
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
    console.log("getAllLessons response:", response.data);
    
    if (response.data && response.data.success) {
      return response.data.data || [];
    }
    throw new Error(response.data?.message || "Failed to fetch lessons");
  } catch (error: any) {
    console.error("Error fetching lessons:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Get user progress
export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const response = await axiosInstance.get('/lessons/progress');
    console.log("getUserProgress response:", response.data);
    
    if (response.data && response.data.success) {
      return response.data.data || { 
        completedLessons: [],
        results: [],
        lastActivity: new Date().toISOString()
      };
    }
    throw new Error(response.data?.message || "Failed to fetch user progress");
  } catch (error: any) {
    console.error("Error fetching user progress:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Update sub-lesson progress
export const updateLessonProgress = async (progressData: ProgressUpdate): Promise<void> => {
  try {
    const response = await axiosInstance.post('/lessons/progress/update', progressData);
    console.log("updateLessonProgress response:", response.data);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || "Failed to update progress");
    }
  } catch (error: any) {
    console.error("Error updating lesson progress:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Reset user's own progress
export const resetUserProgress = async (): Promise<void> => {
  try {
    const response = await axiosInstance.post('/lessons/progress/reset');
    console.log("resetUserProgress response:", response.data);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || "Failed to reset progress");
    }
  } catch (error: any) {
    console.error("Error resetting user progress:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Save typing result
export const saveTypingResult = async (result: any): Promise<void> => {
  try {
    const response = await axiosInstance.post('/typing-results', result);
    console.log("saveTypingResult response:", response.data);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || "Failed to save typing result");
    }
  } catch (error: any) {
    console.error('Failed to save typing result:', error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};
