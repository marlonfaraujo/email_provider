import { EmailSchedule } from "../../../domain/entities/EmailSchedule";
import EmailScheduleRepository from "../../../domain/repositories/EmailScheduleRepository";
import EmailMessageParameter from "../../../domain/valueObjects/EmailMessageParameter";
import IdGeneratorAbstraction from "../../abstractions/IdGeneratorAbstraction";
import { EmailScheduleDto } from "../../dtos/EmailScheduleDto";

export default class CreateEmailSchedule{

    constructor(readonly emailScheduleRepository: EmailScheduleRepository,
            readonly idGenerator: IdGeneratorAbstraction
    ){

    }

    async execute(scheduleDto: EmailScheduleDto): Promise<void>{
        const schedule = new EmailSchedule(this.idGenerator.generate(), scheduleDto.name,
            EmailMessageParameter.create(scheduleDto.body, scheduleDto.subject, scheduleDto.from, scheduleDto.to, scheduleDto.cc, scheduleDto.cco));

        await this.emailScheduleRepository.save(schedule);
    }
}