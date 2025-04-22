
import { useState, useEffect } from 'react';

export interface SubLesson {
  id: string;
  title: string;
  content: string;
}

export interface Lesson {
  id: number;
  title: string;
  subLessons: SubLesson[];
}

export interface LessonData {
  lessons: Lesson[];
}

export const useLessonData = (lessonId?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<SubLesson | null>(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await fetch('/src/assets/lessonData.json');
        if (!response.ok) {
          throw new Error('Failed to load lesson data');
        }
        const data: LessonData = await response.json();
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
      }
    };

    fetchLessonData();
  }, [lessonId]);

  return { loading, error, lessonData, currentLesson };
};
