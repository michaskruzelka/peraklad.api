import neo4j from 'neo4j-driver';

const isEncrypted = (): boolean => {
    return !(
        !process.env.NEO4J_ENCRYPTED ||
        process.env.NEO4J_ENCRYPTED?.toLowerCase() === 'false'
    );
};

const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'neo4j'
    ),
    {
        encrypted: isEncrypted()
            ? 'ENCRYPTION_ON'
            : 'ENCRYPTION_OFF',
        maxTransactionRetryTime: 5000,
    }
);

export { driver };
