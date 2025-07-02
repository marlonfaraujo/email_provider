import { ObjectId } from "mongodb";
import { EmailSchedule } from "../../domain/entities/EmailSchedule";
import EmailScheduleRepository from "../../domain/repositories/EmailScheduleRepository";
import NoSqlDatabaseConnectionAbstraction from "../database/NoSqlDatabaseConnectionAbstraction";
import BaseMongoRepository from "./BaseMongoRepository";

export default class EmailScheduleMongoRepository extends BaseMongoRepository implements EmailScheduleRepository {
    
    private collectionName: string = "schedules" as const;

    constructor(readonly connection: NoSqlDatabaseConnectionAbstraction){
        super(connection);
    }

    async save(schedule: EmailSchedule): Promise<void> {
        const schedules = await this.getCollection<EmailSchedule>(this.collectionName);
        await schedules.insertOne(this.toDocument(schedule));
    }

    async getById(id: string): Promise<EmailSchedule | null> {
        const schedules = await this.getCollection(this.collectionName);
        const result = await schedules.findOne<any>({ _id: new ObjectId(id) });
        return new EmailSchedule(result._id, result.name, result.messageParameter);
    }

    async update(schedule: EmailSchedule, id: string): Promise<void> {
        const schedules = await this.getCollection<EmailSchedule>(this.collectionName);
        await schedules.updateOne(
            { _id: new ObjectId(id) },
            { $set: this.toDocument(schedule) }
        );
    }

    async get(): Promise<EmailSchedule[]> {
        const schedules = await this.getCollection<EmailSchedule>(this.collectionName);
        const result = await schedules.find<any>({}).toArray();
        return result.map((x: any) => new EmailSchedule(x._id, x.name, x.messageParameter));
    }

}