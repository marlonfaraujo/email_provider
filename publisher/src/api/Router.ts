import QueueAbstraction from "../application/abstractions/QueueAbstraction";
import RabbitMQServer from "../infra/queue/RabbitMQServer";
import PublisherFeature from "./features/PublisherFeature";
import HttpServer from "./HttpServer";

export default class Router {

    constructor(readonly httpServer: HttpServer){
    }

    init(): void{
        this.initPublisherFeature();
    }

    private async initPublisherFeature(): Promise<void>{
        const queue: QueueAbstraction = new RabbitMQServer();
        await queue.connect();
        const feature = new PublisherFeature(this.httpServer, queue);
        feature.config();
    }
}