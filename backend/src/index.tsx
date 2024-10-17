import { Context, Hono, MiddlewareHandler } from "hono";
import { ReactionAddedEvent, WebClient } from "@slack/web-api";
import { saveMessage } from "./message/message.service";
import {
  getAllMessages,
  saveMessageToStorage,
} from "./message/message.storage";
import { logger } from "./_shared/util/logger";
import { generateSlackClient, getIdToken } from "./_shared/storage/slackClient";
import { Debugger } from "./debugViewer";
import { parameterClient } from "./_shared/storage/parameterClient";
import { secureHeaders } from "hono/secure-headers";
import { HTTPException } from "hono/http-exception";
import { UnauthorizedError } from "./_shared/errors";
import { jwt } from "hono/jwt";
import { findAllUsers, findUserBySlackUserId } from "./user/user.storage";
import { registerHandlerMessage } from "./message/message.handler";
import { getAllMatomes } from "./matome/matome.storage";
import { registerHandlerUserAuth } from "./user/auth/auth.handler";
import { registerHandlerMatome } from "./matome/matome.handler";

export const createApp = async () => {
  const [jwtSecretKey, basicAuth] = await Promise.all([
    parameterClient.fetchJwtSecretKey(),
    parameterClient.fetchBasicAuthCredential(),
  ]);

  const jwtAuth = jwt({
    secret: jwtSecretKey,
    alg: "HS512",
  });

  const app = new Hono();

  app.use(secureHeaders());

  app.get("/healthcheck", async (c) => {
    return c.text("ok");
  });

  app.post("/", async (c) => {
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

  app.get(
    "/me",
    jwt({
      secret: jwtSecretKey,
      alg: "HS512",
    }),
    async (c) => {
      const payload: { sub: string } = c.get("jwtPayload");
      const user = await findUserBySlackUserId(payload.sub);

      return c.json({ user });
    }
  );

  await registerHandlerMessage(app, {
    jwtAuth,
  });
  await registerHandlerUserAuth(app);
  await registerHandlerMatome(app, { jwtAuth });

  /**
   * TODO: なぜかHonoのBASIC認証がうまくいかない
   * 代わりにクエリパラメータで認証する
   */
  const customAuthMiddleware: MiddlewareHandler = async (c, next) => {
    const username = c.req.query("username");
    const password = c.req.query("password");
    if (username !== basicAuth.username || password !== basicAuth.password) {
      throw new UnauthorizedError();
    }

    await next();
  };

  app.get("/debug", customAuthMiddleware, async (c) => {
    const messages = await getAllMessages();
    const matomes = await getAllMatomes();
    const users = await findAllUsers();
    logger.info("メッセージを全件取得しました", { messages });
    return c.html(
      <Debugger messages={messages ?? []} matomes={matomes} users={users} />
    );
  });

  app.onError((err) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    logger.error("不明なエラーが発生しました", { err });
    throw err;
  });

  return app;
};

const handleReactionAdded = async (c: Context, event: ReactionAddedEvent) => {
  const isTargetEmoji = event.reaction === "facepunch";
  if (!isTargetEmoji) {
    return c.json({ result: "ok" });
  }

  const token = await parameterClient.fetchSlackToken(event.user);
  const slackClient = generateSlackClient(token);

  const message = await saveMessage(
    slackClient,
    event.item.channel,
    event.item.ts,
    event.event_ts,
    event.item_user,
    event.user
  );
  await saveMessageToStorage(message);
  return c.json({ result: "ok" });
};
