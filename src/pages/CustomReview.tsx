
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TypingInterface } from "@/components/studying/TypingInterface";

const CustomReview = () => {
  const [customText, setCustomText] = useState("");
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Custom Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isReady ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Paste your own text to practice typing. This can be code, articles, or any text you want to master.
              </p>
              <Textarea
                placeholder="Enter your text here..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="min-h-[200px]"
              />
              <Button 
                onClick={() => setIsReady(true)}
                disabled={!customText.trim()}
              >
                Start Typing
              </Button>
            </div>
          ) : (
            <div>
              <Button
                variant="outline"
                className="mb-4"
                onClick={() => setIsReady(false)}
              >
                Back to Edit
              </Button>
              <TypingInterface
                lessonType="paragraph"
                lessonDuration={300}
                customText={customText}
                onComplete={console.log}
                onTypingStart={() => {}}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReview;
