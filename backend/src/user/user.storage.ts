import { PutCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../_shared/storage/ddbClient";
import { User } from "./user.service";
import { dateToISOString } from "../_shared/util/date";

const TABLE_NAME = "SlackPunchUser";

interface StorageUser {
  SlackUserId: string;
  UserImage: string | null;
  DisplayUserName: string;
  RegisteredDate: string;
}

export const toStorageUser = (user: User): StorageUser => {
  return {
    SlackUserId: user.slackUserId,
    UserImage: user.userImage,
    DisplayUserName: user.displayUserName,
    RegisteredDate: dateToISOString(user.registeredDate),
  };
};

export const toDomainUser = (user: StorageUser): User => {
  return {
    slackUserId: user.SlackUserId,
    userImage: user.UserImage,
    displayUserName: user.DisplayUserName,
    registeredDate: new Date(user.RegisteredDate),
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
  userId: string
): Promise<User | null> => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      SlackUserId: userId,
    },
  });
  const { Item } = await ddbDocClient.send(command);
  if (!Item) {
    return null;
  }

  return toDomainUser(Item as StorageUser);
};

export const findAllUsers = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });
  const { Items } = await ddbDocClient.send(command);
  if (!Items) {
    throw new Error("取得できませんでした");
  }

  return Items.map((item) => toDomainUser(item as StorageUser));
};
