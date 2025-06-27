export default interface NoSqlDatabaseConnectionAbstraction {
    db(): Promise<any>;
    close(): Promise<void>;
}