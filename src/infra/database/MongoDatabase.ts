import  { MongoClient, ObjectId } from "mongodb";
import NoSqlDatabaseConnectionAbstraction from "./NoSqlDatabaseConnectionAbstraction";

export default class MongoDatabase implements NoSqlDatabaseConnectionAbstraction {

    private client: any;

    constructor(readonly dbName: string){
        this.client = new MongoClient("mongodb://mongodb:27017");
    }

    async db(): Promise<any> {
        await this.client.connect()
        return this.client.db(this.dbName);
    }

    async close(): Promise<void> {
        await this.client.close();
    }

    toDocument(obj: any): any {
        if (obj.id) {
            obj._id = new ObjectId(obj.id);
            delete obj.id;
        }
        return obj;
    }

}