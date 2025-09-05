export const handleLevelCompletion = (levelId, additionalData = {}) => {
  // Play success sound
  if (typeof window !== 'undefined' && window.playSuccessSound) {
    window.playSuccessSound();
  }

  // Update progress
  if (typeof window !== 'undefined' && window.handleLevelComplete) {
    window.handleLevelComplete(levelId, additionalData);
  }

  // Show completion notification
  if (typeof window !== 'undefined' && window.playNotificationSound) {
    setTimeout(() => {
      window.playNotificationSound();
    }, 1000);
  }
};
