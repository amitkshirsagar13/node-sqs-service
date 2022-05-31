import { BaseMessage } from "../message-models/BaseMessage";
import { baseEventMessageProvider } from "../message-models/modelProviders";

export const demoEventHandler = async (event: any) => {
  let baseEvent: BaseMessage = baseEventMessageProvider();
  Object.assign(baseEvent, JSON.parse(event.Body));
  console.dir(baseEvent);
}