import React from "react";

const MOVE_DATA = {
  rock:     { label: "Iron Fist",     emoji: "✊", color: "#ef4444" },
  paper:    { label: "Open Palm",     emoji: "✋", color: "#60a5fa" },
  scissors: { label: "Shadow Blades", emoji: "✌️", color: "#a78bfa" },
  none:     { label: "Void",          emoji: "❌", color: "#6b7280" },
};

export default function AIPanel({ aiName, aiCharacter, phase, aiMove }) {
  const showMove = phase === "result" && aiMove;
  const md = MOVE_DATA[aiMove] ?? MOVE_DATA.none;

  // Reduced the dark overlay opacity from (0.85, 0.95) to (0.35, 0.65) to reveal the character art clearly
  const panelBackgroundStyle = aiCharacter?.image
    ? {
        backgroundImage: `linear-gradient(to bottom, rgba(3, 3, 5, 0.35), rgba(10, 5, 8, 0.65)), url(${aiCharacter.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: "rgba(3, 3, 5, 0.4)",
      };

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-600">
          {aiName || "Shadow AI"}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-[10px] font-mono text-stone-600 uppercase tracking-widest">AI</span>
        </div>
      </div>

      {/* Panel body with character full background */}
      <div
        className="flex-1 ink-panel spirit-border rounded scanline-overlay relative flex flex-col items-center justify-center p-4 overflow-hidden"
        style={panelBackgroundStyle}
      >
        <div className="w-full max-w-[180px] z-10 flex flex-col items-center justify-center flex-1">
          {showMove ? (
            <div
              className="w-full rounded p-4 text-center transition-all duration-400"
              style={{
                background: "rgba(0,0,0,0.65)",
                border: `1px solid ${md.color}40`,
                boxShadow: `0 0 16px ${md.color}15`,
                backdropFilter: "blur(4px)",
              }}
            >
              <div className="text-4xl mb-1">{md.emoji}</div>
              <p className="text-xs font-mono font-medium uppercase tracking-wider" style={{ color: md.color }}>
                {md.label}
              </p>
            </div>
          ) : (
            <div
              className="w-full rounded p-4 text-center"
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(2px)",
              }}
            >
              {phase === "countdown" && (
                <>
                  <div className="text-2xl mb-1 animate-breathe">🤲</div>
                  <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Channeling…</p>
                </>
              )}
              {phase === "grace" && (
                <>
                  <div className="text-2xl mb-1">⚙️</div>
                  <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Computing move…</p>
                </>
              )}
              {(phase === "idle" || !phase) && (
                <>
                  <div className="text-2xl mb-1 opacity-20">👁</div>
                  <p className="text-[9px] font-mono text-stone-600 uppercase tracking-widest">Awaiting Round…</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}