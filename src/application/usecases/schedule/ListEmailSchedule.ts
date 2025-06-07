import { EmailSchedule } from "../../../domain/entities/EmailSchedule";
import EmailScheduleRepository from "../../../domain/repositories/EmailScheduleRepository";

export default class ListEmailSchedule {

    constructor(readonly repository: EmailScheduleRepository){

    }

    async execute(): Promise<EmailSchedule[]>{
        return this.repository.get();
    }
}