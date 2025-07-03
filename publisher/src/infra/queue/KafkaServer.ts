import { Kafka } from "kafkajs";
import QueueAbstraction from "../../application/abstractions/QueueAbstraction";
import { QueueParams } from "../../application/dtos/QueueParams";

export default class KafkaServer implements QueueAbstraction {

    private kafka?: Kafka;

    constructor(readonly clientId: string){

    }

    connect(): Promise<void> {
        this.kafka = new Kafka({ clientId: this.clientId ?? 'app', brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"] });
        return Promise.resolve();
    }
    
    async publish(queueParams: QueueParams, message: any): Promise<void> {
        const producer = this.kafka?.producer();
        const input: any = {
            key: queueParams.queueName,
            value: Buffer.from(JSON.stringify(message)),
            headers: { occurredAt: new Date() }
        };
        await producer!.send({ topic: queueParams.queueName, messages: [input]});
    }

    async close(): Promise<void> {
        await this.kafka?.producer()?.disconnect();
    }  

}