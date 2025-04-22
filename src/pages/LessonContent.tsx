import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { TimerChart } from "@/components/studying/TimerChart";
import { TypingInterface } from "@/components/studying/TypingInterface";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const LessonContent = () => {
  const { lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const lessonType = searchParams.get('type') || 'words';
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [progress, setProgress] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [typingStats, setTypingStats] = useState({ 
    accuracy: 0, 
    wpm: 0,
    mistakes: 0 
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeRemaining > 0 && !showStats) {
        setTimeRemaining((prev) => prev - 1);
        // Update progress as a percentage of time elapsed
        setProgress((120 - timeRemaining + 1) / 1.2); // 120 seconds = 100%
      } else {
        // Time's up, show stats
        if (!showStats && timeRemaining <= 0) {
          setShowStats(true);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showStats]);

  const handleTypingComplete = (stats: { accuracy: number; wpm: number; mistakes: number }) => {
    setTypingStats(stats);
    setShowStats(true);
    
    // Save results to localStorage
    const result = {
      lessonId,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      mistakes: stats.mistakes,
      timeSpent: formatTime(120 - timeRemaining),
      date: new Date().toISOString()
    };
    
    const savedResults = JSON.parse(localStorage.getItem("typingResults") || "[]");
    savedResults.push(result);
    localStorage.setItem("typingResults", JSON.stringify(savedResults));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleRetry = () => {
    setShowStats(false);
    setTimeRemaining(120);
    setProgress(0);
  };
  
  const handleBackToLessons = () => {
    navigate('/studying');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {!showStats ? (
            <TypingInterface 
              onComplete={handleTypingComplete} 
              lessonDuration={120}
              lessonType={lessonType}
            />
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
                    <span className="text-xl font-bold">{formatTime(120 - timeRemaining)}</span>
                  </div>
                  
                  <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={handleRetry}>
                      Try Again
                    </Button>
                    <Button variant="outline" onClick={handleBackToLessons}>
                      Back to Lessons
                    </Button>
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
              <TimerChart progress={progress} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
