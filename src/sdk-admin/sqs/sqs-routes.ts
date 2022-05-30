import { createQueue, listQueues, publish } from './sqs-route-handler';
import { Router } from 'express';

const routes = Router();
routes.get('/create/:queueName', createQueue());
routes.get('/list', listQueues());
routes.post('/publish/:queueName', publish());

export const sqsRoutes: Router = routes;
