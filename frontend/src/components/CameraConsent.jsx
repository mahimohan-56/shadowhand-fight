import React, { useState } from "react";

/**
 * Camera consent gate.
 * - Shows the browser permission prompt right here when user clicks Allow.
 * - Passes the acquired MediaStream back to onAccept so WebcamPanel
 *   can reuse it — no second getUserMedia call fires later.
 */
export default function CameraConsent({ onAccept, onDecline }) {
  const [checked,  setChecked]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [camError, setCamError] = useState(null);

  async function handleAllow() {
    if (!checked || loading) return;
    setLoading(true);
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      // Pass the live stream up — App stores it and hands it to WebcamPanel
      onAccept(stream);
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(3,3,5,0.97)" }}
    >
      <div
        className="w-full max-w-md rounded"
        style={{
          background: "linear-gradient(160deg,#0a0a12,#070710)",
          border: "1px solid rgba(224,32,32,0.3)",
          boxShadow: "0 0 60px rgba(224,32,32,0.08), 0 30px 60px rgba(0,0,0,0.9)",
        }}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-700 to-transparent" />

        <div className="p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📷</span>
            <div>
              <h2 className="text-lg font-bold text-white">Camera Access Required</h2>
              <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                ShadowHand Fight needs your hand
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-xs text-stone-400 leading-relaxed mb-5">
            <Point icon="🔒" text="Your video is processed entirely on your device. No video, image, or frame is ever uploaded or stored." />
            <Point icon="🚫" text="No audio or microphone access is requested at any point." />
            <Point icon="✋" text="Only your detected gesture (rock, paper, or scissors) is sent over the network — nothing else." />
            <Point icon="⏹" text="Your camera turns off automatically when you leave the page, switch tabs, or close the browser." />
            <Point icon="🗑" text="Nothing from your camera is saved to a server or database — ever." />
          </div>

          {camError && (
            <div className="mb-4 px-3 py-2.5 bg-red-900/30 border border-red-700/40 rounded text-red-400 text-xs font-mono">
              ⚠ {camError}
            </div>
          )}

          <label className="flex items-start gap-2.5 mb-5 cursor-pointer group">
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 accent-red-600 cursor-pointer"
            />
            <span className="text-[11px] text-stone-500 group-hover:text-stone-400 transition-colors">
              I understand my camera will be used only for local, on-device gesture detection during this match.
            </span>
          </label>

          <div className="flex gap-3">
            <button
              onClick={onDecline}
              disabled={loading}
              className="flex-1 py-3 rounded text-xs font-bold uppercase tracking-wider text-stone-400 transition-all duration-200 hover:text-stone-200"
              style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleAllow}
              disabled={!checked || loading}
              className="flex-1 py-3 rounded text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: checked && !loading ? "linear-gradient(135deg,#b00000,#7a0000)" : "rgba(255,255,255,0.04)",
                border: checked && !loading ? "1px solid rgba(224,32,32,0.5)" : "1px solid rgba(255,255,255,0.06)",
                opacity: checked && !loading ? 1 : 0.45,
                cursor: checked && !loading ? "pointer" : "not-allowed",
              }}
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 rounded-full border-2 border-t-white border-white/20 animate-spin" />
                  <span>Starting…</span>
                </>
              ) : (
                "Allow Camera ⚔"
              )}
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
      </div>
    </div>
  );
}

function Point({ icon, text }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-sm shrink-0 mt-0.5">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
