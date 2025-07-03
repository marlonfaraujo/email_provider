import EmailProviderAbstraction from "../../application/abstractions/EmailProviderAbstraction";
import JobWorkerAbstraction from "../../application/abstractions/JobWorkerAbstraction";
import EmailSendGrid from "../providers/EmailSendGrid";

export default class EmailJob {

    constructor(readonly worker: JobWorkerAbstraction,
        readonly emailProvider: EmailProviderAbstraction
    ){
    }

    async config(): Promise<void> {
        const emailProvider: EmailProviderAbstraction = new EmailSendGrid();
		await this.worker.start(async(payload: any) => {
			await emailProvider.sendEmail(payload);
		});
    }
}