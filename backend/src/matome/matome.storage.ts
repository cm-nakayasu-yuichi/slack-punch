import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Matome } from "./matome.service";
import { dateToISOString } from "../_shared/util/date";
import { logger } from "../_shared/util/logger";
import { ddbDocClient } from "../_shared/storage/ddbClient";
import { compareDesc } from "date-fns";
import { MessageCompositeKey } from "../message/message.entity";

const TABLE_NAME = "SlackPunchMatome";

interface DynamoMatomeItem {
  Id: string;
  Title: string;
  Description: string;
  CreatedUserId: string;
  // 100件まで
  MessageIdList: MessageCompositeKey[];
  CreatedDate: string;
}

export const toStorageMatome = (matome: Matome): DynamoMatomeItem => {
  return {
    Id: matome.id,
    Title: matome.title,
    Description: matome.description,
    CreatedUserId: matome.createdUserId,
    MessageIdList: matome.messageIdList,
    CreatedDate: dateToISOString(matome.createdDate),
  };
};

export const toDomainMatome = (message: DynamoMatomeItem): Matome => {
  return {
    id: message.Id,
    title: message.Title,
    description: message.Description,
    createdUserId: message.CreatedUserId,
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
