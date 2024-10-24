import { User, UserSchema } from "./user.entity";

export const decodeFromJwtPayload = (payload: any): User => {
  return UserSchema.parse({ ...payload, id: payload.sub });
};
