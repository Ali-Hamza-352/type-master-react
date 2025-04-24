
import axiosInstance from "@/utils/axiosInstance";

export interface SubLesson {
  id: string;
  title: string;
  content: string;
  type: "theory" | "keys" | "words" | "characters" | "paragraph";
  duration: string;
}

export interface Lesson {
  id: number;
  title: string;
  progress: number;
  subLessons: SubLesson[];
}

export interface ProgressUpdate {
  lessonId: number;
  subLessonId: string;
  completed: boolean;
}

export interface UserProgress {
  completedLessons: string[];
  results: any[];
  lastActivity: string;
}

// Get all lessons
export const getAllLessons = async (): Promise<Lesson[]> => {
  try {
    const response = await axiosInstance.get('/lessons');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch lessons");
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

// Get user progress
export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const response = await axiosInstance.get('/lessons/progress');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch user progress");
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
};

// Update sub-lesson progress
export const updateLessonProgress = async (progressData: ProgressUpdate): Promise<void> => {
  try {
    const response = await axiosInstance.post('/lessons/progress/update', progressData);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update progress");
    }
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    throw error;
  }
};

// Reset user's own progress
export const resetUserProgress = async (): Promise<void> => {
  try {
    const response = await axiosInstance.post('/lessons/progress/reset');
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to reset progress");
    }
  } catch (error) {
    console.error("Error resetting user progress:", error);
    throw error;
  }
};

// Save typing result
export const saveTypingResult = async (result: any): Promise<void> => {
  try {
    await axiosInstance.post('/typing-results', result);
  } catch (error) {
    console.error('Failed to save typing result:', error);
    throw error;
  }
};
