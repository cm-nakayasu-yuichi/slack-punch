import { timestampToDate } from "../_shared/util/date";

export type MessageCompositeKey = `${string}/${string}`;

type Conversation = {
  channelName: string;
};
type ConversationHistory = {
  messages: { text: string }[];
};
export type SlackUser = {
  id: string;
  profile: {
    name: string;
    image: string | null;
  };
};

export type SlackClient = {
  fetchConversationById: (option: {
    channelId: string;
  }) => Promise<Conversation>;
  fetchConversationHistory: (option: {
    channelId: string;
  }) => Promise<ConversationHistory>;

  fetchUserByUserId: (option: { userId: string }) => Promise<SlackUser>;
};

export const saveMessage = async (
  slackClient: SlackClient,
  channelId: string,
  timestamp: string,
  eventTimestamp: string,
  postUserId: string,
  blowUserId: string
) => {
  // チャンネル情報取得
  const conversation = await slackClient.fetchConversationById({ channelId });

  // メッセージ情報取得
  const history = await slackClient.fetchConversationHistory({
    channelId,
  });

  if (history.messages.length === 0) {
    throw new Error("message is not found.");
  }

  // 投稿ユーザ情報の取得
  const postUser = await slackClient.fetchUserByUserId({
    userId: postUserId,
  });

  // SlackPunchしたユーザ情報の取得
  const blowUser = await slackClient.fetchUserByUserId({
    userId: blowUserId,
  });

  const message = {
    channelId,
    timestamp,
    channelName: conversation.channelName,
    message: history.messages[0].text,
    postedDate: timestampToDate(timestamp),
    postUserId: postUser.id,
    postUserName: postUser.profile.name,
    postUserImageUrl: postUser.profile.image,
    blownDate: timestampToDate(eventTimestamp),
    blowUserId: blowUser.id,
    blowUserName: blowUser.profile.name,
  };
  return message;
};

export type Message = Awaited<ReturnType<typeof saveMessage>>;
