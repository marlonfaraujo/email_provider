import QueueAbstraction from "../../application/abstractions/QueueAbstraction";
import { QUEUE_CONFIG } from "../../shared/QueueConfig";
import { QueueParams } from "../../application/dtos/QueueParams";
import { EmailMessageDto } from "../../application/dtos/EmailMessageDto";
import { IJobQueue } from "../../application/abstractions/JobQueueAbstraction";

export default class SendEmailMessageConsumer {

    constructor(){
    }
    
    static config (queue: QueueAbstraction, emailJobQueue: IJobQueue<EmailMessageDto>) {
        const queueParams: QueueParams = { 
            exchange: QUEUE_CONFIG.EXCHANGES.SEND_EMAIL, 
            routingKey: QUEUE_CONFIG.ROUTING_KEYS.SEND_EMAIL,
            queueName: QUEUE_CONFIG.QUEUES.SEND_EMAIL,
            type: "topic"
        };
        queue.consume(queueParams, 
            async (data: any) => {                
                const request: EmailMessageDto = JSON.parse(data);
                await emailJobQueue.addJob(
                    "sendEmailJob",
                    request,
                    {
                        attempts: 3,
                    }
                );
            }
        );
    }
}