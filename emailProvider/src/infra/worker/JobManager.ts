import EmailProviderAbstraction from "../../application/abstractions/EmailProviderAbstraction";
import JobWorkerAbstraction from "../../application/abstractions/JobWorkerAbstraction";
import CacheConnectionAbstraction from "../database/CacheConnectionAbstraction";
import RedisConnection from "../database/RedisConnection";
import EmailSendGrid from "../providers/EmailSendGrid";
import BullMQWorker from "./BullMQWorker";
import EmailJob from "./EmailJob";

export default class JobManager {

    private readonly connection: CacheConnectionAbstraction;
    
    constructor(){
        this.connection = new RedisConnection();
    }

    config(): void {
        this.emailConfig();
    }

    private emailConfig(): void {
        const worker: JobWorkerAbstraction = new BullMQWorker(
            this.connection,
            "email-queue",
            5 // concurrency
        );
        const emailProvider: EmailProviderAbstraction = new EmailSendGrid();
        const emailJob = new EmailJob(worker, emailProvider);
        emailJob.config();
    }
}