export function router(req: Request, apiPath: string): Response {
  if (req.method === "GET" && apiPath === "/health") {
    return new Response("ok", { status: 200 });
  }

  return new Response("Not Found", { status: 404 });
}
