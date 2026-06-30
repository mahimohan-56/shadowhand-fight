import React, { useEffect, useState } from "react";

const MOVE_DATA = {
  rock:     { label: "Iron Fist",     emoji: "✊", color: "#ef4444", glow: "rgba(239,68,68,0.5)" },
  paper:    { label: "Open Palm",     emoji: "✋", color: "#60a5fa", glow: "rgba(96,165,250,0.5)" },
  scissors: { label: "Shadow Blades", emoji: "✌️", color: "#a78bfa", glow: "rgba(167,139,250,0.5)" },
  none:     { label: "Void",          emoji: "❌", color: "#6b7280", glow: "rgba(107,114,128,0.3)" },
};

export default function RevealOverlay({ playerMove, aiMove, roundWinner, damage, playerUsername, aiCharacter, aiName }) {
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

  let bannerText = "DRAW";
  let bannerColor = "rgba(168,162,158,0.92)";
  let bannerBorder = "rgba(168,162,158,0.3)";

  if (roundWinner === "player") {
    bannerText = "ROUND WON";
    bannerColor = "rgba(22,101,52,0.95)";
    bannerBorder = "rgba(74,222,128,0.4)";
  } else if (roundWinner === "ai") {
    bannerText = "ROUND LOST";
    bannerColor = "rgba(127,29,29,0.95)";
    bannerBorder = "rgba(239,68,68,0.4)";
  }

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 transition-all duration-500"
      style={{
        background: step >= 1 ? "rgba(3,3,5,0.85)" : "rgba(3,3,5,0)",
        backdropFilter: step >= 1 ? "blur(8px)" : "blur(0px)",
      }}
    >
      {/* Upper banner text area */}
      <div
        className="w-full max-w-md text-center py-2.5 sm:py-3 rounded mb-4 border transition-all duration-500"
        style={{
          background: bannerColor,
          borderColor: bannerBorder,
          transform: step >= 1 ? "scale(1) translateY(0)" : "scale(0.9) translateY(-15px)",
          opacity: step >= 1 ? 1 : 0,
          boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
        }}
      >
        <h2 className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase leading-none">
          {bannerText}
        </h2>
        {damage > 0 && step >= 2 && (
          <p className="text-[10px] font-mono tracking-[0.25em] text-stone-200 mt-1 uppercase animate-pulse">
            💥 dealt {damage} damage 💥
          </p>
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
          boxShadow: `0 0 30px ${move.glow}, inset 0 0 16px ${move.glow}10`,
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