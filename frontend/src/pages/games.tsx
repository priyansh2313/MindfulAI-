// File: frontend/src/pages/games.tsx

import { BrainCircuit, Calculator, Puzzle, GitBranch, Dices, Candy, Gamepad2 } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
// 👇 THIS IS THE CORRECTED PATH. It must start with ../
import styles from '../styles/gamesMenu.module.css';

const gamesList = [
  { id: 'memory_game', title: 'Memory Game', desc: 'Test and improve your memory.', icon: <Puzzle className={styles.gameIcon} /> },
  { id: 'number-recall', title: 'Number Recall', desc: 'Challenge your short-term memory.', icon: <Calculator className={styles.gameIcon} /> },
  { id: 'pattern-sequencing', title: 'Pattern Sequencing', desc: 'Follow and repeat the patterns.', icon: <GitBranch className={styles.gameIcon} /> },
  { id: 'snake-and-ladder', title: 'Snake & Ladder', desc: 'A classic game of luck.', icon: <Dices className={styles.gameIcon} /> },
  { id: 'sudoku-game', title: 'Sudoku', desc: 'A logic-based number puzzle.', icon: <BrainCircuit className={styles.gameIcon} /> },
  { id: 'sweets-match', title: 'Sweets Match', desc: 'Match the colorful sweets.', icon: <Candy className={styles.gameIcon} /> },
  { id: 'uno-game', title: 'Uno', desc: 'The classic card game.', icon: <Gamepad2 className={styles.gameIcon} /> },
];

export default function ElderGamesPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mindful Games</h1>
        <p className={styles.subtitle}>Choose an activity to relax and train your mind.</p>
      </div>
      <div className={styles.gamesGrid}>
        {gamesList.map(game => (
          <Link to={`/games/${game.id}`} key={game.id} className={styles.gameCard}>
            <div className={styles.iconContainer}>
              {game.icon}
            </div>
            <h3 className={styles.gameTitle}>{game.title}</h3>
            <p className={styles.gameDesc}>{game.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}