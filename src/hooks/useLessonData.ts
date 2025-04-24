
import { useState, useEffect } from 'react';
import { getAllLessons } from '@/services/lessonService';
import type { SubLesson, Lesson } from '@/services/lessonService';
import { toast } from '@/components/ui/use-toast';

export interface LessonData {
  lessons: Lesson[];
}

// Re-export types using 'export type' syntax for isolatedModules compatibility
export type { SubLesson, Lesson };

export const useLessonData = (lessonId?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<SubLesson | null>(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const lessons = await getAllLessons();
        console.log("Fetched lessons:", lessons);
        
        const data: LessonData = { lessons };
        setLessonData(data);

        if (lessonId && lessons.length > 0) {
          // Find the specific lesson if lessonId is provided
          let found = false;
          for (const lesson of lessons) {
            const subLesson = lesson.subLessons.find(sub => sub.id === lessonId);
            if (subLesson) {
              console.log("Found sub-lesson:", subLesson);
              setCurrentLesson(subLesson);
              found = true;
              break;
            }
          }
          
          if (!found) {
            console.warn(`Sub-lesson with ID ${lessonId} not found in the fetched lessons`);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading lesson data:', err);
        setError('Failed to load lesson data. Please try again.');
        setLoading(false);
        
        // Fallback to local file if API fails
        try {
          console.log("Attempting to load lesson data from local file");
          const response = await fetch('/src/assets/lessonData.json');
          if (response.ok) {
            const data: LessonData = await response.json();
            console.log("Loaded lesson data from local file:", data);
            setLessonData(data);
            
            if (lessonId) {
              for (const lesson of data.lessons) {
                const subLesson = lesson.subLessons.find(sub => sub.id === lessonId);
                if (subLesson) {
                  setCurrentLesson(subLesson);
                  break;
                }
              }
            }
            
            toast({
              title: "Using offline lesson data",
              description: "Could not connect to the server. Using locally stored lessons instead.",
              variant: "warning"
            });
          }
        } catch (fallbackError) {
          console.error('Fallback lesson data loading failed:', fallbackError);
        }
      }
    };

    fetchLessonData();
  }, [lessonId]);

  return { loading, error, lessonData, currentLesson };
};
