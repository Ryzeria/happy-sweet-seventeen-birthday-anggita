import { useState, useEffect, useRef } from 'react';

const useAudio = (src, options = {}) => {
  const {
    volume = 0.5,
    loop = false,
    autoPlay = false,
    preload = 'metadata'
  } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volumeState, setVolumeState] = useState(volume);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audio.preload = preload;
    audio.volume = volume;
    audio.loop = loop;
    
    audioRef.current = audio;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    const handleLoadStart = () => setIsLoading(true);
    const handleLoadedData = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e) => {
      setError(e.target.error);
      setIsLoading(false);
      setIsPlaying(false);
    };

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('durationchange', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Auto play if requested
    if (autoPlay) {
      play();
    }

    // Cleanup
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('durationchange', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      audio.pause();
      audio.src = '';
    };
  }, [src, volume, loop, autoPlay, preload]);

  const play = async () => {
    if (!audioRef.current) return;

    try {
      setError(null);
      await audioRef.current.play();
    } catch (err) {
      setError(err);
      console.error('Error playing audio:', err);
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  };

  const setVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  const mute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  const formatTime = (time) => {
    if (!time || !isFinite(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  };

  return {
    // State
    isPlaying,
    isLoading,
    duration,
    currentTime,
    volume: volumeState,
    error,
    
    // Controls
    play,
    pause,
    stop,
    toggle,
    seek,
    setVolume,
    mute,
    
    // Utilities
    formatTime,
    getProgress,
    
    // Computed values
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    progress: getProgress()
  };
};

export default useAudio;