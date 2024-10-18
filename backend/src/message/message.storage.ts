import {
  BatchGetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { safeParseFloat } from "../_shared/util/string";
import { dateToISOString } from "../_shared/util/date";
import { logger } from "../_shared/util/logger";
import { ddbDocClient } from "../_shared/storage/ddbClient";
import { compareDesc } from "date-fns";
import {
  decodeFromCompositeKey,
  Message,
  MessageCompositeKey,
} from "./message.entity";

const TABLE_NAME = "SlackPunchMessage";

interface DynamoMessageItem {
  // HashKey
  PostUserId: string;
  // RangeKey
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

export const toDomainMessage = (message: DynamoMessageItem): Message => {
  return {
    postUserId: message.PostUserId,
    timestamp: message.Timestamp.toString(),
    postUserName: message.PostUserName,
    postUserImageUrl: message.PostUserImageUrl,
    channelId: message.ChannelId,
    channelName: message.ChannelName,
    postedDate: new Date(message.PostedDate),
    message: message.Message,
    blownDate: new Date(message.BlownDate),
    blowUserName: message.BlowUserName,
    blowUserId: message.BlowUserId,
  };
};

export const saveMessageToStorage = async (message: Message) => {
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
export const getAllMessages = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const result = await ddbDocClient.send(new ScanCommand(params));
  if (result.Items === undefined) {
    throw new Error("取得できませんでした");
  }
  return result.Items?.map((item) =>
    toDomainMessage(item as DynamoMessageItem)
  ).toSorted((a, b) => {
    return compareDesc(a.postedDate, b.postedDate);
  });
};

export const getMessagesByIdList = async (
  messageIdList: MessageCompositeKey[]
) => {
  const keyList = messageIdList.map((messageId) => {
    const { postUserId, timestamp } = decodeFromCompositeKey(messageId);
    return {
      PostUserId: postUserId,
      Timestamp: safeParseFloat(timestamp),
    };
  });
  const result = await ddbDocClient.send(
    new BatchGetCommand({
      RequestItems: {
        [TABLE_NAME]: {
          Keys: keyList,
        },
      },
    })
  );
  if (result.Responses === undefined) {
    throw new Error();
  }
  // 並び替えはしない
  // FIXME: 取得できなかった要素が`UnprocessedKeys`に入るので、それを元によしなに扱う
  return result.Responses[TABLE_NAME].map((item) =>
    toDomainMessage(item as DynamoMessageItem)
  );
};
