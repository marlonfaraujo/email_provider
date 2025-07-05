import { EmailSchedule, ScheduleStatus } from "../../../src/domain/entities/EmailSchedule";
import EmailMessageParameter from "../../../src/domain/valueObjects/EmailMessageParameter"

test("Must update date and update status", () => {
    const now = new Date();
    const schedule = new EmailSchedule("", "name", now, EmailMessageParameter.create("","","test@email.com", []));
    schedule.name = "Updated name";
    schedule.update();
    expect(schedule.getScheduleDate()).toBe(now);
    expect(schedule.getScheduleStatus()).toBe(ScheduleStatus.Updated);
})