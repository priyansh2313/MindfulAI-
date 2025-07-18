import { ChevronDown, ChevronUp, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/MusicPlayer.module.css';
import { useMusic } from './MusicContext';
import MusicPlayer from './MusicPlayer';

const defaultPosition = { top: undefined, left: undefined, bottom: 24, right: 24 };

const floatingStyles: React.CSSProperties = {
  position: 'fixed',
  zIndex: 1000,
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  borderRadius: 24,
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(16px)',
  minWidth: 260,
  maxWidth: 340,
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
};

const progressBarStyles: React.CSSProperties = {
  width: '100%',
  height: 6,
  borderRadius: 3,
  background: 'rgba(0,0,0,0.08)',
  margin: '12px 0 8px 0',
  cursor: 'pointer',
  position: 'relative',
};

const progressFillStyles = (percent: number): React.CSSProperties => ({
  width: `${percent}%`,
  height: '100%',
  borderRadius: 3,
  background: 'linear-gradient(90deg, #4f8cff, #38e7b0)',
  transition: 'width 0.2s',
});

const coverAnimStyles: React.CSSProperties = {
  width: 90,
  height: 90,
  borderRadius: 16,
  objectFit: 'cover',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  marginBottom: 12,
  animation: 'pulse 2.5s infinite',
};

const minimizedStyles: React.CSSProperties = {
  minWidth: 80,
  maxWidth: 120,
  padding: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'grab',
  userSelect: 'none',
};

const FloatingMusicPlayer = () => {
  const { currentTrack, isPlaying, play, pause, setTrack } = useMusic();
  const [minimized, setMinimized] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showVolume, setShowVolume] = useState(false);
  const [tooltip, setTooltip] = useState('');
  const [visible, setVisible] = useState(true);
  const musicPlayerRef = useRef<any>(null);

  // Draggable state
  const [position, setPosition] = useState(defaultPosition);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  // Progress and time update
  useEffect(() => {
    let interval: any;
    const player = musicPlayerRef.current?.player;
    if (player && isPlaying) {
      interval = setInterval(() => {
        const dur = player.getDuration ? player.getDuration() : 0;
        const cur = player.getCurrentTime ? player.getCurrentTime() : 0;
        setDuration(dur);
        setCurrentTime(cur);
        setProgress(dur ? (cur / dur) * 100 : 0);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [musicPlayerRef, isPlaying]);

  // Play/pause control
  const handlePlayPause = () => {
    const player = musicPlayerRef.current?.player;
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
      pause();
    } else {
      player.playVideo();
      play();
    }
  };

  // Volume control
  const handleMute = () => {
    const player = musicPlayerRef.current?.player;
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
      setVolume(player.getVolume ? player.getVolume() : 100);
    } else {
      player.mute();
      setIsMuted(true);
      setVolume(0);
    }
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    const player = musicPlayerRef.current?.player;
    if (player) {
      player.setVolume(v);
      if (v === 0) {
        player.mute();
        setIsMuted(true);
      } else {
        player.unMute();
        setIsMuted(false);
      }
    }
  };

  // Seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const player = musicPlayerRef.current?.player;
    if (!player || !duration) return;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTo = percent * duration;
    player.seekTo(seekTo, true);
    setCurrentTime(seekTo);
    setProgress(percent * 100);
  };

  // Format time
  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Drag handlers (only when minimized)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!minimized) return;
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - (position.left !== undefined ? position.left : window.innerWidth - (position.right ?? 24) - 120),
      y: e.clientY - (position.top !== undefined ? position.top : window.innerHeight - (position.bottom ?? 24) - 80),
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    let newLeft = e.clientX - dragOffset.current.x;
    let newTop = e.clientY - dragOffset.current.y;
    // Clamp to viewport
    newLeft = Math.max(0, Math.min(window.innerWidth - 120, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - 80, newTop));
    setPosition({ top: newTop, left: newLeft, bottom: undefined, right: undefined });
  };
  const handleMouseUp = () => {
    dragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Reset position when expanded
  useEffect(() => {
    if (!minimized) setPosition(defaultPosition);
  }, [minimized]);

  // Close player and stop music
  const handleClose = () => {
    // Stop music
    const player = musicPlayerRef.current?.player;
    if (player) player.stopVideo();
    setTrack(null); // clear current track in context
    setVisible(false);
  };

  if (!currentTrack || !visible) return null;

  const style: React.CSSProperties = minimized
    ? {
        ...floatingStyles,
        ...minimizedStyles,
        ...position,
        height: 80,
        width: 120,
        overflow: 'hidden',
      }
    : {
        ...floatingStyles,
        padding: 24,
        ...defaultPosition,
        height: 'auto',
        width: '100%',
        overflow: 'hidden',
      };

  return (
    <div
      style={style}
      onMouseDown={minimized ? handleMouseDown : undefined}
    >
      {/* Close button (top right) */}
      <button
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={handleClose}
        title="Close"
      >
        <X size={20} />
      </button>
      {minimized ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
          <img
            src={currentTrack.cover}
            style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }}
            alt="cover"
          />
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setMinimized(false)}
            title="Expand"
          >
            <ChevronUp />
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#4f46e5', fontSize: 16, letterSpacing: 0.5 }}>🎶 Now Playing</span>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setMinimized(true)}
              title="Minimize"
            >
              <ChevronDown />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
            <img
              src={currentTrack.cover}
              style={coverAnimStyles}
              alt="Now Playing Cover"
            />
            <h2 className={styles.title} style={{ margin: '8px 0 0 0', fontSize: 20 }}>{currentTrack.title}</h2>
            <p className={styles.mood} style={{ margin: 0, color: '#64748b' }}>Mood: {currentTrack.mood}</p>
          </div>
          {/* Progress Bar */}
          <div style={progressBarStyles} onClick={handleSeek} title="Seek">
            <div style={progressFillStyles(progress)} />
            <div style={{ position: 'absolute', left: 8, top: 8, fontSize: 12, color: '#64748b' }}>{formatTime(currentTime)}</div>
            <div style={{ position: 'absolute', right: 8, top: 8, fontSize: 12, color: '#64748b' }}>{formatTime(duration)}</div>
          </div>
          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginTop: 8 }}>
            <button
              className={styles.controlBtn}
              onClick={handlePlayPause}
              onMouseEnter={() => setTooltip(isPlaying ? 'Pause' : 'Play')}
              onMouseLeave={() => setTooltip('')}
              style={{ transition: 'background 0.3s, transform 0.2s' }}
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button
              className={styles.controlBtn}
              onClick={handleMute}
              onMouseEnter={() => setTooltip(isMuted ? 'Unmute' : 'Mute')}
              onMouseLeave={() => setTooltip('')}
              style={{ transition: 'background 0.3s, transform 0.2s' }}
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>
            <div style={{ position: 'relative' }}>
              <button
                className={styles.controlBtn}
                onClick={() => setShowVolume((v) => !v)}
                onMouseEnter={() => setTooltip('Volume')}
                onMouseLeave={() => setTooltip('')}
                style={{ transition: 'background 0.3s, transform 0.2s' }}
              >
                <span style={{ fontSize: 18 }}>🔊</span>
              </button>
              {showVolume && (
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{ position: 'absolute', left: '110%', top: 0, width: 80 }}
                />
              )}
            </div>
          </div>
          {/* Tooltip */}
          {tooltip && (
            <div style={{ position: 'absolute', bottom: 70, right: 24, background: '#222', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 13, pointerEvents: 'none', opacity: 0.9 }}>
              {tooltip}
            </div>
          )}
        </>
      )}
      {/* Always render the hidden player */}
      <div style={{ display: 'none' }}>
        <MusicPlayer
          track={currentTrack}
          ref={musicPlayerRef}
        />
      </div>
    </div>
  );
};

export default FloatingMusicPlayer; 