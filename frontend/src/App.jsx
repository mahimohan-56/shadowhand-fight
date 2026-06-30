import React, { useState, useRef, useCallback } from "react";
import { getSocket, destroySocket } from "./utils/socket.js";
import Lobby from "./components/Lobby.jsx";
import CharacterSelect from "./components/CharacterSelect.jsx";
import GameBoard from "./components/GameBoard.jsx";
import GameOver from "./components/GameOver.jsx";

const SCREENS = { LOBBY: "lobby", SELECT: "select", GAME: "game", OVER: "over" };

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
  const [gameOver,  setGameOver]  = useState(null);
  const [connError, setConnError] = useState(null);

  // gestureRef.current = currentGestureRef from useMediaPipe
  // gestureRef.current.current = live gesture string, zero React lag
  const gestureRef = useRef(null);

  const setupSocket = useCallback((uname, char) => {
    const socket = getSocket();
    socket.off();

    socket.on("connect", () => {
      setConnError(null);
      // UPDATED: Now passes the complete character profile object as 'opponent'
      // to match what server.js reads for dynamic AI behavior configurations.
      socket.emit("start_ai_match", { username: uname, opponent: char });
    });

    socket.on("connect_error", () =>
      setConnError("Cannot reach server. Is the backend running on port 3001?")
    );

    socket.on("match_found", ({ yourUsername, aiName, playerHp, aiHp }) => {
      setGameState({
        ...DEFAULT_GAME,
        playerUsername: yourUsername,
        aiName,
        aiCharacter: char,
        playerHp,
        aiHp,
      });
      setScreen(SCREENS.GAME);
    });

    socket.on("round_start", ({ round }) => {
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
      setGameState(prev => ({ ...prev, countdown }));
    });

    socket.on("lock_move", () => {
      setGameState(prev => ({ ...prev, phase: "grace" }));
      // Read gesture via ref — avoids stale closure entirely
      const move = gestureRef.current?.current ?? "none";
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
    setupSocket(username, char);
  }

  function handlePlayAgain() {
    destroySocket();
    setGameState(DEFAULT_GAME);
    setGameOver(null);
    setCharacter(null);
    setScreen(SCREENS.LOBBY);
  }

  return (
    <>
      {screen === SCREENS.LOBBY && (
        <Lobby onStart={handleNameSubmit} connError={connError} />
      )}
      {screen === SCREENS.SELECT && (
        <CharacterSelect username={username} onSelect={handleCharacterSelect} connError={connError} />
      )}
      {screen === SCREENS.GAME && (
        <GameBoard gameState={gameState} gestureRef={gestureRef} />
      )}
      {screen === SCREENS.OVER && (
        <>
          <GameBoard gameState={gameState} gestureRef={gestureRef} />
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