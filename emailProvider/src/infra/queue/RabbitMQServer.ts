import amqp from "amqplib";
import QueueAbstraction from "../../application/abstractions/QueueAbstraction";
import { QueueParams } from "../../application/dtos/QueueParams";

export default class RabbitMQServer  implements QueueAbstraction {
    
    private connection!: amqp.ChannelModel;

    constructor(){
    }
    
    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://admin:admin@email-provider-rabbitmq:5672");
    }

    async consume(queueParams: QueueParams, callback: Function): Promise<void> {
        const channel =  await this.connection.createChannel();
        await this.config(queueParams, channel, { durable: true });

        channel.consume(queueParams.queueName, async (message: any) => {
            if (!message){
                channel.nack(message, false, false);
                return;
            }
            const input = JSON.parse(message.content.toString());
            await callback(input);
            //this.channel.ack(message);
        });
    }
    
    async close(channel: amqp.Channel): Promise<void> {
        await channel.close();
        await this.connection.close();
    }    
    
    private async config(queueParams: QueueParams, channel: any, options: any): Promise<void>{
        await channel.assertExchange(queueParams.exchange, queueParams.type, options);
        await channel.assertQueue(queueParams.queueName, options);
        await channel.bindQueue(queueParams.queueName, queueParams.exchange, queueParams.routingKey);
    }


}