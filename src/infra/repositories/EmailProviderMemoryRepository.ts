import { EmailProvider } from "../../domain/entities/EmailProvider";
import EmailProviderRepository from "../../domain/repositories/EmailProviderRepositoy";

export default class EmailProviderMemoryRepository implements EmailProviderRepository{

    providers: EmailProvider[];

    constructor(){
        this.providers = [];
    }

    async save(provider: EmailProvider): Promise<void> {
        this.providers.push(provider);
    }
    
    async getById(id: string): Promise<EmailProvider | undefined> {
        const provider = this.providers.find(x => x.id === id);
        return provider;
    }
    
    async get(): Promise<EmailProvider[]> {
        return this.providers;
    }

    async update(provider: EmailProvider, id: string): Promise<void> {
        this.providers.map(current => current.id === id ? provider : current);
    }

}