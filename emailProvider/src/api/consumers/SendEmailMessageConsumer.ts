import IdGeneratorAbstraction from "../../application/abstractions/IdGeneratorAbstraction";
import EmailMessageRepository from "../../domain/repositories/EmailMessageRepository";
import QueueAbstraction from "../../application/abstractions/QueueAbstraction";
import { RABBIT_CONFIG } from "../../shared/RabbitConfig";
import { QueueParams } from "../../application/dtos/QueueParams";
import { EmailMessageDto } from "../../application/dtos/EmailMessageDto";
import EmailProviderAbstraction from "../../application/abstractions/EmailProviderAbstraction";
import SendEmailMessage from "../../application/usecases/emailMessage/SendEmailMessage";

export default class SendEmailMessageConsumer {

    constructor(){
    }
    
    static config (queue: QueueAbstraction, repository: EmailMessageRepository, idGenerator: IdGeneratorAbstraction, emailProvider: EmailProviderAbstraction) {
        const queueParams: QueueParams = { 
            exchange: RABBIT_CONFIG.EXCHANGES.SEND_EMAIL, 
            routingKey: RABBIT_CONFIG.ROUTING_KEYS.SEND_EMAIL,
            queueName: RABBIT_CONFIG.QUEUES.SEND_EMAIL,
            type: ""
        };
        queue.consume(queueParams, 
            async (data: any) => {                
                const request: EmailMessageDto = JSON.parse(data);
                const sendEmail = new SendEmailMessage(emailProvider);
                const result = await sendEmail.execute(request);
            }
        );
    }
}