
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <Card className="w-[90%] max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-blue-600">Welcome to TypingMaster</CardTitle>
          <CardDescription className="text-center">
            Master touch typing with our comprehensive learning system
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-gray-600 mb-4">
            Start your journey to faster, more accurate typing today
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/studying")}
          >
            Start Learning
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
