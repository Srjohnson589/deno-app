import { assertEquals } from "@std/assert";
import { handleRequest } from "./main.ts";

Deno.test("GET /health returns 200 OK", () => {
  const res = handleRequest(new Request("http://localhost:8000/health"));
  assertEquals(res.status, 200);
});
