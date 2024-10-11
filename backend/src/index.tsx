import { Context, Hono, MiddlewareHandler } from "hono";
import { ReactionAddedEvent, WebClient } from "@slack/web-api";
import { saveMessage } from "./message/message.service";
import {
  getAllMessageFromStorage,
  putMessageToStorage,
} from "./message/message.storage";
import { logger } from "./_shared/util/logger";
import { generateSlackClient, getIdToken } from "./_shared/storage/slackClient";
import { Debugger } from "./debugViewer";
import { parameterClient } from "./_shared/storage/parameterClient";
import { secureHeaders } from "hono/secure-headers";
import { HTTPException } from "hono/http-exception";
import {
  authenticate,
  startAuthenticationFlow,
} from "./user/auth/auth.service";
import { UnauthorizedError } from "./_shared/errors";
import { jwt } from "hono/jwt";
import { findUserByUserId } from "./user/user.storage";

export const createApp = async () => {
  const [slackClientData, jwtSecretKey, basicAuth] = await Promise.all([
    parameterClient.fetchSlackAuthData(),
    parameterClient.fetchJwtSecretKey(),
    parameterClient.fetchBasicAuthCredential(),
  ]);

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

  app.get("/oauth/authorize", async (c) => {
    const authState = await startAuthenticationFlow();
    return c.redirect(
      "https://slack.com/openid/connect/authorize?" +
        "response_type=code" +
        "&scope=openid" +
        `&client_id=${slackClientData.clientId}` +
        `&state=${authState.state}` +
        // FIXME: 秘匿情報
        `&team=${slackClientData.team}` +
        `&nonce=${authState.nonce}` +
        `&redirect_uri=${slackClientData.redirectUrl}`
    );
  });

  app.get("/oauth/callback", async (c) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    if (code === undefined || state === undefined) {
      throw new UnauthorizedError();
    }

    const { user, token } = await authenticate(code, state);

    return c.json({ user, token });
  });

  app.get(
    "/me",
    jwt({
      secret: jwtSecretKey,
      alg: "HS512",
    }),
    async (c) => {
      const payload: { sub: string } = c.get("jwtPayload");
      const user = await findUserByUserId(payload.sub);

      return c.json({ user });
    }
  );

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
    const messages = await getAllMessageFromStorage();
    logger.info("メッセージを全件取得しました", { messages });
    return c.html(<Debugger messages={messages ?? []} />);
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
  await putMessageToStorage(message);
  return c.json({ result: "ok" });
};
