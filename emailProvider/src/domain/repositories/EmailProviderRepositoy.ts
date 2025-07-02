import { EmailProvider } from "../entities/EmailProvider";

export default interface EmailProviderRepository{
    save (provider: EmailProvider): Promise<void>;
    getById (id: string): Promise<EmailProvider | null>;
    update (provider: EmailProvider, id: string): Promise<void>;
    get (): Promise<EmailProvider[]>;
}