import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VirtualKeyboard } from './VirtualKeyboard';
import { 
  keyboardMapping, 
  Finger, 
  generateWordList,
  generateText,
  calculateWPM,
  calculateAccuracy
} from '@/utils/keyboardUtils';
import { Check, X, Keyboard } from 'lucide-react';

export interface TypingInterfaceProps {
  onComplete: (stats: { accuracy: number; wpm: number; mistakes: number }) => void;
  onTypingStart: () => void;
  lessonDuration?: number; // in seconds, defaults to 60
  lessonType?: 'words' | 'characters' | 'keys' | 'paragraph' | 'theory';
}

interface Mistake {
  index: number;
  expected: string;
  actual: string;
}

export const TypingInterface = ({ 
  onComplete, 
  onTypingStart,
  lessonDuration = 60,
  lessonType = 'words'
}: TypingInterfaceProps) => {
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [currentPosition, setCurrentPosition] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [isCorrect, setIsCorrect] = useState(true);
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const [currentKey, setCurrentKey] = useState('');
  const [highlightedFinger, setHighlightedFinger] = useState<Finger | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setText(generateText(lessonType));
  }, [lessonType]);
  
  useEffect(() => {
    if (text && currentPosition < text.length) {
      const nextKey = text[currentPosition].toLowerCase();
      setCurrentKey(nextKey);
      
      const keyInfo = keyboardMapping[nextKey];
      if (keyInfo) {
        setHighlightedFinger(keyInfo.finger);
      } else {
        setHighlightedFinger(null);
      }
    }
  }, [text, currentPosition]);
  
  const handleFirstKeyPress = useCallback(() => {
    if (!isActive && currentPosition === 0) {
      setIsActive(true);
      setStartTime(Date.now());
      onTypingStart();
    }
  }, [isActive, currentPosition, onTypingStart]);
  
  useEffect(() => {
    if (isActive && !intervalRef.current) {
      setStartTime(Date.now());
      intervalRef.current = window.setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          const correctChars = currentPosition - mistakes.length;
          setWpm(calculateWPM(correctChars, newTime));
          setAccuracy(calculateAccuracy(correctChars, currentPosition));
          
          if (newTime >= lessonDuration) {
            completeTyping();
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, currentPosition, mistakes.length, lessonDuration]);
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (currentPosition === 0) {
      handleFirstKeyPress();
    }

    if (!isActive) return;
    
    if (currentPosition >= text.length) {
      completeTyping();
      return;
    }
    
    const expected = text[currentPosition];
    const typed = event.key;
    
    if ((typed.length !== 1 && typed !== ' ') || event.metaKey || event.ctrlKey) {
      return;
    }
    
    if (typed === ' ') {
      event.preventDefault();
    }
    
    if (typed === expected) {
      setUserInput(prev => prev + typed);
      setCurrentPosition(prev => prev + 1);
      setIsCorrect(true);
    } else {
      setMistakes(prev => [
        ...prev, 
        { index: currentPosition, expected, actual: typed }
      ]);
      setUserInput(prev => prev + typed);
      setCurrentPosition(prev => prev + 1);
      setIsCorrect(false);
    }
  }, [isActive, text, currentPosition, handleFirstKeyPress]);
  
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);
  
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);
  
  const startTyping = () => {
    setIsActive(true);
    setUserInput("");
    setCurrentPosition(0);
    setMistakes([]);
    setTimeElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setStartTime(Date.now());
  };
  
  const completeTyping = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    const finalAccuracy = calculateAccuracy(currentPosition - mistakes.length, currentPosition);
    const finalWpm = calculateWPM(currentPosition - mistakes.length, timeElapsed);
    
    onComplete({
      accuracy: finalAccuracy,
      wpm: finalWpm,
      mistakes: mistakes.length
    });
  };
  
  const renderText = () => {
    if (!text) return null;
    
    return (
      <div className="text-lg text-left space-y-2 my-4">
        <div className="font-medium mb-2">Type the text below:</div>
        <div className="p-4 bg-gray-50 rounded-lg border shadow-sm relative">
          {text.split('').map((char, index) => {
            const isCurrent = index === currentPosition;
            const isTyped = index < currentPosition;
            const mistake = mistakes.find(m => m.index === index);
            const isCorrect = isTyped && !mistake;
            
            return (
              <span 
                key={index}
                className={`
                  ${isCurrent ? 'bg-blue-200 px-0.5 rounded-sm' : ''}
                  ${isCorrect ? 'text-green-600' : ''}
                  ${mistake ? 'text-red-600' : ''}
                  ${isCurrent ? 'border-b-2 border-blue-500 animate-pulse' : ''}
                `}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderUserInput = () => {
    return (
      <div className="text-lg text-left my-4">
        <div className="font-medium mb-2">Your typing:</div>
        <div className="p-4 bg-white rounded-lg border shadow-sm break-all min-h-12 relative">
          {userInput.split('').map((char, index) => {
            const expected = text[index];
            const isCorrect = char === expected;
            
            return (
              <span 
                key={index}
                className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}
              >
                {char}
              </span>
            );
          })}
          {!isCorrect && <X className="absolute right-2 top-2 text-red-500 h-5 w-5" />}
          {isCorrect && userInput.length > 0 && <Check className="absolute right-2 top-2 text-green-500 h-5 w-5" />}
        </div>
      </div>
    );
  };
  
  const renderStats = () => {
    return (
      <div className="flex justify-between items-center py-3 px-4 bg-gray-100 rounded-lg my-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">Time</div>
          <div className="text-xl font-mono font-bold">
            {Math.floor((lessonDuration - timeElapsed) / 60).toString().padStart(2, '0')}:
            {((lessonDuration - timeElapsed) % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">WPM</div>
          <div className="text-xl font-mono font-bold">{wpm}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Accuracy</div>
          <div className="text-xl font-mono font-bold">{accuracy}%</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Mistakes</div>
          <div className="text-xl font-mono font-bold">{mistakes.length}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Touch Typing Practice</h2>
        </div>
        
        {isActive ? (
          <>
            {renderStats()}
            {renderText()}
            {renderUserInput()}
            <VirtualKeyboard 
              currentKey={currentKey} 
              highlightedFinger={highlightedFinger} 
            />
            <input 
              ref={inputRef}
              type="text"
              className="opacity-0 absolute top-0 left-0 w-0 h-0"
              autoFocus
            />
          </>
        ) : (
          <div className="text-center py-8 space-y-6">
            <div className="mx-auto w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
              <Keyboard className="h-16 w-16 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Ready to improve your typing?</h3>
              <p className="text-gray-600">
                Follow the highlighted keys and use the correct fingers for each key.
                Watch your speed and accuracy improve in real-time!
              </p>
            </div>
            <Button onClick={startTyping} size="lg">
              Begin Typing Practice
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
