import { useEffect, useState } from "react";

export default function StatusBar() {
  const [utc, setUtc] = useState("00:00:00");

  useEffect(() => {
    const pad = (x) => String(x).padStart(2, "0");
    const tick = () => {
      const n = new Date();
      setUtc(`${pad(n.getUTCHours())}:${pad(n.getUTCMinutes())}:${pad(n.getUTCSeconds())}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="border-b border-line bg-black/40 backdrop-blur-sm font-mono text-[10px] md:text-[11px] text-dim px-4 md:px-6 py-2 flex items-center justify-between uppercase tracking-[0.1em]">
      <div className="flex items-center gap-3 md:gap-6">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-safe shadow-[0_0_8px_var(--color-safe)] animate-pulse-dot" />
          G.T.I. // ONLINE
        </span>
        <span className="hidden sm:inline">UTC {utc}</span>
        <span className="hidden md:inline">SECTOR // ASARA</span>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <span>VER 2.6.1</span>
        <span className="hidden sm:inline">SIG ▲▲▲△</span>
        <span className="text-accent">[ INTL ]</span>
      </div>
    </div>
  );
}
