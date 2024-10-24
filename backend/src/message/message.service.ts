import { SlackClient } from "../_shared/client/slackClient";
import { timestampToDate } from "../_shared/util/date";

export type Conversation = {
  channelName: string;
};
export type SlackMessage = {
  text: string;
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
  const slackMessage = await slackClient.fetchMessage({
    channelId,
    timestamp,
  });

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
    message: slackMessage.text,
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
