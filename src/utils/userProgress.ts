
import axiosInstance from './axiosInstance';
import { getUserProgress as fetchUserProgress, updateLessonProgress, saveTypingResult as saveResult } from '@/services/lessonService';
import { getToken } from './axiosInstance';

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

// Cache for user progress
let progressCache: UserProgress | null = null;

export const saveTypingResult = async (result: TypingResult) => {
  try {
    // Only proceed if user is authenticated
    if (getToken()) {
      await saveResult(result);
      
      // Also mark sub-lesson as completed if applicable
      if (result.lessonId) {
        const lessonParts = result.lessonId.split('.');
        if (lessonParts.length >= 2) {
          const lessonId = parseInt(lessonParts[0]);
          await updateLessonProgress({
            lessonId,
            subLessonId: result.lessonId,
            completed: true
          });
        }
      }
      
      // Update local cache
      if (progressCache) {
        progressCache.results.push(result);
        
        // Add to completed lessons if applicable
        if (result.lessonId && !progressCache.completedLessons.includes(result.lessonId)) {
          progressCache.completedLessons.push(result.lessonId);
        }
        
        // Update last activity
        progressCache.lastActivity = new Date().toISOString();
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to save typing result:', error);
    return false;
  }
};

export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    // If we have cached data and user is logged in, return it
    if (progressCache && getToken()) {
      return progressCache;
    }
    
    // Try to get from API if user is logged in
    if (getToken()) {
      try {
        const progress = await fetchUserProgress();
        progressCache = progress;
        return progress;
      } catch (error) {
        console.error("Failed to fetch user progress:", error);
      }
    }
    
    // Default empty progress
    return {
      completedLessons: [],
      results: [],
      lastActivity: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in getUserProgress:", error);
    return {
      completedLessons: [],
      results: [],
      lastActivity: new Date().toISOString()
    };
  }
};

export const syncUserProgress = async () => {
  // This is handled automatically by the API now
  return true;
};

export const checkCourseCompletion = async (): Promise<boolean> => {
  try {
    const progress = await getUserProgress();
    // Define what constitutes course completion (e.g., completing all 12 lessons)
    return progress.completedLessons.length >= 12;
  } catch (error) {
    console.error("Error checking course completion:", error);
    return false;
  }
};
