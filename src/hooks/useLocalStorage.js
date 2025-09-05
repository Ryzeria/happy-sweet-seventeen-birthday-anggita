import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Hook for managing user preferences
export const usePreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('birthday-preferences', {
    soundEnabled: true,
    musicEnabled: true,
    animationsEnabled: true,
    autoPlayMusic: false,
    theme: 'default', // default, dark, romantic
    volume: 0.5,
    showHints: true,
    language: 'id' // id, en
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetPreferences = () => {
    setPreferences({
      soundEnabled: true,
      musicEnabled: true,
      animationsEnabled: true,
      autoPlayMusic: false,
      theme: 'default',
      volume: 0.5,
      showHints: true,
      language: 'id'
    });
  };

  return {
    preferences,
    setPreferences,
    updatePreference,
    resetPreferences
  };
};

// Hook for managing user session data
export const useSession = () => {
  const [session, setSession] = useLocalStorage('birthday-session', {
    visitCount: 0,
    firstVisit: null,
    lastVisit: null,
    timeSpent: 0,
    levelsVisited: [],
    bookmarks: [],
    favoriteMessages: []
  });

  const updateSession = (updates) => {
    setSession(prev => ({
      ...prev,
      ...updates,
      lastVisit: Date.now()
    }));
  };

  const incrementVisitCount = () => {
    const now = Date.now();
    setSession(prev => ({
      ...prev,
      visitCount: prev.visitCount + 1,
      lastVisit: now,
      firstVisit: prev.firstVisit || now
    }));
  };

  const addTimeSpent = (seconds) => {
    setSession(prev => ({
      ...prev,
      timeSpent: prev.timeSpent + seconds
    }));
  };

  const visitLevel = (levelId) => {
    setSession(prev => ({
      ...prev,
      levelsVisited: [...new Set([...prev.levelsVisited, levelId])]
    }));
  };

  const addBookmark = (item) => {
    setSession(prev => ({
      ...prev,
      bookmarks: [...prev.bookmarks, { ...item, addedAt: Date.now() }]
    }));
  };

  const removeBookmark = (id) => {
    setSession(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(bookmark => bookmark.id !== id)
    }));
  };

  const addFavoriteMessage = (message) => {
    setSession(prev => ({
      ...prev,
      favoriteMessages: [...prev.favoriteMessages, { ...message, addedAt: Date.now() }]
    }));
  };

  const getSessionStats = () => {
    const totalLevels = 17;
    const levelsVisitedCount = session.levelsVisited.length;
    const explorationPercentage = Math.round((levelsVisitedCount / totalLevels) * 100);
    
    return {
      ...session,
      explorationPercentage,
      averageTimePerLevel: levelsVisitedCount > 0 ? Math.round(session.timeSpent / levelsVisitedCount) : 0,
      isReturningVisitor: session.visitCount > 1,
      daysSinceFirstVisit: session.firstVisit ? Math.floor((Date.now() - session.firstVisit) / (1000 * 60 * 60 * 24)) : 0
    };
  };

  return {
    session,
    setSession,
    updateSession,
    incrementVisitCount,
    addTimeSpent,
    visitLevel,
    addBookmark,
    removeBookmark,
    addFavoriteMessage,
    getSessionStats
  };
};

// Hook for managing game saves
export const useGameSave = (gameId) => {
  const [saveData, setSaveData] = useLocalStorage(`game-save-${gameId}`, {
    progress: 0,
    score: 0,
    completedAt: null,
    attempts: 0,
    bestScore: 0,
    bestTime: null,
    hints: 3,
    achievements: []
  });

  const updateSave = (updates) => {
    setSaveData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const completeGame = (score, time) => {
    setSaveData(prev => ({
      ...prev,
      completedAt: Date.now(),
      score: Math.max(prev.score, score),
      bestScore: Math.max(prev.bestScore, score),
      bestTime: prev.bestTime ? Math.min(prev.bestTime, time) : time
    }));
  };

  const incrementAttempts = () => {
    setSaveData(prev => ({
      ...prev,
      attempts: prev.attempts + 1
    }));
  };

  const useHint = () => {
    setSaveData(prev => ({
      ...prev,
      hints: Math.max(0, prev.hints - 1)
    }));
  };

  const addAchievement = (achievement) => {
    setSaveData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { ...achievement, unlockedAt: Date.now() }]
    }));
  };

  const resetSave = () => {
    setSaveData({
      progress: 0,
      score: 0,
      completedAt: null,
      attempts: 0,
      bestScore: 0,
      bestTime: null,
      hints: 3,
      achievements: []
    });
  };

  return {
    saveData,
    setSaveData,
    updateSave,
    completeGame,
    incrementAttempts,
    useHint,
    addAchievement,
    resetSave,
    isCompleted: !!saveData.completedAt,
    hasHints: saveData.hints > 0
  };
};

export default useLocalStorage;