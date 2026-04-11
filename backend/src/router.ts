import { readFromFile } from "./helpers/readFromFile.ts";
import { writeToFile } from "./helpers/writeToFile.ts";

const STORAGE_TEST_FILE = "./storage/test.txt";

export async function router(req: Request, apiPath: string): Promise<Response> {
  if (req.method === "GET" && apiPath === "/health") {
    return new Response("ok", { status: 200 });
  }

  if (req.method === "GET" && apiPath === "/storage/test.txt") {
    const result = await readFromFile(STORAGE_TEST_FILE);
    if (!result.ok) {
      return new Response(result.message, { status: result.status });
    }
    return new Response(result.content, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (req.method === "POST" && apiPath === "/writeToFile") {
    const contentType = req.headers.get("content-type") ?? "";

    let content: string;
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (!body.filename || !body.content) {
        return new Response("Missing filename or content", { status: 400 });
      }
      if (typeof body.content !== "string") {
        return new Response("Invalid content", { status: 400 });
      }
      content = body.content;
    } else if (contentType.includes("text/plain")) {
      content = await req.text();
    } else {
      return new Response(
        "Expected Content-Type: application/json or text/plain",
        { status: 415 },
      );
    }

    const result = await writeToFile(STORAGE_TEST_FILE, content);
    if (!result.ok) {
      return new Response(result.message, { status: result.status });
    }

    return new Response("File written successfully", { status: 200 });
  }

  return new Response("Not Found", { status: 404 });
}
