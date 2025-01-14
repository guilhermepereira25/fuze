import { Hono } from 'hono';
import * as routes from './${resourceName}.router.ts';

const router = new Hono();

export default router;