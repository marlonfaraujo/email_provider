import ExpressAdapter from "./infra/api/ExpressAdapter";
import Router from "./infra/api/Router";
import QueueConsumerManager from "./infra/consumers/QueueConsumerManager";
import CacheConnectionAbstraction from "./infra/database/CacheConnectionAbstraction";
import RedisConnection from "./infra/database/RedisConnection";
import JobManager from "./infra/worker/JobManager";

const cacheConnection: CacheConnectionAbstraction = new RedisConnection();
const jobManager = new JobManager(cacheConnection);
jobManager.config();
const queueConsumerManager = new QueueConsumerManager(cacheConnection);
queueConsumerManager.init();  
const httpServer = new ExpressAdapter();
const router = new Router(httpServer, cacheConnection);
router.init();
httpServer.listen(3500);