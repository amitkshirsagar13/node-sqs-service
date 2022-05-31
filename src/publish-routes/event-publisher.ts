import { Router } from 'express';
import { publish } from '../sdk-admin/sqs/sqs-route-handler';

const routes = Router();
routes.post('/publish/:queueName', publish());

export const sqsRoutes: Router = routes;
