import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import IMetricsExporter from "./IMetricsExporter";

export default class PrometheusMetricsExporter implements IMetricsExporter {
  private exporter: PrometheusExporter;

  constructor() {
    this.exporter = new PrometheusExporter({ 
        port: Number(process.env.PROMETHEUS_PORT_EXPORTER) || 9464,
        endpoint: "/metrics" 
    });
  }

  async init(): Promise<void> {
  }

  async shutdown(): Promise<void> {
    await this.exporter.shutdown();
  }

  getMetricReader(): PrometheusExporter {
    return this.exporter;
  }
}