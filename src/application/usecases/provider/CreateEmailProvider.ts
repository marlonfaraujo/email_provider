import { EmailProvider } from "../../../domain/entities/EmailProvider";
import EmailProviderRepository from "../../../domain/repositories/EmailProviderRepositoy";
import IdGeneratorAbstraction from "../../abstractions/IdGeneratorAbstraction";
import { EmailProviderDto } from "../../dtos/EmailProviderDto";

export default class CreateEmailProvider{

    constructor(readonly emailProviderRepository: EmailProviderRepository,
            readonly idGenerator: IdGeneratorAbstraction
    ){

    }

    async execute(providerDto: EmailProviderDto): Promise<void>{
        const provider = new EmailProvider(this.idGenerator.generate(), providerDto.server, providerDto.port, providerDto.credentials);
        await this.emailProviderRepository.save(provider);
    }
}