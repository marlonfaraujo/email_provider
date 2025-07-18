import client, { Gauge, Registry } from "prom-client";

export default class PrometheusMetricsService {

    private register: Registry;
    private kafkaGauge: Gauge;

    constructor(){
        this.register = new client.Registry();
        this.kafkaGauge = new client.Gauge({
            name: 'kafka_partition_offset',
            help: 'Latest offset per topic/partition',
            labelNames: ['topic', 'partition']
        });
        this.register.registerMetric(this.kafkaGauge);
    }
    
    updateMetrics(metrics: any[]): void {
        this.kafkaGauge.reset();
        for (const { topic, partition, offset } of metrics) {
            this.kafkaGauge.set({ topic, partition }, offset);
        }
    }

    async getMetrics(): Promise<string> {
        return await this.register.metrics();
    }

    getContentType(): string {
        return this.register.contentType;
    }
}