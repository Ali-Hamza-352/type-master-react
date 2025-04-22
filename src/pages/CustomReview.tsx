
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Activity, Edit } from "lucide-react";
import { TypingInterface } from "@/components/studying/TypingInterface";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const CustomReview = () => {
  const [customText, setCustomText] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const handleStartReview = () => {
    if (customText.trim().length < 10) {
      toast({
        title: "Text too short",
        description: "Please enter at least 10 characters to begin the review.",
        variant: "destructive",
      });
      return;
    }
    
    setIsReviewing(true);
  };

  const handleTypingStart = () => {
    setHasStartedTyping(true);
  };

  const handleComplete = (stats: { accuracy: number; wpm: number; mistakes: number }) => {
    toast({
      title: "Custom Review Completed",
      description: `You achieved ${stats.wpm} WPM with ${stats.accuracy}% accuracy.`,
    });
    
    // Save results to localStorage
    const result = {
      type: "custom",
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      mistakes: stats.mistakes,
      textLength: customText.length,
      date: new Date().toISOString()
    };
    
    const savedResults = JSON.parse(localStorage.getItem("typingResults") || "[]");
    savedResults.push(result);
    localStorage.setItem("typingResults", JSON.stringify(savedResults));
  };

  const handleReset = () => {
    setIsReviewing(false);
    setHasStartedTyping(false);
    setCustomText("");
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Edit className="h-6 w-6" />
            Custom Review
          </CardTitle>
          <CardDescription>
            Practice typing with your own custom text. Paste content you frequently type.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isReviewing ? (
            <div className="space-y-4">
              <Textarea 
                placeholder="Enter or paste your custom text here..." 
                className="min-h-32"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
              />
              <Button onClick={handleStartReview}>Start Typing Review</Button>
            </div>
          ) : (
            <>
              <TypingInterface
                lessonType="paragraph" 
                lessonDuration={300}
                onComplete={handleComplete}
                onTypingStart={handleTypingStart}
              />
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReview;
