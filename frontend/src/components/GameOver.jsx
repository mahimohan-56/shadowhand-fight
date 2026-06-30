import React, { useEffect, useState } from "react";

export default function GameOver({ winner, playerUsername, aiCharacter, onPlayAgain }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t); }, []);

  const playerWon = winner === "player";
  const color     = playerWon ? "#4ade80" : "#ef4444";
  const aiName    = aiCharacter?.name ?? "Shadow AI";

  // 勝利 (shōri) = Victory   /   敗北 (haiboku) = Defeat
  const kanji = playerWon ? "勝利" : "敗北";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(3,3,5,0.92)", backdropFilter: "blur(10px)" }}
    >
      <div
        className={`relative max-w-sm w-full rounded transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        style={{
          background: "linear-gradient(160deg,#0a0a12,#070710)",
          border: `1px solid ${color}28`,
          boxShadow: `0 0 60px ${color}08, 0 30px 60px rgba(0,0,0,0.95)`,
        }}
      >
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg,transparent,${color}70,transparent)` }} />

        <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-4 sm:gap-5">
          {aiCharacter && (
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden"
              style={{
                border: `2px solid ${color}40`,
                boxShadow: `0 0 30px ${color}15`,
                filter: playerWon ? "grayscale(0.3)" : "none",
              }}
            >
              <img src={aiCharacter.image} alt={aiCharacter.name} className="w-full h-full object-cover object-top" />
            </div>
          )}

          <div>
            
            <p
              className="font-black tracking-tight leading-none"
              style={{ color, fontSize: "clamp(3rem, 12vw, 4.5rem)", textShadow: `0 0 30px ${color}50` }}
            >
              {kanji}
            </p>
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] mt-1.5" style={{ color }}>
              {playerWon ? "Victory" : "Defeated"}
            </p>
            <p className="text-xs sm:text-sm text-stone-500 font-mono mt-2 tracking-wider">
              {playerWon
                ? `${playerUsername} defeated ${aiName}`
                : `${aiName} was victorious`}
            </p>
          </div>

          <button
            onClick={onPlayAgain}
            className="w-full py-3 sm:py-3.5 rounded font-bold text-xs sm:text-sm text-white uppercase tracking-[0.15em] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg,${color}35,${color}18)`,
              border: `1px solid ${color}45`,
            }}
          >
            ⚔ {playerWon ? "Fight Again" : "Seek Redemption"}
          </button>
        </div>

        <div className="h-px w-full" style={{ background: `linear-gradient(90deg,transparent,${color}28,transparent)` }} />
      </div>
    </div>
  );
}