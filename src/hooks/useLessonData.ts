
import { useState, useEffect } from 'react';
import { getAllLessons } from '@/services/lessonService';
import type { SubLesson, Lesson } from '@/services/lessonService';

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
        const data: LessonData = { lessons };
        setLessonData(data);

        if (lessonId) {
          // Find the specific lesson if lessonId is provided
          for (const lesson of data.lessons) {
            const subLesson = lesson.subLessons.find(sub => sub.id === lessonId);
            if (subLesson) {
              setCurrentLesson(subLesson);
              break;
            }
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading lesson data:', err);
        setError('Failed to load lesson data. Please try again.');
        setLoading(false);
        
        // Fallback to local file if API fails
        try {
          const response = await fetch('/src/assets/lessonData.json');
          if (response.ok) {
            const data: LessonData = await response.json();
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
