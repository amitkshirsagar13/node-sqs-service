import { BaseMessage } from "./BaseMessage";
import { ThumbnailMessage } from "./ThumbnailMessage";

export const baseEventMessageProvider = (): BaseMessage => {
  return {
    "token": "",
    "correlationId": "",
    "targetQueueName": ""
  }
}

export const thumbnailEventMessageProvider = ():ThumbnailMessage => {
  return {
    "token":"",
    "correlationId":"",
    "targetQueueName":"thumbnail",
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