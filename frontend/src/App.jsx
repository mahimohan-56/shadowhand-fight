import React, { useState, useRef, useCallback, useMemo } from "react";
import { getSocket, destroySocket } from "./utils/socket.js";
import Lobby from "./components/Lobby.jsx";
import CharacterSelect from "./components/CharacterSelect.jsx";
import CameraConsent from "./components/CameraConsent.jsx";
import GameBoard from "./components/GameBoard.jsx";
import GameOver from "./components/GameOver.jsx";

const SCREENS = {
  LOBBY:      "lobby",
  SELECT:     "select",
  CONNECTING: "connecting",
  CONSENT:    "consent",
  READY:      "ready",
  GAME:       "game",
  OVER:       "over",
};

const DEFAULT_GAME = {
  playerUsername: "",
  aiName: "Shadow AI",
  aiCharacter: null,
  playerHp: 100,
  aiHp: 100,
  round: 1,
  countdown: null,
  phase: "idle",
  playerMove: null,
  aiMove: null,
  roundWinner: null,
  damage: 0,
};

export default function App() {
  const [screen,    setScreen]    = useState(SCREENS.LOBBY);
  const [username,  setUsername]  = useState("");
  const [character, setCharacter] = useState(null);
  const [gameState, setGameState] = useState(DEFAULT_GAME);
  const [countdown, setCountdown] = useState(null);
  const [gameOver,  setGameOver]  = useState(null);
  const [connError, setConnError] = useState(null);
  const [wakeMsg,   setWakeMsg]   = useState("Connecting to server…");

  const gestureRef         = useRef(null);
  const attemptRef         = useRef(0);
  // Pre-acquired stream from CameraConsent — passed into WebcamPanel
  // so no second getUserMedia fires when GameBoard mounts.
  const cameraStreamRef    = useRef(null);
  // Last confirmed non-"none" gesture this round — fallback for bad-light frames.
  const lastGoodGestureRef = useRef("none");

  const gameStateWithCountdown = useMemo(
    () => ({ ...gameState, countdown }),
    [gameState, countdown]
  );

  const setupSocket = useCallback((uname, char) => {
    const socket = getSocket();
    socket.off();
    attemptRef.current = 0;

    socket.on("connect", () => {
      setConnError(null);
      socket.emit("start_ai_match", { username: uname, opponent: char });
    });

    socket.on("connect_error", () => {
      attemptRef.current += 1;
      if (attemptRef.current === 1) {
        setWakeMsg("Connecting to server…");
      } else if (attemptRef.current === 2) {
        setWakeMsg("Waking up the server — first visit can take up to 60 seconds…");
      } else if (attemptRef.current >= 4) {
        setWakeMsg("Almost there, please wait…");
      }
      if (attemptRef.current >= 10) {
        setConnError("Could not reach the server. Please try again.");
        setScreen(SCREENS.SELECT);
      }
    });

    // Server confirmed match. Round does NOT start — waits for player_ready.
    socket.on("match_found", ({ yourUsername, aiName, playerHp, aiHp }) => {
      setGameState({
        ...DEFAULT_GAME,
        playerUsername: yourUsername,
        aiName,
        aiCharacter: char,
        playerHp,
        aiHp,
      });
      setCountdown(null);
      setScreen(SCREENS.CONSENT);
    });

    socket.on("round_start", ({ round }) => {
      lastGoodGestureRef.current = "none";
      setGameState(prev => ({
        ...prev,
        round,
        phase: "countdown",
        playerMove: null,
        aiMove: null,
        roundWinner: null,
        damage: 0,
      }));
    });

    socket.on("timer_tick", ({ countdown }) => {
      setCountdown(countdown);
    });

    socket.on("lock_move", () => {
      setGameState(prev => ({ ...prev, phase: "grace" }));
      setCountdown(null);
      // Prefer live gesture; fall back to last good gesture seen this round.
      // Only submit "none" if hand was never detected at all.
      const live = gestureRef.current?.current ?? "none";
      const move = live !== "none" ? live : lastGoodGestureRef.current;
      socket.emit("submit_move", { move });
    });

    socket.on("round_result", ({ playerMove, aiMove, roundWinner, damage, playerHp, aiHp }) => {
      setGameState(prev => ({
        ...prev,
        phase: "result",
        playerMove,
        aiMove,
        roundWinner,
        damage,
        playerHp,
        aiHp,
      }));
    });

    socket.on("waiting_next_round", ({ round }) => {
      setGameState(prev => ({ ...prev, phase: "waiting_next", round }));
    });

    socket.on("game_over", ({ winner }) => {
      setGameOver({ winner });
      setScreen(SCREENS.OVER);
    });

    socket.connect();
  }, []);

  function handleNameSubmit(uname) {
    setUsername(uname);
    setScreen(SCREENS.SELECT);
  }

  function handleCharacterSelect(char) {
    setCharacter(char);
    setConnError(null);
    setWakeMsg("Connecting to server…");
    setScreen(SCREENS.CONNECTING);
    setupSocket(username, char);
  }

  // CameraConsent calls this with the MediaStream it acquired.
  // We store it so WebcamPanel can reuse it — no double prompt.
  function handleConsentAccept(stream) {
    cameraStreamRef.current = stream;
    setScreen(SCREENS.READY);
  }

  function handleConsentDecline() {
    setScreen(SCREENS.SELECT);
  }

  function handleStartMatch() {
    const socket = getSocket();
    socket.emit("player_ready");
    setScreen(SCREENS.GAME);
  }

  function handlePlayAgain() {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    destroySocket();
    setGameState(DEFAULT_GAME);
    setCountdown(null);
    setGameOver(null);
    setCharacter(null);
    setScreen(SCREENS.LOBBY);
  }

  function handleNextRound() {
    const socket = getSocket();
    socket.emit("next_round");
  }

  return (
    <>
      {screen === SCREENS.LOBBY && (
        <Lobby onStart={handleNameSubmit} connError={connError} />
      )}
      {screen === SCREENS.SELECT && (
        <CharacterSelect username={username} onSelect={handleCharacterSelect} connError={connError} />
      )}
      {screen === SCREENS.CONNECTING && (
        <ConnectingScreen character={character} message={wakeMsg} />
      )}
      {screen === SCREENS.CONSENT && (
        <CameraConsent onAccept={handleConsentAccept} onDecline={handleConsentDecline} />
      )}
      {screen === SCREENS.READY && (
        <StartMatchScreen character={character} gameState={gameState} onStart={handleStartMatch} />
      )}
      {screen === SCREENS.GAME && (
        <GameBoard
          gameState={gameStateWithCountdown}
          gestureRef={gestureRef}
          lastGoodGestureRef={lastGoodGestureRef}
          initialStream={cameraStreamRef.current}
          onNextRound={handleNextRound}
        />
      )}
      {screen === SCREENS.OVER && (
        <>
          <GameBoard
            gameState={gameStateWithCountdown}
            gestureRef={gestureRef}
            lastGoodGestureRef={lastGoodGestureRef}
            initialStream={cameraStreamRef.current}
            onNextRound={handleNextRound}
          />
          <GameOver
            winner={gameOver?.winner}
            playerUsername={username}
            aiCharacter={character}
            onPlayAgain={handlePlayAgain}
          />
        </>
      )}
    </>
  );
}

// ─── Connecting screen ────────────────────────────────────────────────────────
function ConnectingScreen({ character, message }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-8 p-6"
      style={{ background: "radial-gradient(ellipse 90% 70% at 50% 85%, #1a0505 0%, #030305 70%)" }}
    >
      {character && (
        <div className="w-28 h-28 rounded overflow-hidden"
          style={{ border: `2px solid ${character.accent}50`, boxShadow: `0 0 40px ${character.accent}20` }}>
          <img src={character.image} alt={character.name} className="w-full h-full object-cover object-top" />
        </div>
      )}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-stone-800" />
        <div className="absolute inset-0 rounded-full border-4 border-t-red-600 animate-spin" />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-white font-bold text-sm tracking-wide">{message}</p>
        <p className="text-stone-500 text-xs font-mono mt-2 leading-relaxed">
          The server may be waking up after inactivity.
          <br />This usually takes 30–60 seconds on first visit.
        </p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-red-600 animate-bounce"
            style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
      {character && (
        <p className="text-stone-600 text-xs font-mono uppercase tracking-widest">
          Preparing to fight {character.name}…
        </p>
      )}
    </div>
  );
}

// ─── Start Match screen ───────────────────────────────────────────────────────
function StartMatchScreen({ character, gameState, onStart }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 120% 80% at 50% 0%, #0d0008 0%, #030305 55%)", filter: "blur(2px)" }} />
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative z-10 w-full max-w-sm rounded flex flex-col items-center text-center gap-6 p-8"
        style={{
          background: "linear-gradient(160deg, #0a0a12, #070710)",
          border: character ? `1px solid ${character.accent}35` : "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.95)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: character ? `linear-gradient(90deg, transparent, ${character.accent}80, transparent)` : "linear-gradient(90deg, transparent, rgba(224,32,32,0.6), transparent)" }} />

        {character && (
          <div className="w-24 h-24 rounded overflow-hidden"
            style={{ border: `2px solid ${character.accent}60`, boxShadow: `0 0 30px ${character.accent}25` }}>
            <img src={character.image} alt={character.name} className="w-full h-full object-cover object-top" />
          </div>
        )}

        <div>
          <p className="text-xs font-mono text-stone-500 uppercase tracking-[0.3em] mb-1">Your opponent</p>
          <h2 className="text-2xl font-black text-white tracking-tight"
            style={{ textShadow: character ? `0 0 20px ${character.accent}60` : "none" }}>
            {character?.name ?? "Shadow AI"}
          </h2>
          <p className="text-xs font-mono mt-1" style={{ color: character?.accent ?? "#ef4444" }}>
            {character?.style ?? "Shadow Fighter"} · {character?.difficulty ?? ""}
          </p>
        </div>

        <div className="w-full flex justify-between text-xs font-mono text-stone-500">
          <span>Your HP: <span className="text-green-400 font-bold">{gameState.playerHp}</span></span>
          <span>Enemy HP: <span className="font-bold" style={{ color: character?.accent ?? "#ef4444" }}>{gameState.aiHp}</span></span>
        </div>

        <div className="w-full flex justify-around py-2 border-t border-white/5">
          {[["✊","Rock"],["✋","Paper"],["✌️","Scissors"]].map(([emoji, name]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <span className="text-xl">{emoji}</span>
              <span className="text-[9px] font-mono text-stone-600 uppercase tracking-widest">{name}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 rounded font-bold text-white text-sm uppercase tracking-[0.2em] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          style={{
            background: character ? `linear-gradient(135deg, ${character.accent}cc, ${character.accent}88)` : "linear-gradient(135deg, #b00000, #7a0000)",
            border: character ? `1px solid ${character.accent}60` : "1px solid rgba(224,32,32,0.5)",
            boxShadow: character ? `0 0 30px ${character.accent}25` : "0 0 20px rgba(224,32,32,0.2)",
          }}
        >
          ⚔ Start Match
        </button>

        <p className="text-stone-600 text-[10px] font-mono">Camera is ready · Round starts on your signal</p>

        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: character ? `linear-gradient(90deg, transparent, ${character.accent}35, transparent)` : "linear-gradient(90deg, transparent, rgba(224,32,32,0.2), transparent)" }} />
      </div>
    </div>
  );
}
