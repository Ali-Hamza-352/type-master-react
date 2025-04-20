
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimerChart } from "@/components/studying/TimerChart";
import { useState, useEffect } from "react";

const LessonContent = () => {
  const { lessonId } = useParams();
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining((prev) => prev - 1);
        setProgress((prev) => prev + 0.33); // Increase progress gradually
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Lesson {lessonId}: Touch typing basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Drill Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span>3 - 5 minutes (based on progress)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy Goal</span>
                    <span>94% Intermediate</span>
                  </div>
                  <div>
                    <span className="block mb-1">Objective</span>
                    <p className="text-gray-600">
                      Consolidation exercise to further develop muscle memory and strengthen technique.
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button size="lg" className="w-full max-w-md">
                  Begin drill (Space)
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-center">
                  <img src="/lovable-uploads/f66fd634-b17b-4199-a265-0f6ccb55e494.png" alt="Hand Position Guide" className="max-w-md" />
                </div>
              </div>
            </CardContent>
          </Card>
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
              <div className="mt-6 space-y-2">
                <Button className="w-full">Next</Button>
                <Button variant="outline" className="w-full">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
