import { PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../_shared/client/ddbClient";
import { AuthState } from "./auth.service";

const TABLE_NAME = "SlackPunchAuthState";

interface StorageAuthState {
  State: string;
  Nonce: string;
  ExpiredAt: number;
}

export const toStorageAuthState = (authState: AuthState): StorageAuthState => {
  return {
    State: authState.state,
    Nonce: authState.nonce,
    ExpiredAt: authState.expiredAt,
  };
};

export const putAuthStateToStorage = async (authState: AuthState) => {
  const params = {
    TableName: TABLE_NAME,
    Item: toStorageAuthState(authState),
  };
  await ddbDocClient.send(new PutCommand(params));
};

export const findByState = async (state: string): Promise<AuthState | null> => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      State: state,
    },
  });
  const { Item } = await ddbDocClient.send(command);
  if (!Item) {
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  if (timestamp > Item.ExpiredAt) {
    return null;
  }

  return {
    state: Item.AuthState,
    nonce: Item.Nonce,
    expiredAt: Item.ExpiredAt,
  };
};
