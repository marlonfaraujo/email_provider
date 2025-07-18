import { HttpServer } from "../http/HttpServer";
import InstrumentationObervabilityAbstraction from "../observability/InstrumentationObervabilityAbstraction";

export default class TracerController {
    
    static async config (httpServer: HttpServer, observability: InstrumentationObervabilityAbstraction) {
        const tracer = await observability.tracer("custom-tracer");
        httpServer.route("get", "/test", async (params: any, body: any) => {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
            return {};
        });

        httpServer.route("get", "/custom-tracer", async (params: any, body: any) => {
            const span = tracer.startSpan("custom-operation");
            try {
                await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
                span.setAttribute("custom.attribute", "value");
                console.log((observability as any).tracerProvider?.());
                return {};
            } finally {
                span.end()
            }
        });
    }
}