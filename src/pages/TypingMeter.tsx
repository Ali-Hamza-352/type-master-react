
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { TypingInterface } from "@/components/studying/TypingInterface";
import { useState } from "react";

const TypingMeter = () => {
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const handleTypingStart = () => {
    setHasStartedTyping(true);
  };

  const handleComplete = (stats: { accuracy: number; wpm: number; mistakes: number }) => {
    console.log("Completed typing with stats:", stats);
    // Could save to localStorage here if needed
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
            lessonDuration={60}
            onComplete={handleComplete}
            onTypingStart={handleTypingStart}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingMeter;
