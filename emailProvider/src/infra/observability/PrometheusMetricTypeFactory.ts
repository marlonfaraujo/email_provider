import { Counter, Gauge, Histogram, Metric, Registry, Summary } from "prom-client";
import { MetricConfig, MetricType } from "../../application/abstractions/MetricsServiceAbstraction";

export default class PrometheusMetricTypeFactory {

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    public create(type: MetricType, config: MetricConfig): Metric<any> {
        const factoryMap = {
            counter: () => new Counter({ ...config, registers: [this.registry] }),
            gauge: () => new Gauge({ ...config, registers: [this.registry] }),

            histogram: () =>
                new Histogram({
                    ...config,
                    registers: [this.registry],
                    buckets: config.buckets || [0.1, 0.5, 1, 2, 5],
                }),
            summary: () =>
                new Summary({
                    ...config,
                    registers: [this.registry],
                    percentiles: config.percentiles || [0.5, 0.9, 0.99],
                })

        } as const;
        const factory = factoryMap[type];
        if (!factory) {
            throw new Error(`Type of metric not supported: ${type}`);
        }
        return factory();
    }
}