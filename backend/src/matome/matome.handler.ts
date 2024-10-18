import { Hono, MiddlewareHandler } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createMatome, getMatome, getMatomeList } from "./matome.service";

export const registerHandlerMatome = (
  app: Hono,
  {
    jwtAuth,
  }: {
    jwtAuth: MiddlewareHandler;
  }
) => {
  app.post(
    "/matome",
    jwtAuth,
    zValidator(
      "json",
      z.object({
        title: z.string(),
        description: z.string(),
        messageIdList: z
          .array(
            z
              .string()
              .and(
                z.custom<`${string}/${string}`>((val) =>
                  /^\S+\/[0-9\.]+$/g.test(val as string)
                )
              )
          )
          .max(100 /* DBの制約上 */),
      })
    ),
    async (c) => {
      const validatedRequestBody = c.req.valid("json");
      const payload: { sub: string } = c.get("jwtPayload");

      const matome = await createMatome({
        ...validatedRequestBody,
        createdUserId: payload.sub,
      });
      return c.json({ matome });
    }
  );

  app.get("/matome", jwtAuth, async (c) => {
    const matomeList = await getMatomeList();
    return c.json({ matomeList });
  });

  app.get("/matome/:matomeId", jwtAuth, async (c) => {
    const matomeId = c.req.param("matomeId");
    const matome = await getMatome(matomeId);
    return c.json({ matome });
  });

  app.get("/debug/createMatome", async (c) => {
    const matome = await createMatome({
      title: "タイトルテスト",
      description: "説明テスト",
      messageIdList: [
        "U07PKSCF18W/1727835831.532679",
        "U07PPKB0005/1727832976.662479",
      ],
      createdUserId: "U07PKSCF18W",
    });
    return c.redirect("/debug");
  });
};
