import { handle } from "hono/aws-lambda";
import { createApp } from "..";

export const handler = async () => {
  const app = await createApp();
  return handle(app);
};
