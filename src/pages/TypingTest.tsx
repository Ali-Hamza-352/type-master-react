
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { TypingInterface } from "@/components/studying/TypingInterface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const TypingTest = () => {
  const [duration, setDuration] = useState("1");
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const handleTypingStart = () => {
    setHasStartedTyping(true);
  };

  const handleComplete = (stats: { accuracy: number; wpm: number; mistakes: number }) => {
    toast({
      title: "Typing Test Completed",
      description: `You achieved ${stats.wpm} WPM with ${stats.accuracy}% accuracy.`,
    });
    
    // Save results to localStorage
    const result = {
      type: "test",
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      mistakes: stats.mistakes,
      duration: parseInt(duration),
      date: new Date().toISOString()
    };
    
    const savedResults = JSON.parse(localStorage.getItem("typingResults") || "[]");
    savedResults.push(result);
    localStorage.setItem("typingResults", JSON.stringify(savedResults));
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Typing Test
          </CardTitle>
          <Select
            value={duration}
            onValueChange={setDuration}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 minute</SelectItem>
              <SelectItem value="2">2 minutes</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Take a timed typing test to measure your typing speed and accuracy.
          </p>
          <TypingInterface
            lessonType="paragraph"
            lessonDuration={parseInt(duration) * 60}
            onComplete={handleComplete}
            onTypingStart={handleTypingStart}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingTest;
