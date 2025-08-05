import React from 'react';

export default function StoryViewer() {
  // This path MUST match. The space in "Story Corner" is tricky.
  const storyUrl = "/Story Corner/index.html"; 

  return (
    <div>
      <iframe
        src={storyUrl}
        title="Story Corner"
        style={{ width: '100%', height: '80vh', border: 'none' }}
      />
    </div>
  );
}