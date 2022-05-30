import { BaseMessage } from "../message-models/BaseMessage";
import { ThumbnailMessage } from "../message-models/ThumbnailMessage";

export const demoEventHandler = async (event: any) => {
  let baseEvent: BaseMessage = thumbnailEventMessageProvider();
  Object.assign(baseEvent, JSON.parse(event.Body));
  console.dir(baseEvent);
}

export const thumbnailEventHandler = async (event: any) => {
  let thumbnailEvent: ThumbnailMessage = thumbnailEventMessageProvider();
  Object.assign(thumbnailEvent, JSON.parse(event.Body));
  console.dir(thumbnailEvent);
}

const baseEventMessageProvider = (): BaseMessage => {
  return {
    "token": "",
    "correlationId": "",
    "targetQueueName": ""
  }
}

const thumbnailEventMessageProvider = ():ThumbnailMessage => {
  return {
    "token":"",
    "correlationId":"",
    "targetQueueName":"",
    "sourceFileName": "",
    "sourceFileDownloadTicket": "",
    "thumbnailFileUploadTicket": "",
    "thumbnailOptions": {
      "height": 256,
      "width": 256,
      "percentage": 25,
      "jpegOptions": {
        "force": true,
        "quality": 90
      },
      "responseType": "base64"
    }
  };
}