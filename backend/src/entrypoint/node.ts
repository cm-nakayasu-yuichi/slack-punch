import { app } from "..";
import { serve } from "@hono/node-server";

serve({
  ...app,
  port: 3001,
});

console.log("Server is running on http://localhost:3001");
