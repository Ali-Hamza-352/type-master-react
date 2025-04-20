
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonList } from "@/components/studying/LessonList";
import { Book } from "lucide-react";

const Studying = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Book className="w-8 h-8 text-blue-600" />
          <div>
            <CardTitle className="text-2xl">Touch Typing Course</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Master touch typing with our comprehensive 12-lesson course. Each lesson builds upon the previous one,
            helping you develop proper typing techniques and increase your speed and accuracy.
          </p>
          <LessonList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Studying;
