import { Context, Hono } from "hono";
import { ReactionAddedEvent } from "@slack/web-api";
import { saveMessage } from "./service";
import {
  getAllMessageFromStorage,
  putMessageToStorage,
} from "./storage/message";
import { logger } from "./util/logger";
import { slackClient } from "./slackClient";
import { Debugger } from "./debugViewer";

const _app = new Hono();

const handleReactionAdded = async (c: Context, event: ReactionAddedEvent) => {
  const message = await saveMessage(
    slackClient,
    event.item.channel,
    event.item.ts,
    event.event_ts,
    event.item_user,
    event.user
  );
  await putMessageToStorage(message);
  return c.json({ result: "ok" });
};

_app.get("/healthcheck", async (c) => {
  return c.text("ok");
});

_app.post("/", async (c) => {
  const slackEvent = await c.req.json();
  logger.info("イベントを受け取りました", { slackEvent });
  switch (slackEvent.type) {
    case "url_verification": {
      return c.json({ challenge: slackEvent.challenge });
    }
    case "event_callback": {
      const slackEventDetail = slackEvent.event;
      if (slackEventDetail.type !== "reaction_added") {
        throw new Error(
          `対応していないevent_callbackの"type"です event.type=${slackEventDetail.type}`
        );
      }

      const isTargetEmoji = slackEventDetail.reaction === "facepunch";
      if (!isTargetEmoji) {
        return c.json({ result: "ok" });
      }
      return await handleReactionAdded(
        c,
        slackEventDetail as ReactionAddedEvent
      );
    }
    default: {
      throw new Error(`対応していない"type"です type=${slackEvent.type}`);
    }
  }
});

_app.get("/debug", async (c) => {
  const messages = await getAllMessageFromStorage();
  logger.info("メッセージを全件取得しました", { messages });
  return c.html(<Debugger messages={messages ?? []} />);
});

_app.onError((error, c) => {
  console.log("#", error);
  logger.error("意図しないエラーが発生しました", { error });
  throw error;
});

export const app = _app;
