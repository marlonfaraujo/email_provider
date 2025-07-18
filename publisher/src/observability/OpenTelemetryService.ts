import { NodeSDK } from "@opentelemetry/sdk-node";
import InstrumentationObervabilityAbstraction from "./InstrumentationObervabilityAbstraction";
import IMetricsExporter from "./IMetricsExporter";
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { trace, Tracer, TracerProvider } from "@opentelemetry/api";

export default class OpenTelemetryService implements InstrumentationObervabilityAbstraction {
  private sdk: NodeSDK;

  constructor(private readonly metricsExporter: IMetricsExporter, 
    private readonly serviceName: string
  ) {
    const metricReader = metricsExporter.getMetricReader();
    this.sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter({
        url: `http://${process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "tempo-service:4318"}/v1/traces`,
      }),
      metricReader: metricReader,
      instrumentations: [new ExpressInstrumentation(), new HttpInstrumentation()],
      serviceName: serviceName
    });
  }
  
  async start(): Promise<void> {
    await this.metricsExporter.init();
    this.sdk.start();
    console.log("OpenTelemetry started");
  }

  async shutdown(): Promise<void> {
    await this.sdk.shutdown();
    await this.metricsExporter.shutdown();
  }

  tracer(name: string): Promise<Tracer> {
    const tracer = trace.getTracer(name);
    return Promise.resolve(tracer);
  }

  tracerProvider(): TracerProvider {
    return trace.getTracerProvider();
  }
}
