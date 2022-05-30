import {Request, Response} from 'express';
import AWS from 'aws-sdk';
import env from '../../config/env';
import { createSimpleQueue, publishMessage } from './sqs-handler';

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

export const listQueues = () => (_req: Request, res: Response, _next:any) => {
  const queueList = listQueues();
  res.send(200).json(queueList);
}

export const publish = () => async (req: Request, res: Response, _next: any) => {
  const queueName = req.params.queueName;
  const message = {...req.body, targetQueueName: queueName};
  publishMessage(message).then((response: any) => {
    res.status(response.code).json(response);
  });
}
