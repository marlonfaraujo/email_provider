import express, { Application, Request, Response } from "express";
import HttpServer from "./HttpServer";
import MetricsMiddleware from "./middlewares/MetricsMiddleware";
import MetricsServiceAbstraction from "../../application/abstractions/MetricsServiceAbstraction";

export default class ExpressAdapter implements HttpServer {
	app: any;

	constructor (readonly metricsService: MetricsServiceAbstraction) {
		this.app = express();
		this.app.use(express.json());
		this.metricsMiddlewareConfig(metricsService);
	}

	private metricsMiddlewareConfig(metricsService: MetricsServiceAbstraction): void {
		const metricsMiddleware = new MetricsMiddleware(metricsService);
		this.app.use(metricsMiddleware.handler.bind(metricsMiddleware));
	}

	route(method: string, url: string, callback: Function): void {
		this.app[method](url, async function (req: Request, res: Response) {
			const output = await callback(req.params, req.body);
			res.json(output);
		});
	}

	listen(port: number): void {
		this.app.listen(port);
	}
	
	getInstance(): Application {
		return this.app;
	}
}