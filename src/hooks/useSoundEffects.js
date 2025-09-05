import { useRef, useCallback } from 'react';

export const useSoundEffects = () => {
  const audioRefs = useRef({});

  const preloadSounds = useCallback((sounds) => {
    sounds.forEach(({ name, src }) => {
      if (!audioRefs.current[name]) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = 0.5;
        audioRefs.current[name] = audio;
      }
    });
  }, []);

  const playSound = useCallback(async (soundName, volume = 0.5) => {
    const audio = audioRefs.current[soundName];
    if (!audio) {
      console.warn(`Sound ${soundName} not found`);
      return;
    }

    try {
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.currentTime = 0; // Reset to beginning
      await audio.play();
    } catch (error) {
      console.error(`Error playing sound ${soundName}:`, error);
    }
  }, []);

  const stopSound = useCallback((soundName) => {
    const audio = audioRefs.current[soundName];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const setVolume = useCallback((soundName, volume) => {
    const audio = audioRefs.current[soundName];
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    preloadSounds,
    playSound,
    stopSound,
    setVolume
  };
};