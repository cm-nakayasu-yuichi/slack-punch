import { Hono, MiddlewareHandler } from "hono";
import { parameterClient } from "../../_shared/client/parameterClient";
import { authenticate, startAuthenticationFlow } from "./auth.service";
import { UnauthorizedError } from "../../_shared/errors";

export const registerHandlerUserAuth = async (app: Hono) => {
  const slackClientData = await parameterClient.fetchSlackAuthData();

  app.get("/oauth/authorize", async (c) => {
    const authState = await startAuthenticationFlow();
    return c.redirect(
      "https://slack.com/openid/connect/authorize?" +
        "response_type=code" +
        "&scope=openid" +
        `&client_id=${slackClientData.clientId}` +
        `&state=${authState.state}` +
        `&team=${slackClientData.mainTeamId}` +
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

    const { token } = await authenticate(code, state);

    return c.json({ token });
  });
};
