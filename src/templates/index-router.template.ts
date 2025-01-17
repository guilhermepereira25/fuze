import { Hono } from "hono";
import * as routes from "./${resourceName}.router.ts";
import * as handlers from "./${resourceName}.handler.ts"

const router = new Hono()
    .router(routes.findOne, handlers.findOne);

export default router;