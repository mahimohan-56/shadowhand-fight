import React, { useEffect, useState } from "react";

export default function CountdownOverlay({ countdown, phase }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setScale(1.18);
    const t = setTimeout(() => setScale(1), 180);
    return () => clearTimeout(t);
  }, [countdown, phase]);

  if (phase === "grace") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div
          className="text-center"
          style={{ transform: `scale(${scale})`, transition: "transform 0.15s cubic-bezier(0.34,1.4,0.64,1)" }}
        >
          {/* Scaled down on mobile (text-3xl) up to original 6xl on sm+ so it
              never overflows the short horizontal VS strip on small screens */}
          <div className="text-3xl sm:text-6xl font-black text-red-500 leading-none glow-blood tracking-tight">
            LOCK!
          </div>
          <p className="text-[7px] sm:text-[9px] font-mono text-stone-500 mt-1 sm:mt-2 uppercase tracking-[0.2em] sm:tracking-[0.35em] whitespace-nowrap">
            Sealing your fate…
          </p>
        </div>
      </div>
    );
  }

  if (phase === "countdown" && countdown !== null) {
    const isUrgent = countdown <= 3;

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div
          className="text-center"
          style={{ transform: `scale(${scale})`, transition: "transform 0.15s cubic-bezier(0.34,1.4,0.64,1)" }}
        >
          <div
            className={`font-black leading-none tabular-nums select-none ${isUrgent ? "text-red-500 glow-blood" : "text-white"}`}
            style={{ fontSize: "clamp(2.25rem, 9vw, 7.5rem)" }}
          >
            {countdown}
          </div>
          <p className="text-[7px] sm:text-[9px] font-mono text-stone-500 mt-0.5 sm:mt-1 uppercase tracking-[0.2em] sm:tracking-[0.35em] whitespace-nowrap">
            {isUrgent ? "Hold your gesture!" : "Prepare your hand…"}
          </p>
        </div>
      </div>
    );
  }

  return null;
}