import React from "react";

const MOVE_DATA = {
  rock:     { kanji: "拳", label: "IRON FIST",       color: "#ef4444" },
  paper:    { kanji: "掌", label: "OPEN PALM",       color: "#60a5fa" },
  scissors: { kanji: "剪", label: "SHADOW BLADES",   color: "#a78bfa" },
  none:     { kanji: "無", label: "VOID",             color: "#6b7280" },
};

export default function OpponentPanel({ opponentUsername, phase, opponentMove, roundResult }) {
  const showMove = roundResult && opponentMove;
  const moveData = MOVE_DATA[opponentMove] || MOVE_DATA.none;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Label row */}
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-stone-600">Opponent</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-spirit-400 animate-pulse" />
          <span className="font-mono text-[9px] text-stone-600 uppercase tracking-widest">Online</span>
        </div>
      </div>

      {/* Panel body */}
      <div className="flex-1 ink-panel spirit-border rounded-sm flex flex-col items-center justify-center gap-6 p-6 scanline-overlay relative">

        {/* Corner marks */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-spirit-500/30" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-spirit-500/30" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-spirit-500/30" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-spirit-500/30" />

        {/* Avatar hex */}
        <div className="relative">
          <div className="w-20 h-20 rounded-sm flex items-center justify-center font-cinzel font-black text-3xl text-stone-200"
            style={{
              background: "linear-gradient(135deg, #0a0a1a 0%, #141428 100%)",
              border: "1px solid rgba(96,144,221,0.3)",
              boxShadow: "0 0 20px rgba(96,144,221,0.1)",
            }}>
            {opponentUsername ? opponentUsername[0].toUpperCase() : "?"}
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-spirit-500/50 to-transparent" />
        </div>

        {/* Name */}
        <div className="text-center">
          <p className="font-cinzel font-bold text-stone-200 text-sm tracking-widest uppercase">
            {opponentUsername || "???"}
          </p>
          <p className="font-mono text-[9px] tracking-[0.2em] text-stone-600 mt-0.5 uppercase">Shadow Fighter</p>
        </div>

        {/* Status / move reveal */}
        <div className="w-full">
          {showMove ? (
            <div className="rounded-sm p-4 text-center"
              style={{
                background: "rgba(0,0,0,0.4)",
                border: `1px solid ${moveData.color}40`,
                boxShadow: `0 0 20px ${moveData.color}15`,
              }}>
              <div className="font-cinzel text-5xl font-black mb-1" style={{ color: moveData.color }}>
                {moveData.kanji}
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: moveData.color }}>
                {moveData.label}
              </p>
            </div>
          ) : (
            <div className="rounded-sm p-4 text-center"
              style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}>
              {phase === "countdown" ? (
                <>
                  <div className="font-cinzel text-2xl text-stone-400 mb-1 animate-breathe">🤲</div>
                  <p className="font-mono text-[9px] text-stone-600 uppercase tracking-widest">Channeling chi…</p>
                </>
              ) : phase === "grace" ? (
                <>
                  <div className="font-cinzel text-2xl text-blood-500 mb-1">⏳</div>
                  <p className="font-mono text-[9px] text-stone-600 uppercase tracking-widest">Sealing move…</p>
                </>
              ) : (
                <>
                  <div className="text-2xl mb-1 opacity-20">👁</div>
                  <p className="font-mono text-[9px] text-stone-700 uppercase tracking-widest">Awaiting battle…</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
