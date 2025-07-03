import EmailProviderAbstraction from "../../abstractions/EmailProviderAbstraction";
import { EmailMessageDto } from "../../dtos/EmailMessageDto";
import { IJobQueue } from "../../abstractions/JobQueueAbstraction";

export default class SendEmailMessage{
    
    constructor(readonly emailProvider: EmailProviderAbstraction,
            readonly jobQueue: IJobQueue<EmailMessageDto>
    ){
    }

    async execute(emailMessage: EmailMessageDto): Promise<void> {
        await this.jobQueue.addJob(
            "sendEmailJob",
            emailMessage,
            {
                attempts: 3,
            }
        );
    }
}