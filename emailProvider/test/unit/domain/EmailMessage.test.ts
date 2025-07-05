import EmailMessage from "../../../src/domain/entities/EmailMessage"
import EmailMessageParameter from "../../../src/domain/valueObjects/EmailMessageParameter"

test("Must publish the message and have the status published", () => {
    const from: string = "test@email.com";
    const message = new EmailMessage("", EmailMessageParameter.create("", "", from));
    expect(from).toBe(message.messageParameter.from.getValue());
})