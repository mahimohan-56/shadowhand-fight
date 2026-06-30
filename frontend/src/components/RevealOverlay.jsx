import React, { useEffect, useState } from "react";

const MOVE_DATA = {
  rock:     { label: "Iron Fist",     emoji: "✊", color: "#ef4444", glow: "rgba(239,68,68,0.5)" },
  paper:    { label: "Open Palm",     emoji: "✋", color: "#60a5fa", glow: "rgba(96,165,250,0.5)" },
  scissors: { label: "Shadow Blades", emoji: "✌️", color: "#a78bfa", glow: "rgba(167,139,250,0.5)" },
  none:     { label: "Void",          emoji: "❌", color: "#6b7280", glow: "rgba(107,114,128,0.3)" },
};

export default function RevealOverlay({ playerMove, aiMove, roundWinner, damage, playerUsername, aiCharacter, aiName, phase, onNextRound }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 100);
    const t2 = setTimeout(() => setStep(2), 550);
    const t3 = setTimeout(() => setStep(3), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [playerMove, aiMove, roundWinner]);

  const pm = MOVE_DATA[playerMove] ?? MOVE_DATA.none;
  const am = MOVE_DATA[aiMove] ?? MOVE_DATA.none;

  // Minimalist result config
  const result = roundWinner === "player"
    ? { label: "VICTORY",  sub: "ROUND COMPLETE", accentColor: "#4ade80", accentRgb: "74,222,128" }
    : roundWinner === "ai"
    ? { label: "DEFEATED", sub: "ROUND COMPLETE", accentColor: "#ef4444", accentRgb: "239,68,68" }
    : { label: "DRAW",     sub: "NO DAMAGE",      accentColor: "#78716c", accentRgb: "120,113,108" };

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4"
      style={{
        background: step >= 1 ? "rgba(3,3,5,0.92)" : "rgba(3,3,5,0)",
        transition: "background 0.35s ease",
      }}
    >
      {/* ── Minimal result header ── */}
      <div
        className="w-full max-w-md mb-5 transition-all duration-500 flex flex-col items-center gap-1"
        style={{
          transform: step >= 1 ? "translateY(0)" : "translateY(-12px)",
          opacity: step >= 1 ? 1 : 0,
        }}
      >
        {/* Thin accent bar above */}
        <div
          className="w-12 h-px mb-2"
          style={{ background: result.accentColor, boxShadow: `0 0 8px rgba(${result.accentRgb},0.8)` }}
        />

        {/* Main result word */}
        <h2
          className="text-2xl sm:text-3xl font-black tracking-[0.2em] uppercase leading-none"
          style={{ color: result.accentColor, textShadow: `0 0 20px rgba(${result.accentRgb},0.4)` }}
        >
          {result.label}
        </h2>

        {/* Sub-label */}
        <p className="text-[9px] font-mono tracking-[0.35em] uppercase text-stone-600 mt-0.5">
          {result.sub}
        </p>

        {/* Damage chip — appears on step 2 */}
        {damage > 0 && step >= 2 && (
          <div
            className="mt-2 px-3 py-0.5 text-[9px] font-mono uppercase tracking-[0.25em] transition-all duration-300"
            style={{
              color: result.accentColor,
              border: `1px solid rgba(${result.accentRgb},0.3)`,
              background: `rgba(${result.accentRgb},0.06)`,
            }}
          >
            − {damage} hp
          </div>
        )}
      </div>

      {/* Duel grid matching card container sizes */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 items-stretch">
        {/* PLAYER SIDE */}
        <MoveColumn
          show={step >= 1}
          side="left"
          name={playerUsername || "You"}
          move={pm}
          showTag={step >= 2}
          tag={roundWinner === "player" ? "HIT" : roundWinner === "ai" ? "HIT BY" : "TIE"}
          tagColor={roundWinner === "player" ? "#4ade80" : roundWinner === "ai" ? "#ef4444" : "#a8a29e"}
        />

        {/* AI SIDE */}
        <MoveColumn
          show={step >= 1}
          side="right"
          name={aiName || "AI"}
          move={am}
          showTag={step >= 2}
          tag={roundWinner === "ai" ? "HIT" : roundWinner === "player" ? "HIT BY" : "TIE"}
          tagColor={roundWinner === "ai" ? "#4ade80" : roundWinner === "player" ? "#ef4444" : "#a8a29e"}
          portrait={aiCharacter?.image}
          portraitAccent={aiCharacter?.accent}
        />
      </div>

      {/* Next Round button — only shown when server is waiting for player */}
      {phase === "waiting_next" && step >= 3 && (
        <button
          onClick={onNextRound}
          className="mt-5 px-8 py-3 rounded font-black uppercase tracking-widest text-sm text-white transition-all duration-200 active:scale-95"
          style={{
            background: "linear-gradient(135deg, rgba(176,0,0,0.9) 0%, rgba(220,38,38,0.85) 100%)",
            border: "1px solid rgba(239,68,68,0.5)",
            boxShadow: "0 0 24px rgba(176,0,0,0.5), 0 4px 16px rgba(0,0,0,0.6)",
          }}
        >
          ⚔️ Next Round
        </button>
      )}
    </div>
  );
}

function MoveColumn({ show, side, name, move, showTag, tag, tagColor, portrait, portraitAccent }) {
  const isLeft = side === "left";

  return (
    <div
      className="flex flex-col gap-2 w-full transition-all duration-500 h-full"
      style={{
        opacity: show ? 1 : 0,
        transform: show
          ? "translateX(0) scale(1)"
          : `translateX(${isLeft ? "-25px" : "25px"}) scale(0.95)`,
        transitionTimingFunction: "cubic-bezier(0.34,1.3,0.64,1)",
      }}
    >
      <span className={`text-[9px] font-mono uppercase tracking-[0.3em] text-stone-500 ${isLeft ? "" : "text-right"}`}>
        {name}
      </span>

      {/* Changed class attributes here to flex-1 min-h-[225px] to match the sizes */}
      <div
        className="w-full rounded p-5 flex flex-col items-center gap-3 relative overflow-hidden flex-1 min-h-[225px]"
        style={{
          background: "rgba(6,6,14,0.85)",
          border: `1px solid ${move.color}55`,
        }}
      >
        {/* WIN/LOSS tag */}
        {showTag && (
          <div
            className="absolute top-2 right-2 text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: `${tagColor}18`, color: tagColor, border: `1px solid ${tagColor}40` }}
          >
            {tag}
          </div>
        )}

        {/* Portrait if AI */}
        {portrait && (
          <div
            className="w-16 h-16 rounded overflow-hidden shrink-0"
            style={{ border: `1px solid ${portraitAccent ?? move.color}50` }}
          >
            <img src={portrait} alt={name} className="w-full h-full object-cover object-top" />
          </div>
        )}

        {/* Move emoji & text layout block */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-4xl sm:text-5xl my-1 drop-shadow-lg animate-breathe">
            {move.emoji}
          </div>
          <p className="text-xs font-mono font-medium uppercase tracking-wider text-center" style={{ color: move.color }}>
            {move.label}
          </p>
        </div>
      </div>
    </div>
  );
}