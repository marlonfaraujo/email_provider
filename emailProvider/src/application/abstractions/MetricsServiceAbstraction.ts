export default interface MetricsServiceAbstraction {
    createMetric(type: MetricType, config: MetricConfig): void;
    observe(name: string, value: number, labels?: Record<string, string>): void;
    inc(name: string, labels?: Record<string, string>, value?: number): void;
    set(name: string, labels: Record<string, string>, value: number): void;
    getMetrics(): Promise<string>;
    getContentType(): string;
}

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';

export type MetricConfig = {
  name: string;
  help: string;
  labelNames?: string[];
  buckets?: number[];
  percentiles?: number[];
};