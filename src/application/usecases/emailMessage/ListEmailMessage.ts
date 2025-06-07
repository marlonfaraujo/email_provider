import EmailMessage from "../../../domain/entities/EmailMessage";
import EmailMessageRepository from "../../../domain/repositories/EmailMessageRepository";

export default class ListEmailMessage {

    constructor(readonly repository: EmailMessageRepository){

    }

    execute(): Promise<EmailMessage[]>{
        return this.repository.get();
    }
}