import EmailProviderAbstraction from "../../application/abstractions/EmailProviderAbstraction";
import IdGeneratorAbstraction from "../../application/abstractions/IdGeneratorAbstraction";
import { EmailMessageDto } from "../../application/dtos/EmailMessageDto";
import CreateEmailMessage from "../../application/usecases/emailMessage/CreateEmailMessage";
import ListEmailMessage from "../../application/usecases/emailMessage/ListEmailMessage";
import SendEmailMessage from "../../application/usecases/emailMessage/SendEmailMessage";
import EmailMessageRepository from "../../domain/repositories/EmailMessageRepository";
import HttpServer from "../HttpServer";

export default class EmailMessageFeature {
    
	constructor (readonly httpServer: HttpServer, 
        readonly repository: EmailMessageRepository,
        readonly idGenerator: IdGeneratorAbstraction,
		readonly emailProvider: EmailProviderAbstraction) {
	}

	async config () {
		this.httpServer.route("post", "/messages", async (params: any, body: any) => {
			const request: EmailMessageDto = body;
			const sendEmail = new SendEmailMessage(this.emailProvider);
			const result = await sendEmail.execute(request);
			if(result == null || result.statusCode >= 400){
				//bullmq para retries ou agendamento
				return;
			}
			const createMessage = new CreateEmailMessage(this.repository, this.idGenerator);
			const messageId = await createMessage.execute(request);
			return { messageId: messageId };
		});
		
		this.httpServer.route("get", "/messages", async (params: any, body: any) => {
			const getMessages = new ListEmailMessage(this.repository);
			const messages = await getMessages.execute();
			const response: EmailMessageResponse[] = messages.map(message => ({
				id: message.id,
				status: message.status,
				subject: message.subject,
				from: message.from,
				recipient: message.recipients.join(";")
			}));
			return response;
		});
	}
}

export type EmailMessageResponse = {
	id: string,
	status: string,
	subject: string,
	from: string,
	recipient: string
}