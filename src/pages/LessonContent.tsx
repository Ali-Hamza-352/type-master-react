
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { TimerChart } from "@/components/studying/TimerChart";
import { TypingInterface } from "@/components/studying/TypingInterface";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type LessonType = 'words' | 'characters' | 'keys' | 'paragraph' | 'theory';

const LessonContent = () => {
  const { lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleTypingComplete = (stats: { accuracy: number; wpm: number; mistakes: number }) => {
    setTypingStats(stats);
    setShowStats(true);
    
    const result = {
      lessonId,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      mistakes: stats.mistakes,
      timeSpent: formatTime(selectedDuration * 60 - timeRemaining),
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
    setTimeRemaining(selectedDuration * 60);
    setProgress(0);
    setIsTyping(false);
  };
  
  const handleBackToLessons = () => {
    navigate('/studying');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {!showStats ? (
            <>
              {!isTyping && (
                <Card className="mb-4">
                  <CardContent className="pt-6">
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
                lessonDuration={selectedDuration * 60}
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
