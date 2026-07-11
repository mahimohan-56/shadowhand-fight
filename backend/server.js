import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = process.env.PORT || 3001;

const activeMatches = new Map(); // socketId → matchState

const MOVES = ["rock", "paper", "scissors"];
const COUNTERS = { rock: "paper", paper: "scissors", scissors: "rock" };

function getAiMove(history, difficulty, currentRound) {
  if (difficulty === "Boss") {
    if (currentRound === 1) return "paper";
    if (currentRound === 2) return "scissors";
    if (currentRound === 3) return "rock";
    if (currentRound === 4) return "paper";
    if (currentRound === 5) return "scissors";
  }

  if (history.length < 2) {
    return MOVES[Math.floor(Math.random() * 3)];
  }

  const recent = history.slice(-5);
  const counts = { rock: 0, paper: 0, scissors: 0 };
  recent.forEach(m => { if (counts[m] !== undefined) counts[m]++; });
  const mostUsed = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

  switch (difficulty) {
    case "Easy":
      return Math.random() < 0.25 ? COUNTERS[mostUsed] : MOVES[Math.floor(Math.random() * 3)];
    case "Medium":
      return Math.random() < 0.40 ? COUNTERS[mostUsed] : MOVES[Math.floor(Math.random() * 3)];
    case "Hard":
      return Math.random() < 0.65 ? COUNTERS[mostUsed] : MOVES[Math.floor(Math.random() * 3)];
    default:
      return MOVES[Math.floor(Math.random() * 3)];
  }
}

function determineWinner(playerMove, aiMove) {
  if (playerMove === aiMove) return "draw";
  if (playerMove === "none" && aiMove === "none") return "draw";
  if (playerMove === "none") return "ai";
  if (aiMove    === "none") return "player";
  if (
    (playerMove === "rock"     && aiMove === "scissors") ||
    (playerMove === "scissors" && aiMove === "paper")    ||
    (playerMove === "paper"    && aiMove === "rock")
  ) return "player";
  return "ai";
}

function createMatch(socketId, username, difficulty) {
  const chosenDifficulty = difficulty || "Medium";

  // Scale AI max HP based on difficulty tier
  let maxAiHp = 100;
  if (chosenDifficulty === "Hard") {
    maxAiHp = 150;
  } else if (chosenDifficulty === "Boss") {
    maxAiHp = 200;
  }

  return {
    socketId,
    username,
    difficulty:     chosenDifficulty,
    playerHp:       100,
    aiHp:           maxAiHp,
    round:          1,
    phase:          "idle",
    countdownTimer: null,
    graceTimer:     null,
    playerMove:     null,
    playerHistory:  [],
    savedCountdown: null,
  };
}

function startRound(socketId, startingFrom = 5) {
  const match = activeMatches.get(socketId);
  if (!match || match.phase === "ended") return;

  match.phase      = "countdown";
  match.playerMove = null;

  io.to(socketId).emit("round_start", { round: match.round });

  let countdown = startingFrom;
  match.savedCountdown = countdown;
  io.to(socketId).emit("timer_tick", { countdown });

  match.countdownTimer = setInterval(() => {
    countdown--;
    match.savedCountdown = countdown;
    if (countdown <= 0) {
      clearInterval(match.countdownTimer);
      match.countdownTimer = null;
      lockMoves(socketId);
    } else {
      io.to(socketId).emit("timer_tick", { countdown });
    }
  }, 1000);
}

function lockMoves(socketId) {
  const match = activeMatches.get(socketId);
  if (!match || match.phase === "ended") return;

  match.phase = "grace";
  io.to(socketId).emit("lock_move");

  match.graceTimer = setTimeout(() => {
    if (match.playerMove === null) match.playerMove = "none";
    evaluateRound(socketId);
  }, 800);
}

function evaluateRound(socketId) {
  const match = activeMatches.get(socketId);
  if (!match || match.phase === "ended") return;

  clearTimeout(match.graceTimer);
  match.graceTimer = null;

  const playerMove = match.playerMove || "none";
  const aiMove     = getAiMove(match.playerHistory, match.difficulty, match.round);

  if (playerMove !== "none") match.playerHistory.push(playerMove);

  const result = determineWinner(playerMove, aiMove);
  let damage = 0, roundWinner = null;

  if (result === "player") {
    damage = 20;
    match.aiHp = Math.max(0, match.aiHp - damage);
    roundWinner = "player";
  } else if (result === "ai") {
    damage = 20;
    match.playerHp = Math.max(0, match.playerHp - damage);
    roundWinner = "ai";
  }

  match.phase = "result";

  io.to(socketId).emit("round_result", {
    round:      match.round,
    playerMove,
    aiMove,
    roundWinner,
    damage,
    playerHp:   match.playerHp,
    aiHp:       match.aiHp,
  });

  if (match.playerHp <= 0 || match.aiHp <= 0) {
    match.phase = "ended";
    const winner = match.playerHp > 0 ? "player" : "ai";
    setTimeout(() => {
      io.to(socketId).emit("game_over", { winner });
      activeMatches.delete(socketId);
    }, 2500);
  } else {
    match.round++;
    match.phase = "waiting_next";
    // Wait for client to emit "next_round" before starting the next round
    io.to(socketId).emit("waiting_next_round", { round: match.round });
  }
}

io.on("connection", (socket) => {
  console.log(`[+] ${socket.id} connected`);

  socket.on("start_ai_match", ({ username, opponent }) => {
    const old = activeMatches.get(socket.id);
    if (old) {
      clearInterval(old.countdownTimer);
      clearTimeout(old.graceTimer);
      activeMatches.delete(socket.id);
    }

    const difficultyRating = opponent?.difficulty || "Medium";
    const match = createMatch(socket.id, username || "Warrior", difficultyRating);
    activeMatches.set(socket.id, match);

    socket.emit("match_found", {
      yourUsername: match.username,
      aiName:       opponent?.name || "Shadow AI",
      playerHp:     match.playerHp,
      aiHp:         match.aiHp,
    });

    // Do NOT auto-start round — wait for player_ready from client.
    // This prevents cold-start races where the round fires before
    // the user has granted camera permission and clicked Start Match.
  });

  socket.on("submit_move", ({ move }) => {
    const match = activeMatches.get(socket.id);
    if (!match || match.phase !== "grace") return;

    const valid = ["rock", "paper", "scissors", "none"];
    match.playerMove = valid.includes(move) ? move : "none";

    clearTimeout(match.graceTimer);
    match.graceTimer = null;
    evaluateRound(socket.id);
  });

  // Player clicked "Start Match" — now it's safe to begin round 1
  socket.on("player_ready", () => {
    const match = activeMatches.get(socket.id);
    if (!match || match.phase !== "idle") return;
    startRound(socket.id);
  });

  socket.on("next_round", () => {
    const match = activeMatches.get(socket.id);
    if (!match || match.phase !== "waiting_next") return;
    startRound(socket.id);
  });

  socket.on("disconnect", () => {
    console.log(`[-] ${socket.id} disconnected`);
    const match = activeMatches.get(socket.id);
    if (match) {
      clearInterval(match.countdownTimer);
      clearTimeout(match.graceTimer);
      activeMatches.delete(socket.id);
    }
  });
});

app.get("/health", (_, res) =>
  res.json({ status: "ok", activeMatches: activeMatches.size })
);

httpServer.listen(PORT, () =>
  console.log(`🥷 ShadowHand Fight → http://localhost:${PORT}`)
);