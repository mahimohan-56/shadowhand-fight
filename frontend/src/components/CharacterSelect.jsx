import React, { useState } from "react";

export const CHARACTERS = [
  {
    id: "may",
    name: "May",
    image: "/characters/may.jpg",
    weapon: "Dual Daggers",
    style: "Agile Assassin",
    desc: "Swift, relentless, and deadly. Her twin daggers strike before you can react.",
    accent: "#4ade80",
    difficulty: "Easy",
  },
  {
    id: "shark",
    name: "Shark",
    image: "/characters/shark.jpg",
    weapon: "Knuckle Weapons",
    style: "Arena Brawler",
    desc: "A ruthless underground champion whose crushing punches and relentless pressure dominate the arena.",
    accent: "#fbbf24",
    difficulty: "Medium",
  },
  {
    id: "butcher",
    name: "Butcher",
    image: "/characters/butcher.jpg",
    weapon: "Cleavers",
    style: "Brute Force",
    desc: "A towering demon who crushes opponents with devastating power and relentless aggression.",
    accent: "#fbbf24",
    difficulty: "Medium",
  },
  {
    id: "crane",
    name: "Crane",
    image: "/characters/crane.jpg",
    weapon: "Naginata",
    style: "Reach Specialist",
    desc: "Graceful yet ruthless. His naginata controls the battlefield with sweeping precision.",
    accent: "#ef4444",
    difficulty: "Hard",
  },
  {
    id: "vortex",
    name: "Vortex",
    image: "/characters/vortex.jpg",
    weapon: "Composite Sword",
    style: "Herald Grandmaster",
    desc: "Every strike is calculated. His flawless blade work and lethal shadow abilities punish even the smallest mistake.",
    accent: "#6a5cff",
    difficulty: "Boss",
  },
];

const DIFFICULTY_COLOR = {
  Easy: "#4ade80",
  Medium: "#fbbf24",
  Hard: "#ef4444",
  Boss: "#6a5cff",
};

export default function CharacterSelect({ username, onSelect, connError }) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const activeChar = hovered ?? selected ?? CHARACTERS[0];

  function handleConfirm() {
    if (!selected || confirming) return;
    setConfirming(true);
    onSelect(selected);
  }

  return (
    <div
      className="relative flex flex-col h-[100dvh] w-screen overflow-hidden"
      style={{ background: "radial-gradient(ellipse 100% 80% at 50% 100%, #150505 0%, #030305 55%)" }}
    >
      {/* Top header — stacks vertically on the smallest screens so long
          text doesn't get squeezed into a single illegible row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-0 px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-white/5 shrink-0">
        <div>
          <p className="text-[10px] sm:text-xs font-mono text-amber-600 uppercase tracking-[0.2em] sm:tracking-[0.25em]">
            Welcome, {username}
          </p>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
            Choose Your Opponent
          </h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] sm:text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">ShadowHand Fight</p>
          <p className="text-[10px] sm:text-xs font-mono text-stone-300 mt-0.5 opacity-90">Select an enemy to battle</p>
        </div>
      </div>

      {connError && (
        <div className="mx-4 sm:mx-8 mt-3 px-4 py-2 rounded bg-red-900/30 border border-red-700/40 text-red-400 text-xs font-mono shrink-0">
          ⚠ {connError}
        </div>
      )}

      {/* Main content
          Desktop (lg+): sidebar list (left) + big preview panel (right), side by side.
          Mobile/tablet (<lg): stacked — horizontally-scrollable character chips on top,
          full-width preview below. min-h-0 everywhere so the preview area scrolls
          internally instead of pushing the page taller than the viewport. */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 lg:gap-0 min-h-0 p-3 sm:p-6 overflow-y-auto lg:overflow-hidden">

        {/* Character picker —
            Mobile: horizontal scroll-snap row of compact cards.
            Desktop: vertical list, same cards as before. */}
        <div
          className="flex lg:flex-col gap-2.5 sm:gap-3 lg:w-64 shrink-0 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden pb-2 lg:pb-0 lg:pr-1 -mx-3 px-3 lg:mx-0 lg:px-0"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {CHARACTERS.map(char => {
            const isSelected = selected?.id === char.id;
            const isHov = hovered?.id === char.id;
            const accent = char.accent;

            return (
              <button
                key={char.id}
                onMouseEnter={() => setHovered(char)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(char)}
                className="relative flex items-center gap-3 p-2.5 sm:p-3 rounded text-left transition-all duration-200 shrink-0 w-[230px] lg:w-auto"
                style={{
                  scrollSnapAlign: "start",
                  background: isSelected
                    ? `rgba(${hexToRgb(accent)}, 0.12)`
                    : isHov
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.02)",
                  border: isSelected
                    ? `1px solid ${accent}60`
                    : isHov
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(255,255,255,0.04)",
                  boxShadow: isSelected ? `0 0 20px ${accent}15` : "none",
                }}
              >
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded shrink-0 overflow-hidden"
                  style={{ border: `1px solid ${isSelected ? accent + "60" : "rgba(255,255,255,0.08)"}` }}
                >
                  <img src={char.image} alt={char.name} className="w-full h-full object-cover object-top" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-white truncate">{char.name}</span>
                    <div className="flex flex-col items-center gap-1 sm:gap-1.5 shrink-0">
                      <span
                        className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider"
                        style={{ color: DIFFICULTY_COLOR[char.difficulty] }}
                      >
                        {char.difficulty}
                      </span>
                      {isSelected ? (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                      ) : (
                        <div className="w-1.5 h-1.5" />
                      )}
                    </div>
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-mono text-stone-500 mt-0.5 uppercase tracking-wider truncate">
                    {char.style}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview panel
            Mobile/tablet (<lg): image on top (shorter, full-width), details below.
            Desktop (lg+): image on the left at fixed width, details on the right. */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-5 min-w-0 lg:pl-6">

          {/* Character image */}
          <div
            className="relative w-full h-48 sm:h-64 lg:h-auto lg:w-72 shrink-0 rounded overflow-hidden"
            style={{
              border: `1px solid ${activeChar.accent}40`,
              background: "rgba(5,5,12,0.8)",
              boxShadow: `0 0 60px ${activeChar.accent}10`,
            }}
          >
            <img
              src={activeChar.image}
              alt={activeChar.name}
              className="w-full h-full object-cover object-top transition-all duration-300"
              style={{ filter: "saturate(0.9) contrast(1.05)" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-24 sm:h-28"
              style={{ background: "linear-gradient(to top, rgba(3,3,5,0.95), transparent)" }}
            />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
              <h2
                className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none"
                style={{ textShadow: `0 0 30px ${activeChar.accent}80` }}
              >
                {activeChar.name.toUpperCase()}
              </h2>
              <p className="text-[11px] sm:text-xs font-mono mt-1" style={{ color: activeChar.accent }}>
                {activeChar.style.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Details + confirm */}
          <div className="flex-1 flex flex-col justify-between py-1 gap-5 lg:gap-0">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-600 mb-2.5 sm:mb-3">
                  Fighter Profile
                </p>
                <div className="flex flex-col gap-2.5">
                  <InfoRow label="Weapon" value={activeChar.weapon} accent={activeChar.accent} />
                  <InfoRow label="Style" value={activeChar.style} accent={activeChar.accent} />
                  <InfoRow
                    label="Difficulty"
                    value={activeChar.difficulty}
                    accent={DIFFICULTY_COLOR[activeChar.difficulty]}
                  />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-600 mb-2">
                  Threat Assessment
                </p>
                <p className="text-sm text-stone-400 leading-relaxed font-light">
                  {activeChar.desc}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono text-stone-600 mb-1.5 uppercase tracking-wider">
                  <span>Starting HP</span>
                  <span>100 / 100</span>
                </div>
                <div className="h-2 rounded-none bg-white/5 overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full hp-fill"
                    style={{ width: "100%", background: "linear-gradient(90deg, #166534, #16a34a, #4ade80)" }}
                  />
                </div>
              </div>
            </div>

            {/* Confirm button — pinned to bottom on desktop, normal flow on mobile
                so it doesn't float oddly above a short scrollable content area */}
            <div className="flex flex-col gap-2 pb-1 lg:pb-0">
              {!selected && (
                <p className="text-xs font-mono text-stone-600 text-center">
                  ← Select an enemy to challenge
                </p>
              )}
              <button
                onClick={handleConfirm}
                disabled={!selected || confirming}
                className="w-full py-3.5 sm:py-4 rounded font-bold text-sm uppercase tracking-[0.15em] transition-all duration-200"
                style={{
                  background: selected
                    ? confirming
                      ? "rgba(60,60,60,0.6)"
                      : `linear-gradient(135deg, ${activeChar.accent}cc, ${activeChar.accent}88)`
                    : "rgba(255,255,255,0.04)",
                  border: selected ? `1px solid ${activeChar.accent}60` : "1px solid rgba(255,255,255,0.06)",
                  color: selected ? "#fff" : "#555",
                  boxShadow: selected && !confirming ? `0 0 30px ${activeChar.accent}20` : "none",
                  cursor: selected && !confirming ? "pointer" : "not-allowed",
                }}
              >
                {confirming ? "Connecting…" : selected ? `⚔ Fight ${selected.name}` : "Select an Opponent"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, accent }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-600 w-20 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/5" />
      <span className="text-xs font-mono font-medium" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}