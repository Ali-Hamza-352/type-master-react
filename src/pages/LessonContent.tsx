
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { TimerChart, ProgressDataPoint } from "@/components/studying/TimerChart";
import { TypingInterface } from "@/components/studying/TypingInterface";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLessonData } from "@/hooks/useLessonData";
import { toast } from "@/components/ui/use-toast";
import { saveTypingResult, checkCourseCompletion } from "@/utils/userProgress";
import { useAuth } from "@/hooks/useAuth";

type LessonType = 'words' | 'characters' | 'keys' | 'paragraph' | 'theory';

const LessonContent = () => {
  const { lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const lessonType = searchParams.get('type') as LessonType || 'words';
  const [timeRemaining, setTimeRemaining] = useState(300); // Default 5 minutes
  const [progress, setProgress] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [typingStats, setTypingStats] = useState({ 
    accuracy: 0, 
    wpm: 0,
    mistakes: 0 
  });
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(3); // Default 3 minutes
  const [progressData, setProgressData] = useState<ProgressDataPoint[]>([]);
  const [courseCompleted, setCourseCompleted] = useState(false);
  
  const { loading, error, currentLesson } = useLessonData(lessonId);

  useEffect(() => {
    // Reset timer when duration changes
    setTimeRemaining(selectedDuration * 60);
  }, [selectedDuration]);

  useEffect(() => {
    let timer: number | null = null;
    
    if (isTyping && timeRemaining > 0 && !showStats) {
      timer = window.setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          setProgress((selectedDuration * 60 - newTime) / (selectedDuration * 60) * 100);
          
          if (newTime <= 0) {
            setShowStats(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining, showStats, isTyping, selectedDuration]);

  const handleTypingStart = () => {
    setIsTyping(true);
  };

  const handleAccuracyUpdate = (accuracy: number) => {
    const timeElapsed = selectedDuration * 60 - timeRemaining;
    setProgressData(prev => [
      ...prev, 
      { time: timeElapsed, accuracy }
    ]);
  };

  const handleTypingComplete = async (stats: { accuracy: number; wpm: number; mistakes: number }) => {
    setTypingStats(stats);
    setShowStats(true);
    
    const result = {
      lessonId: lessonId || '',
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      mistakes: stats.mistakes,
      timeSpent: formatTime(selectedDuration * 60 - timeRemaining),
      date: new Date().toISOString()
    };
    
    if (isAuthenticated) {
      await saveTypingResult(result);
      const isCompleted = checkCourseCompletion();
      setCourseCompleted(isCompleted);
      
      if (isCompleted) {
        toast({
          title: "Course Completed!",
          description: "Congratulations! You've completed the full typing course. Visit your profile to view your certificate.",
        });
      }
    } else {
      // Just save to localStorage if not authenticated
      const savedResults = JSON.parse(localStorage.getItem("typingResults") || "[]");
      savedResults.push(result);
      localStorage.setItem("typingResults", JSON.stringify(savedResults));
    }

    toast({
      title: "Lesson Completed",
      description: `You achieved ${stats.wpm} WPM with ${stats.accuracy}% accuracy.`,
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleRetry = () => {
    setShowStats(false);
    setTimeRemaining(selectedDuration * 60);
    setProgress(0);
    setIsTyping(false);
    setProgressData([]);
  };
  
  const handleBackToLessons = () => {
    navigate('/studying');
  };
  
  const handleViewCertificate = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-48">
              <p>Loading lesson data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !currentLesson) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <p className="text-red-500">
                {error || `Lesson ${lessonId} not found`}
              </p>
              <Button onClick={handleBackToLessons}>
                Back to Lessons
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {!showStats ? (
            <>
              {!isTyping && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>{currentLesson.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Select Duration</h3>
                      <Select 
                        value={selectedDuration.toString()}
                        onValueChange={(value) => setSelectedDuration(parseInt(value))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 minutes</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}
              <TypingInterface 
                onComplete={handleTypingComplete}
                onTypingStart={handleTypingStart}
                onAccuracyUpdate={handleAccuracyUpdate}
                lessonDuration={selectedDuration * 60}
                lessonContent={currentLesson.content}
                lessonType={lessonType}
              />
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Typing Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Accuracy</span>
                    <span className="text-xl font-bold">{typingStats.accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Words per minute</span>
                    <span className="text-xl font-bold">{typingStats.wpm} WPM</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Mistakes</span>
                    <span className="text-xl font-bold">{typingStats.mistakes}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Time spent</span>
                    <span className="text-xl font-bold">{formatTime(selectedDuration * 60 - timeRemaining)}</span>
                  </div>
                  
                  <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={handleRetry}>
                      Try Again
                    </Button>
                    <Button variant="outline" onClick={handleBackToLessons}>
                      Back to Lessons
                    </Button>
                    {courseCompleted && (
                      <Button variant="outline" onClick={handleViewCertificate} className="ml-2">
                        View Certificate
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Time Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-mono text-center mb-6">
                {formatTime(timeRemaining)}
              </div>
              <TimerChart 
                progress={progress}
                progressData={progressData} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
