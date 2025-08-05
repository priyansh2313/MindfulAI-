// File: frontend/src/pages/GameViewer.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

export default function GameViewer() {
  const { gameId } = useParams();
  const gameUrl = `/Mindful_Games/${gameId}/index.html`; 
  return (
    <div>
      <iframe src={gameUrl} title={`Mindful Game: ${gameId}`} style={{ width: '100%', height: '100vh', border: 'none' }} />
    </div>
  );
}