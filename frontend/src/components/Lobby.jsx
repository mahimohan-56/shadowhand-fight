import React, { useState, useEffect, useRef } from "react";

/*Particle rain (replaces embers)*/
function Particles({ count = 24, inside = false }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 8}s`,
    size: Math.random() > 0.6 ? 2 : 1,
    opacity: 0.12 + Math.random() * 0.22,
  }));
  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: "-4px",
            width: p.size,
            height: inside
              ? `${6 + Math.random() * 10}px`
              : `${10 + Math.random() * 20}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
            background: Math.random() > 0.5 ? "#e30613" : "#a3050f",
            position: "absolute",
            borderRadius: "1px",
          }}
        />
      ))}
    </>
  );
}

/*Scan-line overlay*/
function ScanLines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.09) 2px, rgba(0,0,0,0.09) 3px)",
      }}
    />
  );
}

/*Corner bracket decoration*/
function CornerBrackets({
  color = "rgba(227,6,19,1)",
  size = 14,
  thickness = 2,
}) {
  const s = { position: "absolute", width: size, height: size, [Symbol()]: "" };
  const line = { background: color };
  const corners = [
    {
      top: 0,
      left: 0,
      borderTop: `${thickness}px solid ${color}`,
      borderLeft: `${thickness}px solid ${color}`,
    },
    {
      top: 0,
      right: 0,
      borderTop: `${thickness}px solid ${color}`,
      borderRight: `${thickness}px solid ${color}`,
    },
    {
      bottom: 0,
      left: 0,
      borderBottom: `${thickness}px solid ${color}`,
      borderLeft: `${thickness}px solid ${color}`,
    },
    {
      bottom: 0,
      right: 0,
      borderBottom: `${thickness}px solid ${color}`,
      borderRight: `${thickness}px solid ${color}`,
    },
  ];
  return (
    <>
      {corners.map((style, i) => (
        <div
          key={i}
          style={{ position: "absolute", width: size, height: size, ...style }}
        />
      ))}
    </>
  );
}

/*"Enter battle sumbit button*/
function EnterBattleButton() {
  return (
    <button
      type="submit"
      aria-label="Enter Battle"
      className="battle-btn group relative w-full cursor-pointer border-none bg-transparent p-0 outline-none select-none transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#ff4040] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{
        aspectRatio: "530 / 176",
        maxWidth: "88%",
        margin: "0 auto",
        filter:
          "drop-shadow(0 10px 20px rgba(0,0,0,0.85)) drop-shadow(0 0 0 rgba(0,0,0,0))",
      }}
    >
      <svg
        viewBox="0 0 530 180"
        className="w-full h-full block overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blackened bronze outer rim */}
          <linearGradient id="ebbRimOuter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3a1e" />
            <stop offset="12%" stopColor="#26200f" />
            <stop offset="50%" stopColor="#100c07" />
            <stop offset="85%" stopColor="#26200f" />
            <stop offset="100%" stopColor="#4a3a1e" />
          </linearGradient>
          {/* Bronze inner bevel ridge */}
          <linearGradient id="ebbRidge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a7038" />
            <stop offset="25%" stopColor="#3a3018" />
            <stop offset="75%" stopColor="#13100a" />
            <stop offset="100%" stopColor="#6a5626" />
          </linearGradient>
          {/* Blood-garnet plates */}
          <linearGradient id="ebbPlateTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c0a0a" />
            <stop offset="35%" stopColor="#4c1010" />
            <stop offset="70%" stopColor="#5e1616" />
            <stop offset="100%" stopColor="#210707" />
          </linearGradient>
          <linearGradient id="ebbPlateBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f0505" />
            <stop offset="25%" stopColor="#4c0e0e" />
            <stop offset="65%" stopColor="#6e1919" />
            <stop offset="100%" stopColor="#1c0505" />
          </linearGradient>
          {/* End-cap metal */}
          <linearGradient id="ebbEndCap" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5a4826" />
            <stop offset="45%" stopColor="#2c2412" />
            <stop offset="80%" stopColor="#141008" />
            <stop offset="100%" stopColor="#4a3c1e" />
          </linearGradient>
          {/* Garnet gem gradient */}
          <radialGradient id="ebbGemMain" cx="35%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#ff9a8a" />
            <stop offset="20%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#7f1d1d" />
            <stop offset="85%" stopColor="#2a0a0a" />
            <stop offset="100%" stopColor="#150404" />
          </radialGradient>
          <radialGradient id="ebbGemSmall" cx="30%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#fecaca" />
            <stop offset="40%" stopColor="#b91c1c" />
            <stop offset="85%" stopColor="#3a0d0d" />
          </radialGradient>
          {/* Soft gold glow (blur + merge) */}
          <filter id="ebbGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="1.8" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ebbTextGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer chamfered boundary */}
        <polygon
          points="88,23 442,23 482,47 508,90 482,133 442,157 88,157 48,133 22,90 48,47"
          fill="url(#ebbRimOuter)"
          stroke="#0c0a06"
          strokeWidth="3"
        />
        <polygon
          points="90,26 440,26 478,49 504,90 478,131 440,154 90,154 52,131 26,90 52,49"
          fill="none"
          stroke="#e30613"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        {/* Middle chiseled band */}
        <polygon
          points="94,31 436,31 472,53 496,90 472,127 436,149 94,149 58,127 34,90 58,53"
          fill="url(#ebbRidge)"
          stroke="#080603"
          strokeWidth="3.5"
        />
        <polygon
          points="95,33 435,33 470,54 493,90 470,126 435,147 95,147 60,126 37,90 60,54"
          fill="none"
          stroke="#e8d090"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {/* Glowing gold inner border */}
        <polygon
          points="98,39 432,39 464,59 487,90 464,121 432,141 98,141 66,121 43,90 66,59"
          fill="#170707"
          filter="url(#ebbGoldGlow)"
          stroke="#e30613"
          strokeWidth="3.5"
        />
        <polygon
          points="98,39 432,39 464,59 487,90 464,121 432,141 98,141 66,121 43,90 66,59"
          fill="none"
          stroke="#f8ecc4"
          strokeOpacity="0.85"
          strokeWidth="1.2"
        />
        {/* Garnet plates */}
        <path
          d="M 100,41 L 430,41 L 460,59 L 480,90 L 440,90 L 420,91 L 110,91 L 90,90 L 50,90 L 70,59 Z"
          fill="url(#ebbPlateTop)"
        />
        <path
          d="M 50,90 L 90,90 L 110,91 L 420,91 L 440,90 L 480,90 L 460,121 L 430,139 L 100,139 L 70,121 Z"
          fill="url(#ebbPlateBottom)"
        />
        <line x1="50" y1="90" x2="480" y2="90" stroke="#100303" strokeWidth="3" />
        <line x1="50" y1="91.5" x2="480" y2="91.5" stroke="#e30613" strokeOpacity="0.4" strokeWidth="1.2" />
        <path d="M 104,45 L 126,90 L 104,135" fill="none" stroke="#2c0c0c" strokeWidth="3" />
        <path d="M 103,45 L 125,90 L 103,135" fill="none" stroke="#e30613" strokeOpacity="0.45" strokeWidth="1.5" />
        <path d="M 426,45 L 404,90 L 426,135" fill="none" stroke="#2c0c0c" strokeWidth="3" />
        <path d="M 427,45 L 405,90 L 427,135" fill="none" stroke="#e30613" strokeOpacity="0.45" strokeWidth="1.5" />

        {/* Ambient center glow */}
        <ellipse cx="265" cy="90" rx="150" ry="34" fill="#e30613" fillOpacity="0.18" filter="url(#ebbGoldGlow)" />

        {/* Left / right metal wing brackets */}
        <path
          d="M 22,90 L 52,47 L 76,50 C 70,68 62,80 50,90 C 62,100 70,112 76,130 L 52,133 Z"
          fill="url(#ebbEndCap)"
          stroke="#100c05"
          strokeWidth="2.5"
        />
        <path d="M 26,90 L 50,53 C 65,70 60,95 48,90" fill="none" stroke="#b09858" strokeOpacity="0.5" strokeWidth="1.2" />
        <path
          d="M 508,90 L 478,47 L 454,50 C 460,68 468,80 480,90 C 468,100 460,112 454,130 L 478,133 Z"
          fill="url(#ebbEndCap)"
          stroke="#100c05"
          strokeWidth="2.5"
        />
        <path d="M 504,90 L 480,53 C 465,70 470,95 482,90" fill="none" stroke="#b09858" strokeOpacity="0.5" strokeWidth="1.2" />

        {/* Corner mounts */}
        <path d="M 80,24 C 76,28 72,34 76,42 C 84,40 92,30 96,24 Z" fill="#2c2412" stroke="#0a0805" strokeWidth="1.5" />
        <path d="M 80,156 C 76,152 72,146 76,138 C 84,140 92,150 96,156 Z" fill="#2c2412" stroke="#0a0805" strokeWidth="1.5" />
        <path d="M 450,24 C 454,28 458,34 454,42 C 446,40 438,30 434,24 Z" fill="#2c2412" stroke="#0a0805" strokeWidth="1.5" />
        <path d="M 450,156 C 454,152 458,146 454,138 C 446,140 438,150 434,156 Z" fill="#2c2412" stroke="#0a0805" strokeWidth="1.5" />

        {/* Rivets */}
        <circle cx="210" cy="28" r="2" fill="#211b0e" stroke="#8a7440" strokeWidth="1" />
        <circle cx="320" cy="28" r="2" fill="#211b0e" stroke="#8a7440" strokeWidth="1" />
        <circle cx="210" cy="152" r="2" fill="#211b0e" stroke="#8a7440" strokeWidth="1" />
        <circle cx="320" cy="152" r="2" fill="#211b0e" stroke="#8a7440" strokeWidth="1" />

        {/* Twin garnet gems */}
        <circle cx="58" cy="90" r="16" fill="url(#ebbGemMain)" stroke="#1a0505" strokeWidth="1.5" />
        <ellipse cx="52" cy="83" rx="4" ry="6" fill="#ffffff" fillOpacity="0.7" transform="rotate(-25 52 83)" />
        <circle cx="472" cy="90" r="16" fill="url(#ebbGemMain)" stroke="#1a0505" strokeWidth="1.5" />
        <ellipse cx="466" cy="83" rx="4" ry="6" fill="#ffffff" fillOpacity="0.7" transform="rotate(-25 466 83)" />

        {/* Corner mini gems */}
        <circle cx="87" cy="29" r="5" fill="url(#ebbGemSmall)" stroke="#000" strokeOpacity="0.8" />
        <circle cx="87" cy="151" r="5" fill="url(#ebbGemSmall)" stroke="#000" strokeOpacity="0.8" />
        <circle cx="443" cy="29" r="5" fill="url(#ebbGemSmall)" stroke="#000" strokeOpacity="0.8" />
        <circle cx="443" cy="151" r="5" fill="url(#ebbGemSmall)" stroke="#000" strokeOpacity="0.8" />

        {/* Glowing gold typography */}
        <text
          x="265"
          y="93"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Bebas Neue', 'Arial Narrow', sans-serif"
          fontSize="46"
          letterSpacing="4"
          fill="#fbedc4"
          stroke="#2a0707"
          strokeWidth="1.5"
          paintOrder="stroke"
        >
          ENTER BATTLE
        </text>
      </svg>
    </button>
  );
}

/*Shared form*/
function LobbyForm({
  username,
  setUsername,
  touched,
  setTouched,
  isValid,
  connError,
  onSubmit,
  compact,
}) {
  return (
    <div className="w-full max-w-[300px]">
      {connError && (
        <div
          className="mb-4 px-3 py-2 text-xs font-mono text-center tracking-wider"
          style={{
            background: "rgba(180,30,30,0.18)",
            border: "1px solid rgba(180,30,30,0.4)",
            color: "#e07070",
          }}
        >
          ⚠ {connError}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        {/*Username input*/}
        <div className="relative" style={{ padding: "1px" }}>
          {/*Animated gold left bar*/}
          <div
            className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300"
            style={{
              background:
                touched && !isValid
                  ? "#c03030"
                  : isValid
                    ? "#e30613"
                    : "rgba(227,6,19,0.2)",
            }}
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="ENTER FIGHTER TAG"
            maxLength={20}
            className="w-full pl-5 pr-4 py-3 text-sm text-center font-mono tracking-[0.18em] outline-none transition-all duration-200"
            style={{
              background: "rgba(8,6,12,0.85)",
              color: "#e8dcc0",
              border: "none",
              borderBottom:
                touched && !isValid
                  ? "1px solid rgba(192,48,48,0.6)"
                  : "1px solid rgba(227,6,19,0.18)",
              borderTop: "1px solid rgba(227,6,19,0.07)",
              borderRight: "1px solid rgba(227,6,19,0.07)",
              caretColor: "#e30613",
              letterSpacing: "0.18em",
            }}
          />
          {touched && !isValid && (
            <p
              className="text-[10px] text-center mt-1.5 font-mono tracking-widest uppercase"
              style={{ color: "#c05050" }}
            >
              ▸ 2 characters minimum
            </p>
          )}
        </div>

        {/*Submit button*/}
        <EnterBattleButton />
      </form>

      {/* Gesture icons */}
      <div
        className="mt-5 pt-4 flex justify-between px-1 text-center"
        style={{ borderTop: "1px solid rgba(227,6,19,0.15)" }}
      >
        {[
          ["✊", "ObsidianFist"],
          ["✋", "SheetSlayer"],
          ["✌️", "TitaniumShear"],
        ].map(([icon, name]) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <span className="text-xl opacity-80 filter sepia-[0.4]">
              {icon}
            </span>
            <span
              className="text-[11px] font-semibold font-mono uppercase tracking-wider"
              style={{ color: "rgba(227,6,19,0.85)" }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* MAIN LOBBY*/
export default function Lobby({ onStart, connError }) {
  const [username, setUsername] = useState("");
  const [touched, setTouched] = useState(false);
  const isValid = username.trim().length >= 2;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      setTouched(true);
      return;
    }
    onStart(username.trim());
  }

  const formProps = {
    username,
    setUsername,
    touched,
    setTouched,
    isValid,
    connError,
    onSubmit: handleSubmit,
  };

  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');
        :root { color-scheme: dark; }

        body { margin: 0; }

        .particle {
          position: absolute;
          border-radius: 1px;
          animation: fall linear infinite;
        }
        @keyframes fall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(100vh) rotate(15deg); opacity: 0; }
        }

        /* scanline blink */
        @keyframes blink { 0%,100%{opacity:1} 49%{opacity:1} 50%{opacity:0.7} 51%{opacity:1} }

        /* subtle screen flicker */
        @keyframes flicker {
          0%,100%{ opacity:1 }
          92%    { opacity:1 }
          93%    { opacity:0.96 }
          94%    { opacity:1 }
          97%    { opacity:0.97 }
          98%    { opacity:1 }
        }
        .screen-flicker { animation: flicker 7s infinite; }

        /* title glitch shimmer */
        @keyframes titleShimmer {
          0%,100% { text-shadow: 0 0 24px rgba(227,6,19,0.5), 0 2px 4px rgba(0,0,0,0.95); }
          50%      { text-shadow: 0 0 36px rgba(227,6,19,0.75), 2px 0 0 rgba(200,80,80,0.15), -2px 0 0 rgba(50,100,200,0.1), 0 2px 4px rgba(0,0,0,0.95); }
        }
        .title-anim { animation: titleShimmer 4s ease-in-out infinite; }

        /* bar scan accent */
        @keyframes scanBar {
          0%   { top: -4px; opacity: 0; }
          5%   { opacity: 0.6; }
          95%  { opacity: 0.4; }
          100% { top: 102%; opacity: 0; }
        }
        .scan-bar {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(227,6,19,0.25) 30%, rgba(227,6,19,0.25) 70%, transparent);
          animation: scanBar 6s linear infinite;
        }

        /* status ticker */
        @keyframes ticker {
          from { transform: translateX(100%); }
          to   { transform: translateX(-200%); }
        }
        .ticker-text { animation: ticker 14s linear infinite; white-space: nowrap; }

        /* input glow on focus */
        input:focus {
          background: rgba(12,9,18,0.92) !important;
          box-shadow: 0 0 0 1px rgba(227,6,19,0.25) !important;
        }
      `}</style>

      <div
        className="flex items-center justify-center min-h-[100dvh] p-3 sm:p-8 select-none relative overflow-hidden"
        style={{ background: "#000000" }}
      >
        {/* Particle rain — background layer */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <Particles count={28} />
        </div>

        {/* Background layers */}
        {/* Radial vignette center */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(40,28,4,0.22) 0%, transparent 70%)",
          }}
        />
        {/* Floor glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(80,55,0,0.15) 0%, transparent 70%)",
          }}
        />
        {/* Tactical grid */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(227,6,19,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(227,6,19,0.025) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 90% 80% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 50% 50%, black 20%, transparent 100%)",
          }}
        />
        {/* Edge vignettes */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(9,7,14,0.9) 0%, transparent 16%, transparent 84%, rgba(9,7,14,0.9) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(9,7,14,0.75) 0%, transparent 18%, transparent 80%, rgba(9,7,14,0.75) 100%)",
          }}
        />

        {/*DESKTOP — Nintendo Switch shell*/}
        <div className="hidden lg:flex items-stretch w-[1160px] h-[580px] drop-shadow-[0_0_80px_rgba(0,0,0,0.95)] relative z-10">
          {/* LEFT JOY-CON — dark charcoal with gold strip */}
          <div
            className="relative w-[156px] h-[580px] rounded-l-[100px] rounded-r-[10px] flex flex-col items-center"
            style={{
              background: "linear-gradient(148deg, #1e1e22 0%, #2c2c32 100%)",
              boxShadow:
                "inset 6px -8px 18px #0d0d10, inset 0px 8px 6px #3a3a42",
            }}
          >
            {/* Gold accent strip */}
            <div
              className="absolute top-0 right-0 bottom-0 w-[3px] rounded-r-[1px]"
              style={{
                background:
                  "linear-gradient(180deg, transparent 8%, rgba(227,6,19,0.5) 30%, rgba(227,6,19,0.5) 70%, transparent 92%)",
              }}
            />

            {/* Minus button */}
            <div
              className="absolute top-[44px] right-[18px] w-[24px] h-[6px] border border-[#111] rounded-[1px]"
              style={{ background: "linear-gradient(180deg,#2a2a2e,#1a1a1e)" }}
            />

            {/* Left analog stick */}
            <div className="absolute top-[84px] left-1/2 -translate-x-1/2 w-[68px] h-[68px] bg-[#18181c] border border-[#111] rounded-full overflow-hidden grid grid-cols-2 grid-rows-2 gap-[1px] shadow-lg">
              <div className="bg-[#222226]" />
              <div className="bg-[#222226]" />
              <div className="bg-[#222226]" />
              <div className="bg-[#222226]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#18181c] p-[1px] z-10 rounded-full flex items-center justify-center">
                <div
                  className="w-[54px] h-[54px] rounded-full bg-[#1e1e22]"
                  style={{
                    boxShadow:
                      "inset 0px -7px 7px rgb(28,28,30), inset 0px 7px 20px rgb(70,70,75), inset 0px 7px 12px rgb(0,0,0)",
                  }}
                />
              </div>
            </div>

            {/* D-pad */}
            <div className="absolute top-[206px] left-1/2 -translate-x-1/2 w-[92px] h-[92px] flex flex-col items-center justify-center text-[#888] text-[16px] font-bold">
              <div>
                <div
                  className="w-[30px] h-[30px] bg-[#1e1e22] rounded-full border border-[#111] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#282830] active:bg-[#141418]"
                  style={{ color: "rgba(227,6,19,0.6)" }}
                >
                  ▲
                </div>
              </div>
              <div className="flex gap-[32px] my-[-2px]">
                <div
                  className="w-[30px] h-[30px] bg-[#1e1e22] rounded-full border border-[#111] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#282830] active:bg-[#141418]"
                  style={{ color: "rgba(227,6,19,0.6)" }}
                >
                  ◀
                </div>
                <div
                  className="w-[30px] h-[30px] bg-[#1e1e22] rounded-full border border-[#111] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#282830] active:bg-[#141418]"
                  style={{ color: "rgba(227,6,19,0.6)" }}
                >
                  ▶
                </div>
              </div>
              <div>
                <div
                  className="w-[30px] h-[30px] bg-[#1e1e22] rounded-full border border-[#111] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#282830] active:bg-[#141418]"
                  style={{ color: "rgba(227,6,19,0.6)" }}
                >
                  ▼
                </div>
              </div>
            </div>

            {/* Screenshot button */}
            <div
              className="absolute bottom-[66px] right-[30px] w-[24px] h-[24px] border border-[#111] rounded-[4px] flex items-center justify-center cursor-pointer shadow-sm"
              style={{ background: "linear-gradient(135deg,#2a2a2e,#1a1a1e)" }}
            >
              <div
                className="w-[10px] h-[10px] rounded-full border border-[#111]"
                style={{
                  background: "linear-gradient(135deg,#2a2a2e,#1a1a1e)",
                }}
              />
            </div>
          </div>

          {/* CENTER SCREEN BEZEL */}
          <div
            className="flex-1 flex p-[24px] px-[32px] rounded-[6px]"
            style={{
              background:
                "linear-gradient(180deg, #2a2a2e 0%, #323236 3%, #1c1c20 5%, #1c1c20 100%)",
            }}
          >
            <div className="flex-1 border-t-[26px] border-b-[26px] border-l-[44px] border-r-[44px] border-black rounded-[12px] bg-black flex overflow-hidden">
              {/* SCREEN CONTENT */}
              <div
                className="flex-1 relative flex flex-col items-center justify-center overflow-hidden py-6 screen-flicker"
                style={{
                  background:
                    "radial-gradient(ellipse 120% 70% at 50% 100%, #1a1108 0%, #0c0a12 45%, #07060e 100%)",
                }}
              >
                {/* Blurred ninja GIF background*/}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <img
                    src="/ninja%20lobby%20background.gif"
                    alt=""
                    className="w-full h-full object-cover scale-110"
                    style={{ filter: "blur(2px) brightness(1) saturate(1)" }}
                  />
                </div>
                {/* Dark overlay for legibility */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 120% 70% at 50% 100%, rgba(26,17,8,0.55) 0%, rgba(12,10,18,0.75) 45%, rgba(7,6,14,0.85) 100%)",
                  }}
                />

                {/* Scan bar */}

                {/* Screen-edge accents */}
                <div
                  className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(227,6,19,0.3) 30%, rgba(227,6,19,0.3) 70%, transparent)",
                  }}
                />
                <div
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(100,75,0,0.18) 0%, transparent 100%)",
                  }}
                />

                {/* Scanlines */}
                <ScanLines />

                {/* Status bar top */}

                {/* Title section */}
                <div className="mb-5 text-center select-none flex flex-col items-center relative z-10 mt-4">
                  {/* Game title */}
                  <img
                    src="/logo-text.png"
                    alt="ShadowHand"
                    className="title-anim"
                    style={{
                      height: "clamp(5rem, 11vw, 7.5rem)",
                      width: "auto",
                    }}
                  />

                  {/* Divider with label */}
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="h-[1px] w-10"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(227,6,19,1))",
                      }}
                    />
                    <span
                      className="text-[8px] font-mono uppercase tracking-[0.5em]"
                      style={{ color: "rgba(227,6,19,1)" }}
                    >
                      Hand Gesture Combat
                    </span>
                    <div
                      className="h-[1px] w-10"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(227,6,19,1), transparent)",
                      }}
                    />
                  </div>

                  {/* Player count / mode badge */}
                  <div className="flex gap-2 mt-3">
                    {["1P VS CPU"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[7px] font-mono px-2 py-0.5 tracking-wider"
                        style={{
                          color: "rgba(227,6,19,0.45)",
                          border: "1px solid rgba(227,6,19,0.18)",
                          background: "rgba(227,6,19,0.05)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <div className="relative z-10 w-full flex justify-center">
                  <LobbyForm {...formProps} compact={false} />
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT JOY-CON — dark charcoal with gold strip */}
          <div
            className="relative w-[156px] h-[580px] rounded-r-[100px] rounded-l-[10px] flex flex-col items-center"
            style={{
              background: "linear-gradient(148deg, #2c2c32 0%, #1e1e22 100%)",
              boxShadow:
                "inset -6px -8px 18px #0d0d10, inset 0px 8px 6px #3a3a42",
            }}
          >
            {/* Gold accent strip */}
            <div
              className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-[1px]"
              style={{
                background:
                  "linear-gradient(180deg, transparent 8%, rgba(227,6,19,0.5) 30%, rgba(227,6,19,0.5) 70%, transparent 92%)",
              }}
            />

            {/* Plus button */}
            <div className="absolute top-[40px] left-[18px] w-[20px] h-[20px]">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[20px] rounded-[1px]"
                style={{ background: "#1a1a1e" }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[6px] rounded-[1px]"
                style={{ background: "#1a1a1e" }}
              />
            </div>

            {/* XYAB buttons */}
            <div className="absolute top-[84px] left-1/2 -translate-x-1/2 w-[92px] h-[92px] flex flex-col items-center justify-center text-[13px] font-bold">
              <div>
                <div
                  className="w-[30px] h-[30px] bg-[#1e1e22] rounded-full border border-[#111] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#282830] active:bg-[#141418]"
                  style={{ color: "rgba(227,6,19,0.7)" }}
                >
                  X
                </div>
              </div>
              <div className="flex gap-[32px] my-[-2px]">
                <div
                  className="w-[30px] h-[30px] bg-[#1e1e22] rounded-full border border-[#111] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#282830] active:bg-[#141418]"
                  style={{ color: "rgba(227,6,19,0.7)" }}
                >
                  Y
                </div>
                <div
                  className="w-[30px] h-[30px] bg-[#1e1e22] rounded-full border border-[#111] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#282830] active:bg-[#141418]"
                  style={{ color: "rgba(227,6,19,0.7)" }}
                >
                  A
                </div>
              </div>
              <div>
                <div
                  className="w-[30px] h-[30px] bg-[#1e1e22] rounded-full border border-[#111] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#282830] active:bg-[#141418]"
                  style={{ color: "rgba(227,6,19,0.7)" }}
                >
                  B
                </div>
              </div>
            </div>

            {/* Right analog stick */}
            <div className="absolute top-[220px] left-1/2 -translate-x-1/2 w-[68px] h-[68px] bg-[#18181c] border border-[#111] rounded-full overflow-hidden grid grid-cols-2 grid-rows-2 gap-[1px] shadow-lg">
              <div className="bg-[#222226]" />
              <div className="bg-[#222226]" />
              <div className="bg-[#222226]" />
              <div className="bg-[#222226]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#18181c] p-[1px] z-10 rounded-full flex items-center justify-center">
                <div
                  className="w-[54px] h-[54px] rounded-full bg-[#1e1e22]"
                  style={{
                    boxShadow:
                      "inset 0px -7px 7px rgb(28,28,30), inset 0px 7px 20px rgb(70,70,75), inset 0px 7px 12px rgb(0,0,0)",
                  }}
                />
              </div>
            </div>

            {/* Home button */}
            <div
              className="absolute bottom-[60px] left-[30px] cursor-pointer h-[32px] w-[32px] p-[1px] rounded-full flex items-center justify-center shadow-md"
              style={{
                border: "1px solid rgba(227,6,19,0.3)",
                background: "linear-gradient(135deg,#282828,#1a1a1a)",
              }}
            >
              <div
                onClick={() => window.location.reload()}
                className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[14px] font-bold"
                style={{
                  background: "linear-gradient(180deg,#2a2a2a,#181818)",
                  border: "1px solid rgba(227,6,19,0.2)",
                  color: "rgba(227,6,19,0.7)",
                }}
              >
                ⌂
              </div>
            </div>
          </div>
        </div>
        {/* ═══════════════════════════ END DESKTOP/TABLET BLOCK ═══════════════════════════ */}

        {/*MOBILE card layout */}
        {/* Blurred ninja GIF background — mobile only, desktop stays plain black outside the screen */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <img
            src="/ninja%20lobby%20background.gif"
            alt=""
            className="w-full h-full object-cover scale-110"
            style={{ filter: "blur(6px) brightness(0.35) saturate(1)" }}
          />
        </div>
        <div className="flex lg:hidden flex-col items-center w-full max-w-sm relative z-10">
          {/* Logo text */}
          <div className="mb-6 text-center select-none flex flex-col items-center">
            <img
              src="/logo-text.png"
              alt="ShadowHand"
              style={{
                height: "clamp(9.5rem, 30vw, 8.5rem)",
                width: "auto",
                position: "relative",
                top: "-10px",
              }}
            />
            <div className="flex items-center gap-2 mt-2">
              <div
                className="h-[1px] w-6"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(227,6,19,0.5))",
                }}
              />
              <span
                className="text-[8px] font-mono text-center uppercase tracking-[0.4em]"
                style={{ color: "rgba(255, 255, 255, 1)" }}
              >
                Hand Gesture Combat
              </span>
              <div
                className="h-[1px] w-6"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(227,6,19,0.5), transparent)",
                }}
              />
            </div>
          </div>

          {/* Card */}
          <div
            className="w-full rounded-none p-5 sm:p-6 relative"
            style={{
              background: "rgba(10,8,16,0.8)",
              border: "1px solid rgba(227,6,19,0.18)",
              boxShadow:
                "0 0 40px rgba(227,6,19,0.06), inset 0 0 30px rgba(0,0,0,0.5)",
            }}
          >
            {/* Corner brackets on card */}
            <div
              className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
              style={{ borderColor: "rgba(227,6,19,0.5)" }}
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2"
              style={{ borderColor: "rgba(227,6,19,0.5)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2"
              style={{ borderColor: "rgba(227,6,19,0.5)" }}
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
              style={{ borderColor: "rgba(227,6,19,0.5)" }}
            />

            <LobbyForm {...formProps} compact={true} />
          </div>


        </div>
        {/* ═══════════════════════════ END MOBILE BLOCK ═══════════════════════════ */}
      </div>
    </>
  );
}