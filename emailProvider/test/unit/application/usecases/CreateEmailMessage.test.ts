import CreateEmailMessage from "../../../../src/application/usecases/emailMessage/CreateEmailMessage";
import ListEmailMessage from "../../../../src/application/usecases/emailMessage/ListEmailMessage";
import EmailMessageMemoryRepository from "../../../../src/infra/repositories/EmailMessageMemoryRepository";
import { CryptoUuidGenerator } from "../../../../src/infra/uuid/CryptoUuidGenerator";

test("Must create the message record and return the result by searching by field of the recipient object", async () => {
    const repository = new EmailMessageMemoryRepository();
    const crypto = new CryptoUuidGenerator();
    const createMessage = new CreateEmailMessage(repository, crypto);

    const dto : any = {
        body: "html",
        subject: "subject",
        from: "test@email.com",
        to: ["test2@email.com","test3@email.com"],
        cc: ["test2@email.com"],
        cco: ["test2@email.com"]
    };
    await createMessage.execute(dto);

    const messages = await new ListEmailMessage(repository).execute();
    expect(messages).toBeDefined();
    expect(messages.find(x => x.recipients)).toBeDefined();
    expect(messages.find(x => x.recipients.some((email: string) => dto.to.includes(email)))?.id).toBeDefined();
});