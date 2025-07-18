import KafkaBroker from "./KafkaBroker";

export default class PrometheusKafkaMetrics {

    static async getMetrics(kafkaBroker: KafkaBroker): Promise<MetricOutput[]> {
        const admin = await kafkaBroker.admin();
        const topics = await admin.listTopics();
        const metrics : MetricOutput[] = [];
        for (const topic of topics) {
            const topicOffsets = await admin.fetchTopicOffsets(topic);
            for (const partition of topicOffsets) {
                metrics.push({
                    topic,
                    partition: Number(partition.partition),
                    offset: Number(partition.offset),
                });
            }
        }
        return metrics;
    }
}

type MetricOutput = {
    topic: string,
    partition: number;
    offset: number;
}