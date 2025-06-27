import EmailProviderRepository from "../../../domain/repositories/EmailProviderRepositoy";
import { EmailProviderResultDto } from "../../dtos/EmailProviderResultDto";

export default class ListEmailProvider {

    constructor(readonly repository: EmailProviderRepository){

    }

    async execute(): Promise<EmailProviderResultDto[]>{
        const items = await this.repository.get();
        const result: EmailProviderResultDto[] = items.map(item => ({
            id: item.id,
            server: item.server,
            port: item.port,
            level: item.getLevel()
        }));
        return result;
    }
}