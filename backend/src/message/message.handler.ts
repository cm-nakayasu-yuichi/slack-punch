import { Hono, MiddlewareHandler } from "hono";
import { getMessagesByYearMonth } from "./message.storage";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const registerHandlerMessage = (
  app: Hono,
  {
    jwtAuth,
  }: {
    jwtAuth: MiddlewareHandler;
  }
) => {
  app.get(
    "/messages",
    jwtAuth,
    zValidator(
      "query",
      z.object({
        yearMonth: z.string().regex(/^\d{4}-\d{2}$/),
      })
    ),
    async (c) => {
      const yearMonth = c.req.query("yearMonth");
      const { messages } = await getMessagesByYearMonth(yearMonth!);
      return c.json({ messages });
    }
  );
};
