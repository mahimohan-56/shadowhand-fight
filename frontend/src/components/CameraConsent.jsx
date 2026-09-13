import React, { useState, useEffect } from "react";

/**
 * Camera consent gate.
 * - Shows the browser permission prompt right here when user clicks Allow.
 * - Passes the acquired MediaStream back to onAccept so WebcamPanel
 *   can reuse it — no second getUserMedia call fires later.
 *
 * NOTE: This design uses Google "Material Symbols Outlined" icons.
 * Add these two links to your public/index.html <head> if you haven't already:
 *   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
 *   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
 */
const TRANSITION_MS = 340;

export default function CameraConsent({ onAccept, onDecline }) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [camError, setCamError] = useState(null);

  // Enter/exit transition state — mounts hidden, animates in on next frame,
  // and animates out before actually calling onAccept/onDecline so the
  // hand-off to CameraConsent -> WebcamPanel (or back to CharacterSelect) reads as one smooth motion.
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function closeThen(fn, arg) {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => fn(arg), TRANSITION_MS);
  }

  async function handleAllow() {
    if (!checked || loading || leaving) return;
    setLoading(true);
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      // Pass the live stream up — App stores it and hands it to WebcamPanel
      closeThen(onAccept, stream);
    } catch (err) {
      setLoading(false);
      if (err.name === "NotAllowedError") {
        setCamError("Camera permission denied. Please allow access in your browser settings and try again.");
      } else if (err.name === "NotFoundError") {
        setCamError("No camera found on this device.");
      } else {
        setCamError("Could not start camera: " + err.message);
      }
    }
  }

  const visible = mounted && !leaving;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: "rgba(3,3,5,0.97)",
        fontFamily: "'Inter', sans-serif",
        opacity: visible ? 1 : 0,
        transition: `opacity ${TRANSITION_MS}ms ease`,
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      <div
        className="w-full max-w-md bg-[#1b1b1d] border border-[#c7c5ce]/20 rounded-xl overflow-hidden relative"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(10px)",
          transition: `opacity ${TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1), transform ${TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1)`,
        }}
      >
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#be1212] to-transparent opacity-50" />

        {/* Security Protocol bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[#201f21] bg-[#131315]">
          <span
            className="material-symbols-outlined text-[#ffb4aa] text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shield_lock
          </span>
          <h1 className="text-[11px] font-bold text-[#e5e1e4] uppercase tracking-wider">
            Security Protocol
          </h1>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center gap-2 pb-4 border-b border-[#201f21]">
            <div className="w-16 h-16 rounded-full bg-[#201f21] flex items-center justify-center mb-1 border border-[#c7c5ce]/10">
              <span
                className="material-symbols-outlined text-4xl text-[#e5e1e4]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                camera
              </span>
            </div>
            <h2 className="text-[20px] font-semibold text-[#e5e1e4]">Camera Access Required</h2>
            <p className="text-[11px] font-medium text-[#e5bdb8] uppercase tracking-widest">
              ShadowHand Fight needs your hand
            </p>
          </div>

          {/* Security Bullet Points */}
          <div className="flex flex-col gap-3 py-1">
            <Point icon="shield" color="text-[#ffb4aa]" text="Your video is processed entirely on your device. No video, image, or frame is ever uploaded or stored." />
            <Point icon="mic_off" color="text-[#ffb4ab]" text="No audio or microphone access is requested at any point." />
            <Point icon="front_hand" color="text-[#c8c5cb]" text="Only your detected gesture (rock, paper, or scissors) is sent over the network — nothing else." />
            <Point icon="timer_off" color="text-[#c7c5ce]" text="Your camera turns off automatically when you leave the page, switch tabs, or close the browser." />
            <Point icon="cloud_off" color="text-[#5f5e66]" text="Nothing from your camera is saved to a server or database — ever." />
          </div>

          {camError && (
            <div className="px-3 py-2.5 bg-[#93000a]/20 border border-[#93000a]/40 rounded text-[#ffb4ab] text-xs font-mono flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <span>{camError}</span>
            </div>
          )}

          {/* Consent Checkbox */}
          <div className="bg-[#353437] p-3 rounded-lg border border-[#c7c5ce]/10">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div className="relative flex items-center justify-center pt-0.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={e => setChecked(e.target.checked)}
                  className="peer sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded transition-colors flex items-center justify-center ${
                    checked
                      ? "bg-[#be1212] border-[#be1212]"
                      : "bg-[#131315] border-[#ac8883]"
                  }`}
                >
                  {checked && (
                    <span
                      className="material-symbols-outlined text-[#ffcec8]"
                      style={{ fontSize: "16px", fontWeight: 700 }}
                    >
                      check
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-[#e5e1e4] group-hover:text-white transition-colors select-none leading-tight">
                I understand my camera will be used only for local, on-device gesture detection during this match.
              </span>
            </label>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-[#201f21] p-4 md:px-6 border-t border-[#c7c5ce]/20 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={() => closeThen(onDecline)}
            disabled={loading || leaving}
            className="px-5 py-2.5 rounded border border-[#5c403c] text-[#e5e1e4] text-[11px] font-bold uppercase tracking-wider hover:bg-[#353437] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffb4aa] focus:ring-offset-2 focus:ring-offset-[#201f21]"
          >
            Cancel
          </button>
          <button
            onClick={handleAllow}
            disabled={!checked || loading || leaving}
            className="px-5 py-2.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-[#ffb4aa] focus:ring-offset-2 focus:ring-offset-[#201f21]"
            style={{
              background: checked && !loading ? "#be1212" : "rgba(255,255,255,0.04)",
              color: checked && !loading ? "#ffcec8" : "#8a8a8c",
              opacity: checked && !loading ? 1 : 0.6,
              cursor: checked && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? (
              <>
                <div className="w-3 h-3 rounded-full border-2 border-t-white border-white/20 animate-spin" />
                <span>Starting…</span>
              </>
            ) : (
              "Allow Camera"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Point({ icon, color, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 flex-shrink-0 ${color}`}>
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
        >
          {icon}
        </span>
      </div>
      <p className="text-[13px] text-[#e5bdb8] leading-relaxed">{text}</p>
    </div>
  );
}