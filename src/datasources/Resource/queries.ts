const IMPORT_RESOURCE_QUERY = `
    MATCH (p:Project { id: $projectId })-[:HAS_SETTINGS]->(ps:ProjectSettings)
    SET ps.status = toInteger($projectStatus)

    CREATE (r:Resource {
        id: randomUUID(),
        name: $resourceName,
        language: $resourceLanguage,
        format: $resourceFormat,
        status: $resourceStatus
    })
    CREATE (p)-[:TRANSLATING]->(r)

    WITH r, [x IN $elements | apoc.map.merge(x, { id: randomUUID() })] as elements
    WITH r, tail(elements) as remainingElements, elements[0] as firstElement

    CREATE (fri:ResourceItem {
        id: firstElement.id,
        text: firstElement.text,
        status: toInteger($resourceItemStatus)
    })
    CREATE (fri)-[:HAS_CONTEXT]->(fric:ResourceItemContext:%s)
    CREATE (r)-[:FIRST_ITEM]->(fri)

    FOREACH (_ IN CASE WHEN firstElement.context.timnig IS NULL THEN [0] ELSE [1] END |
        CREATE (t:Timing { 
            startsAt: duration({ milliseconds: firstElement.context.timing.startsAt }),
            endsAt: duration({ milliseconds: firstElement.context.timing.endsAt })
        })
        CREATE (fric)-[:HAS_TIMING]->(t)
    )

    FOREACH (_ IN CASE WHEN firstElement.context.key IS NULL THEN [0] ELSE [1] END |
        SET fric.key = firstElement.context.key
    )

    WITH r, fri, remainingElements as elements
    WITH r, fri, elements, elements[0] as next

    CALL {
        WITH elements
        UNWIND range(0, size(elements) - 1) as elementIndex
        
        WITH elements, elementIndex, elements[elementIndex] as current 
        CREATE (ri:ResourceItem {
            id: current.id,
            text: current.text,
            status: toInteger($resourceItemStatus)
        })
        CREATE (ri)-[:HAS_CONTEXT]->(ric:ResourceItemContext:%s)

        WITH ri, ric, elements, elementIndex, current 
        FOREACH (_ IN CASE WHEN current.context.timing IS NULL THEN [0] ELSE [1] END |
            CREATE (t:Timing { 
                startsAt: duration({ milliseconds: current.context.timing.startsAt }),
                endsAt: duration({ milliseconds: current.context.timing.endsAt })
            })
            CREATE (ric)-[:HAS_TIMING]->(t)
        )

        FOREACH (_ IN CASE WHEN current.context.key IS NULL THEN [0] ELSE [1] END |
            SET ric.key = current.context.key
        )

        WITH ri, elements[elementIndex - 1] as previous
        CALL apoc.do.when(
            previous IS NOT NULL,
            '
                MATCH (previousItem:ResourceItem { id: previous.id })
                CREATE (previousItem)-[:NEXT]->(ri)
                RETURN true
            ',
            'RETURN true',
            { ri: ri, previous: previous }
        )
        YIELD value
        
        RETURN DISTINCT value
    }

    WITH fri, next, r, elements[-1] as lastElement
    CALL apoc.do.when(
        next IS NOT NULL,
        'MATCH (nextItem:ResourceItem { id: next.id }) CREATE (fri)-[:NEXT]->(nextItem) RETURN true',
        'RETURN true',
        { fri: fri, next: next }
    )
    YIELD value

    WITH r, lastElement
    CALL apoc.do.when(
        lastElement IS NOT NULL,
        '
            MATCH (lri:ResourceItem { id: lastElement.id })
            CREATE (lri)<-[:LAST_ITEM]-(r)
            RETURN true',
        'RETURN true',
        { lastElement: lastElement, r: r }
    )
    YIELD value

    RETURN r.id AS id
`;

export { IMPORT_RESOURCE_QUERY };
