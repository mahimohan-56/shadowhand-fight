import React, { useState } from "react";

const EMBER_COUNT = 20;
function Embers({ count = EMBER_COUNT }) {
  const embers = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 25}%`,
    delay: `${Math.random() * 6}s`,
    duration: `${3 + Math.random() * 5}s`,
    color: Math.random() > 0.4 ? "#ff8c00" : "#e02020",
  }));
  return (
    <>
      {embers.map(e => (
        <span key={e.id} className="ember" style={{
          left: e.left, bottom: e.bottom,
          animationDelay: e.delay, animationDuration: e.duration,
          background: e.color,
        }} />
      ))}
    </>
  );
}

/* Shared form content used by both the desktop Switch screen and the
   mobile card, so behavior/markup never drifts between the two layouts. */
function LobbyForm({ username, setUsername, touched, setTouched, isValid, connError, onSubmit, compact }) {
  return (
    <div className={compact ? "w-full max-w-sm" : "w-full max-w-[320px]"}>
      {connError && (
        <div className="mb-4 px-3 py-2 rounded bg-red-900/40 border border-red-700/40 text-red-400 text-xs font-mono text-center">
          ⚠ {connError}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Enter your Fighter Name"
            maxLength={20}
            className="w-full px-4 py-3 rounded bg-black/60 text-white placeholder-stone-600 text-base text-center border outline-none transition-all duration-200 focus:bg-black/80 focus:border-red-500/40"
            style={{ border: touched && !isValid ? "1px solid rgba(224,32,32,0.6)" : "1px solid rgba(255,255,255,0.08)" }}
          />
          {touched && !isValid && (
            <p className="text-red-400 text-xs text-center mt-2 font-mono">At least 2 chars required</p>
          )}
        </div>

        <button
          type="submit"
          className="group relative overflow-hidden w-full py-3.5 rounded font-black text-sm text-white uppercase tracking-[0.15em] border border-red-500/20 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #b00000, #7a0000)",
            boxShadow: "0 0 20px rgba(224,32,32,0.25)"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
          <span className="relative z-10">Enter Battle ⚔</span>
        </button>
      </form>

      <div className="border-t border-white/5 mt-6 pt-4 flex justify-between px-3 text-center">
        {[["✊", "Rock"], ["✋", "Paper"], ["✌️", "Scissors"]].map(([icon, name]) => (
          <div key={name} className="flex flex-col items-center group">
            <span className="text-2xl transition-transform group-hover:scale-110">{icon}</span>
            <span className="text-[10px] font-mono uppercase text-stone-500 tracking-widest mt-1.5">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Lobby({ onStart, connError }) {
  const [username, setUsername] = useState("");
  const [touched,  setTouched]  = useState(false);
  const isValid = username.trim().length >= 2;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) { setTouched(true); return; }
    onStart(username.trim());
  }

  const formProps = { username, setUsername, touched, setTouched, isValid, connError, onSubmit: handleSubmit };

  return (
    <div
      className="flex items-center justify-center min-h-[100dvh] p-3 sm:p-8 select-none relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 90% 70% at 50% 85%, #1a0505 0%, #030305 70%)" }}
    >
      <Embers />

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP / TABLET (md and up) — full cinematic Nintendo Switch
          shell, unchanged from the original design.
          Hidden entirely below the md breakpoint so it never tries to
          squeeze its fixed 1160px width into a phone viewport. */}
      <div className="hidden md:flex items-stretch w-[1160px] h-[484px] drop-shadow-[0_0_80px_rgba(0,0,0,0.95)] relative z-10">

        {/* LEFT JOY-CON */}
        <div
          className="relative w-[156px] h-[484px] rounded-l-[100px] rounded-r-[10px] flex flex-col items-center"
          style={{
            background: "linear-gradient(148deg, rgba(0, 186, 219, 1) 0%, rgba(0, 185, 220, 1) 100%)",
            boxShadow: "inset 6px -8px 18px #058ca5, inset 0px 8px 6px #6ad9ed"
          }}
        >
          <div className="absolute top-[44px] right-[18px] w-[24px] h-[6px] border border-[#222] rounded-[1px] bg-[#3c3d41]" />
          <div className="absolute top-[84px] left-1/2 -translate-x-1/2 w-[68px] h-[68px] bg-[#2d2e33] border border-[#2d2e33] rounded-full overflow-hidden grid grid-cols-2 grid-rows-2 gap-[1px] shadow-lg">
            <div className="bg-[#444]" /><div className="bg-[#444]" /><div className="bg-[#444]" /><div className="bg-[#444]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2d2e33] p-[1px] z-10 rounded-full flex items-center justify-center">
              <div className="w-[54px] h-[54px] rounded-full bg-[#282c2f]" style={{ boxShadow: "inset 0px -7px 7px rgb(49, 49, 49), inset 0px 7px 20px rgb(124, 124, 124), inset 0px 7px 12px rgb(0, 0, 0)" }} />
            </div>
          </div>
          <div className="absolute top-[206px] left-1/2 -translate-x-1/2 w-[92px] h-[92px] flex flex-col items-center justify-center text-[#1b1b1c] text-[18px] font-bold">
            <div><div className="w-[30px] h-[30px] bg-[#505050] rounded-full border border-[#2d2e33] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#585858] active:bg-[#404040]">▲</div></div>
            <div className="flex gap-[32px] my-[-2px]">
              <div className="w-[30px] h-[30px] bg-[#505050] rounded-full border border-[#2d2e33] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#585858] active:bg-[#404040]">◀</div>
              <div className="w-[30px] h-[30px] bg-[#505050] rounded-full border border-[#2d2e33] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#585858] active:bg-[#404040]">▶</div>
            </div>
            <div><div className="w-[30px] h-[30px] bg-[#505050] rounded-full border border-[#2d2e33] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#585858] active:bg-[#404040]">▼</div></div>
          </div>
          <div className="absolute bottom-[66px] right-[30px] w-[24px] h-[24px] border border-[#2d2e33] rounded-[4px] bg-gradient-to-br from-[#605f65] to-[#3c3d41] flex items-center justify-center cursor-pointer shadow-sm">
            <div className="w-[10px] h-[10px] bg-gradient-to-br from-[#605f65] to-[#3c3d41] border border-[#2d2e33] rounded-full" />
          </div>
        </div>

        {/* CENTER SCREEN OUTLINE */}
        <div
          className="flex-1 flex p-[24px] px-[32px] rounded-[6px]"
          style={{ background: "linear-gradient(180deg, rgba(71,77,79,1) 0%, rgba(90,97,100,1) 3%, rgba(46,50,51,1) 5%, rgba(46,50,51,1) 100%)" }}
        >
          <div className="flex-1 border-t-[26px] border-b-[26px] border-l-[44px] border-r-[44px] border-black rounded-[12px] bg-black flex overflow-hidden">
            <div
              className="flex-1 relative flex flex-col items-center justify-center overflow-hidden py-6"
              style={{ background: "radial-gradient(ellipse 90% 70% at 50% 85%, #1a0505 0%, #030305 70%)" }}
            >
              <Embers count={14} />

              <div className="mb-5 text-center select-none flex flex-col items-center">
                <div className="text-4xl mb-1.5" style={{ filter: "drop-shadow(0 0 14px rgba(224,32,32,0.55))" }}>🥷</div>
                <h1 className="text-4xl font-black tracking-tight text-white uppercase" style={{ textShadow: "0 0 16px rgba(224,32,32,0.6)" }}>
                  ShadowHand
                </h1>
                <span className="text-[10px] font-mono text-red-600 uppercase tracking-[0.45em] font-bold mt-1">Hand Gesture Combat</span>
              </div>

              <LobbyForm {...formProps} compact={false} />
            </div>
          </div>
        </div>

        {/* RIGHT JOY-CON */}
        <div
          className="relative w-[156px] h-[484px] rounded-r-[100px] rounded-l-[10px] flex flex-col items-center"
          style={{
            background: "linear-gradient(148deg, rgba(250, 97, 93, 1) 0%, rgba(239, 79, 77, 1) 100%)",
            boxShadow: "inset -6px -8px 18px #d12621, inset 0px 8px 6px #fd877c"
          }}
        >
          <div className="absolute top-[40px] left-[18px] w-[20px] h-[20px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#333] w-[6px] h-[20px] rounded-[1px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#333] w-[20px] h-[6px] rounded-[1px]" />
          </div>
          <div className="absolute top-[84px] left-1/2 -translate-x-1/2 w-[92px] h-[92px] flex flex-col items-center justify-center text-[#d7d7d7] text-[14px] font-bold">
            <div><div className="w-[30px] h-[30px] bg-[#505050] rounded-full border border-[#2d2e33] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#585858] active:bg-[#404040]">X</div></div>
            <div className="flex gap-[32px] my-[-2px]">
              <div className="w-[30px] h-[30px] bg-[#505050] rounded-full border border-[#2d2e33] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#585858] active:bg-[#404040]">Y</div>
              <div className="w-[30px] h-[30px] bg-[#505050] rounded-full border border-[#2d2e33] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#585858] active:bg-[#404040]">A</div>
            </div>
            <div><div className="w-[30px] h-[30px] bg-[#505050] rounded-full border border-[#2d2e33] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#585858] active:bg-[#404040]">B</div></div>
          </div>
          <div className="absolute top-[220px] left-1/2 -translate-x-1/2 w-[68px] h-[68px] bg-[#2d2e33] border border-[#2d2e33] rounded-full overflow-hidden grid grid-cols-2 grid-rows-2 gap-[1px] shadow-lg filter contrast-[130%]">
            <div className="bg-[#444]" /><div className="bg-[#444]" /><div className="bg-[#444]" /><div className="bg-[#444]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2d2e33] p-[1px] z-10 rounded-full flex items-center justify-center">
              <div className="w-[54px] h-[54px] rounded-full bg-[#282c2f]" style={{ boxShadow: "inset 0px -7px 7px rgb(49, 49, 49), inset 0px 7px 20px rgb(124, 124, 124), inset 0px 7px 12px rgb(0, 0, 0)" }} />
            </div>
          </div>
          <div className="absolute bottom-[60px] left-[30px] cursor-pointer border border-[#1b1b1c] bg-gradient-to-br from-[#a0a0a0] to-[#303030] h-[32px] w-[32px] p-[1px] rounded-full flex items-center justify-center shadow-md">
            <div className="w-[26px] h-[26px] border border-[#1b1b1c] bg-gradient-to-b from-[#6b6b6b] to-[#303030] rounded-full flex items-center justify-center text-black text-[14px] font-bold">⌂</div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE (below md) — simplified, full-width card.
          Keeps the same ninja/blood-red identity (logo, glow, color
          palette, gesture cheat sheet) but drops the Switch shell
          entirely since joy-cons at any sane scale either get
          illegibly tiny or force horizontal scrolling on a phone. */}
      <div className="flex md:hidden flex-col items-center w-full max-w-sm relative z-10">
        <div className="mb-6 text-center select-none flex flex-col items-center">
          <div className="text-5xl mb-2" style={{ filter: "drop-shadow(0 0 14px rgba(224,32,32,0.55))" }}>🥷</div>
          <h1 className="text-3xl xs:text-4xl font-black tracking-tight text-white uppercase" style={{ textShadow: "0 0 16px rgba(224,32,32,0.6)" }}>
            ShadowHand
          </h1>
          <span className="text-[9px] font-mono text-red-600 uppercase tracking-[0.35em] font-bold mt-1.5">
            Hand Gesture Combat
          </span>
        </div>

        <div
          className="w-full rounded-xl p-5 sm:p-6"
          style={{
            background: "rgba(10,5,8,0.7)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 0 40px rgba(224,32,32,0.08)",
          }}
        >
          <LobbyForm {...formProps} compact={true} />
        </div>

        <p className="mt-5 text-[9px] font-mono text-white-700 uppercase tracking-[0.25em] text-center px-4">
          📷 Camera required · Use a well-lit space for best gesture tracking
        </p>
      </div>
    </div>
  );
}