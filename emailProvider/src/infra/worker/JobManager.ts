import EmailProviderAbstraction from "../../application/abstractions/EmailProviderAbstraction";
import JobWorkerAbstraction from "../../application/abstractions/JobWorkerAbstraction";
import CacheConnectionAbstraction from "../database/CacheConnectionAbstraction";
import EmailSendGrid from "../providers/EmailSendGrid";
import BullMQWorker from "./BullMQWorker";
import EmailJob from "./EmailJob";

export default class JobManager {
    
    constructor(readonly cacheConnection: CacheConnectionAbstraction){
    }

    config(): void {
        this.emailJobConfig();
    }

    private emailJobConfig(): void {
        const worker: JobWorkerAbstraction = new BullMQWorker(
            this.cacheConnection,
            "email-queue",
            5 // concurrency
        );
        const emailProvider: EmailProviderAbstraction = new EmailSendGrid();
        const emailJob = new EmailJob(worker, emailProvider);
        emailJob.config();
    }
}