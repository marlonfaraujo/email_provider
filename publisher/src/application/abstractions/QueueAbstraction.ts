import { QueueParams } from "../dtos/QueueParams";

export default interface QueueAbstraction {
    connect (): Promise<void>;
    publish (queueParams: QueueParams, message: any): Promise<void>;
}