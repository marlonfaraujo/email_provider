import { EmailProvider } from "../../../domain/entities/EmailProvider";
import EmailProviderRepository from "../../../domain/repositories/EmailProviderRepositoy";

export default class ListEmailProvider {

    constructor(readonly repository: EmailProviderRepository){

    }

    async execute(): Promise<EmailProvider[]>{
        return await this.repository.get();
    }
}