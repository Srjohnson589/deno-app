import { assertEquals } from "@std/assert";
import { app } from "../src/app.ts";

Deno.test("GET /api/health returns 200 OK", async () => {
  const res = await app(new Request("http://localhost:8000/api/health"));
  await assertEquals(res.status, 200);
});

Deno.test("POST /api/writeToFile writes to file", async () => {
  const res = await app(new Request("http://localhost:8000/api/writeToFile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: "test.txt", content: "Hello, world!" }),
  }));
  await assertEquals(res.status, 200);
});

Deno.test("GET /api/storage/test.txt returns file contents", async () => {
  await app(new Request("http://localhost:8000/api/writeToFile", {
    method: "POST",
    headers: { "Content-Type": "text/plain; charset=utf-8" },
    body: "stored for read test",
  }));

  const res = await app(
    new Request("http://localhost:8000/api/storage/test.txt"),
  );
  await assertEquals(res.status, 200);
  await assertEquals(await res.text(), "stored for read test");
});
