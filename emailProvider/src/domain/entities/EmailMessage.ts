import EmailMessageParameter from "../valueObjects/EmailMessageParameter";

export default class EmailMessage{

    readonly id: string;
    messageParameter: EmailMessageParameter;
    private readonly createdDate: Date;

    constructor(id: string, messageParameter: EmailMessageParameter){
        this.id = id;
        this.messageParameter = messageParameter;
        this.createdDate = new Date();
    }
}



