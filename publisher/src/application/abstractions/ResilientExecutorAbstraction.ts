export default interface ResilientExecutorAbstraction {
    execute<T>(task: () => Promise<T>): Promise<T>;
}