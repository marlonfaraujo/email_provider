import { Collection, Db, Document, ObjectId } from "mongodb";
import NoSqlDatabaseConnectionAbstraction from "../database/NoSqlDatabaseConnectionAbstraction";

export default abstract class BaseMongoRepository {

    constructor(readonly connection: NoSqlDatabaseConnectionAbstraction){
    }

    async getDb(): Promise<Db> {
        return await this.connection.db();
    }

    async getCollection<T extends Document>(name: string): Promise<Collection<T>> {
        const db = await this.getDb();
        return db.collection<T>(name);
    }
    
    toDocument(obj: any): any {
        if (obj.id) {
            obj._id = new ObjectId(obj.id);
            delete obj.id;
        }
        return obj;
    }
}