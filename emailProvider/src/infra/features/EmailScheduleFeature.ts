import IdGeneratorAbstraction from "../../application/abstractions/IdGeneratorAbstraction";
import { IJobQueue } from "../../application/abstractions/JobQueueAbstraction";
import { EmailMessageDto } from "../../application/dtos/EmailMessageDto";
import CreateEmailSchedule from "../../application/usecases/schedule/CreateEmailSchedule";
import ListEmailSchedule from "../../application/usecases/schedule/ListEmailSchedule";
import EmailScheduleRepository from "../../domain/repositories/EmailScheduleRepository";
import HttpServer from "../api/HttpServer";
import CacheConnectionAbstraction from "../database/CacheConnectionAbstraction";
import BullMQJobQueue from "../queue/BullMQJobQueue";

export default class EmailScheduleFeature {
    
    constructor (readonly httpServer: HttpServer, 
        readonly repository: EmailScheduleRepository,
        readonly idGenerator: IdGeneratorAbstraction,
        readonly cacheConnection: CacheConnectionAbstraction) {
    }

    async config () {
        this.httpServer.route("post", "/schedules", async (params: any, body: any) => {
            const jobQueue: IJobQueue<EmailMessageDto> = new BullMQJobQueue<EmailMessageDto>("email-queue", this.cacheConnection);
            const createSchedule = new CreateEmailSchedule(this.repository, this.idGenerator, jobQueue);
            await createSchedule.execute(body);
        });
        
        this.httpServer.route("get", "/schedules", async (params: any, body: any) => {
            const getSchedules = new ListEmailSchedule(this.repository);
            const schedules = await getSchedules.execute();
            const response : EmailScheduleResponse[] = schedules.map(schedule => ({
                id: schedule.id,
                name: schedule.name,
                scheduledDate: schedule.scheduledDate,
                scheduleStatus: schedule.scheduleStatus,
                publishStatus: schedule.publishStatus,
                publishDate: schedule.publishDate,
                subject: schedule.subject,
                from: schedule.from,
                recipient: schedule.recipients.join(";")
            }));
            return response;
        });
    }
}

export type EmailScheduleResponse = {
	id: string,
    name: string,
    scheduledDate: Date,
    scheduleStatus: string,
    publishStatus: string,
    publishDate: Date | null,
	subject: string,
	from: string,
	recipient: string
}