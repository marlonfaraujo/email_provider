import EmailProviderAbstraction from "../application/abstractions/EmailProviderAbstraction";
import JobWorkerAbstraction from "../application/abstractions/JobWorkerAbstraction";
import SendEmailMessage from "../application/usecases/emailMessage/SendEmailMessage";
import CacheConnectionAbstraction from "../infra/database/CacheConnectionAbstraction";
import { Worker } from 'bullmq';

export default class BullMQWorker implements JobWorkerAbstraction {

    private worker?: Worker;

    constructor(readonly connection: CacheConnectionAbstraction,
        private readonly queueName: string,
        private readonly concurrency = 5,
    ){
        
    }

    async start(callback: Function): Promise<void> {
        this.worker = new Worker(
            this.queueName,
            async (job: any) => await callback(job.data),
            { connection: this.connection, concurrency: this.concurrency },
        );
    }

    async close(): Promise<void> {
        await this.worker?.close();
    }

    async sendEmailWorker(emailProvider: EmailProviderAbstraction, concurrency = 5): Promise<void>{
        const sendEmail = new SendEmailMessage(emailProvider);
        const emailWorker = new Worker(
            "email-queue",
            async (job: any) => {
                const result = await sendEmail.execute(job.data);
            },
            { connection: this.connection, concurrency: concurrency },
        );

        emailWorker.on('failed', (job: any, err: any) =>
            console.error(`Job ${job.id} failed: ${err}`),
        );
        emailWorker.on('completed', (job: any) => {
            console.log(`Job ${job.id} sucess.`);
        });
    }
}