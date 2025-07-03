import QueueAbstraction from "./queue/QueueAbstraction";
import PublisherController from "./controllers/PublisherController";
import { ExpressAdapter, HttpServer } from "./http/HttpServer";
import KafkaServer from "./queue/KafkaServer";

async function main () {
    const httpServer: HttpServer = new ExpressAdapter();
    const queue: QueueAbstraction = new KafkaServer("email-provider-publisher");
    await queue.connect();
    PublisherController.config(httpServer, queue);
    httpServer.listen(3501);
}

main();