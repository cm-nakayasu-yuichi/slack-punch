import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().min(1),
  profile: z.object({
    name: z.string().min(1),
    image: z.string().nullable(),
  }),
});

export type User = z.infer<typeof UserSchema>;
