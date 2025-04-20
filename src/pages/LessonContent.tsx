
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { TimerChart } from "@/components/studying/TimerChart";
import { TypingInterface } from "@/components/studying/TypingInterface";
import { useState, useEffect } from "react";

const LessonContent = () => {
  const { lessonId } = useParams();
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [progress, setProgress] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [typingStats, setTypingStats] = useState({ accuracy: 0, wpm: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining((prev) => prev - 1);
        setProgress((prev) => prev + 0.33);
      } else {
        // Time's up, show stats
        setShowStats(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleTypingComplete = (stats: { accuracy: number; wpm: number }) => {
    setTypingStats(stats);
    setShowStats(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {!showStats ? (
            <TypingInterface onComplete={handleTypingComplete} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Typing Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Accuracy</span>
                    <span>{typingStats.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Words per minute</span>
                    <span>{typingStats.wpm} WPM</span>
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
