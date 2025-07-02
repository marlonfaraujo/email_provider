import EmailProviderAbstraction from "../application/abstractions/EmailProviderAbstraction";
import IdGeneratorAbstraction from "../application/abstractions/IdGeneratorAbstraction";
import QueueAbstraction from "../application/abstractions/QueueAbstraction";
import MongoDatabase from "../infra/database/MongoDatabase";
import NoSqlDatabaseConnectionAbstraction from "../infra/database/NoSqlDatabaseConnectionAbstraction";
import EmailSendGrid from "../infra/providers/EmailSendGrid";
import RabbitMQServer from "../infra/queue/RabbitMQServer";
import EmailMessageMemoryRepository from "../infra/repositories/EmailMessageMemoryRepository";
import EmailMessageMongoRepository from "../infra/repositories/EmailMessageMongoRepository";
import EmailProviderMemoryRepository from "../infra/repositories/EmailProviderMemoryRepository";
import EmailProviderMongoRepository from "../infra/repositories/EmailProviderMongoRepository";
import EmailScheduleMemoryRepository from "../infra/repositories/EmailScheduleMemoryRepository";
import EmailScheduleMongoRepository from "../infra/repositories/EmailScheduleMongoRepository";
import { CryptoUuidGenerator } from "../infra/uuid/CryptoUuidGenerator";
import MongoObjectIdGenerator from "../infra/uuid/MongoObjectIdGenerator";
import SendEmailMessageConsumer from "./consumers/SendEmailMessageConsumer";
import EmailMessageFeature from "./features/EmailMessageFeature";
import EmailProviderFeature from "./features/EmailProviderFeature";
import EmailScheduleFeature from "./features/EmailScheduleFeature";
import HttpServer from "./HttpServer";

export default class Router {

    private readonly uuid: IdGeneratorAbstraction;
    private readonly connection: NoSqlDatabaseConnectionAbstraction;
    private readonly emailProvider: EmailProviderAbstraction;

    constructor(readonly httpServer: HttpServer){
        this.uuid = new MongoObjectIdGenerator();
        this.connection = new MongoDatabase();
        this.emailProvider = new EmailSendGrid();
    }

    init(): void{
        this.initEmailMessageFeature();
        this.initEmailScheduleFeature();
        this.initEmailProviderFeature();
        this.initSendEmailMessageConsumer();
    }

    private async initEmailMessageFeature(): Promise<void>{
        //const repository = new EmailMessageMemoryRepository();
        const repository = new EmailMessageMongoRepository(this.connection);
        const feature = new EmailMessageFeature(this.httpServer, repository, this.uuid, this.emailProvider);
        feature.config();
    }

    private initEmailScheduleFeature(): void{
        //const repository = new EmailScheduleMemoryRepository();
        const repository = new EmailScheduleMongoRepository(this.connection);
        const feature = new EmailScheduleFeature(this.httpServer, repository, this.uuid);
        feature.config();
    }

    private initEmailProviderFeature(): void{
        //const repository = new EmailProviderMemoryRepository();
        const repository = new EmailProviderMongoRepository(this.connection);
        const feature = new EmailProviderFeature(this.httpServer, repository, this.uuid);
        feature.config();
    }
    
    private async initSendEmailMessageConsumer(): Promise<void>{
        const repository = new EmailMessageMongoRepository(this.connection);
        const queue: QueueAbstraction = new RabbitMQServer();
        await queue.connect();
        SendEmailMessageConsumer.config(queue, repository, this.uuid, this.emailProvider);
    }
}