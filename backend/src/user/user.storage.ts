import { PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../_shared/storage/ddbClient";
import { User } from "./user.service";

const TABLE_NAME = "SlackPunchUser";

interface StorageUser {
  UserId: string;
  SlackUserId: string;
  UserImage: string | null;
  DisplayUserName: string;
}

export const toStorageUser = (user: User): StorageUser => {
  return {
    UserId: user.userId,
    SlackUserId: user.slackUserId,
    UserImage: user.userImage,
    DisplayUserName: user.displayUserName,
  };
};

export const putUserToStorage = async (user: User) => {
  const params = {
    TableName: TABLE_NAME,
    Item: toStorageUser(user),
  };
  await ddbDocClient.send(new PutCommand(params));
};

export const findUserBySlackUserId = async (
  slackUserId: string
): Promise<User | null> => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "SlackUserIdIndex",
    KeyConditionExpression: "SlackUserId = :slackUserId",
    ExpressionAttributeValues: {
      ":slackUserId": slackUserId,
    },
  });
  const { Items } = await ddbDocClient.send(command);
  if (!Items || Items.length === 0) {
    return null;
  }
  if (Items.length > 1) {
    throw new Error("同じユーザーIDが2ユーザー以上存在しています", {
      cause: {
        Items,
      },
    });
  }

  return {
    userId: Items[0].UserId,
    slackUserId: Items[0].SlackUserId,
    userImage: Items[0].UserImage,
    displayUserName: Items[0].DisplayUserName,
  };
};

export const findUserByUserId = async (
  userId: string
): Promise<User | null> => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      UserId: userId,
    },
  });
  const { Item } = await ddbDocClient.send(command);
  if (!Item) {
    return null;
  }

  return {
    userId: Item.UserId,
    slackUserId: Item.SlackUserId,
    userImage: Item.UserImage,
    displayUserName: Item.DisplayUserName,
  };
};
