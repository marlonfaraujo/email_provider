export default interface InstrumentationObervabilityAbstraction {
    start(): Promise<void>;
    shutdown(): Promise<void>;
    tracer(name: string): Promise<any>;
}