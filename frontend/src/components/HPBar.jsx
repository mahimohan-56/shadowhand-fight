import React from "react";

function hpColor(hp, maxHp) {
  const ratio = maxHp > 0 ? hp / maxHp : 0;
  if (ratio > 0.6) return { fill: "linear-gradient(90deg,#166534,#16a34a,#4ade80)", glow: "rgba(74,222,128,0.3)", text: "#4ade80" };
  if (ratio > 0.3) return { fill: "linear-gradient(90deg,#92400e,#d97706,#fbbf24)", glow: "rgba(251,191,36,0.3)", text: "#fbbf24" };
  return       { fill: "linear-gradient(90deg,#7f1d1d,#b91c1c,#ef4444)",         glow: "rgba(239,68,68,0.5)",  text: "#ef4444" };
}

export default function HPBar({ username, hp, maxHp, side = "left", isYou = false }) {
  // FIX: If maxHp is missing, look at current health to dynamically infer the real pool ceiling limits
  let effectiveMax = maxHp || 100;
  if (!maxHp) {
    if (hp > 150) effectiveMax = 200;
    else if (hp > 100) effectiveMax = 150;
    else effectiveMax = 100;
  }

  // Calculate percentage cleanly
  const pct = Math.min(100, Math.max(0, (hp / effectiveMax) * 100));
  const colors = hpColor(hp, effectiveMax);
  const isLeft = side === "left";

  return (
    <div className={`flex flex-col gap-1.5 flex-1 ${isLeft ? "items-start" : "items-end"}`}>
      {/* Meta Label Info */}
      <div className={`flex items-center gap-2 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-stone-600">
          {isYou ? "YOU" : "ENEMY"}
        </span>
        <span className="font-bold text-white text-sm truncate max-w-[130px] tracking-wide">
          {username}
        </span>
        <span className="font-mono text-xs font-semibold" style={{ color: colors.text }}>
          {hp}/{effectiveMax}
        </span>
      </div>

      {/* Outer Juice Container */}
      <div
        className="w-full h-2.5 relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Inner Filled Color Bar */}
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${pct}%`,
            background: colors.fill,
            boxShadow: `0 0 10px ${colors.glow}`,
            float: isLeft ? "left" : "right"
          }}
        />
      </div>
    </div>
  );
}