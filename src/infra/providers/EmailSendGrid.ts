import EmailProviderAbstraction from "../../application/abstractions/EmailProviderAbstraction";
import { SendEmailDto } from "../../application/dtos/SendEmailDto";
import { MailService } from '@sendgrid/mail';
import { SendEmailResultDto } from "../../application/dtos/SendEmailResultDto";

export default class EmailSendGrid implements EmailProviderAbstraction {
    
    private readonly mailService: MailService;

    constructor() {
        const apiKey = process.env.SENDGRID_API_KEY;
        if (!apiKey) {
            throw new Error("SENDGRID_API_KEY not found.");
        }
        this.mailService = new MailService();
        this.mailService.setApiKey(apiKey);    
    }

    async sendEmail(input: SendEmailDto): Promise<SendEmailResultDto> {
        const msg = {
            to: input.to,
            from: input.from,
            subject: input.subject,
            html: input.body
        };
        const [sendEmailResponse] = await this.mailService.send(msg);
        if (sendEmailResponse.statusCode >= 400) {
            throw new Error("Error status code: " + sendEmailResponse.statusCode);
            console.log(sendEmailResponse.body);
        }
        const result: SendEmailResultDto = { statusCode: sendEmailResponse.statusCode, body: sendEmailResponse.body };
        return result;
    }

}