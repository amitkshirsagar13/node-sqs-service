import * as express from 'express';
import { createQueue, listQueues, publish } from './sqs-handler';
import { Router } from 'express';

const routes = express.Router();
routes.get('/create/:queueName', createQueue());
routes.get('/list', listQueues());
routes.post('/publish/:queueName', publish());

export const sqsRoutes: Router = routes;
