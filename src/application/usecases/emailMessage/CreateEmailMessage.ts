import EmailMessage from "../../../domain/entities/EmailMessage";
import EmailMessageRepository from "../../../domain/repositories/EmailMessageRepository";
import EmailMessageParameter from "../../../domain/valueObjects/EmailMessageParameter";
import IdGeneratorAbstraction from "../../abstractions/IdGeneratorAbstraction";
import { EmailMessageDto } from "../../dtos/EmailMessageDto";

export default class CreateEmailMessage{
    
    constructor(readonly emailMessageRepository: EmailMessageRepository,
            readonly idGenerator: IdGeneratorAbstraction
    ){

    }

    async execute(messageDto: EmailMessageDto): Promise<string>{
        const message = new EmailMessage(this.idGenerator.generate(), 
            EmailMessageParameter.create(messageDto.body, messageDto.subject, messageDto.from, messageDto.to, messageDto.cc, messageDto.cco));
        await this.emailMessageRepository.save(message);
        return message.id;
    }
}