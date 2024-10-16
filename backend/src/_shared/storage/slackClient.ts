import { WebClient } from "@slack/web-api";
import { SlackClient } from "../../message/message.service";
import { logger } from "../../_shared/util/logger";
import { parameterClient, SlackAuth } from "./parameterClient";

export const generateSlackClient = (token: string) => {
  const web = new WebClient(token);

  return {
    fetchConversationById: async ({ channelId }) => {
      const conversation = await web.conversations.info({
        channel: channelId,
      });
      logger.info("conversationを取得しました", { conversation });
      if (conversation.channel === undefined) {
        throw new Error("チャンネル情報が取得できませんでした");
      }
      if (conversation.channel.name === undefined) {
        throw new Error("チャンネル名が取得できませんでした");
      }

      return {
        channelName: conversation.channel.name,
      };
    },
    fetchConversationHistory: async ({ channelId }) => {
      const history = await web.conversations.history({
        channel: channelId,
      });
      logger.info("historyを取得しました", { history });
      if (history === undefined) {
        throw new Error("履歴が取得できませんでした");
      }
      if (history.messages === undefined) {
        throw new Error("メッセージが取得できませんでした");
      }
      if (
        history.messages.some(
          (messageElement) => messageElement.text === undefined
        )
      ) {
        logger.error("`history.messages`", {
          "history.messages": history.messages,
        });
        throw new Error("メッセージにundefinedが含まれています");
      }
      return {
        messages: history.messages as { text: string }[],
      };
    },
    fetchUserByUserId: async ({ userId }) => {
      const userResponse = await web.users.info({
        user: userId,
      });
      logger.info("userを取得しました", { userResponse });

      if (userResponse.user === undefined) {
        throw new Error("ユーザ情報が取得できませんでした");
      }
      if (userResponse.user.profile === undefined) {
        throw new Error("ユーザのプロフィール情報が取得できませんでした");
      }

      const displayName = userResponse.user.profile.display_name;
      const realName = userResponse.user.profile.real_name;
      if (realName === undefined) {
        throw new Error("ユーザーの`real_name`が取得できませんでした");
      }

      const id = userResponse.user.id;
      if (id === undefined) {
        throw new Error("ユーザーのIDが取得できませんでした");
      }

      const image = userResponse.user.profile.image_72 ?? null;

      return {
        id,
        profile: {
          // 空文字やnullの場合はdisplayNameを使う
          name: !!displayName ? displayName : realName,
          image: image,
        },
      };
    },
  } as SlackClient;
};

export const getIdToken = async (slackAuth: SlackAuth, code: string) => {
  const { redirectUrl } = await parameterClient.fetchSlackAuthData();
  const botWeb = new WebClient(slackAuth.botToken);
  const response = await botWeb.openid.connect.token({
    client_id: slackAuth.clientId,
    client_secret: slackAuth.clientSecret,
    code: code,
    redirect_uri: redirectUrl,
  });

  return response;
};
