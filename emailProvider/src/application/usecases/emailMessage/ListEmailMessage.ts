import EmailMessageRepository from "../../../domain/repositories/EmailMessageRepository";
import { EmailMessageResultDto } from "../../dtos/EmailMessageResultDto";

export default class ListEmailMessage {

    constructor(readonly repository: EmailMessageRepository){

    }

    async execute(): Promise<EmailMessageResultDto[]>{
        const items = await this.repository.get();
        const result: EmailMessageResultDto[] = items.map(item => ({
            id: item.id,
            status: item.getStatus(),
            subject: item.messageParameter.subject,
            from: item.messageParameter.from.getValue(),
            recipients: [
                ...item.messageParameter.recipient.cc.map(x => x.getValue()), 
                ...item.messageParameter.recipient.cco.map(x => x.getValue()), 
                ...item.messageParameter.recipient.to.map(x => x.getValue())
            ]
        }));
        return result;
    }
}