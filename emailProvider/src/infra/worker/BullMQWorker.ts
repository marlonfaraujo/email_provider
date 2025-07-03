import JobWorkerAbstraction from "../../application/abstractions/JobWorkerAbstraction";
import CacheConnectionAbstraction from "../database/CacheConnectionAbstraction";
import { Worker } from 'bullmq';

export default class BullMQWorker implements JobWorkerAbstraction {

    private worker?: Worker;

    constructor(readonly cacheConnection: CacheConnectionAbstraction,
        private readonly queueName: string,
        private readonly concurrency = 5,
    ){
        
    }

    async start(callback: Function): Promise<void> {
        this.worker = new Worker(
            this.queueName,
            async (job: any) => await callback(job),
            { connection: this.cacheConnection.connection(), concurrency: this.concurrency },
        );
    }

    async close(): Promise<void> {
        await this.worker?.close();
    }
}