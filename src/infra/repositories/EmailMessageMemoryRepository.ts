import EmailMessage from "../../domain/entities/EmailMessage";
import EmailMessageRepository from "../../domain/repositories/EmailMessageRepository";

export default class EmailMessageMemoryRepository implements EmailMessageRepository {

    messages: EmailMessage[];

    constructor(){
        this.messages = [];
    }

    async save(message: EmailMessage): Promise<void> {
        this.messages.push(message);
    }

    async getById(id: string): Promise<EmailMessage | undefined> {
        const message = this.messages.find(x => x.id === id); 
        return message;
    }

    async get(): Promise<EmailMessage[]> {
        return this.messages;
    }

    async update(message: EmailMessage, id: string): Promise<void> {
        this.messages.map(current => current.id === id ? message : current);
    }

}