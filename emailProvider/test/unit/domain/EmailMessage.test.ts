import EmailMessage from "../../../emailProvider/src/domain/entities/EmailMessage"
import { MessageStatusEnum } from "../../../emailProvider/src/domain/enums/MessageStatus";
import EmailMessageParameter from "../../../emailProvider/src/domain/valueObjects/EmailMessageParameter"

test("Must publish the message and have the status published", () => {
    const message = new EmailMessage("", EmailMessageParameter.create("","","test@email.com"));
    message.publish();
    expect(message.getStatus()).toBe(MessageStatusEnum.Published);
})