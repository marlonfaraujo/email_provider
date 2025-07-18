import EmailProviderAbstraction from "../../application/abstractions/EmailProviderAbstraction";
import IdGeneratorAbstraction from "../../application/abstractions/IdGeneratorAbstraction";
import CacheConnectionAbstraction from "../database/CacheConnectionAbstraction";
import MongoDatabase from "../database/MongoDatabase";
import NoSqlDatabaseConnectionAbstraction from "../database/NoSqlDatabaseConnectionAbstraction";
import EmailMessageFeature from "../features/EmailMessageFeature";
import EmailProviderFeature from "../features/EmailProviderFeature";
import EmailScheduleFeature from "../features/EmailScheduleFeature";
import EmailMessageMemoryRepository from "../repositories/EmailMessageMemoryRepository";
import EmailProviderMemoryRepository from "../repositories/EmailProviderMemoryRepository";
import EmailScheduleMemoryRepository from "../repositories/EmailScheduleMemoryRepository";
import { CryptoUuidGenerator } from "../uuid/CryptoUuidGenerator";
import EmailSendGrid from "../providers/EmailSendGrid";
import EmailMessageMongoRepository from "../repositories/EmailMessageMongoRepository";
import EmailProviderMongoRepository from "../repositories/EmailProviderMongoRepository";
import EmailScheduleMongoRepository from "../repositories/EmailScheduleMongoRepository";
import MongoObjectIdGenerator from "../uuid/MongoObjectIdGenerator";
import HttpServer from "./HttpServer";
import MetricsFeature from "../features/MetricsFeature";
import MetricsServiceAbstraction from "../../application/abstractions/MetricsServiceAbstraction";

export default class Router {

    private readonly uuid: IdGeneratorAbstraction;
    private readonly connection: NoSqlDatabaseConnectionAbstraction;
    private readonly emailProvider: EmailProviderAbstraction;

    constructor(readonly httpServer: HttpServer, 
        readonly cacheConnection: CacheConnectionAbstraction,
        readonly metricsService: MetricsServiceAbstraction){
        this.uuid = new MongoObjectIdGenerator();
        this.connection = new MongoDatabase();
        this.emailProvider = new EmailSendGrid();
    }

    init(): void{
        this.initEmailMessageFeature();
        this.initEmailScheduleFeature();
        this.initEmailProviderFeature();
        this.initMetricsFeature();
    }

    private async initEmailMessageFeature(): Promise<void> {
        //const repository = new EmailMessageMemoryRepository();
        const repository = new EmailMessageMongoRepository(this.connection);
        const feature = new EmailMessageFeature(this.httpServer, repository, this.uuid, this.emailProvider, this.cacheConnection);
        feature.config();
    }

    private initEmailScheduleFeature(): void {
        //const repository = new EmailScheduleMemoryRepository();
        const repository = new EmailScheduleMongoRepository(this.connection);
        const feature = new EmailScheduleFeature(this.httpServer, repository, this.uuid, this.cacheConnection);
        feature.config();
    }

    private initEmailProviderFeature(): void {
        //const repository = new EmailProviderMemoryRepository();
        const repository = new EmailProviderMongoRepository(this.connection);
        const feature = new EmailProviderFeature(this.httpServer, repository, this.uuid);
        feature.config();
    }

    private initMetricsFeature(): void {
        const feature = new MetricsFeature(this.httpServer, this.metricsService);
        feature.config();
    }
}