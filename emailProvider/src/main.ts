import ExpressAdapter from "./infra/api/ExpressAdapter";
import Router from "./infra/api/Router";
import QueueConsumerManager from "./infra/consumers/QueueConsumerManager";
import CacheConnectionAbstraction from "./infra/database/CacheConnectionAbstraction";
import RedisConnection from "./infra/database/RedisConnection";
import PrometheusMetricsService from "./infra/observability/PrometheusMetricsService";
import JobManager from "./infra/worker/JobManager";

const cacheConnection: CacheConnectionAbstraction = new RedisConnection();
const jobManager = new JobManager(cacheConnection);
jobManager.config();
const queueConsumerManager = new QueueConsumerManager(cacheConnection);
queueConsumerManager.init();
const metricsService = new PrometheusMetricsService();
metricsService.createMetric('counter', {
    name: 'http_requests_total',
    help: 'Count of Requests HTTP',
    labelNames: ['method', 'route', 'status_code']
});
metricsService.createMetric('histogram', {
    name: 'http_response_time_seconds',
    help: 'Time to response HTTP',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});  
const httpServer = new ExpressAdapter(metricsService);
const router = new Router(httpServer, cacheConnection, metricsService);
router.init();
httpServer.listen(3500);