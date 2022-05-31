import { ThumbnailMessage } from "../message-models/ThumbnailMessage";
import { thumbnailEventMessageProvider } from "../message-models/modelProviders";

export const thumbnailEventHandler = async (event: any) => {
  let thumbnailEvent: ThumbnailMessage = thumbnailEventMessageProvider();
  Object.assign(thumbnailEvent, JSON.parse(event.Body));
  console.dir(thumbnailEvent);
}
