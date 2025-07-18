import QueueAbstraction from "./queue/QueueAbstraction";
import PublisherController from "./controllers/PublisherController";
import { ExpressAdapter, HttpServer } from "./http/HttpServer";
import KafkaServer from "./queue/KafkaServer";
import OpenTelemetryService from "./observability/OpenTelemetryService";
import PrometheusMetricsExporter from "./observability/PrometheusMetricsExporter";
import TracerController from "./controllers/TracerController";

async function main () {
    const telemetry = new OpenTelemetryService(new PrometheusMetricsExporter(), "email-provider-publisher-api");
    await telemetry.start();
    //process.on('SIGTERM', () => telemetry.shutdown());
    const httpServer: HttpServer = new ExpressAdapter();
    const queue: QueueAbstraction = new KafkaServer("email-provider-publisher");
    await queue.connect();
    PublisherController.config(httpServer, queue);
    TracerController.config(httpServer, telemetry);
    httpServer.listen(3501);
}

main();