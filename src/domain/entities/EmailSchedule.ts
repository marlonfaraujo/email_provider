import { MessageStatusEnum } from "../enums/MessageStatus";
import EmailMessageParameter from "../valueObjects/EmailMessageParameter";

export class EmailSchedule{
    
    readonly id: string;
    name: string;
    private scheduledDate: Date;
    private scheduleStatus: string;
    messageParameter: EmailMessageParameter;
    private publishStatus: string;
    private publishDate: Date | null;

    constructor(id: string, name: string, messageParameter: EmailMessageParameter){
        this.id = id;
        this.name = name;
        this.scheduledDate = new Date();
        this.scheduleStatus = ScheduleStatus.Created;
        this.messageParameter = messageParameter;
        this.publishStatus = MessageStatusEnum.Pending;
        this.publishDate = null;
    }

    getScheduleDate(): Date {
        return this.scheduledDate;
    }
    getPublishDate(): Date | null {
        return this.publishDate;
    }    
    //change all (properties name, scheduledDate, messageParameter)
    update(): void{
        this.scheduleStatus = ScheduleStatus.Updated;
    }
    cancel(): void{
        this.scheduleStatus = ScheduleStatus.Cancelled;
    }
    getScheduleStatus(): string{
        return this.scheduleStatus;
    }
    //for queue
    publish(): void{
        this.publishStatus = MessageStatusEnum.Published;
        this.publishDate = new Date();
    }
    getPublishStatus(): string{
        return this.publishStatus;
    }

}

export enum ScheduleStatus {
    Created = "Created",
    Updated = "Updated",
    Cancelled = "Cancelled"
}