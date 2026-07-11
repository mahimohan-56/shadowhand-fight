import { useEffect, useRef, useState, useCallback } from "react";
import { detectGesture, drawLandmarks } from "../utils/gestureDetection.js";

const WASM_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

/**
 * useMediaPipe — local, on-device hand tracking.
 *
 * Options:
 *   enabled       — whether to run at all (default true)
 *   initialStream — a pre-acquired MediaStream from CameraConsent.
 *                   When provided, getUserMedia is NOT called again so
 *                   the browser never shows a second permission prompt.
 *   lastGoodGestureRef — external ref updated with every non-"none"
 *                   gesture detected, used as lock-move fallback.
 */
export function useMediaPipe(videoRef, canvasRef, {
  enabled = true,
  initialStream = null,
  lastGoodGestureRef = null,
} = {}) {
  const handLandmarkerRef  = useRef(null);
  const rafRef             = useRef(null);
  const streamRef          = useRef(null);

  const [modelReady,  setModelReady]  = useState(false);
  const [modelError,  setModelError]  = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const currentGestureRef = useRef("none");
  const lastVideoTimeRef  = useRef(-1);

  const getCurrentGesture = useCallback(() => currentGestureRef.current, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
  }, [videoRef]);

  // ── Load model ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function loadModel() {
      try {
        const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const resolver = await FilesetResolver.forVisionTasks(WASM_CDN);
        const hl = await HandLandmarker.createFromOptions(resolver, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });
        if (!cancelled) {
          handLandmarkerRef.current = hl;
          setModelReady(true);
        }
      } catch (err) {
        if (!cancelled) setModelError("Failed to load hand-tracking model: " + err.message);
      }
    }
    loadModel();

    return () => {
      cancelled = true;
      handLandmarkerRef.current?.close?.();
      handLandmarkerRef.current = null;
    };
  }, [enabled]);

  // ── Camera lifecycle ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) { stopCamera(); return; }

    let cancelled = false;

    async function startCamera() {
      try {
        let stream;
        if (initialStream && initialStream.active) {
          // Reuse the stream acquired on the consent screen — no prompt fires
          stream = initialStream;
        } else {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
            audio: false,
          });
        }
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => setCameraReady(true);
        }
      } catch (err) {
        const msg =
          err.name === "NotAllowedError" ? "Camera access denied. Please allow camera permissions and refresh."
          : err.name === "NotFoundError" ? "No camera found on this device."
          : "Could not access camera: " + err.message;
        setCameraError(msg);
      }
    }

    startCamera();

    function handleVisibility() {
      if (document.hidden) stopCamera();
      else if (enabled) startCamera();
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      // Only stop the stream if we didn't borrow it from outside
      if (!initialStream) stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => { return () => { if (!initialStream) stopCamera(); }; }, [stopCamera, initialStream]);

  // ── Detection loop ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !modelReady || !cameraReady) return;

    function detect() {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !handLandmarkerRef.current) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }
      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const result = handLandmarkerRef.current.detectForVideo(video, performance.now());
        const ctx = canvas.getContext("2d");
        canvas.width  = video.videoWidth  || 640;
        canvas.height = video.videoHeight || 480;

        if (result.landmarks?.length > 0) {
          const lm      = result.landmarks[0];
          const gesture = detectGesture(lm);
          currentGestureRef.current = gesture;

          // Track last good gesture for bad-light fallback
          if (gesture !== "none" && lastGoodGestureRef) {
            lastGoodGestureRef.current = gesture;
          }

          drawLandmarks(ctx, lm, canvas.width, canvas.height);
        } else {
          currentGestureRef.current = "none";
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      rafRef.current = requestAnimationFrame(detect);
    }

    rafRef.current = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, modelReady, cameraReady, videoRef, canvasRef, lastGoodGestureRef]);

  return { modelReady, modelError, cameraError, cameraReady, getCurrentGesture, currentGestureRef, stopCamera };
}
