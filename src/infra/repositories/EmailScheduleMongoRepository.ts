import { ObjectId } from "mongodb";
import { EmailSchedule } from "../../domain/entities/EmailSchedule";
import EmailScheduleRepository from "../../domain/repositories/EmailScheduleRepository";
import NoSqlDatabaseConnectionAbstraction from "../database/NoSqlDatabaseConnectionAbstraction";

export default class EmailScheduleMongoRepository implements EmailScheduleRepository {
    
    collectionName: string = "schedules" as const;

    constructor(readonly connection: NoSqlDatabaseConnectionAbstraction){

    }

    async save(schedule: EmailSchedule): Promise<void> {
        const db = await this.connection.db();
        const schedules = db.collection(this.collectionName);
        const result = await schedules.insertOne(this.connection.toDocument(schedule));
        console.log(result);
    }

    async getById(id: string): Promise<EmailSchedule | undefined> {
        const db = await this.connection.db();
        const schedules = db.collection(this.collectionName);
        const result = await schedules.findOne({ _id: new ObjectId(id) });
        console.log(result);
        return result;
    }

    async update(schedule: EmailSchedule, id: string): Promise<void> {
        const db = await this.connection.db();
        const schedules = db.collection(this.collectionName);
        const updateResult = await schedules.updateOne(
            { _id: new ObjectId(id) },
            { $set: this.connection.toDocument(schedule) }
        );
        console.log(updateResult);
    }

    async get(): Promise<EmailSchedule[]> {
        const db = await this.connection.db();
        const schedules = db.collection(this.collectionName);
        const result = await schedules.find().toArray();
        console.log(result);
        return result.map((x: any) => new EmailSchedule(x._id, x.name, x.messageParameter));
    }

}