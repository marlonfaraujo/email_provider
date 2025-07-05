import EmailProviderAbstraction from "../../application/abstractions/EmailProviderAbstraction";
import IdGeneratorAbstraction from "../../application/abstractions/IdGeneratorAbstraction";
import JobWorkerAbstraction from "../../application/abstractions/JobWorkerAbstraction";
import { SendEmailDto } from "../../application/dtos/SendEmailDto";
import { SendEmailResultDto } from "../../application/dtos/SendEmailResultDto";
import SendEmailException from "../../application/exceptions/SendEmailException";
import CreateEmailMessage from "../../application/usecases/emailMessage/CreateEmailMessage";
import EmailMessageRepository from "../../domain/repositories/EmailMessageRepository";
import MongoDatabase from "../database/MongoDatabase";
import NoSqlDatabaseConnectionAbstraction from "../database/NoSqlDatabaseConnectionAbstraction";
import EmailSendGrid from "../providers/EmailSendGrid";
import EmailMessageMongoRepository from "../repositories/EmailMessageMongoRepository";
import MongoObjectIdGenerator from "../uuid/MongoObjectIdGenerator";

export default class EmailJob {

    constructor(readonly worker: JobWorkerAbstraction,
        readonly emailProvider: EmailProviderAbstraction
    ){
    }

    async config(): Promise<void> {
        const emailProvider: EmailProviderAbstraction = new EmailSendGrid();
        const connection: NoSqlDatabaseConnectionAbstraction = new MongoDatabase();
        const emailRepository: EmailMessageRepository = new EmailMessageMongoRepository(connection);
        const idGenerator: IdGeneratorAbstraction = new MongoObjectIdGenerator();
		await this.worker.start(async(job: any) => {
            const input : SendEmailDto = {
                to: job.data?.to || [],
                cc: job.data?.cc || [],
                bcc: job.data?.cco || [],
                from: job.data?.from,
                subject: job.data?.subject,
                body: job.data?.body
            };
			await emailProvider.sendEmail(input)
                .then(async (result: SendEmailResultDto) => {
                    const createEmailMessage = new CreateEmailMessage(emailRepository, idGenerator);
                    await createEmailMessage.execute(job.data);
                })
                .catch((exception: SendEmailException) => {
                    console.log(exception);
                });
		});
    }
}