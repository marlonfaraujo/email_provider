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

    async init () {
        this.httpServer.on("post", "/providers", async (params: any, body: any) => {
            const createProvider = new CreateEmailProvider(this.repository, this.idGenerator);
            await createProvider.execute(body);
        });
        
        this.httpServer.on("get", "/providers", async (params: any, body: any) => {
            const getProviders = new ListEmailProvider(this.repository);
            const providers = await getProviders.execute();
            return providers;
        });
    }
}