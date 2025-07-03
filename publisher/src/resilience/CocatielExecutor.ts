import { circuitBreaker, CircuitBreakerPolicy, ConsecutiveBreaker, ExponentialBackoff, handleAll, retry, RetryPolicy } from "cockatiel";
import ResilientExecutorAbstraction from "./ResilientExecutorAbstraction";

export default class CocatielExecutor implements ResilientExecutorAbstraction {
    
    private readonly retryPolicy: RetryPolicy;
    private readonly breakerPolicy: CircuitBreakerPolicy | null;

    constructor(opts?: {
        retry?: (builder: typeof retry) => RetryPolicy;
        breaker?: (builder: typeof circuitBreaker) => CircuitBreakerPolicy | null;
    }) {
        
        this.retryPolicy = retry(handleAll, { maxAttempts: 3, backoff: new ExponentialBackoff({ initialDelay: 1_000, maxDelay: 8_000 }) });
        this.breakerPolicy = circuitBreaker(handleAll, {
            halfOpenAfter: 10 * 1000,
            breaker: new ConsecutiveBreaker(3),
        });
    }

    async execute<T>(task: () => Promise<T>): Promise<T> {
        const exec = () => this.retryPolicy.execute(task);
        return this.breakerPolicy ? this.breakerPolicy.execute(exec) : exec();
    }

}