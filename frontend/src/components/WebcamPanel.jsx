import React, { useRef, useEffect } from "react";
import { useMediaPipe } from "../hooks/useMediaPipe.js";

const GESTURE_DATA = {
  rock:     { label: "Iron Fist",     emoji: "✊", color: "#ef4444" },
  paper:    { label: "Open Palm",     emoji: "✋", color: "#60a5fa" },
  scissors: { label: "Shadow Blades", emoji: "✌️", color: "#a78bfa" },
  none:     { label: "No Hand",       emoji: "–",  color: "#6b7280" },
};

export default function WebcamPanel({ gestureRef, phase, cameraEnabled = true }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  const { modelReady, modelError, cameraError, cameraReady, currentGestureRef } =
    useMediaPipe(videoRef, canvasRef, { enabled: cameraEnabled });

  useEffect(() => {
    if (gestureRef) gestureRef.current = currentGestureRef;
  }, [gestureRef, currentGestureRef]);

  const gesture = currentGestureRef?.current || "none";
  const gData   = GESTURE_DATA[gesture];
  const isLive  = modelReady && cameraReady;
  const isLock  = phase === "grace";

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-500">
          Challenger
        </span>
        <div className="flex items-center gap-2">
          {cameraError && <span className="text-[9px] font-mono text-red-500 uppercase">CAM ERROR</span>}
          {modelError  && <span className="text-[9px] font-mono text-red-500 uppercase">AI ERROR</span>}
          {isLive && (
            <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 tracking-wider uppercase">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* Main Video Box Wrapper Panel — Added flex-1 and h-full to match opponent container height */}
      <div className="relative flex-1 h-full border border-white/5 bg-stone-950/20 rounded-md overflow-hidden shadow-2xl">
        {/* Absolute Scanning Overlay effects */}
        <div className="absolute inset-0 pointer-events-none border border-red-500/5 z-20 rounded-md m-px" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none z-10" />

        {/* State Indicators */}
        {isLock && (
          <div className="absolute inset-0 bg-red-950/20 border border-red-500/20 z-20 animate-pulse flex items-center justify-center pointer-events-none">
            <div className="bg-stone-950/90 px-3 py-1.5 rounded border border-red-500/30 shadow-xl">
              <p className="text-[10px] font-mono font-bold tracking-[0.3em] text-red-400 uppercase">
                LOCKING GESTURE
              </p>
            </div>
          </div>
        )}

        {/* Loading fallbacks */}
        {!cameraReady && !cameraError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-stone-950/80">
            <div className="w-6 h-6 rounded-full border-2 border-t-red-500 border-stone-800 animate-spin" />
            <p className="text-[10px] font-mono tracking-widest text-stone-600 uppercase">Starting camera…</p>
          </div>
        )}
        {cameraReady && !modelReady && !modelError && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 ink-panel rounded px-3 py-1.5 border border-red-900/40">
            <p className="text-[9px] font-mono tracking-widest text-stone-500 uppercase">Loading AI model…</p>
          </div>
        )}

        {/* Mirrored video + landmark canvas */}
        <div className="cam-wrapper w-full h-full" style={{ transform: "scaleX(-1)" }}>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} />
        </div>

        {/* Gesture badge */}
        {isLive && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded"
            style={{
              background: "rgba(3,3,5,0.88)",
              border: `1px solid ${gData.color}45`,
              boxShadow: `0 0 10px ${gData.color}18`,
            }}
          >
            <span className="text-xs">{gData.emoji}</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-200">
              {gData.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}