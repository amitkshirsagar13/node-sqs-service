import express from 'express';
import { sdkAdminRoutes } from './sdk-admin/sdk-admin';
import { demoEventHandler } from './event-handlers/demo-event-handler';
import { thumbnailEventHandler } from './event-handlers/thumbnail-event-handler';
import { createSimpleQueue, sqsListener } from './sdk-admin/sqs/sqs-handler';

const app = express();
const port = 5000;
const host = "127.0.0.1";

app.use(express.json()); 
app.use('/admin', sdkAdminRoutes);

app.get('/', function (req, res) {
   res.send('Hello!!!');
});

const createDefaultQueues = (queueNameList: string[]) => {
   queueNameList.forEach((queueName) => createSimpleQueue(queueName));
}

createDefaultQueues(['demo', 'thumbnail']);

sqsListener('demo', demoEventHandler);
sqsListener('thumbnail', thumbnailEventHandler);

const server = app.listen(port, host, () => {
   console.log("SQS app listening at http://%s:%s", host, port)
});