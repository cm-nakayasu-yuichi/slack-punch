import { getSecret } from "@aws-lambda-powertools/parameters/secrets";
import { z } from "zod";

const SlackAuthSchema = z.object({
  redirectUrl: z.string().min(1),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  botToken: z.string().min(1),
  mainTeamId: z.string().min(1),
  teamList: z.array(z.string().min(1)),
  signingSecret: z.string().min(1),
});
export type SlackAuth = z.infer<typeof SlackAuthSchema>;

export type ParameterClient = {
  fetchSlackToken: (userId: string) => Promise<string>;
  fetchBasicAuthCredential: () => Promise<{
    username: string;
    password: string;
  }>;
  fetchSlackAuthData: () => Promise<SlackAuth>;
  fetchJwtSecretKey: () => Promise<string>;
};

export const parameterClient: ParameterClient = {
  async fetchSlackToken(userId) {
    const token = await getSecret(`/slack-punch/slack/token/${userId}`);

    if (!token || typeof token !== "string")
      throw new Error("Slack token is not found.", {
        cause: {
          path: `/slack/token/${userId}`,
        },
      });

    return token;
  },

  async fetchBasicAuthCredential() {
    const response: any = await getSecret(`/slack-punch/basicAuth`, {
      transform: "json",
    });

    if (!response || typeof response !== "object")
      throw new Error("basicAuth is not found.", {});
    if (
      typeof response.username !== "string" ||
      typeof response.password !== "string"
    ) {
      throw new Error("username or password is not found.", {});
    }

    return {
      username: response.username,
      password: response.password,
    };
  },

  async fetchSlackAuthData() {
    const response: any = await getSecret(`/slack-punch/slack/auth`, {
      transform: "json",
    });

    const result = SlackAuthSchema.parse(response);
    return result;
  },

  async fetchJwtSecretKey() {
    const jwtSecret: any = await getSecret(`/slack-punch/jwt-secret`);

    if (!jwtSecret || typeof jwtSecret !== "string")
      throw new Error("basicAuth is not found.", {});

    return jwtSecret;
  },
};
