import { handle } from "hono/aws-lambda";
import { createApp } from "..";

export const handler = async (event: any) => {
  const app = await createApp();
  return handle(app)(event);
};
