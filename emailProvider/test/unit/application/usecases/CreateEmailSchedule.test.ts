import { EmailMessageDto } from "../../../../src/application/dtos/EmailMessageDto";
import CreateEmailSchedule from "../../../../src/application/usecases/schedule/CreateEmailSchedule";
import ListEmailSchedule from "../../../../src/application/usecases/schedule/ListEmailSchedule";
import EmailScheduleMemoryRepository from "../../../../src/infra/repositories/EmailScheduleMemoryRepository";
import { CryptoUuidGenerator } from "../../../../src/infra/uuid/CryptoUuidGenerator";
import BullMQJobQueue from "../../../../src/infra/queue/BullMQJobQueue";
import RedisConnection  from "../../../../src/infra/database/RedisConnection";

test("Must create schedule record and return non-null id", async() => {
    const repository = new EmailScheduleMemoryRepository();
    const crypto = new CryptoUuidGenerator();
    const mockAdd = jest.fn();
    const mockQueue = { addJob: mockAdd } as unknown as BullMQJobQueue<EmailMessageDto>;
    const mockCache = { connection: mockAdd } as unknown as RedisConnection;
    const createSchedule = new CreateEmailSchedule(repository, crypto, mockQueue);
    const dto : any = {
        name: "name",
        body: "html",
        subject: "subject",
        from: "test@email.com",
        to: ["test2@emai.com"]
    };

    await createSchedule.execute(dto);
    const schedules = await new ListEmailSchedule(repository).execute();
    expect(schedules).toBeDefined();
    expect(schedules.find(x => x.name === dto.name)?.id).toBeDefined();

});