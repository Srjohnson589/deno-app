import { useEffect, useState } from "react";

export function App() {
  const [api, setApi] = useState<"pending" | "ok" | "error">("pending");

  useEffect(() => {
    fetch("/api/health")
      .then((r) => setApi(r.ok ? "ok" : "error"))
      .catch(() => setApi("error"));
  }, []);

  return (
    <p style={{ fontFamily: "system-ui", padding: "1rem" }}>
      Dev proxy + API:{" "}
      {api === "pending"
        ? "checking…"
        : api === "ok"
        ? "ok (GET /api/health)"
        : "unreachable — is the Deno server running on port 8000?"}
    </p>
  );
}
