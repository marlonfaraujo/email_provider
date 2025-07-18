import { collectDefaultMetrics, Counter, Gauge, Histogram, Metric, Registry, Summary } from "prom-client";
import MetricsServiceAbstraction, { MetricConfig, MetricType } from "../../application/abstractions/MetricsServiceAbstraction";
import PrometheusMetricTypeFactory from "./PrometheusMetricTypeFactory";

export default class PrometheusMetricsService implements MetricsServiceAbstraction {

    private registry: Registry;
    private metrics: Map<string, Metric<any>>;
    private factory: PrometheusMetricTypeFactory;

    constructor(){
        this.registry = new Registry();
        this.factory = new PrometheusMetricTypeFactory(this.registry);
        this.metrics = new Map();
        collectDefaultMetrics({ register: this.registry });
    }

    createMetric(type: MetricType, config: MetricConfig): void {
        if (this.metrics.has(config.name)) return;
        const metric = this.factory.create(type, config);
        this.metrics.set(config.name, metric);
    }
    observe(name: string, value: number, labels?: Record<string, string>): void {
        const metric = this.metrics.get(name);
        if (!metric || !('observe' in metric)) return;

        if (labels) {
            (metric as Histogram | Summary).observe(labels, value);
            return;
        }
        (metric as Histogram | Summary).observe(value);
    }
    inc(name: string, labels?: Record<string, string>, value?: number): void {
        const metric = this.metrics.get(name);
        if (!metric || !('inc' in metric)) return;
        if (labels) {
            metric.inc(labels, value);
            return;
        }
        metric.inc(value);
    }
    set(name: string, labels: Record<string, string>, value: number): void {
        const metric = this.metrics.get(name);
        if (!metric || !('set' in metric)) return;

        (metric as Gauge).set(labels, value);
    }
    getMetrics(): Promise<string> {
        return this.registry.metrics();
    }
    getContentType(): string {
        return this.registry.contentType;
    }

}