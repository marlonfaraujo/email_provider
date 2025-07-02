import ExpressAdapter from "./api/ExpressAdapter";
import Router from "./api/Router";

const httpServer = new ExpressAdapter();
const router = new Router(httpServer);
router.init();
httpServer.listen(3501);  