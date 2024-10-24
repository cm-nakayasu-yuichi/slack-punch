import crypto from "crypto";
import { WebClient } from "@slack/web-api";
import { Conversation, SlackMessage } from "../../message/message.service";
import { logger } from "../util/logger";
import { parameterClient, SlackAuth } from "./parameterClient";
import { differenceInMinutes } from "date-fns";
import { User } from "../../user/user.entity";

export type SlackClient = {
  fetchConversationById: (option: {
    channelId: string;
  }) => Promise<Conversation>;
  fetchMessage: (option: {
    channelId: string;
    timestamp: string;
  }) => Promise<SlackMessage>;

  fetchUserByUserId: (option: { userId: string }) => Promise<User>;
};

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
    fetchMessage: async ({ channelId, timestamp }) => {
      const fetchFromHistory = async () => {
        const history = await web.conversations.history({
          channel: channelId,
          latest: timestamp,
          inclusive: true,
          limit: 1,
        });
        logger.debug("historyMessageを取得しました", { history });
        if (
          history === undefined ||
          history.messages === undefined ||
          history.messages.length === 0
        ) {
          throw new Error("historyMessageが取得できませんでした", {
            cause: history,
          });
        }

        if (history.messages[0].ts !== timestamp) {
          throw new Error("取得できたhistoryMessageのtimestampが一致しません", {
            cause: {
              historyTimestamp: history.messages[0].ts,
              timestamp,
            },
          });
        }

        return history.messages[0];
      };

      const fetchFromReplies = async () => {
        const replyMessage = await web.conversations.replies({
          channel: channelId,
          ts: timestamp,
          limit: 1,
        });
        logger.debug("replyMessageを取得しました", { replyMessage });
        if (
          replyMessage === undefined ||
          replyMessage.messages === undefined ||
          replyMessage.messages.length === 0
        ) {
          throw new Error("replyMessageが取得できませんでした", {
            cause: replyMessage,
          });
        }

        if (replyMessage.messages[0].ts !== timestamp) {
          throw new Error("取得できたreplyMessageのtimestampが一致しません", {
            cause: {
              historyTimestamp: replyMessage.messages[0].ts,
              timestamp,
            },
          });
        }

        return replyMessage.messages[0];
      };

      const message = await fetchFromHistory().catch((e) => {
        logger.debug("`web.conversations.history`から取得できませんでした", {
          e,
        });

        return fetchFromReplies();
      });

      if (message.type !== "message") {
        throw new Error("取得できたメッセージのtypeが対応していません", {
          cause: {
            type: message.type,
          },
        });
      }

      return message;
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

export const verifySigning = ({
  rawBody,
  signingSecret,
  signature,
  timestamp,
}: {
  rawBody: string;
  signingSecret: string;
  signature: string;
  timestamp: string;
}) => {
  if (differenceInMinutes(new Date(timestamp), new Date()) > 5) {
    throw new Error("署名検証に失敗しました/timestampが古すぎます");
  }

  const signatureBaseString = `v0:${timestamp}:${rawBody}`;

  const expectedSignature = `v0=${crypto
    .createHmac("sha256", signingSecret)
    .update(signatureBaseString, "utf8")
    .digest("hex")}`;

  if (signature !== expectedSignature) {
    throw new Error("署名検証に失敗しました/signatureが一致しません");
  }
};
