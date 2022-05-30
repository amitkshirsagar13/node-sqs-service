import { BaseMessage } from "../message-models/BaseMessage";
import { ThumbnailMessage } from "../message-models/ThumbnailMessage";
import { baseEventMessageProvider, thumbnailEventMessageProvider } from "../message-models/modelProviders";

export const demoEventHandler = async (event: any) => {
  let baseEvent: BaseMessage = baseEventMessageProvider();
  Object.assign(baseEvent, JSON.parse(event.Body));
  console.dir(baseEvent);
}

export const thumbnailEventHandler = async (event: any) => {
  let thumbnailEvent: ThumbnailMessage = thumbnailEventMessageProvider();
  Object.assign(thumbnailEvent, JSON.parse(event.Body));
  console.dir(thumbnailEvent);
}
