import { Admin, Kafka } from "kafkajs";

export default class KafkaBroker {

    private kafka?: Kafka;
    private adminKafka?: Admin;

    constructor(readonly clientId: string) {
        this.kafka = new Kafka({ clientId: this.clientId ?? 'kafka-exporter', brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"] });
    }

    async admin(): Promise<Admin> {
        this.adminKafka = this.kafka?.admin({});
        await this.adminKafka?.connect();
        return this.adminKafka!;
    }

    async close(): Promise<void> {
        await this.adminKafka?.disconnect();
    }  

}