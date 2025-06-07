import { EmailSchedule } from "../entities/EmailSchedule";

export default interface EmailScheduleRepository {
	save (schedule: EmailSchedule): Promise<void>;
	getById (id: string): Promise<EmailSchedule | undefined>;
	update (schedule: EmailSchedule, id: string): Promise<void>;
	get (): Promise<EmailSchedule[]>;
}