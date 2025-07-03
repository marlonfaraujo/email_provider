import amqp, { ConfirmChannel } from "amqplib";
import QueueAbstraction from "./QueueAbstraction";
import { QueueParamsDto } from "./QueueParamsDto";

export default class RabbitMQServer  implements QueueAbstraction {
    
    private connection!: amqp.ChannelModel;

    constructor(){
    }
    
    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://admin:admin@rabbitmq:5672");
    }

    async publish(queueParams: QueueParamsDto, message: any): Promise<void> {
        const channel = await this.connection.createConfirmChannel();
        this.config(queueParams, channel, { durable: true });

        const timeoutError: Promise<boolean> = new Promise((resolve, reject) => setTimeout(() => reject(new Error("timeout")), 4000));

        Promise.race([timeoutError, this.publishWithConfirmChannel(channel, queueParams, message)]);
    }

    private publishWithConfirmChannel(channel: ConfirmChannel, queueParams: QueueParamsDto, message: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const onReturn = (msg: any) => {
                channel.off('return', onReturn);
                reject(msg);
            };

            channel.on('return', onReturn);

            channel.publish(queueParams.exchange, 
                queueParams.routingKey, 
                Buffer.from(JSON.stringify(message)), 
                { persistent: true, mandatory: true }, 
                (err, ok) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(true);
                }
            );

        });
    }

    async close(channel: amqp.Channel): Promise<void> {
        await channel.close();
        await this.connection.close();
    }    

    private async config(queueParams: QueueParamsDto, channel: any, options: any): Promise<void>{
        await channel.assertExchange(queueParams.exchange, queueParams.type, options);
        await channel.assertQueue(queueParams.queueName, options);
        await channel.bindQueue(queueParams.queueName, queueParams.exchange, queueParams.routingKey);
    }


}