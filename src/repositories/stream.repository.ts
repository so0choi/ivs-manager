import { DynamoDBHelper } from "../helpers/dynamo.helper";
import { LIVE_STATUS, STREAM_SK } from "../constants/dynamodb";

export class StreamRepository {
  static async saveStream({
    streamId,
    chatRoomArn,
    chatRoomId,
    channelArn,
  }: {
    streamId: string;
    channelArn: string;
    chatRoomId: string;
    chatRoomArn: string;
  }) {
    const PK = `stream_${streamId}`;
    const createdAt = new Date().toISOString();

    await DynamoDBHelper.put({
      PK,
      SK: STREAM_SK.METADATA,
      channelArn,
      status: LIVE_STATUS.LIVE,
      chatRoomId,
    });

    await DynamoDBHelper.put({
      PK,
      SK: STREAM_SK.CHAT_ROOM,
      chatRoomArn,
      createdAt,
    });
  }

  static async getStream(streamId: string) {
    return (await DynamoDBHelper.get(`stream_${streamId}`, STREAM_SK.METADATA))
      .Item;
  }

  static async getChatRoom(streamId: string) {
    return (await DynamoDBHelper.get(`stream_${streamId}`, STREAM_SK.CHAT_ROOM))
      .Item;
  }
}
