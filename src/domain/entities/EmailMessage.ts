import { MessageStatusEnum } from "../enums/MessageStatus";
import EmailMessageParameter from "../valueObjects/EmailMessageParameter";

//in real time
export default class EmailMessage{

    readonly id: string;
    private status: string;
    messageParameter: EmailMessageParameter;
    private readonly createdDate: Date;
    private publishedDate: Date | null;

    constructor(id: string, messageParameter: EmailMessageParameter){
        this.id = id;
        this.status = MessageStatusEnum.Pending; //for queue
        this.messageParameter = messageParameter;
        this.createdDate = new Date();
        this.publishedDate = null;
    }

    getStatus(): string{
        return this.status;
    }

    //for queue
    publish(): void{
        this.status = MessageStatusEnum.Published;
        this.publishedDate = new Date();
    }
}



