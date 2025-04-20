
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const lessons = [
  {
    id: 1,
    title: "The Home Row",
    progress: 0,
    subLessons: [
      { id: "1.1", title: "Touch typing basics", duration: "3-5 min" },
      { id: "1.2", title: "New keys: Home row", duration: "3 min" },
      { id: "1.3", title: "Understanding results", duration: "3 min" },
      { id: "1.4", title: "Key drill", duration: "3-5 min" },
      { id: "1.5", title: "Tip: Typing tests (Online)", duration: "3-5 min" },
      { id: "1.6", title: "Word drill", duration: "3-5 min" },
      { id: "1.7", title: "Paragraph drill", duration: "3-5 min" },
    ],
  },
  {
    id: 2,
    title: "Keys E and I",
    progress: 0,
    subLessons: [
      { id: "2.1", title: "New keys: E and I", duration: "3-5 min" },
      { id: "2.2", title: "Optimal duration", duration: "3 min" },
      { id: "2.3", title: "Word drill", duration: "3-5 min" },
      { id: "2.4", title: "Sentence drill", duration: "3-5 min" },
      { id: "2.5", title: "Tip: Typing Meter", duration: "3-5 min" },
      { id: "2.6", title: "Paragraph drill", duration: "3-5 min" },
    ],
  },
  // ... Additional lessons will be added similarly
];

export function LessonList() {
  const navigate = useNavigate();

  const startLesson = (lessonId: string) => {
    navigate(`/studying/lesson/${lessonId}`);
  };

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {lessons.map((lesson) => (
        <AccordionItem key={lesson.id} value={`lesson-${lesson.id}`} className="border rounded-lg p-2">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-4">
                <div className="font-semibold">Lesson {lesson.id}</div>
                <div className="text-gray-600">{lesson.title}</div>
              </div>
              <Progress value={lesson.progress} className="w-24" />
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-4">
            <div className="space-y-3">
              {lesson.subLessons.map((subLesson) => (
                <div key={subLesson.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <div className="font-medium">{subLesson.title}</div>
                    <div className="text-sm text-gray-500">{subLesson.duration}</div>
                  </div>
                  <Button onClick={() => startLesson(subLesson.id)} size="sm">
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
