import QueueAbstraction from "../queue/QueueAbstraction";
import { QueueParamsDto } from "../queue/QueueParamsDto";
import { RABBIT_CONFIG } from "../queue/RabbitConfig";
import { HttpServer } from "../http/HttpServer";

export default class PublisherController {
    
    static config (httpServer: HttpServer, queue: QueueAbstraction) {
        httpServer.route("post", "/sendemail", async (params: any, body: any) => {
			const request: Input = body;
			const queueParams: QueueParamsDto = { 
				exchange: RABBIT_CONFIG.EXCHANGES.SEND_EMAIL, 
				routingKey: RABBIT_CONFIG.ROUTING_KEYS.SEND_EMAIL, 
				queueName: RABBIT_CONFIG.QUEUES.SEND_EMAIL, 
				type: "" 
			};
			await queue.publish(queueParams, request);
        });
    }
}

export type Input = {
	body: string,
    subject: string,
    from: string
    to?: string[],
    cc?: string[],
    cco?: string[]
}
