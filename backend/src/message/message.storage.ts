import {
  BatchGetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { safeParseFloat } from "../_shared/util/string";
import { dateToISOString } from "../_shared/util/date";
import { logger } from "../_shared/util/logger";
import { ddbDocClient } from "../_shared/client/ddbClient";
import { compareDesc, format } from "date-fns";
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
  PostedYearMonth: string;
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
    Timestamp: message.timestamp,
    PostUserName: message.postUserName,
    PostUserImageUrl: message.postUserImageUrl,
    PostedYearMonth: format(message.postedDate, "yyyy-MM"),
    ChannelId: message.channelId,
    ChannelName: message.channelName,
    Message: message.message,
    BlownDate: dateToISOString(message.blownDate),
    BlowUserName: message.blowUserName,
    BlowUserId: message.blowUserId,
  };
};

export const toDomainMessage = (message: DynamoMessageItem): Message => {
  return {
    postUserId: message.PostUserId,
    timestamp: message.Timestamp,
    postUserName: message.PostUserName,
    postUserImageUrl: message.PostUserImageUrl,
    channelId: message.ChannelId,
    channelName: message.ChannelName,
    postedDate: new Date(message.Timestamp),
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
 * 年月を指定して全メッセージ取得
 */
export const getMessagesByYearMonth = async (yearMonth: string) => {
  let exclusiveStartKey: Record<string, any> | undefined = undefined;
  const messages: Message[] = [];

  while (true) {
    const queryResult: QueryCommandOutput = await ddbDocClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "YearMonthIndex",
        KeyConditionExpression: "PostedYearMonth = :postedYearMonth",
        ExpressionAttributeValues: {
          ":postedYearMonth": yearMonth,
        },
        ExclusiveStartKey: exclusiveStartKey,
      })
    );
    logger.debug("DynamoDBから取得しました", {
      exclusiveStartKey,
      queryResult,
    });
    if (queryResult.Items === undefined) {
      throw new Error("取得できませんでした");
    }

    const fetchedMessages = queryResult.Items.map((item) =>
      toDomainMessage(item as DynamoMessageItem)
    );
    messages.push(...fetchedMessages);

    if (queryResult.LastEvaluatedKey === undefined) {
      break;
    }

    exclusiveStartKey = queryResult.LastEvaluatedKey;
  }

  // NOTE: GSIでindex登録されてるため、並べ替える必要なし

  return {
    messages,
  };
};

export const getMessagesByIdList = async (
  messageIdList: MessageCompositeKey[]
) => {
  const keyList = messageIdList.map((messageId) => {
    const { postUserId, timestamp } = decodeFromCompositeKey(messageId);
    return {
      PostUserId: postUserId,
      Timestamp: timestamp,
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
