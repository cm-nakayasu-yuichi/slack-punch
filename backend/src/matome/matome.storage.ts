import {
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandOutput,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Matome } from "./matome.service";
import { dateToISOString } from "../_shared/util/date";
import { logger } from "../_shared/util/logger";
import { ddbDocClient } from "../_shared/client/ddbClient";
import { compareDesc, format } from "date-fns";
import { MessageCompositeKey } from "../message/message.entity";

const TABLE_NAME = "SlackPunchMatome";

interface DynamoMatomeItem {
  Id: string;
  Title: string;
  Description: string;
  CreatedUser: {
    id: string;
    profile: {
      name: string;
      image: string | null;
    };
  };
  // 100件まで
  MessageIdList: MessageCompositeKey[];
  CreatedDate: string;
  CreatedYearMonth: string;
}

export const toStorageMatome = (matome: Matome): DynamoMatomeItem => {
  return {
    Id: matome.id,
    Title: matome.title,
    Description: matome.description,
    CreatedUser: matome.createdUser,
    MessageIdList: matome.messageIdList,
    CreatedDate: dateToISOString(matome.createdDate),
    CreatedYearMonth: format(matome.createdDate, "yyyy-MM"),
  };
};

export const toDomainMatome = (message: DynamoMatomeItem): Matome => {
  return {
    id: message.Id,
    title: message.Title,
    description: message.Description,
    createdUser: message.CreatedUser,
    messageIdList: message.MessageIdList,
    createdDate: new Date(message.CreatedDate),
  };
};

export const putMatomeToStorage = async (matome: Matome) => {
  const params = {
    TableName: TABLE_NAME,
    Item: toStorageMatome(matome),
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
  } catch (error) {
    logger.error("DynamoDBへのPutItemでエラーが発生しました", {
      error,
      table: TABLE_NAME,
    });
    throw error;
  }
};

export const getAllMatomes = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const result = await ddbDocClient.send(new ScanCommand(params));
  if (result.Items === undefined) {
    throw new Error("取得できませんでした");
  }
  return result.Items?.map((item) =>
    toDomainMatome(item as DynamoMatomeItem)
  ).toSorted((a, b) => {
    return compareDesc(a.createdDate, b.createdDate);
  });
};

/**
 * 年月を指定して全メッセージ取得
 */
export const getMatomesByYearMonth = async (yearMonth: string) => {
  let exclusiveStartKey: Record<string, any> | undefined = undefined;
  const matomes: Matome[] = [];

  while (true) {
    const queryResult: QueryCommandOutput = await ddbDocClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "YearMonthIndex",
        KeyConditionExpression: "CreatedYearMonth = :createdYearMonth",
        ExpressionAttributeValues: {
          ":createdYearMonth": yearMonth,
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
      toDomainMatome(item as DynamoMatomeItem)
    );
    matomes.push(...fetchedMessages);

    if (queryResult.LastEvaluatedKey === undefined) {
      break;
    }

    exclusiveStartKey = queryResult.LastEvaluatedKey;
  }

  // NOTE: GSIでindex登録されてるため、並べ替える必要なし

  return {
    matomes,
  };
};

export const getMatomeById = async (matomeId: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      Id: matomeId,
    },
  };

  const result = await ddbDocClient.send(new GetCommand(params));
  if (result.Item === undefined) {
    throw new Error("取得できませんでした");
  }

  return toDomainMatome(result.Item as DynamoMatomeItem);
};
