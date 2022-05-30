import {Request, Response} from 'express';
import AWS from 'aws-sdk';
import env from '../../config/env';
import { Consumer } from 'sqs-consumer';

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
  sqs.listQueues({}, (err, data) => {
    console.log('Listing Queues!!!');
    if (err) {
      res.status(500).json({
        status: "internal server error",
        error: err
      });
    } else {
      res.status(200).json({
        status: "OK",
        urls: data.QueueUrls
      });
    }
  });
}

export const publish = () => (req: Request, res: Response, _next: any) => {
    const queueName = req.params.queueName;
    const message = req.body;
    console.log(message);
    let msgParams = {
        QueueUrl:
        env.SERVICE_ENDPOINT + "/" + env.ACCOUNT_ID + "/" + queueName,
        MessageBody: JSON.stringify(message)
    };
    sqs.sendMessage(msgParams, (err, data) => {
        if (err) {
            res.status(500).json({
                status: "internal server error",
                error: err
            });
        } else {
            res.status(202).json({
                status: "accepted",
                messageId: data.MessageId,
                message: "sent to queue"
            });
        }
    });
}

const createSimpleQueue = (QueueName: string): any => {
  const queuParams = {...params, QueueName}
  sqs.createQueue(queuParams, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      return undefined;
    } else {
      return data;
    }
  });
}

export const sqsListener = (queueName: string, worker: any) => {
  const consumer = Consumer.create({
    queueUrl: env.SERVICE_ENDPOINT + "/" + env.ACCOUNT_ID + "/" + queueName,
    handleMessage: worker,
    sqs
  });
  consumer.on('error', (err) => {
    console.error(err.message);
  });

  consumer.on('processing_error', (err) => {
    console.error(err.message);
  });

  consumer.start();
}
