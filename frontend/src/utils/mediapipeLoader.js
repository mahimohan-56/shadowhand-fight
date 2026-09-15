const WASM_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

let landmarkerPromise = null;

/**
 * Loads (or returns the already-loading/loaded) HandLandmarker singleton.
 * Safe to call multiple times — subsequent calls just await the same promise.
 * Also performs a one-time GPU warm-up call on a blank frame, so the
 * expensive first-inference shader compile happens here instead of during
 * round 1's live countdown.
 */
export function preloadHandLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
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

      try {
        const warmCanvas = document.createElement("canvas");
        warmCanvas.width = 640;
        warmCanvas.height = 480;
        const wctx = warmCanvas.getContext("2d");
        wctx.fillStyle = "#000";
        wctx.fillRect(0, 0, 640, 480);
        hl.detectForVideo(warmCanvas, performance.now());
      } catch (warmErr) {
        console.warn("MediaPipe warm-up skipped:", warmErr);
      }

      return hl;
    })();
  }
  return landmarkerPromise;
}
