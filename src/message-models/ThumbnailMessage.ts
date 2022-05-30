import { BaseMessage } from "./BaseMessage";

export interface ThumbnailMessage extends BaseMessage {
    sourceFileName: string,
    sourceFileDownloadTicket: string,
    thumbnailFileUploadTicket: string,
    thumbnailOptions: {
        height: number,
        jpegOptions: {
            force: boolean,
            quality: number
        },
        percentage: number,
        responseType: string
        width: number,
    }
}