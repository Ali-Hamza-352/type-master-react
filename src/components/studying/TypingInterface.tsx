
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TypingInterfaceProps {
  onComplete: (stats: { accuracy: number; wpm: number }) => void;
}

export const TypingInterface = ({ onComplete }: TypingInterfaceProps) => {
  const [currentWord, setCurrentWord] = useState("as");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isActive) return;
      
      if (e.key === ' ') {
        if (userInput === currentWord) {
          // Word completed correctly
          setUserInput("");
          // For demo, we'll just repeat the same word
          setCurrentWord("as");
        }
      } else {
        setUserInput((prev) => prev + e.key);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentWord, userInput, isActive]);

  const startTyping = () => {
    setIsActive(true);
    setStartTime(Date.now());
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">Type the highlighted word and press space</p>
        </div>

        <div className="text-center space-x-4 text-2xl">
          <span className={currentWord === userInput ? "text-green-500" : "text-blue-500"}>
            {currentWord}
          </span>
          <span className="text-muted-foreground">{currentWord}</span>
          <span className="text-muted-foreground">{currentWord}</span>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <img 
            src="/lovable-uploads/f66fd634-b17b-4199-a265-0f6ccb55e494.png" 
            alt="Keyboard Hand Position" 
            className="w-full max-w-md mx-auto"
          />
        </div>

        <div className="text-center">
          {!isActive && (
            <Button onClick={startTyping} size="lg">
              Begin Typing (Space)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
