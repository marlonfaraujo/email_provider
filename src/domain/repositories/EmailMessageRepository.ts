import EmailMessage from "../entities/EmailMessage";

export default interface EmailMessageRepository {
    save (message: EmailMessage): Promise<void>;
    getById (id: string): Promise<EmailMessage | undefined>;
    update (message: EmailMessage, id: string): Promise<void>;
    get (): Promise<EmailMessage[]>;
}