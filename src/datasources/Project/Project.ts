import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ValidationError } from 'apollo-server-lambda';

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
} from './types';
import { ACCESS_TYPES, DEFAULT_ACCESS_TYPE, LEVELS, STATUSES } from './config';
import { DEFAULT_ABC } from '../ABC/config';
import { DEFAULT_SPELLING } from '../Spelling/config';
import { IContext } from '../../services/graphql/types';
import request from '../../services/neo4j/request';

class Project extends DataSource implements IDataSource {
    public readonly category: ICategory;
    private context: IContext;

    constructor(category: ICategory) {
        super();

        this.category = category;
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

        const records = await request.perform(
            cql,
            params,
            this.context.driver,
            this.context.logger
        );

        return records.map((record: any) => record.get('id'))[0];
    }

    public async updateIMDBMovieProject(
        args: UpdateIMDBMovieProjectArgs
    ): Promise<boolean> {
        const cql = `
            MATCH (p:Project:MovieSubtitles { id: $id })-[:HAS_INFO]->(i:IMDB:Movie)
            WITH p, i
            MATCH (p)-[:HAS_SETTINGS]->(ps:ProjectSettings)
            WITH p, i, ps
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
                i.posterSrc = coalesce($imdb.posterSrc, i.posterSrc),
                ps.access = CASE 
                    WHEN $settings.access IS NULL 
                    THEN ps.access 
                    ELSE toInteger($settings.access) 
                END,
                ps.abc = CASE
                    WHEN $settings.abc IS NULL
                    THEN ps.abc
                    ELSE toInteger($settings.abc)
                ps.spelling = CASE
                    WHEN $settings.spelling IS NULL
                    THEN ps.spelling
                    ELSE toInteger($settings.spelling)
        `;

        await request.perform(
            cql,
            args,
            this.context.driver,
            this.context.logger
        );

        return true;
    }
}

export { Project };
