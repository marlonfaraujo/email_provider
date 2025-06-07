import EmailMessage from "../../../src/domain/entities/EmailMessage"
import { MessageStatusEnum } from "../../../src/domain/enums/MessageStatus";
import EmailMessageParameter from "../../../src/domain/valueObjects/EmailMessageParameter"

test("Must publish the message and have the status published", () => {
    const message = new EmailMessage("", EmailMessageParameter.create("","","test@email.com"));
    message.publish();
    expect(message.getStatus()).toBe(MessageStatusEnum.Published);
})