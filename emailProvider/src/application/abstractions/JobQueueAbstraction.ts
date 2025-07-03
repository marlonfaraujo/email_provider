import { JobOptions } from "../dtos/JobOptions";

export interface IJobQueue<T> {
  addJob(payload: T, options?: JobOptions): Promise<string>;
}