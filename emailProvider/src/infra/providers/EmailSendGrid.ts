import EmailProviderAbstraction from "../../application/abstractions/EmailProviderAbstraction";
import { SendEmailDto } from "../../application/dtos/SendEmailDto";
import { MailService } from '@sendgrid/mail';
import { SendEmailResultDto } from "../../application/dtos/SendEmailResultDto";
import SendEmailException from "../../application/exceptions/SendEmailException";

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
            cc: input.cc,
            bcc: input.bcc,
            from: input.from,
            subject: input.subject,
            html: input.body
        };
        try {
            const [sendEmailResponse] = await this.mailService.send(msg);
            if (sendEmailResponse.statusCode >= 400) {
                console.log(sendEmailResponse.body);
                throw new SendEmailException("Error send email message", sendEmailResponse.statusCode);;
            }
            const result: SendEmailResultDto = { statusCode: sendEmailResponse.statusCode, body: sendEmailResponse.body };
            return result;
        } catch(error: any){
            console.log(error);
            const errorMessage = error.response?.body?.errors[0]?.message || "Error send email message";
            throw new SendEmailException(errorMessage, error.code);
        }
    }

}