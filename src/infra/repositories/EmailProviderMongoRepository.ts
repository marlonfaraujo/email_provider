import { ObjectId } from "mongodb";
import { EmailProvider } from "../../domain/entities/EmailProvider";
import EmailProviderRepository from "../../domain/repositories/EmailProviderRepositoy";
import NoSqlDatabaseConnectionAbstraction from "../database/NoSqlDatabaseConnectionAbstraction";

export default class EmailProviderMongoRepository implements EmailProviderRepository {

    collectionName: string = "providers" as const;

    constructor(readonly connection: NoSqlDatabaseConnectionAbstraction){

    }

    async save(provider: EmailProvider): Promise<void> {
        const db = await this.connection.db();
        const providers = db.collection(this.collectionName);
        const result = await providers.insertOne(this.connection.toDocument(provider));
        console.log(result);
    }

    async getById(id: string): Promise<EmailProvider | undefined> {
        const db = await this.connection.db();
        const providers = db.collection(this.collectionName);
        const result = await providers.findOne({ _id: new ObjectId(id) });
        console.log(result);
        return result;
    }

    async update(provider: EmailProvider, id: string): Promise<void> {
        const db = await this.connection.db();
        const providers = db.collection(this.collectionName);
        const updateResult = await providers.updateOne(
            { _id: new ObjectId(id) },
            { $set: this.connection.toDocument(provider) }
        );
        console.log(updateResult);
    }

    async get(): Promise<EmailProvider[]> {
        const db = await this.connection.db();
        const providers = db.collection(this.collectionName);
        const result = await providers.find().toArray();
        console.log(result);
        return result.map((x: any) => new EmailProvider(x._id, x.server, x.port, x.credentials, x.level));
    }

}