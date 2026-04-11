import { Button, Field, Label, Textarea } from "@headlessui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import logo from "./assets/AirTera_Logo_Icon.png";

export function App() {
  const [text, setText] = useState("");
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [storedContent, setStoredContent] = useState<string | null>(null);
  const [storedLoad, setStoredLoad] = useState<"pending" | "ok" | "error">(
    "pending",
  );
  const [storedError, setStoredError] = useState<string | null>(null);

  const loadStoredFile = useCallback(async () => {
    setStoredLoad("pending");
    setStoredError(null);
    try {
      const res = await fetch("/api/storage/test.txt");
      const body = await res.text();
      if (!res.ok) {
        setStoredContent(null);
        setStoredLoad("error");
        setStoredError(body || `Could not load file (${res.status})`);
        return;
      }
      setStoredContent(body);
      setStoredLoad("ok");
    } catch {
      setStoredContent(null);
      setStoredLoad("error");
      setStoredError("Network error.");
    }
  }, []);

  useEffect(() => {
    void loadStoredFile();
  }, [loadStoredFile]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitState("submitting");
    setSubmitMessage(null);
    try {
      const res = await fetch("/api/writeToFile", {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: text,
      });
      const msg = await res.text();
      if (!res.ok) {
        setSubmitState("error");
        setSubmitMessage(msg || `Request failed (${res.status})`);
        return;
      }
      setSubmitState("success");
      setSubmitMessage(msg || "Saved.");
      void loadStoredFile();
    } catch {
      setSubmitState("error");
      setSubmitMessage("Network error.");
    }
  }

  return (
    <div className="min-h-dvh w-full bg-[rgb(40,32,17)] text-white">
      <header className="flex w-full justify-center border-b border-white/6 bg-linear-to-b from-black/25 to-transparent px-4 py-5 sm:py-6">
        <div className="rounded-lg bg-white px-5 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.25)] sm:px-6 sm:py-3.5">
          <img
            src={logo}
            alt="AirTera — Security. Safety. Compliance."
            className="h-11 w-auto max-w-[min(100%,22rem)] object-contain object-center sm:h-13 md:h-14"
            draggable={false}
          />
        </div>
      </header>
      <main className="mx-auto max-w-2xl space-y-8 px-4 py-10">
        <section
          className="rounded-xl border border-white/10 bg-black/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          aria-labelledby="stored-heading"
        >
          <h2
            id="stored-heading"
            className="text-sm font-semibold tracking-wide text-white/90"
          >
            storage/test.txt
          </h2>
          {storedLoad === "pending" && (
            <p className="mt-3 text-sm text-white/55">Loading…</p>
          )}
          {storedLoad === "error" && storedError != null && (
            <p className="mt-3 text-sm text-red-300/95">{storedError}</p>
          )}
          {storedLoad === "ok" && storedContent != null && (
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap wrap-break-word rounded-lg border border-white/10 bg-black/35 px-3 py-2 font-mono text-sm text-white/90">
              {storedContent === "" ? "(empty file)" : storedContent}
            </pre>
          )}
        </section>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-xl border border-white/10 bg-black/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <Field className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-white/90">
              Content
            </Label>
            <Textarea
              name="content"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="w-full resize-y rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-white/30 placeholder:text-white/35 focus:border-amber-400/50 focus:ring-2 data-focus:border-amber-400/50 data-hover:border-white/25"
              placeholder="Enter text to send to the server…"
            />
          </Field>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              disabled={submitState === "submitting"}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[rgb(40,32,17)] outline-none ring-amber-300/60 enabled:data-active:bg-amber-600 enabled:data-hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 enabled:data-focus:ring-2"
            >
              {submitState === "submitting" ? "Submitting…" : "Submit"}
            </Button>
            {submitMessage != null && (
              <p
                className={
                  submitState === "success"
                    ? "text-sm text-emerald-300/95"
                    : "text-sm text-red-300/95"
                }
              >
                {submitMessage}
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
