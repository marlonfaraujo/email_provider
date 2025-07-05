import EmailProviderAbstraction from "../../application/abstractions/EmailProviderAbstraction";
import IdGeneratorAbstraction from "../../application/abstractions/IdGeneratorAbstraction";
import { IJobQueue } from "../../application/abstractions/JobQueueAbstraction";
import { EmailMessageDto } from "../../application/dtos/EmailMessageDto";
import CreateEmailMessage from "../../application/usecases/emailMessage/CreateEmailMessage";
import ListEmailMessage from "../../application/usecases/emailMessage/ListEmailMessage";
import SendEmailMessage from "../../application/usecases/emailMessage/SendEmailMessage";
import EmailMessageRepository from "../../domain/repositories/EmailMessageRepository";
import CacheConnectionAbstraction from "../../infra/database/CacheConnectionAbstraction";
import BullMQJobQueue from "../../infra/queue/BullMQJobQueue";
import HttpServer from "../api/HttpServer";

export default class EmailMessageFeature {

	constructor (readonly httpServer: HttpServer, 
        readonly repository: EmailMessageRepository,
        readonly idGenerator: IdGeneratorAbstraction,
		readonly emailProvider: EmailProviderAbstraction,
		readonly cacheConnection: CacheConnectionAbstraction) {
	}

	async config (): Promise<void> {
		this.httpServer.route("post", "/messages", async (params: any, body: any) => {
			const request: EmailMessageDto = body;
			const jobQueue: IJobQueue<EmailMessageDto> = new BullMQJobQueue<EmailMessageDto>("email-queue", this.cacheConnection);
			const sendEmail = new SendEmailMessage(this.emailProvider, jobQueue);
			await sendEmail.execute(request);
			return {};
		});
		
		this.httpServer.route("get", "/messages", async (params: any, body: any) => {
			const getMessages = new ListEmailMessage(this.repository);
			const messages = await getMessages.execute();
			const response: EmailMessageResponse[] = messages.map(message => ({
				id: message.id,
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
	subject: string,
	from: string,
	recipient: string
}