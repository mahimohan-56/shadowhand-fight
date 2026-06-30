/**
 * Robust gesture detection for Rock / Paper / Scissors.
 *
 * Strategy: use multiple independent signals per gesture so that
 * hand tilt, distance from camera, and lighting variation don't
 * cause a single check to flip the whole result.
 *
 * MediaPipe landmark indices:
 *   Wrist  = 0
 *   Thumb  = 1-4   (MCP=1, IP=3, Tip=4)
 *   Index  = 5-8   (MCP=5, PIP=6, DIP=7, Tip=8)
 *   Middle = 9-12  (MCP=9, PIP=10, DIP=11, Tip=12)
 *   Ring   = 13-16 (MCP=13, PIP=14, DIP=15, Tip=16)
 *   Pinky  = 17-20 (MCP=17, PIP=18, DIP=19, Tip=20)
 *
 * y-axis: smaller = higher on screen (standard MediaPipe convention)
 */

// ─── Low-level helpers ────────────────────────────────────────────────────

function dist2D(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function dist3D(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y, dz = (a.z ?? 0) - (b.z ?? 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Curl ratio: 0 = fully extended, 1 = fully curled.
 * Measured as tip distance from MCP relative to finger "span"
 * (MCP to middle-knuckle DIP as reference length).
 * Works even when the hand is tilted toward the camera.
 */
function curlRatio(tip, pip, mcp) {
  const tipToMcp = dist3D(tip, mcp);
  const span     = dist3D(pip, mcp) * 2.2; // normaliser
  if (span < 0.001) return 0.5;
  const ratio = 1 - Math.min(tipToMcp / span, 1);
  return Math.max(0, Math.min(1, ratio));
}

/**
 * Is the finger extended?
 * Combines y-axis check with curl ratio so tilted hands still register.
 */
function isFingerExtended(tip, dip, pip, mcp) {
  const yExtended   = tip.y < pip.y;                          // tip above PIP
  const curl        = curlRatio(tip, pip, mcp);               // 0=extended
  const curlOk      = curl < 0.52;
  // Need at least one strong signal, or both weak signals
  const straightLen = dist3D(tip, mcp);
  const foldedLen   = dist3D(pip, mcp) + dist3D(tip, pip);
  const straightRatio = straightLen / (foldedLen + 0.0001);   // near 1 = straight
  return (yExtended && curlOk) || (straightRatio > 0.82 && curlOk);
}

/**
 * Is the finger curled (clenched into fist)?
 * Higher bar than "not extended" to avoid false positives.
 */
function isFingerCurled(tip, pip, mcp) {
  const curl = curlRatio(tip, pip, mcp);
  return curl > 0.58;
}

// ─── Per-finger convenience ───────────────────────────────────────────────

function indexExtended(lm)  { return isFingerExtended(lm[8],  lm[7],  lm[6],  lm[5]);  }
function middleExtended(lm) { return isFingerExtended(lm[12], lm[11], lm[10], lm[9]);  }
function ringExtended(lm)   { return isFingerExtended(lm[16], lm[15], lm[14], lm[13]); }
function pinkyExtended(lm)  { return isFingerExtended(lm[20], lm[19], lm[18], lm[17]); }

function indexCurled(lm)    { return isFingerCurled(lm[8],  lm[6],  lm[5]);  }
function middleCurled(lm)   { return isFingerCurled(lm[12], lm[10], lm[9]);  }
function ringCurled(lm)     { return isFingerCurled(lm[16], lm[14], lm[13]); }
function pinkyCurled(lm)    { return isFingerCurled(lm[20], lm[18], lm[17]); }

// ─── Gesture detectors ───────────────────────────────────────────────────

/**
 * ROCK — Iron Fist
 * Simple rule: none of the four fingers are clearly extended.
 * We don't require them to be positively "curled" — just not up.
 * This is intentionally lenient so a natural closed fist always registers.
 */
function isRock(lm) {
  const extendedCount = [
    indexExtended(lm),
    middleExtended(lm),
    ringExtended(lm),
    pinkyExtended(lm),
  ].filter(Boolean).length;

  // 0 or at most 1 finger reads as extended (one ambiguous finger is fine)
  return extendedCount <= 1;
}

/**
 * PAPER — Open Palm
 * All four fingers extended AND spread apart (no bunching).
 */
function isPaper(lm) {
  const allExtended =
    indexExtended(lm) &&
    middleExtended(lm) &&
    ringExtended(lm) &&
    pinkyExtended(lm);

  if (!allExtended) return false;

  // Additional spread check: index tip and pinky tip should be reasonably apart
  // relative to the hand width (wrist to middle MCP distance)
  const handWidth  = dist2D(lm[0], lm[9]);
  const fingerSpan = dist2D(lm[8], lm[20]);
  const spreadOk   = fingerSpan > handWidth * 0.6;

  return spreadOk;
}

/**
 * SCISSORS — Shadow Blades (✌)
 * Index + middle extended, ring + pinky curled.
 * Also verifies the two raised fingers are actually spread (V shape),
 * not just both pointing straight up — that would be a relaxed paper.
 */
function isScissors(lm) {
  const idxUp  = indexExtended(lm);
  const midUp  = middleExtended(lm);
  const rngDwn = ringCurled(lm) || !ringExtended(lm);
  const pkyDwn = pinkyCurled(lm) || !pinkyExtended(lm);

  if (!idxUp || !midUp || !rngDwn || !pkyDwn) return false;

  // V-spread: horizontal distance between index tip and middle tip
  // should be meaningful relative to the distance between their MCPs
  const tipSpread  = dist2D(lm[8], lm[12]);
  const mcpSpread  = dist2D(lm[5], lm[9]);
  const vOk        = tipSpread > mcpSpread * 0.4;

  return vOk;
}

// ─── Stability buffer ────────────────────────────────────────────────────
// Require N consecutive matching frames before committing a new gesture.
// This eliminates single-frame flicker between poses.

const CONFIRM_FRAMES = 2;
let candidateGesture = "none";
let candidateCount   = 0;
let confirmedGesture = "none";

// ─── Main export ─────────────────────────────────────────────────────────

export function detectGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return "none";
  const lm = landmarks;

  let raw = "none";
  // Order matters: scissors before paper (scissors is a subset condition)
  if (isRock(lm))     raw = "rock";
  else if (isScissors(lm)) raw = "scissors";
  else if (isPaper(lm))    raw = "paper";

  // Stability filter
  if (raw === candidateGesture) {
    candidateCount++;
    if (candidateCount >= CONFIRM_FRAMES) {
      confirmedGesture = raw;
    }
  } else {
    candidateGesture = raw;
    candidateCount   = 1;
    // Allow immediate "none" so the hand disappearing clears state fast
    if (raw === "none") confirmedGesture = "none";
  }

  return confirmedGesture;
}

// ─── Landmark drawing — unchanged ShadowHand palette ─────────────────────

/** Draw landmarks with ShadowHand blood/ember palette */
export function drawLandmarks(ctx, landmarks, W, H) {
  if (!landmarks || landmarks.length === 0) return;

  const connections = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20],
    [5,9],[9,13],[13,17],
  ];

  ctx.clearRect(0, 0, W, H);

  // Connectors — dark blood red
  ctx.strokeStyle = "rgba(176, 0, 0, 0.7)";
  ctx.lineWidth = 1.5;
  for (const [a, b] of connections) {
    const la = landmarks[a], lb = landmarks[b];
    ctx.beginPath();
    ctx.moveTo(la.x * W, la.y * H);
    ctx.lineTo(lb.x * W, lb.y * H);
    ctx.stroke();
  }

  // Nodes — ember orange wrist, red tips, dark joints
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];
    const x = lm.x * W, y = lm.y * H;
    const isTip   = [4, 8, 12, 16, 20].includes(i);
    const isWrist = i === 0;

    ctx.beginPath();
    ctx.arc(x, y, isWrist ? 5 : isTip ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = isWrist ? "#ff8c00" : isTip ? "#ff4040" : "#8b0000";
    ctx.fill();

    if (isTip) {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,64,64,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
