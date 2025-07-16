import MetricsServiceAbstraction from "../../application/abstractions/MetricsServiceAbstraction";
import HttpServer from "../api/HttpServer";
import { Request, Response } from "express";

export default class MetricsFeature {
    
    constructor(readonly httpServer: HttpServer,
        readonly metricsService: MetricsServiceAbstraction
    ){
    }

    config(): void{
        const app = this.httpServer.getInstance();
        app.get("/metrics", async (req: Request, res: Response) => {
            const metrics = await this.metricsService.getMetrics();
            res.setHeader("Content-Type", this.metricsService.getContentType());
            res.status(200).send(metrics);
        });
    }
}