import * as express from 'express';
import { Router } from 'express';
import AWS from 'aws-sdk';
import env from '../config/env';
import {sqsRoutes} from './sqs/sqs-routes';

AWS.config.update({
    region: env.REGION
});

const routes: express.Router = express.Router();

routes.get('/health', (req, res) => res.status(200).contentType('application/json').json({'status': 'ok'}));
routes.use('/sqs', sqsRoutes);

export const sdkAdminRoutes: Router = routes;