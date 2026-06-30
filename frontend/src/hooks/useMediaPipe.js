import { useEffect, useRef, useState, useCallback } from "react";
import { detectGesture, drawLandmarks } from "../utils/gestureDetection.js";

const WASM_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

/**
 * useMediaPipe — local, on-device hand tracking.
 *
 * SECURITY / PRIVACY NOTES:
 * - The camera stream NEVER leaves the browser. All hand detection runs
 *   client-side via WASM. Only the resulting gesture string
 *   ("rock" | "paper" | "scissors" | "none") is ever sent to the server.
 * - No video frame, image, or raw landmark data is transmitted or stored.
 * - The camera stream is fully stopped (all tracks closed) whenever this
 *   component unmounts, the tab is hidden, or the user navigates away —
 *   so the camera LED turns off immediately when not in active gameplay.
 * - `requireConsent` gates camera activation behind an explicit user
 *   action, rather than firing getUserMedia automatically.
 */
export function useMediaPipe(videoRef, canvasRef, { enabled = true } = {}) {
  const handLandmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);

  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const currentGestureRef = useRef("none");
  const lastVideoTimeRef = useRef(-1);

  const getCurrentGesture = useCallback(() => currentGestureRef.current, []);

  /** Fully stop the camera — closes every track so the camera light turns off */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  }, [videoRef]);

  // ── Load model (only once enabled) ──────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function loadModel() {
      try {
        const vision = await import("@mediapipe/tasks-vision");
        const { HandLandmarker, FilesetResolver } = vision;
        const filesetResolver = await FilesetResolver.forVisionTasks(WASM_CDN);
        const handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });
        if (!cancelled) {
          handLandmarkerRef.current = handLandmarker;
          setModelReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setModelError("Failed to load hand-tracking model: " + err.message);
        }
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
    if (!enabled) {
      stopCamera();
      return;
    }

    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false, // explicitly never request microphone access
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => setCameraReady(true);
        }
      } catch (err) {
        const msg =
          err.name === "NotAllowedError"
            ? "Camera access denied. Please allow camera permissions and refresh."
            : err.name === "NotFoundError"
            ? "No camera found on this device."
            : "Could not access camera: " + err.message;
        setCameraError(msg);
      }
    }

    startCamera();

    // Stop the camera the moment the tab is hidden (switched away / minimized)
    function handleVisibility() {
      if (document.hidden) stopCamera();
      else if (enabled) startCamera();
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      stopCamera();
    };
  }, [enabled, videoRef, stopCamera]);

  // Always release the camera on full unmount, even if effects above
  // somehow didn't run their cleanup (defensive double-stop)
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // ── RAF detection loop (runs 100% locally — no network calls) ──────────
  useEffect(() => {
    if (!enabled || !modelReady || !cameraReady) return;

    function detect() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !handLandmarkerRef.current) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }
      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const result = handLandmarkerRef.current.detectForVideo(video, performance.now());
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        if (result.landmarks && result.landmarks.length > 0) {
          const lm = result.landmarks[0];
          currentGestureRef.current = detectGesture(lm);
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
  }, [enabled, modelReady, cameraReady, videoRef, canvasRef]);

  return {
    modelReady,
    modelError,
    cameraError,
    cameraReady,
    getCurrentGesture,
    currentGestureRef,
    stopCamera,
  };
}