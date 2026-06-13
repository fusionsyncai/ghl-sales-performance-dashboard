"use client";

import { useEffect, useRef, useState } from "react";
import { Info, Lock, MonitorSmartphone, ServerOff } from "lucide-react";

const POINTS = [
  {
    icon: ServerOff,
    title: "Nothing hits our servers",
    body: "We run no database. Your GHL key is never written to any backend we control.",
  },
  {
    icon: MonitorSmartphone,
    title: "Stored in your browser",
    body: "Your connection lives only in your own browser session on this device.",
  },
  {
    icon: Lock,
    title: "Encrypted, read-only",
    body: "AES-256 encrypted and used strictly to read your data live — never to write.",
  },
];

export function PrivacyInfo() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-flex">
      <button
        type="button"
        aria-label="How we handle your key"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-5 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground transition-colors hover:border-emerald-500/40 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
      >
        <Info className="size-3" />
      </button>

      {open ? (
        <div
          role="dialog"
          className="animate-rise-in absolute bottom-[calc(100%+10px)] left-1/2 z-50 w-72 -translate-x-1/2 rounded-2xl border border-border bg-card/95 p-4 text-left shadow-xl backdrop-blur-xl"
        >
          <p className="font-heading text-sm font-bold text-foreground">
            Your key stays yours
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {POINTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-2.5">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Icon className="size-3.5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-foreground">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <span
            aria-hidden
            className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 rounded-[2px] border-b border-r border-border bg-card/95"
          />
        </div>
      ) : null}
    </div>
  );
}
