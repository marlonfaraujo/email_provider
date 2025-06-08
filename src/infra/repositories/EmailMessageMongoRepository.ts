import { ObjectId } from "mongodb";
import EmailMessage from "../../domain/entities/EmailMessage";
import EmailMessageRepository from "../../domain/repositories/EmailMessageRepository";
import NoSqlDatabaseConnectionAbstraction from "../database/NoSqlDatabaseConnectionAbstraction";

export default class EmailMessageMongoRepository implements EmailMessageRepository {

    collectionName: string = "messages" as const;

    constructor(readonly connection: NoSqlDatabaseConnectionAbstraction){

    }

    async save(message: EmailMessage): Promise<void> {
        const db = await this.connection.db();
        const messages = db.collection(this.collectionName);
        const result = await messages.insertOne(this.connection.toDocument(message));
        console.log(result);
    }

    async getById(id: string): Promise<EmailMessage | undefined> {
        const db = await this.connection.db();
        const messages = db.collection(this.collectionName);
        const result = await messages.findOne({ _id: new ObjectId(id) });
        console.log(result);
        return result;
    }

    async update(message: EmailMessage, id: string): Promise<void> {
        const db = await this.connection.db();
        const messages = db.collection(this.collectionName);
        const updateResult = await messages.updateOne(
            { _id: new ObjectId(id) },
            { $set: this.connection.toDocument(message) }
        );
        console.log(updateResult);
    }

    async get(): Promise<EmailMessage[]> {
        const db = await this.connection.db();
        const messages = db.collection(this.collectionName);
        const result = await messages.find().toArray();
        console.log(result);
        return result.map((x: any) => new EmailMessage(x._id, x.messageParameter));
    }

}