import React from "react";
import HPBar from "./HPBar.jsx";
import WebcamPanel from "./WebcamPanel.jsx";
import AIPanel from "./AIPanel.jsx";
import CountdownOverlay from "./CountdownOverlay.jsx";
import RevealOverlay from "./RevealOverlay.jsx";

export default function GameBoard({ gameState, gestureRef }) {
  const {
    playerUsername, aiName, aiCharacter,
    playerHp, aiHp,
    round, countdown, phase,
    playerMove, aiMove, roundWinner, damage,
  } = gameState;

  const showReveal = phase === "result" && playerMove && aiMove;

  return (
    <div
      className="flex flex-col h-[100dvh] w-screen overflow-hidden relative"
      style={{ background: "radial-gradient(ellipse 120% 80% at 50% 0%, #0d0008 0%, #030305 55%)" }}
    >
      {/* Ambient glow top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[180px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(176,0,0,0.06) 0%, transparent 70%)" }}
      />

      {/* ── Header: HP bars ── */}
      <header className="ink-panel border-b border-white/5 px-2.5 sm:px-5 py-2 sm:py-3 flex items-center gap-2 sm:gap-5 z-10 relative shrink-0">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-red-700/50 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-blue-600/35 to-transparent" />

        <HPBar username={playerUsername || "You"} hp={playerHp} side="left" isYou />

        {/* Center Control Badge (Round display) */}
        <div className="flex flex-col items-center shrink-0 px-1.5 sm:px-3 min-w-[64px] sm:min-w-[90px]">
          <span className="text-[6px] sm:text-[8px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-stone-700 leading-none">Round</span>
          <span className="text-lg sm:text-2xl font-black text-white leading-none mt-0.5">{round}</span>
          <div className="mt-0.5">
            {phase === "countdown" && <div className="w-1 h-1 rounded-full bg-red-500 animate-ping" />}
            {phase === "grace"     && <div className="w-1 h-1 rounded-full bg-red-400 animate-ping" />}
            {(phase === "idle" || phase === "result") && <div className="w-1 h-1 rounded-full bg-stone-700" />}
          </div>
        </div>

        <HPBar username={aiCharacter?.name ?? aiName ?? "Shadow AI"} hp={aiHp} side="right" isYou={false} />
      </header>

      {/* ── Game area ── */}
      <main className="flex-1 flex flex-col md:flex-row gap-2 sm:gap-3 p-2 sm:p-3 min-h-0 relative overflow-hidden">

        {/* Player webcam */}
        <div className="flex-1 min-h-0 min-w-0 h-full flex flex-col">
          <WebcamPanel gestureRef={gestureRef} phase={phase} />
        </div>

        {/* Center VS + countdown */}
        <div className="relative flex md:flex-col items-center justify-center w-full h-10 md:w-20 md:h-auto shrink-0">
          <div
            className="absolute md:inset-y-0 md:left-1/2 md:-translate-x-1/2 md:w-px md:h-auto inset-x-0 top-1/2 -translate-y-1/2 h-px w-auto"
            style={{
              background: "linear-gradient(to right,transparent,rgba(176,0,0,0.25) 30%,rgba(176,0,0,0.25) 70%,transparent)",
            }}
          />
          <div
            className="relative z-10 flex items-center justify-center w-10 h-10 rounded font-bold text-xs text-stone-500 tracking-widest"
            style={{ background: "rgba(3,3,5,0.92)", border: "1px solid rgba(176,0,0,0.2)" }}
          >
            VS
          </div>
          {!showReveal && <CountdownOverlay countdown={countdown} phase={phase} />}
        </div>

        {/* AI panel */}
        <div className="flex-1 min-w-0">
          <AIPanel aiName={aiName} aiCharacter={aiCharacter} phase={phase} aiMove={aiMove} />
        </div>

        {/* Reveal overlay */}
        {showReveal && (
          <RevealOverlay
            playerMove={playerMove}
            aiMove={aiMove}
            roundWinner={roundWinner}
            damage={damage}
            playerUsername={playerUsername}
            aiCharacter={aiCharacter}
            aiName={aiName}
          />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="ink-panel border-t border-white/5 px-2.5 sm:px-5 py-1.5 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-0 z-10 shrink-0">
  <span className="hidden sm:inline text-[10px] font-mono text-stone-600 tracking-[0.2em] uppercase text-center">
    ShadowHand Fight
  </span>
</footer>
    </div>
  );
}