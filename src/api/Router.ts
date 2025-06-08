import IdGeneratorAbstraction from "../application/abstractions/IdGeneratorAbstraction";
import MongoDatabase from "../infra/database/MongoDatabase";
import NoSqlDatabaseConnectionAbstraction from "../infra/database/NoSqlDatabaseConnectionAbstraction";
import EmailMessageMemoryRepository from "../infra/repositories/EmailMessageMemoryRepository";
import EmailMessageMongoRepository from "../infra/repositories/EmailMessageMongoRepository";
import EmailProviderMemoryRepository from "../infra/repositories/EmailProviderMemoryRepository";
import EmailProviderMongoRepository from "../infra/repositories/EmailProviderMongoRepository";
import EmailScheduleMemoryRepository from "../infra/repositories/EmailScheduleMemoryRepository";
import EmailScheduleMongoRepository from "../infra/repositories/EmailScheduleMongoRepository";
import { CryptoUuidGenerator } from "../infra/uuid/CryptoUuidGenerator";
import MongoObjectIdGenerator from "../infra/uuid/MongoObjectIdGenerator";
import EmailMessageFeature from "./features/EmailMessageFeature";
import EmailProviderFeature from "./features/EmailProviderFeature";
import EmailScheduleFeature from "./features/EmailScheduleFeature";
import HttpServer from "./HttpServer";

export default class Router {

    private readonly uuid: IdGeneratorAbstraction;
    private readonly connection: NoSqlDatabaseConnectionAbstraction;

    constructor(readonly httpServer: HttpServer){
        this.uuid = new MongoObjectIdGenerator();
        this.connection = new MongoDatabase("email_provider");
    }

    init(): void{
        this.initEmailMessageFeature();
        this.initEmailScheduleFeature();
        this.initEmailProviderFeature();
    }

    private initEmailMessageFeature(): void{
        //const repository = new EmailMessageMemoryRepository();
        const repository = new EmailMessageMongoRepository(this.connection);
        const feature = new EmailMessageFeature(this.httpServer, repository, this.uuid);
        feature.init();
    }

    private initEmailScheduleFeature(): void{
        //const repository = new EmailScheduleMemoryRepository();
        const repository = new EmailScheduleMongoRepository(this.connection);
        const feature = new EmailScheduleFeature(this.httpServer, repository, this.uuid);
        feature.init();
    }

    private initEmailProviderFeature(): void{
        //const repository = new EmailProviderMemoryRepository();
        const repository = new EmailProviderMongoRepository(this.connection);
        const feature = new EmailProviderFeature(this.httpServer, repository, this.uuid);
        feature.init();
    }
}