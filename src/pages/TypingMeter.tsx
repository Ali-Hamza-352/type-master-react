
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { TypingInterface } from "@/components/studying/TypingInterface";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { ProgressDataPoint } from "@/components/studying/TimerChart";

const TypingMeter = () => {
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [progressData, setProgressData] = useState<ProgressDataPoint[]>([]);

  const handleTypingStart = () => {
    setHasStartedTyping(true);
    setProgressData([]);
  };

  const handleAccuracyUpdate = (accuracy: number) => {
    const timeElapsed = progressData.length * 5; // Assuming updates every 5 seconds
    setProgressData(prev => [
      ...prev, 
      { time: timeElapsed, accuracy }
    ]);
  };

  const handleComplete = (stats: { accuracy: number; wpm: number; mistakes: number }) => {
    console.log("Completed typing with stats:", stats);
    
    // Save results to localStorage
    const result = {
      type: "meter",
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      mistakes: stats.mistakes,
      date: new Date().toISOString()
    };
    
    const savedResults = JSON.parse(localStorage.getItem("typingResults") || "[]");
    savedResults.push(result);
    localStorage.setItem("typingResults", JSON.stringify(savedResults));
    
    toast({
      title: "Typing Test Completed",
      description: `You achieved ${stats.wpm} WPM with ${stats.accuracy}% accuracy.`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Typing Meter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Test your typing speed and accuracy with our typing meter. Type the text below to get started.
          </p>
          <TypingInterface
            lessonType="paragraph"
            lessonContent="The quick brown fox jumps over the lazy dog. All good men must come to the aid of their country. Practice makes perfect when learning to type quickly and accurately."
            lessonDuration={60}
            onComplete={handleComplete}
            onTypingStart={handleTypingStart}
            onAccuracyUpdate={handleAccuracyUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingMeter;
