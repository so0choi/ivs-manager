import {
  ChatTokenCapability,
  CreateRoomCommand,
  DeleteRoomCommand,
  CreateChatTokenCommand,
  IvschatClient,
} from "@aws-sdk/client-ivschat";

let ivschatClient: IvschatClient | null = null;

export function getIVSClient() {
  if (
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY
  ) {
    throw new Error("AWS credentials are missing!");
  }

  ivschatClient = new IvschatClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  return ivschatClient;
}

export class IvschatHelper {
  static async createRoom(streamId: string) {
    const params = { name: streamId };
    const crateRoomCommand = new CreateRoomCommand(params);
    return getIVSClient().send(crateRoomCommand);
  }
  static async deleteRoom(arn: string) {
    const params = { identifier: arn };
    const deleteRoomCommand = new DeleteRoomCommand(params);
    return getIVSClient().send(deleteRoomCommand);
  }
  static async createChatToken(
    roomArn: string,
    userId: string,
    attributes: { [key: string]: any },
  ) {
    const params = {
      roomIdentifier: roomArn,
      userId,
      capabilities: [ChatTokenCapability.SEND_MESSAGE],
      attributes,
      // sessionDurationInMinutes: default 1h
    };
    const createChatTokenCommand = new CreateChatTokenCommand(params);
    return getIVSClient().send(createChatTokenCommand);
  }
}
