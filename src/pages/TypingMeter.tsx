
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { TypingInterface } from "@/components/studying/TypingInterface";

const TypingMeter = () => {
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
            onComplete={console.log}
            onTypingStart={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingMeter;
