import logo from "./assets/AirTera_Logo_Icon.png";
import { useEffect } from "react";

export function App() {
  useEffect(() => {
    const healthCheck = async () => {
      const response = await fetch("/api/health");
      const body = await response.text();
      console.log("/api/health", { status: response.status, body });
    };
    void healthCheck();
  }, []);

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
        
      </main>
    </div>
  );
}
