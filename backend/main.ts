export function handleRequest(req: Request): Response {
  const url = new URL(req.url);

  const path = url.pathname;
  if (!path.startsWith("/api")) {
    return new Response("Not Found", { status: 404 });
  }
  const apiPath = path.slice("/api".length) || "/";
  
  if (req.method === "GET" && apiPath === "/health") {
    return new Response("ok", { status: 200 });
  }
  return new Response("Not Found", { status: 404 });
}

if (import.meta.main) {
  Deno.serve({ port: 8000 }, handleRequest);
}
