import EmailScheduleRepository from "../../../domain/repositories/EmailScheduleRepository";
import { EmailScheduleResultDto } from "../../dtos/EmailScheduleResultDto";

export default class ListEmailSchedule {

    constructor(readonly repository: EmailScheduleRepository){

    }

    async execute(): Promise<EmailScheduleResultDto[]>{
        const items = await this.repository.get();
        const result: EmailScheduleResultDto[] = items.map(item => ({
            id: item.id,
            name: item.name,
            scheduledDate: item.getScheduleDate(),
            scheduleStatus: item.getScheduleStatus(),
            publishStatus: item.getPublishStatus(),
            publishDate: item.getPublishDate(),
            subject: item.messageParameter.subject,
            from: item.messageParameter.from.getValue(),
            recipients: [
                ...item.messageParameter.recipient.cc.map(x => x.getValue()), 
                ...item.messageParameter.recipient.cco.map(x => x.getValue()), 
                ...item.messageParameter.recipient.to.map(x => x.getValue())
            ]
        }));

        return result;
    }
}