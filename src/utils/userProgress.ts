
import axiosInstance from './axiosInstance';

export interface TypingResult {
  lessonId?: string;
  type?: string;
  wpm: number;
  accuracy: number;
  mistakes: number;
  timeSpent?: string;
  date: string;
  [key: string]: any;
}

export interface UserProgress {
  completedLessons: string[];
  results: TypingResult[];
  lastActivity: string;
}

export const saveTypingResult = async (result: TypingResult) => {
  // First, save to localStorage
  const savedResults = JSON.parse(localStorage.getItem("typingResults") || "[]");
  savedResults.push(result);
  localStorage.setItem("typingResults", JSON.stringify(savedResults));
  
  // Update user progress
  updateUserProgress(result);
  
  // Then try to save to backend (will fail gracefully if not connected)
  try {
    if (localStorage.getItem('authToken')) {
      await axiosInstance.post('/typing-results', result);
    }
  } catch (error) {
    console.error('Failed to save typing result to server:', error);
  }
};

export const updateUserProgress = (result: TypingResult) => {
  const progressData: UserProgress = JSON.parse(localStorage.getItem("userProgress") || 
    JSON.stringify({
      completedLessons: [],
      results: [],
      lastActivity: new Date().toISOString()
    })
  );
  
  // Add to results
  progressData.results.push(result);
  
  // Add to completed lessons if applicable
  if (result.lessonId && !progressData.completedLessons.includes(result.lessonId)) {
    progressData.completedLessons.push(result.lessonId);
  }
  
  // Update last activity
  progressData.lastActivity = new Date().toISOString();
  
  // Save back to localStorage
  localStorage.setItem("userProgress", JSON.stringify(progressData));
  
  return progressData;
};

export const getUserProgress = (): UserProgress => {
  return JSON.parse(localStorage.getItem("userProgress") || 
    JSON.stringify({
      completedLessons: [],
      results: [],
      lastActivity: new Date().toISOString()
    })
  );
};

export const syncUserProgress = async () => {
  try {
    if (localStorage.getItem('authToken')) {
      const progressData = getUserProgress();
      await axiosInstance.post('/sync-progress', progressData);
    }
  } catch (error) {
    console.error('Failed to sync user progress with server:', error);
  }
};

export const checkCourseCompletion = (): boolean => {
  const progress = getUserProgress();
  // Define what constitutes course completion (e.g., completing all 12 lessons)
  // This is just a simple example - adjust based on your app's requirements
  return progress.completedLessons.length >= 12;
};
