export default interface IMetricsExporter {
  init(): Promise<void>;
  shutdown(): Promise<void>;
  getMetricReader(): any;
}