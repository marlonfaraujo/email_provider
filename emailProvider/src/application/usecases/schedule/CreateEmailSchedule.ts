import { EmailSchedule } from "../../../domain/entities/EmailSchedule";
import EmailScheduleRepository from "../../../domain/repositories/EmailScheduleRepository";
import EmailMessageParameter from "../../../domain/valueObjects/EmailMessageParameter";
import IdGeneratorAbstraction from "../../abstractions/IdGeneratorAbstraction";
import { IJobQueue } from "../../abstractions/JobQueueAbstraction";
import { EmailMessageDto } from "../../dtos/EmailMessageDto";
import { EmailScheduleDto } from "../../dtos/EmailScheduleDto";

export default class CreateEmailSchedule{

    constructor(readonly emailScheduleRepository: EmailScheduleRepository,
            readonly idGenerator: IdGeneratorAbstraction,
            readonly jobQueue: IJobQueue<EmailMessageDto>
    ){

    }

    async execute(scheduleDto: EmailScheduleDto): Promise<void>{
        const schedule = new EmailSchedule(this.idGenerator.generate(), scheduleDto.name, scheduleDto.scheduledDate,
            EmailMessageParameter.create(scheduleDto.body, scheduleDto.subject, scheduleDto.from, scheduleDto.to, scheduleDto.cc, scheduleDto.cco));

        await this.emailScheduleRepository.save(schedule);
        await this.jobQueue.addJob(
            "sendEmailJob",
            { 
                to: schedule.messageParameter.recipient.to.map(x => x.getValue()), 
                from: schedule.messageParameter.from.getValue(), 
                body: schedule.messageParameter.body, 
                subject: schedule.messageParameter.subject, 
                cc: schedule.messageParameter.recipient.cc.map(x => x.getValue()), 
                cco: schedule.messageParameter.recipient.cco.map(x => x.getValue()) 
            },
            {
                scheduledAt: schedule.getScheduleDate(),
                attempts: 3,
            }
        );
    }
}