"use client";

import { FormEvent, useEffect, useState } from "react";

const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

function createTargetNumber() {
  return Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
}

type Feedback = {
  message: string;
  tone: "neutral" | "success" | "warning";
};

function GameHeader() {
  return (
    <header className="game-header">
      <div className="eyebrow">A tiny challenge</div>
      <h1 id="game-title">Number Guessing Game</h1>
      <p>Find the hidden number between 1 and 100.</p>
    </header>
  );
}

function GuessForm({
  guess,
  feedback,
  gameOver,
  onGuessChange,
  onSubmit,
}: {
  guess: string;
  feedback: Feedback;
  gameOver: boolean;
  onGuessChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="guess-form" onSubmit={onSubmit} noValidate>
      <label htmlFor="guess">Your guess</label>
      <div className="input-row">
        <input
          id="guess"
          name="guess"
          type="number"
          inputMode="numeric"
          min={MIN_NUMBER}
          max={MAX_NUMBER}
          step={1}
          value={guess}
          onChange={(event) => onGuessChange(event.target.value)}
          placeholder="e.g. 42"
          aria-describedby="feedback"
          disabled={gameOver}
        />
        <button type="submit" disabled={gameOver}>
          Guess
        </button>
      </div>
      <p id="feedback" className={`feedback feedback-${feedback.tone}`} role="status" aria-live="polite">
        {feedback.message}
      </p>
    </form>
  );
}

function Attempts({ count }: { count: number }) {
  return (
    <div className="attempts" aria-label={`${count} attempts made`}>
      <span className="attempts-label">Attempts</span>
      <strong>{count}</strong>
    </div>
  );
}

export default function Home() {
  const [target, setTarget] = useState<number | null>(null);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({
    message: "Make your first guess to begin.",
    tone: "neutral",
  });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setTarget(createTargetNumber());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (target === null) return;

    const parsedGuess = Number(guess);
    if (!guess.trim() || !Number.isInteger(parsedGuess) || parsedGuess < MIN_NUMBER || parsedGuess > MAX_NUMBER) {
      setFeedback({
        message: "Enter a whole number from 1 to 100.",
        tone: "warning",
      });
      return;
    }

    setAttempts((currentAttempts) => currentAttempts + 1);

    if (parsedGuess === target) {
      setFeedback({ message: "Correct! You found it.", tone: "success" });
      setGameOver(true);
    } else if (parsedGuess > target) {
      setFeedback({ message: "Too high. Try a smaller number.", tone: "warning" });
    } else {
      setFeedback({ message: "Too low. Try a larger number.", tone: "warning" });
    }

    setGuess("");
  }

  function restartGame() {
    setTarget(createTargetNumber());
    setGuess("");
    setAttempts(0);
    setFeedback({ message: "Make your first guess to begin.", tone: "neutral" });
    setGameOver(false);
  }

  return (
    <main className="game-shell">
      <section className="game-card" aria-labelledby="game-title">
        <GameHeader />
        <div className="game-content">
          <GuessForm
            guess={guess}
            feedback={feedback}
            gameOver={gameOver}
            onGuessChange={setGuess}
            onSubmit={handleSubmit}
          />
          <div className="game-footer">
            <Attempts count={attempts} />
            <button className="restart-button" type="button" onClick={restartGame}>
              Restart Game
            </button>
          </div>
        </div>
      </section>
      <p className="footer-note">Use your instincts. You’ve got this.</p>
    </main>
  );
}
