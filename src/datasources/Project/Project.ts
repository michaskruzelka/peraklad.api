import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ValidationError } from 'apollo-server-lambda';
import { Record } from 'neo4j-driver';

import { ICategory } from './Category/types';
import {
    IDataSource,
    AccessType,
    Level,
    Status,
    LevelID,
    StatusID,
    CreateIMDBMovieProjectArgs,
    UpdateIMDBMovieProjectArgs,
    UpdateProjectSettingsArgs,
} from './types';
import { ACCESS_TYPES, DEFAULT_ACCESS_TYPE, LEVELS, STATUSES } from './config';
import { DEFAULT_ABC } from '../ABC/config';
import { DEFAULT_SPELLING } from '../Spelling/config';
import { IContext } from '../../services/graphql/types';
import request from '../../services/neo4j/request';

class Project extends DataSource implements IDataSource {
    public readonly category: ICategory;
    private context: IContext;

    constructor(category?: ICategory) {
        super();

        if (category) {
            this.category = category;
        }
    }

    initialize(config: DataSourceConfig<IContext>): void {
        this.context = config.context;
    }

    /**
     * Gets all access types
     *
     * @returns access type list
     */
    public getAccessTypes(): AccessType[] {
        return ACCESS_TYPES;
    }

    /**
     * Gets access type by id
     *
     * @param id access type id
     *
     * @returns access type
     *
     * @throws an error when the access type was not found
     */
    public getAccessTypeById(id: number): AccessType {
        const accessType = ACCESS_TYPES.find(
            (accessType) => accessType.id === id
        );

        if (!accessType) {
            throw new Error('Project access type not found.');
        }

        return accessType;
    }

    /**
     * Gets default access type
     *
     * @returns default access type
     */
    public getDefaultAccessType(): AccessType {
        return (
            ACCESS_TYPES.find(
                (accessType) => accessType.id === DEFAULT_ACCESS_TYPE
            ) || ACCESS_TYPES[0]
        );
    }

    public validateAccessTypeId(id: number): void {
        try {
            this.getAccessTypeById(id);
        } catch (e) {
            throw new ValidationError('Project access type ID is not valid.');
        }
    }

    /**
     * Gets level by id
     *
     * @param id level id
     * @returns level
     */
    public getLevelById(id: number): Level {
        const level = LEVELS.find((level) => level.id === id);

        if (!level) {
            throw new Error('Project level not found.');
        }

        return level;
    }

    /**
     * Gets status by ID
     *
     * @param id status ID
     *
     * @returns status object
     *
     * @throws an error when status was not found
     */
    public getStatusById(id: number): Status {
        const status = STATUSES.find((status) => status.id === id);

        if (!status) {
            throw new Error('Project status not found');
        }

        return status;
    }

    public getStatuses(): Status[] {
        return STATUSES;
    }

    public async createIMDBMovieProject(
        args: CreateIMDBMovieProjectArgs
    ): Promise<string> {
        const params = {
            project: {
                ...args.project,
                level: LevelID.SELF,
            },
            imdb: {
                ...args.imdb,
            },
            settings: {
                status: StatusID.NEW,
                access: DEFAULT_ACCESS_TYPE,
                abc: DEFAULT_ABC,
                spelling: DEFAULT_SPELLING,
            },
        };

        const cql = `
            CREATE (p:Project:MovieSubtitles {
                id: randomUUID(),
                name: $project.name,
                level: toInteger($project.level),
                description: $project.description,
                createdAt: datetime(),
                updatedAt: datetime()
            })
            CREATE (i:IMDB:Movie {
                title: $imdb.title,
                language: $imdb.language,
                year: toInteger($imdb.year),
                imdbId: $imdb.imdbId,
                imdbRating: $imdb.imdbRating,
                posterSrc: $imdb.posterSrc
            })
            CREATE (ps:ProjectSettings {
                status: toInteger($settings.status),
                access: toInteger($settings.access),
                abc: toInteger($settings.abc),
                spelling: toInteger($settings.spelling)
            })
            CREATE (p)-[:HAS_INFO]->(i)
            CREATE (p)-[:HAS_SETTINGS]->(ps)
            RETURN p.id AS id;
        `;

        const records = await this.performDBRequest(cql, params);

        return records.map((record: any) => record.get('id'))[0];
    }

    public async updateIMDBMovieProject(
        args: UpdateIMDBMovieProjectArgs
    ): Promise<boolean> {
        const cql = `
            MATCH (p:Project:MovieSubtitles { id: $id })-[:HAS_INFO]->(i:IMDB:Movie)
            WITH p, i
            SET p.name = coalesce($project.name, p.name),
                p.description = coalesce($project.description, p.description),
                p.updatedAt = datetime(),
                i.title = coalesce($imdb.title, i.title),
                i.language = coalesce($imdb.language, i.language),
                i.year = CASE
                    WHEN $imdb.year IS NULL
                    THEN i.year
                    ELSE toInteger($imdb.year)
                END,
                i.imdbId = coalesce($imdb.imdbId, i.imdbId),
                i.imdbRating = coalesce($imdb.imdbRating, i.imdbRating),
                i.posterSrc = coalesce($imdb.posterSrc, i.posterSrc)
        `;

        await this.performDBRequest(cql, args);

        return true;
    }

    public async updateProjectSettings(
        args: UpdateProjectSettingsArgs
    ): Promise<boolean> {
        const cql = `
            MATCH (p:Project { id: $id })-[:HAS_SETTINGS]->(ps:ProjectSettings)
            WITH p, ps
            SET p.updatedAt = datetime(),
                ps.status = CASE
                    WHEN $settings.status IS NULL
                    THEN ps.status
                    ELSE toInteger($settings.status)
                END,
                ps.access = CASE 
                    WHEN $settings.access IS NULL 
                    THEN ps.access 
                    ELSE toInteger($settings.access) 
                END,
                ps.abc = CASE
                    WHEN $settings.abc IS NULL
                    THEN ps.abc
                    ELSE toInteger($settings.abc)
                END,
                ps.spelling = CASE
                    WHEN $settings.spelling IS NULL
                    THEN ps.spelling
                    ELSE toInteger($settings.spelling)
                END
        `;

        await this.performDBRequest(cql, args);

        return true;
    }

    public async deleteProject(id: string): Promise<boolean> {
        const cql = `
            MATCH (p:Project { id: $id })
            OPTIONAL MATCH (p)-[:IS_PARENT_OF]->(cp:Project)
            OPTIONAL MATCH (p)-[:TRANSLATING]->(r:Resource)
            CALL apoc.do.case([
                cp IS NOT NULL, 'RETURN false AS deleted',
                r IS NOT NULL, 'MATCH (p)-[:HAS_SETTINGS]->(ps:ProjectSettings) 
                    SET ps.status = toInteger($status),
                        p.updatedAt = datetime()
                    RETURN true AS deleted'],
                'MATCH path = (p)-[*]-(:IMDB|:VideoInfo) DETACH DELETE path RETURN true AS deleted',
                { p:p, cp:cp, r:r }
            )
            YIELD value
            RETURN value.deleted AS deleted
        `;

        const records = await this.performDBRequest(cql, {
            id,
            status: StatusID.DELETED,
        });

        return records.map((record: any) => record.get('deleted'))[0];
    }

    public async getProjectById(id: string): Promise<any> {
        const cql = `
            MATCH (p:Project { id: $id })-[:HAS_SETTINGS]->(ps:ProjectSettings)
            WITH p, ps
            MATCH (p)-[:HAS_INFO]->(i)
            RETURN { id: p.id, labels: labels(p), project: p, info: i, settings: ps } AS project
        `;

        const records = await this.performDBRequest(cql, { id });
        const project = records.map((record: any) => record.get('project'))[0];

        if (!project) {
            throw new Error(`Project not found: ${id}`);
        }

        return project;
    }

    public readRemoteFile(fileUrl: string): Promise<Buffer> {
        if (!this.category) {
            throw new Error('File cannot be downloaded.');
        }

        return this.category.readRemoteFile(fileUrl);
    }

    private async performDBRequest(
        cql: string,
        args: object
    ): Promise<Record[]> {
        return request.perform(
            cql,
            args,
            this.context.driver,
            this.context.logger
        );
    }
}

export { Project };
