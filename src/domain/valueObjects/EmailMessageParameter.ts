import Email from "./Email";
import Recipient from "./Recipient";

export default class EmailMessageParameter{
    
    body: string;
    subject: string;
    from: Email;
    recipient: Recipient;
    
    constructor(body: string, subject: string, from: string, recipient: Recipient){
        this.body = body;
        this.subject = subject;
        this.from = new Email(from);
        this.recipient = recipient;
    }

    static create(body: string, subject: string, from: string, to: string[] = [], cc: string[] = [], cco: string[] = []): EmailMessageParameter {
        const recipient = new Recipient(to, cc, cco);
        return new EmailMessageParameter(body, subject, from, recipient);
    }
}