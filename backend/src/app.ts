import { router } from "./router.ts";

export async function app(req: Request): Promise<Response> {
  const path = new URL(req.url).pathname;
  if (!path.startsWith("/api")) {
    return new Response("Not Found", { status: 404 });
  }
  const apiPath = path.slice("/api".length) || "/";
  return await router(req, apiPath);
}
