import  { Db, MongoClient } from "mongodb";
import NoSqlDatabaseConnectionAbstraction from "./NoSqlDatabaseConnectionAbstraction";

export default class MongoDatabase implements NoSqlDatabaseConnectionAbstraction {

    private readonly client: MongoClient;
    private readonly dbName: string;

    constructor(){
        this.dbName = "email_provider";
        this.client = new MongoClient("mongodb://email-provider-mongodb:27017");
    }

    async db(): Promise<Db> {
        await this.client.connect()
        return this.client.db(this.dbName);
    }

    async close(): Promise<void> {
        await this.client.close();
    }


}