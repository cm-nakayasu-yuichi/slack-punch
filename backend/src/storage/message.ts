import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Message } from "../service";
import { safeParseFloat } from "../util/string";
import { dateToISOString } from "../util/date";
import { logger } from "../util/logger";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = "SlackPunchMessage";

interface DynamoMessageItem {
  PostUserId: string;
  Timestamp: number;
  PostUserName: string;
  PostUserImageUrl: string | null;
  ChannelId: string;
  ChannelName: string;
  PostedDate: string;
  Message: string;
  BlownDate: string;
  BlowUserName: string;
  BlowUserId: string;
}

export const messageToDynamoMessageItem = (
  message: Message
): DynamoMessageItem => {
  return {
    PostUserId: message.postUserId,
    Timestamp: safeParseFloat(message.timestamp),
    PostUserName: message.postUserName,
    PostUserImageUrl: message.postUserImageUrl,
    ChannelId: message.channelId,
    ChannelName: message.channelName,
    PostedDate: dateToISOString(message.postedDate),
    Message: message.message,
    BlownDate: dateToISOString(message.blownDate),
    BlowUserName: message.blowUserName,
    BlowUserId: message.blowUserId,
  };
};

export const putMessageToStorage = async (message: Message) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Item: messageToDynamoMessageItem(message),
    };
    await ddbDocClient.send(new PutCommand(params));
  } catch (error) {
    logger.error("DynamoDBへのPutItemでエラーが発生しました", { error });
    throw error;
  }
};

/**
 * 全件取得
 * FIXME: 1MBを超えると全件取得できないので修正する
 * FIXME: 返却する方がanyのままなのでzodなど使って修正する
 */
export const getAllMessageFromStorage = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const result = await ddbDocClient.send(new ScanCommand(params));
  return result.Items;
};
