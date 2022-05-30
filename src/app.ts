import express from 'express';
import { sdkAdminRoutes } from './sdk-admin/sdk-admin';
import { sqsListener } from './sdk-admin/sqs/sqs-handler';
import messageHandler from './file-event-handler/message-handler';

const app = express();
const port = 5000;
const host = "127.0.0.1";

app.use(express.json()); 
app.use('/admin', sdkAdminRoutes);

app.get('/', function (req, res) {
   const body = req.body;
   res.send('Hello!!!');
});

sqsListener('demo', messageHandler);

const server = app.listen(port, host, () => {
   console.log("SQS app listening at http://%s:%s", host, port)
})