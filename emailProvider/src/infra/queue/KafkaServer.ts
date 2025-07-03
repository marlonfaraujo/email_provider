import { Consumer, Kafka } from "kafkajs";
import QueueAbstraction from "../../application/abstractions/QueueAbstraction";
import { QueueParams } from "../../application/dtos/QueueParams";

export default class KafkaServer implements QueueAbstraction {

    private kafka?: Kafka;
    private consumer?: Consumer;

    constructor(readonly clientId: string,
        readonly groupId: string
    ){

    }

    connect(): Promise<void> {
        this.kafka = new Kafka({ clientId: this.clientId ?? 'app-consumer', brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"] });
        return Promise.resolve();
    }

    async consume(queueParams: QueueParams, callback: Function): Promise<void> {
        this.consumer = this.kafka!.consumer({ groupId: this.groupId });
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: queueParams.queueName, fromBeginning: false });      
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const output = message.value!.toString();
                await callback(output);
            }
        });
    }

    async close(): Promise<void> {
        await this.consumer?.disconnect();
    }  

}