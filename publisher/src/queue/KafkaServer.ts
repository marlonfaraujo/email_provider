import { Kafka } from "kafkajs";
import QueueAbstraction from "./QueueAbstraction";
import { QueueParamsDto } from "./QueueParamsDto";

export default class KafkaServer implements QueueAbstraction {

    private kafka?: Kafka;

    constructor(readonly clientId: string){

    }

    connect(): Promise<void> {
        this.kafka = new Kafka({ clientId: this.clientId ?? 'app', brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"] });
        return Promise.resolve();
    }
    
    async publish(queueParams: QueueParamsDto, message: any): Promise<void> {
        const producer = this.kafka?.producer();
        await producer!.connect();
        const input: any = {
            key: message?.from ?? crypto.randomUUID(),
            value: Buffer.from(JSON.stringify(message)),
            headers: { occurredAt: new Date().toString() }
        };
        await producer!.send({ topic: queueParams.queueName, messages: [input]});
    }

    async close(): Promise<void> {
        await this.kafka?.producer()?.disconnect();
    }  

}