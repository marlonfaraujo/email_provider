import IdGeneratorAbstraction from "../../application/abstractions/IdGeneratorAbstraction";
import CreateEmailSchedule from "../../application/usecases/schedule/CreateEmailSchedule";
import ListEmailSchedule from "../../application/usecases/schedule/ListEmailSchedule";
import EmailScheduleRepository from "../../domain/repositories/EmailScheduleRepository";
import HttpServer from "../HttpServer";

export default class EmailScheduleFeature {
    
    constructor (readonly httpServer: HttpServer, 
        readonly repository: EmailScheduleRepository,
        readonly idGenerator: IdGeneratorAbstraction) {
    }

    async init () {
        this.httpServer.on("post", "/schedules", async (params: any, body: any) => {
            const createSchedule = new CreateEmailSchedule(this.repository, this.idGenerator);
            await createSchedule.execute(body);
        });
        
        this.httpServer.on("get", "/schedules", async (params: any, body: any) => {
            const getSchedules = new ListEmailSchedule(this.repository);
            const schedules = await getSchedules.execute();
            return schedules;
        });
    }
}