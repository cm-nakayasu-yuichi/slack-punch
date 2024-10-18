import { MessageCompositeKey } from "../message/message.entity";
import { getMessagesByIdList } from "../message/message.storage";
import {
  getAllMatomes,
  getMatomeById,
  putMatomeToStorage,
} from "./matome.storage";

export type Matome = {
  id: string;
  title: string;
  description: string;
  createdUserId: string;
  messageIdList: MessageCompositeKey[];
  createdDate: Date;
};

export const createMatome = async (
  matomeInput: Omit<Matome, "createdDate" | "id">
) => {
  const id = crypto.randomUUID();

  // メッセージが存在しているかチェック
  await getMessagesByIdList(matomeInput.messageIdList).catch((err) => {
    throw new Error("不正なメッセージを含んでいます", { cause: err });
  });

  const matome = { ...matomeInput, id, createdDate: new Date() };
  await putMatomeToStorage(matome);

  return matome;
};

export const getMatomeList = async () => {
  const matomeList = await getAllMatomes();
  return matomeList;
};

export const getMatome = async (matomeId: string) => {
  const matome = await getMatomeById(matomeId);
  const messages = await getMessagesByIdList(matome.messageIdList);
  return { matome, messages };
};
