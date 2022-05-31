import {Request, Response} from 'express';
import AWS from 'aws-sdk';
import env from '../../config/env';
import { createSimpleQueue, listAsyncQueues, publishMessage } from './sqs-handler';

const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  endpoint: env.SERVICE_ENDPOINT,
  accessKeyId: env.IAM.ACCESS_KEY_ID,
  secretAccessKey: env.IAM.SECRET_ACCESS_KEY,
  region: env.REGION
});

const params = {
  QueueName: 'STRING_VALUE',
    Attributes: {
    // Enabled short polling
    'ReceiveMessageWaitTimeSeconds': '5'
  },
  tags: {
    'env': 'local'
  }
};

export const createQueue = () => (req: Request, res: Response, next:any) => {
  try {
    const queueName = req.params?.queueName;
    const data = createSimpleQueue(queueName);
    res.status(200).json({
            status: "OK",
            data
          });
    console.log('Creating %s Resource!!!', queueName)
  } catch (error) {
    console.error('Handle create sdk resource failed!!!', error);
  } finally {
    next();
  }
}

export const listQueues = () => async (_req: Request, res: Response, next: any) => {
  try {
    const listResponse = await listAsyncQueues();
    res.status(listResponse.code).json(listResponse);
  } catch (error) {
    console.error('Handle list sdk resource failed!!!', error);
  } finally {
    next();
  }
}

export const publish = () => async (req: Request, res: Response, next: any) => {
  const queueName = req.params.queueName;
  const message = { ...req.body, targetQueueName: queueName };
  try {
    const publishResponse = await publishMessage(message);
    res.status(publishResponse.code).json(publishResponse);
  } catch (error) {
    console.error('Handle publish sdk resource failed!!!', error);
  } finally {
    next();
  }
}
