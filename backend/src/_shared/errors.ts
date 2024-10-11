import { HTTPException } from "hono/http-exception";

export class UnauthorizedError extends HTTPException {
  constructor() {
    super(401, { message: "Unauthorized" });
  }
}
