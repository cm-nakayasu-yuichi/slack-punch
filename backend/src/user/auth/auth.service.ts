import { decode, sign, verify } from "hono/jwt";
import { findUserBySlackUserId, putUserToStorage } from "../user.storage";
import {
  generateSlackClient,
  getIdToken,
} from "../../_shared/storage/slackClient";
import { parameterClient } from "../../_shared/storage/parameterClient";
import { z } from "zod";
import { SlackUser } from "../../message/message.service";
import crypto from "crypto";
import { UnauthorizedError } from "../../_shared/errors";
import { findByState, putAuthStateToStorage } from "./auth.storage";

const IdTokenSchema = z.object({
  // NOTE: https://slack.com/openid/connect/keys
  header: z.object({
    alg: z.literal("RS256"),
    // type: z.literal("JWT"),
  }),
  payload: z.object({
    iss: z.literal("https://slack.com"),
    sub: z.string().min(1),
    exp: z.number().min(1),
    nonce: z.string().min(1),
    "https://slack.com/team_id": z.string().min(1),
  }),
});

export const startAuthenticationFlow = async (): Promise<AuthState> => {
  const state: AuthState = {
    state: crypto.randomUUID(),
    nonce: crypto.randomUUID(),
    expiredAt: Math.floor(Date.now() / 1000) + 60 * 1, // 1 minutes
  };
  await putAuthStateToStorage(state);

  return state;
};

export const authenticate = async (code: string, state: string) => {
  const slackUser = await getSlackUserByCode(code, state);

  let user = await findUserBySlackUserId(slackUser.id);
  if (user === null) {
    user = await generateUser(slackUser);
  }

  const payload = {
    sub: user.slackUserId,
    role: "user",
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
  };
  const jwtSecret = await parameterClient.fetchJwtSecretKey();
  const token = await sign(payload, jwtSecret, "HS512");

  return {
    token,
    user,
  };
};

const getSlackUserByCode = async (
  code: string,
  state: string
): Promise<SlackUser> => {
  const authState = await findByState(state);
  if (authState === null) {
    throw new UnauthorizedError();
  }

  const slackAuth = await parameterClient.fetchSlackAuthData();
  const response = await getIdToken(slackAuth, code!);
  if (!response.ok || response.id_token === undefined) {
    throw new UnauthorizedError();
  }

  const idToken = await decode(response.id_token);
  const validatedIdToken = IdTokenSchema.parse(idToken);

  if (validatedIdToken.payload.nonce !== authState.nonce) {
    throw new UnauthorizedError();
  }
  if (
    !slackAuth.teamList.includes(
      validatedIdToken.payload["https://slack.com/team_id"]
    )
  ) {
    throw new UnauthorizedError();
  }

  const userId = validatedIdToken.payload.sub;

  const slackClient = generateSlackClient(response.access_token!);
  const user = await slackClient.fetchUserByUserId({ userId });

  return user;
};

const generateUser = async (slackUser: SlackUser) => {
  const user = {
    slackUserId: slackUser.id,
    displayUserName: slackUser.profile.name,
    userImage: slackUser.profile.image,
    registeredDate: new Date(),
  };
  await putUserToStorage(user);
  return user;
};

export type AuthState = {
  state: string;
  nonce: string;
  expiredAt: number;
};
