import { Queue } from "bullmq";
import { IJobQueue } from "../../application/abstractions/JobQueueAbstraction";
import CacheConnectionAbstraction from "../database/CacheConnectionAbstraction";
import { JobOptions } from "../../application/dtos/JobOptions";

export default class BullMQJobQueue<T> implements IJobQueue<T> {

  private readonly queue: Queue;

  constructor(readonly queueName: string, cacheConnection: CacheConnectionAbstraction) {
    this.queue = new Queue(queueName, { connection: cacheConnection.connection() });
  }

  async addJob(jobName: string, payload: T, options: JobOptions = {}): Promise<string> {
    const delay =
      options.scheduledAt && options.scheduledAt > new Date()
        ? options.scheduledAt.getTime() - Date.now()
        : 0;

    const job = await this.queue.add(jobName, payload, {
      delay,
      attempts: options.attempts ?? 1,
      backoff: { type: 'exponential', delay: 60_000 }, // 1 min, 2 min, 4 min…
      removeOnComplete: true,
      removeOnFail: false,
    });
    return job.id as string;
  }
}