import { EmailProvider } from "../entities/EmailProvider";

export default interface EmailProviderRepository{
    save (provider: EmailProvider): Promise<void>;
    getById (id: string): Promise<EmailProvider | undefined>;
    update (provider: EmailProvider, id: string): Promise<void>;
    get (): Promise<EmailProvider[]>;
}