export default interface JobWorkerAbstraction {
  start(callback: Function): Promise<void>;
  close(): Promise<void>;
}