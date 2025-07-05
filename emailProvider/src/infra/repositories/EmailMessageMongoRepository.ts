import { ObjectId } from "mongodb";
import EmailMessage from "../../domain/entities/EmailMessage";
import EmailMessageRepository from "../../domain/repositories/EmailMessageRepository";
import NoSqlDatabaseConnectionAbstraction from "../database/NoSqlDatabaseConnectionAbstraction";
import BaseMongoRepository from "./BaseMongoRepository";
import EmailMessageParameter from "../../domain/valueObjects/EmailMessageParameter";

export default class EmailMessageMongoRepository extends BaseMongoRepository implements EmailMessageRepository {

    private collectionName: string = "messages" as const;

    constructor(readonly connection: NoSqlDatabaseConnectionAbstraction){
        super(connection);
    }

    async save(message: EmailMessage): Promise<void> {
        const messages = await this.getCollection<EmailMessage>(this.collectionName);
        await messages.insertOne(this.toDocument(message));
    }

    async getById(id: string): Promise<EmailMessage | null> {
        const messages = await this.getCollection<EmailMessage>(this.collectionName);
        const result = await messages.findOne<any>({ _id: new ObjectId(id) });
        return new EmailMessage(result._id, result.messageParameter);
    }

    async update(message: EmailMessage, id: string): Promise<void> {
        const messages = await this.getCollection<EmailMessage>(this.collectionName);
        await messages.updateOne(
            { _id: new ObjectId(id) },
            { $set: this.toDocument(message) }
        );
    }

    async get(): Promise<EmailMessage[]> {
        const messages = await this.getCollection<EmailMessage>(this.collectionName);
        const result = await messages.find<any>({}).toArray();
        return result.map((x: any) => new EmailMessage(x._id, 
            EmailMessageParameter.create(x.messageParameter.body, 
                x.messageParameter.subject, 
                x.messageParameter.from?.value, 
                x.messageParameter.recipient?.to?.map((x: any) => x.value), 
                x.messageParameter.recipient?.cc?.map((x: any) => x.value), 
                x.messageParameter.recipient?.cco?.map((x: any) => x.value))));
    }

}