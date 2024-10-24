import { Hono, MiddlewareHandler } from "hono";
import { getAllMessages } from "./message.storage";

export const registerHandlerMessage = (
  app: Hono,
  {
    jwtAuth,
  }: {
    jwtAuth: MiddlewareHandler;
  }
) => {
  app.get("/messages", jwtAuth, async (c) => {
    const messages = await getAllMessages();
    return c.json({ messages, lastKey: null });
  });
};
