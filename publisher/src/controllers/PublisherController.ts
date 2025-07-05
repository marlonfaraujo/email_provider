import QueueAbstraction from "../queue/QueueAbstraction";
import { QueueParamsDto } from "../queue/QueueParamsDto";
import { QUEUE_CONFIG } from "../queue/QueueConfig";
import { HttpServer } from "../http/HttpServer";

export default class PublisherController {
    
    static config (httpServer: HttpServer, queue: QueueAbstraction) {
        httpServer.route("post", "/sendemail", async (params: any, body: any) => {
			const request: Input = body;
			const queueParams: QueueParamsDto = { 
				exchange: QUEUE_CONFIG.EXCHANGES.SEND_EMAIL, 
				routingKey: QUEUE_CONFIG.ROUTING_KEYS.SEND_EMAIL, 
				queueName: QUEUE_CONFIG.QUEUES.SEND_EMAIL, 
				type: "" 
			};
			await queue.publish(queueParams, request);
            return {};
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
