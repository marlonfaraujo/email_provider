import { SendEmailDto } from "../dtos/SendEmailDto";
import { SendEmailResultDto } from "../dtos/SendEmailResultDto";

export default interface EmailProviderAbstraction {
    sendEmail(input: SendEmailDto): Promise<SendEmailResultDto>;
}