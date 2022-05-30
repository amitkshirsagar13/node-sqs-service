export interface BaseMessage {
    token: string;
    correlationId: string;
    targetQueueName: string
}