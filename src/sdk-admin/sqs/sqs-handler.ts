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
      data: messageResponse
    };
  } catch(err) {
    return {
      code: 500,
      status: "failure",
      message: "failed message sent to queue"
    };
  }
}

export const listAsyncQueues = async () => {
  try {
    const queueList = await (await sqs.listQueues({}).promise()).QueueUrls;
    return {
      code: 200,
      status: "success",
      data: queueList
    };
  } catch(err) {
    return {
      code: 500,
      status: "failure",
      message: "failed message sent to queue"
    };
  }
}