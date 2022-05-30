import {Request, response, Response} from 'express';
import AWS from 'aws-sdk';
import env from '../../config/env';
import { Consumer } from 'sqs-consumer';
import { BaseMessage } from '../../message-models/BaseMessage';

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

export const publish = () => async (req: Request, res: Response, _next: any) => {
  const queueName = req.params.queueName;
  const message = {...req.body, targetQueueName: queueName};
  publishMessage(message).then((response: any) => {
    res.status(response.code).json(response);
  });
}

export const publishMessage = async (message: BaseMessage) => {
  let msgParams = {
    QueueUrl:
    env.SERVICE_ENDPOINT + "/" + env.ACCOUNT_ID + "/" + message.targetQueueName,
    MessageBody: JSON.stringify(message)
  };
  try {
    const messageResponse = await sqs.sendMessage(msgParams).promise();
    return {
      code: 202,
      status: "accepted",
      message: "sent to queue",
      MessageId: messageResponse.MessageId,
      SequenceNumber: messageResponse.SequenceNumber
    };
  } catch(err) {
    return {
      code: 501,
      status: "failure",
      message: "failed message sent to queue"
    };
  }
}

export const createSimpleQueue = (QueueName: string): any => {
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
