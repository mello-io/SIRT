// S.I.R.T. ProgressTerminal
// Animated terminal-style loading indicator shown during checklist generation.
// Cycles through phase label messages with a blinking cursor.

"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Mapping stack to incident type...",
  "Applying MITRE context...",
  "Building tool query blocks...",
  "Finalising checklist...",
];

export function ProgressTerminal() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 2800);

    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 380);

    return () => {
      clearInterval(msgInterval);
      clearInterval(dotInterval);
    };
  }, []);

  return (
    <div className="bg-deep-slate border border-grid-line rounded-lg p-5 font-mono">
      {/* Header bar */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-muted-ash uppercase tracking-widest">
          S.I.R.T. engine
        </span>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse"
          aria-hidden="true"
        />
      </div>

      {/* Message steps */}
      <div className="space-y-2">
        {MESSAGES.map((msg, i) => {
          const isDone = i < messageIndex;
          const isCurrent = i === messageIndex;
          return (
            <div
              key={msg}
              className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                isDone ? "opacity-35" : isCurrent ? "opacity-100" : "opacity-20"
              }`}
            >
              <span
                className={
                  isDone
                    ? "text-signal-green"
                    : isCurrent
                    ? "text-signal-green"
                    : "text-muted-ash"
                }
              >
                {isDone ? "✓" : isCurrent ? "›" : "·"}
              </span>
              <span
                className={
                  isDone
                    ? "text-muted-ash line-through"
                    : isCurrent
                    ? "text-off-white"
                    : "text-muted-ash"
                }
              >
                {msg}
              </span>
              {isCurrent && (
                <span className="text-signal-green" aria-hidden="true">
                  {dots}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Blinking cursor line */}
      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-ash">
        <span aria-hidden="true">_</span>
        <span
          className="inline-block w-2 h-[13px] bg-signal-green/70 animate-pulse"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
