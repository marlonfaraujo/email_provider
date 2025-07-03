import QueueAbstraction from "../../application/abstractions/QueueAbstraction";
import { RABBIT_CONFIG } from "../../shared/RabbitConfig";
import { QueueParams } from "../../application/dtos/QueueParams";
import { EmailMessageDto } from "../../application/dtos/EmailMessageDto";
import { IJobQueue } from "../../application/abstractions/JobQueueAbstraction";

export default class SendEmailMessageConsumer {

    constructor(){
    }
    
    static config (queue: QueueAbstraction, emailJobQueue: IJobQueue<EmailMessageDto>) {
        const queueParams: QueueParams = { 
            exchange: RABBIT_CONFIG.EXCHANGES.SEND_EMAIL, 
            routingKey: RABBIT_CONFIG.ROUTING_KEYS.SEND_EMAIL,
            queueName: RABBIT_CONFIG.QUEUES.SEND_EMAIL,
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