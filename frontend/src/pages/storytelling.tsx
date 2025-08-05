import React from 'react';
import { Link } from 'react-router-dom';

export default function ElderStorytellingPage() {
  return (
    <div>
      <h1>Calming Stories</h1>
      <p>Select a story to listen to.</p>
      {/* Corrected path */}
      <Link to="/storytelling/story-corner-main">
        Enter the Story Corner
      </Link>
    </div>
  );
}