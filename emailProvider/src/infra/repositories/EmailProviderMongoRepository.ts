import { ObjectId } from "mongodb";
import { EmailProvider } from "../../domain/entities/EmailProvider";
import EmailProviderRepository from "../../domain/repositories/EmailProviderRepositoy";
import NoSqlDatabaseConnectionAbstraction from "../database/NoSqlDatabaseConnectionAbstraction";
import BaseMongoRepository from "./BaseMongoRepository";

export default class EmailProviderMongoRepository extends BaseMongoRepository implements EmailProviderRepository {

    private collectionName: string = "providers" as const;

    constructor(readonly connection: NoSqlDatabaseConnectionAbstraction){
        super(connection);
    }

    async save(provider: EmailProvider): Promise<void> {
        const providers = await this.getCollection<EmailProvider>(this.collectionName);
        await providers.insertOne(this.toDocument(provider));
    }

    async getById(id: string): Promise<EmailProvider | null> {
        const providers = await this.getCollection<EmailProvider>(this.collectionName);
        const result = await providers.findOne<any>({ _id: new ObjectId(id) });
        return new EmailProvider(result._id, result.server, result.port, result.credentials, result.level);
    }

    async update(provider: EmailProvider, id: string): Promise<void> {
        const providers = await this.getCollection(this.collectionName);
        await providers.updateOne(
            { _id: new ObjectId(id) },
            { $set: this.toDocument(provider) }
        );
    }

    async get(): Promise<EmailProvider[]> {
        const providers = await this.getCollection(this.collectionName);
        const result = await providers.find<any>({}).toArray();
        return result.map((x: any) => new EmailProvider(x._id, x.server, x.port, x.credentials, x.level));
    }

}