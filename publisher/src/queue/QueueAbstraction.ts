import { QueueParamsDto } from "./QueueParamsDto";

export default interface QueueAbstraction {
    connect (): Promise<void>;
    publish (queueParams: QueueParamsDto, message: any): Promise<void>;
}