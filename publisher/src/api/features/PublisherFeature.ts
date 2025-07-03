import QueueAbstraction from "../../application/abstractions/QueueAbstraction";
import { QueueParams } from "../../application/dtos/QueueParams";
import { RABBIT_CONFIG } from "../../shared/RabbitConfig";
import HttpServer from "../HttpServer";

export default class PublisherFeature {
    
    constructor (readonly httpServer: HttpServer,
		readonly queue: QueueAbstraction) {
    }

    async config () {
        this.httpServer.route("post", "/sendemail", async (params: any, body: any) => {
			const request: Input = body;
			const queueParams: QueueParams = { 
				exchange: RABBIT_CONFIG.EXCHANGES.SEND_EMAIL, 
				routingKey: RABBIT_CONFIG.ROUTING_KEYS.SEND_EMAIL, 
				queueName: RABBIT_CONFIG.QUEUES.SEND_EMAIL, 
				type: "" 
			};
			//tranformation in use case
			await this.queue.publish(queueParams, request);
        });
    }
}

export type Input = {

}
