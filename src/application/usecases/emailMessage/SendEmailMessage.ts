import { SendEmailDto } from "../../dtos/SendEmailDto";
import EmailProviderAbstraction from "../../abstractions/EmailProviderAbstraction";
import { EmailMessageDto } from "../../dtos/EmailMessageDto";
import { SendEmailResultDto } from "../../dtos/SendEmailResultDto";

export default class SendEmailMessage{
    
    constructor(readonly emailProvider: EmailProviderAbstraction
    ){

    }

    async execute(emailMessage: EmailMessageDto): Promise<SendEmailResultDto> {
        const input : SendEmailDto = {
            to: emailMessage.to![0],
            from: emailMessage.from,
            subject: emailMessage.subject,
            body: emailMessage.body,
            cc: emailMessage.cc || [],
            bcc: emailMessage.cco || []
        };
        const result = await this.emailProvider.sendEmail(input);
        return result;
    }
}