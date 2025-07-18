import { Request, Response, NextFunction } from 'express';
import MetricsServiceAbstraction from "../../../application/abstractions/MetricsServiceAbstraction";

export default class MetricsMiddleware {

    constructor(readonly metricsService: MetricsServiceAbstraction){
        this.handler = this.handler.bind(this);
    }

    handler(req: Request, res: Response, next: NextFunction) {
        const start = process.hrtime();
        res.on("finish", () => {
            const duration = process.hrtime(start);
            const durationInSeconds = duration[0] + duration[1] / 1e9;

            this.metricsService.inc('http_requests_total', {
                method: req.method,
                route: req.route?.path || req.path,
                status_code: String(res.statusCode),
            });

            this.metricsService.observe('http_response_time_seconds', durationInSeconds, {
                method: req.method,
                route: req.route?.path || req.path,
                status_code: String(res.statusCode),
            });
        });
        next();
    }
}