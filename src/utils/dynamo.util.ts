import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

let dynamoClient: DynamoDBDocumentClient | null = null;

export function getDynamoClient() {
  if (
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY
  ) {
    throw new Error("AWS credentials are missing!");
  }
  if (!dynamoClient) {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    dynamoClient = DynamoDBDocumentClient.from(client);
  }
  return dynamoClient;
}

export class DynamoDBHelper {
  static async put(Item: { PK: string; SK: string; [key: string]: any }) {
    const params = {
      TableName: process.env.DYNAMODB_STREAM_TABLE,
      Item,
    };
    return getDynamoClient().send(new PutCommand(params));
  }
  static async get(PK: string, SK: string) {
    const params = {
      TableName: process.env.DYNAMODB_STREAM_TABLE,
      Key: {
        PK,
        SK,
      },
    };
    return getDynamoClient().send(new GetCommand(params));
  }
}
