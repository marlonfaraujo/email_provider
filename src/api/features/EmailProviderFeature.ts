import IdGeneratorAbstraction from "../../application/abstractions/IdGeneratorAbstraction";
import CreateEmailProvider from "../../application/usecases/provider/CreateEmailProvider";
import ListEmailProvider from "../../application/usecases/provider/ListEmailProvider";
import EmailProviderRepository from "../../domain/repositories/EmailProviderRepositoy";
import HttpServer from "../HttpServer";

export default class EmailProviderFeature {
    
    constructor (readonly httpServer: HttpServer, 
        readonly repository: EmailProviderRepository,
        readonly idGenerator: IdGeneratorAbstraction) {
    }

    async config () {
        this.httpServer.route("post", "/providers", async (params: any, body: any) => {
            const createProvider = new CreateEmailProvider(this.repository, this.idGenerator);
            await createProvider.execute(body);
        });
        
        this.httpServer.route("get", "/providers", async (params: any, body: any) => {
            const getProviders = new ListEmailProvider(this.repository);
            const providers = await getProviders.execute();
            const response : EmailProviderResponse[] = providers.map(provider => ({
                id: provider.id,
                server: provider.server,
                port: provider.port,
                level: provider.level
            }))
            return response;
        });
    }
}

export type EmailProviderResponse = {
	id: string;
    server: string,
    port: string,
    level: string
}