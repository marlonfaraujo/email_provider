import { EmailSchedule, ScheduleStatus } from "../../../src/domain/entities/EmailSchedule";
import EmailMessageParameter from "../../../src/domain/valueObjects/EmailMessageParameter"

test("Must update date and update status", () => {
    const schedule = new EmailSchedule("", "name", EmailMessageParameter.create("","","test@email.com", []));
    schedule.name = "Updated name";
    const now = new Date();
    schedule.scheduledDate = now;
    schedule.update();
    expect(schedule.scheduledDate).toBe(now);
    expect(schedule.getScheduleStatus()).toBe(ScheduleStatus.Updated);
})