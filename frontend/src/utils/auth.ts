// Auth utility functions for user session management

/**
 * Comprehensive logout function that clears user session data from localStorage
 * This ensures that when a new user logs in, they don't see the previous user's data
 * Note: Server-side data (evaluation scores, etc.) will be retrieved fresh on login
 */
export const clearAllUserData = (): void => {
  try {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    
    // Clear local session data that should be fresh on each login
    localStorage.removeItem('todayMood');
    localStorage.removeItem('moodHistory');
    localStorage.removeItem('activityHistory');
    
    // Clear journal data (these are local and should be cleared)
    localStorage.removeItem('journalEntries');
    localStorage.removeItem('journalImages');
    localStorage.removeItem('journalTextBoxes');
    
    // Clear other local session data
    localStorage.removeItem('streak');
    localStorage.removeItem('badges');
    localStorage.removeItem('goals');
    localStorage.removeItem('notes');
    localStorage.removeItem('reminders');
    
    // Clear any care connect data
    const careConnectKeys = [
      'careConnectCheckins',
      'careConnectResponses',
      'careConnectSettings',
      'careConnectFamilyMembers'
    ];
    
    careConnectKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Note: We DON'T clear evaluation data here because it should be retrieved from server
    // localStorage.removeItem('evaluationScore');
    // localStorage.removeItem('evaluationResult');
    // localStorage.removeItem('evaluationHistory');
    
    console.log('✅ User session data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing user data:', error);
  }
};

/**
 * Logout function that clears data and redirects to login
 */
export const logout = (navigate: (path: string) => void): void => {
  clearAllUserData();
  navigate('/login');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Get current user data
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr && userStr !== 'undefined') {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
}; 