import { useState, useEffect } from 'react';

const useProgress = (storageKey = 'birthday-progress') => {
  const [progress, setProgress] = useState({
    completedLevels: [],
    currentLevel: 1,
    totalScore: 0,
    achievements: [],
    timeSpent: 0,
    startTime: null
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress(prev => ({
          ...prev,
          ...parsed,
          startTime: parsed.startTime || Date.now()
        }));
      } catch (error) {
        console.error('Error loading progress:', error);
        // Initialize with start time if parsing fails
        setProgress(prev => ({
          ...prev,
          startTime: Date.now()
        }));
      }
    } else {
      // First time visit
      setProgress(prev => ({
        ...prev,
        startTime: Date.now()
      }));
    }
  }, [storageKey]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (progress.startTime) {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [progress, storageKey]);

  // Mark level as completed
  const completeLevel = (levelId, score = 0, timeSpent = 0) => {
    setProgress(prev => {
      const completedLevels = [...prev.completedLevels];
      if (!completedLevels.includes(levelId)) {
        completedLevels.push(levelId);
      }

      const nextLevel = Math.min(levelId + 1, 17);
      
      return {
        ...prev,
        completedLevels,
        currentLevel: levelId >= 17 ? 17 : nextLevel,
        totalScore: prev.totalScore + score,
        timeSpent: prev.timeSpent + timeSpent
      };
    });
  };

  // Add achievement
  const addAchievement = (achievement) => {
    setProgress(prev => {
      const achievements = [...prev.achievements];
      if (!achievements.find(a => a.id === achievement.id)) {
        achievements.push({
          ...achievement,
          unlockedAt: Date.now()
        });
      }
      return {
        ...prev,
        achievements
      };
    });
  };

  // Check if level is unlocked
  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) return true;
    return progress.completedLevels.includes(levelId - 1);
  };

  // Check if level is completed
  const isLevelCompleted = (levelId) => {
    return progress.completedLevels.includes(levelId);
  };

  // Get completion percentage
  const getCompletionPercentage = () => {
    return Math.round((progress.completedLevels.length / 17) * 100);
  };

  // Get time spent in readable format
  const getTimeSpentFormatted = () => {
    const totalMinutes = Math.floor(progress.timeSpent / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Get total time since start
  const getTotalTimeSpent = () => {
    if (!progress.startTime) return 0;
    return Math.floor((Date.now() - progress.startTime) / 1000);
  };

  // Reset progress
  const resetProgress = () => {
    const initialProgress = {
      completedLevels: [],
      currentLevel: 1,
      totalScore: 0,
      achievements: [],
      timeSpent: 0,
      startTime: Date.now()
    };
    setProgress(initialProgress);
    localStorage.setItem(storageKey, JSON.stringify(initialProgress));
  };

  // Get progress statistics
  const getStats = () => {
    const totalTimeSpent = getTotalTimeSpent();
    const averageTimePerLevel = progress.completedLevels.length > 0 
      ? Math.floor(totalTimeSpent / progress.completedLevels.length)
      : 0;

    return {
      levelsCompleted: progress.completedLevels.length,
      totalLevels: 17,
      completionPercentage: getCompletionPercentage(),
      totalScore: progress.totalScore,
      averageScore: progress.completedLevels.length > 0 
        ? Math.floor(progress.totalScore / progress.completedLevels.length)
        : 0,
      achievements: progress.achievements.length,
      timeSpent: getTimeSpentFormatted(),
      totalTimeSpent,
      averageTimePerLevel,
      currentLevel: progress.currentLevel,
      isComplete: progress.completedLevels.length === 17
    };
  };

  // Check for new achievements based on progress
  const checkAchievements = () => {
    const stats = getStats();
    const newAchievements = [];

    // Level completion achievements
    if (stats.levelsCompleted >= 5 && !progress.achievements.find(a => a.id === 'first-5-levels')) {
      newAchievements.push({
        id: 'first-5-levels',
        title: 'Getting Started! 🌟',
        description: 'Completed your first 5 levels',
        icon: '🌟',
        rarity: 'common'
      });
    }

    if (stats.levelsCompleted >= 10 && !progress.achievements.find(a => a.id === 'halfway-hero')) {
      newAchievements.push({
        id: 'halfway-hero',
        title: 'Halfway Hero 🚀',
        description: 'Reached the halfway point!',
        icon: '🚀',
        rarity: 'uncommon'
      });
    }

    if (stats.levelsCompleted === 17 && !progress.achievements.find(a => a.id === 'birthday-champion')) {
      newAchievements.push({
        id: 'birthday-champion',
        title: 'Birthday Champion! 🎂',
        description: 'Completed all 17 levels!',
        icon: '🎂',
        rarity: 'legendary'
      });
    }

    // Score achievements
    if (stats.totalScore >= 1000 && !progress.achievements.find(a => a.id === 'score-master')) {
      newAchievements.push({
        id: 'score-master',
        title: 'Score Master 💎',
        description: 'Earned 1000+ total points',
        icon: '💎',
        rarity: 'rare'
      });
    }

    // Time achievements
    if (stats.totalTimeSpent >= 3600 && !progress.achievements.find(a => a.id === 'time-invested')) {
      newAchievements.push({
        id: 'time-invested',
        title: 'Time Well Spent ⏰',
        description: 'Spent over 1 hour on this journey',
        icon: '⏰',
        rarity: 'common'
      });
    }

    // Add new achievements
    newAchievements.forEach(achievement => {
      addAchievement(achievement);
    });

    return newAchievements;
  };

  return {
    progress,
    completeLevel,
    addAchievement,
    isLevelUnlocked,
    isLevelCompleted,
    getCompletionPercentage,
    getTimeSpentFormatted,
    getTotalTimeSpent,
    resetProgress,
    getStats,
    checkAchievements
  };
};

export default useProgress;