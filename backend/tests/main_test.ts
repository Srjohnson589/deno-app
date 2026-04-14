import { assertEquals } from "@std/assert";
import { app } from "../src/app.ts";

Deno.test("GET /api/health returns 200 OK", async () => {
  const res = await app(new Request("http://localhost:8000/api/health"));
  await assertEquals(res.status, 200);
});
