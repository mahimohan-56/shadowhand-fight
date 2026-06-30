/**
 * Detect Rock, Paper, or Scissors from 21 MediaPipe hand landmarks.
 * Landmark y: smaller = higher on screen.
 * A finger is "extended" when tip.y < pip.y
 */

function isExtended(tip, pip) {
  return tip.y < pip.y;
}

export function detectGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return "none";
  const lm = landmarks;

  const indexUp  = isExtended(lm[8],  lm[6]);
  const middleUp = isExtended(lm[12], lm[10]);
  const ringUp   = isExtended(lm[16], lm[14]);
  const pinkyUp  = isExtended(lm[20], lm[18]);
  const extCount = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;

  if (indexUp && middleUp && !ringUp && !pinkyUp) return "scissors";
  if (extCount === 4) return "paper";
  if (extCount === 0) return "rock";
  return "none";
}

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

  // Nodes — ember orange tips, blood red joints
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];
    const x = lm.x * W, y = lm.y * H;
    const isTip = [4, 8, 12, 16, 20].includes(i);
    const isWrist = i === 0;

    ctx.beginPath();
    ctx.arc(x, y, isWrist ? 5 : isTip ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = isWrist ? "#ff8c00" : isTip ? "#ff4040" : "#8b0000";
    ctx.fill();

    // Outer glow ring on tips
    if (isTip) {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,64,64,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
