import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface MusicTrack {
  title: string;
  videoId: string;
  cover: string;
  mood: string;
}

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  setTrack: (track: MusicTrack) => void;
  play: () => void;
  pause: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const setTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return (
    <MusicContext.Provider value={{ currentTrack, isPlaying, setTrack, play, pause }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within a MusicProvider');
  return context;
}; 