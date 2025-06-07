import { EmailSchedule } from "../../domain/entities/EmailSchedule";
import EmailScheduleRepository from "../../domain/repositories/EmailScheduleRepository";

export default class EmailScheduleMemoryRepository implements EmailScheduleRepository{
    schedules: EmailSchedule[];

    constructor(){
        this.schedules = [];
    }

    async getById(id: string): Promise<EmailSchedule | undefined> {
        const schedule = this.schedules.find(x => x.id === id);
        return schedule;
    }
    
    async get(): Promise<EmailSchedule[]> {
        return this.schedules;
    }
    
    async save(schedule: EmailSchedule): Promise<void> {
        this.schedules.push(schedule);
    }


    async update(schedule: EmailSchedule, id: string): Promise<void> {
        this.schedules.map(current => current.id === id ? schedule : current);
    }


}