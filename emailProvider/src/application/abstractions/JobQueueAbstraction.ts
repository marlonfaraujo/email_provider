import { JobOptions } from "../dtos/JobOptions";

export interface IJobQueue<T> {
  addJob(jobName: string, payload: T, options?: JobOptions): Promise<string>;
}