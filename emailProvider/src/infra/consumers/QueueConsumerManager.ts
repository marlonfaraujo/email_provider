import { IJobQueue } from "../../application/abstractions/JobQueueAbstraction";
import QueueAbstraction from "../../application/abstractions/QueueAbstraction";
import { EmailMessageDto } from "../../application/dtos/EmailMessageDto";
import CacheConnectionAbstraction from "../database/CacheConnectionAbstraction";
import BullMQJobQueue from "../queue/BullMQJobQueue";
import KafkaServer from "../queue/KafkaServer";
import SendEmailMessageConsumer from "./SendEmailMessageConsumer";

export default class QueueConsumerManager {

    constructor(readonly cacheConnection: CacheConnectionAbstraction) {
    }

    init(): void {
        this.initSendEmailMessageConsumer();
    }

    private async initSendEmailMessageConsumer(): Promise<void>{
        const queue: QueueAbstraction = new KafkaServer("email-provider-api", "consumers-group");
        await queue.connect();
        const emailJobQueue: IJobQueue<EmailMessageDto> = new BullMQJobQueue<EmailMessageDto>("email-queue", this.cacheConnection);
        SendEmailMessageConsumer.config(queue, emailJobQueue);
    }
}