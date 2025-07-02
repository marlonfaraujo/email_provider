import { QueueParams } from "../dtos/QueueParams";

export default interface QueueAbstraction {
    connect (): Promise<void>;
    consume (queueParams: QueueParams, callback: Function): Promise<void>;
}