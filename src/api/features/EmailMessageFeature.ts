import IdGeneratorAbstraction from "../../application/abstractions/IdGeneratorAbstraction";
import CreateEmailMessage from "../../application/usecases/emailMessage/CreateEmailMessage";
import ListEmailMessage from "../../application/usecases/emailMessage/ListEmailMessage";
import EmailMessageRepository from "../../domain/repositories/EmailMessageRepository";
import HttpServer from "../HttpServer";

export default class EmailMessageFeature {
    
	constructor (readonly httpServer: HttpServer, 
        readonly repository: EmailMessageRepository,
        readonly idGenerator: IdGeneratorAbstraction) {
	}

	async config () {
		this.httpServer.route("post", "/messages", async (params: any, body: any) => {
			console.log(body);
			const createMessage = new CreateEmailMessage(this.repository, this.idGenerator);
			await createMessage.execute(body);
		});
		
		this.httpServer.route("get", "/messages", async (params: any, body: any) => {
			const getMessages = new ListEmailMessage(this.repository);
			const messages = await getMessages.execute();
			return messages;
		});
	}
}