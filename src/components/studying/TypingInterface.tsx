
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VirtualKeyboard } from './VirtualKeyboard';
import { WordBox } from './WordBox';
import { 
  keyboardMapping, 
  Finger, 
  calculateWPM,
  calculateAccuracy
} from '@/utils/keyboardUtils';
import { Keyboard } from 'lucide-react';

export interface TypingInterfaceProps {
  onComplete: (stats: { accuracy: number; wpm: number; mistakes: number }) => void;
  onTypingStart: () => void;
  onAccuracyUpdate?: (accuracy: number) => void;
  lessonDuration?: number; // in seconds, defaults to 60
  lessonType?: 'words' | 'characters' | 'keys' | 'paragraph' | 'theory';
  lessonContent?: string;
}

interface Mistake {
  index: number;
  expected: string;
  actual: string;
}

interface WordState {
  word: string;
  typedWord: string;
  isCompleted: boolean;
  isCorrect: boolean;
}

export const TypingInterface = ({ 
  onComplete, 
  onTypingStart,
  onAccuracyUpdate,
  lessonDuration = 60,
  lessonType = 'words',
  lessonContent = ''
}: TypingInterfaceProps) => {
  const [words, setWords] = useState<string[]>([]);
  const [wordStates, setWordStates] = useState<WordState[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const [currentKey, setCurrentKey] = useState('');
  const [highlightedFinger, setHighlightedFinger] = useState<Finger | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<number | null>(null);
  const accuracyUpdateInterval = useRef<number | null>(null);

  // Initialize lesson content
  useEffect(() => {
    if (lessonContent) {
      const wordsArray = lessonContent.split(/\s+/);
      setWords(wordsArray);
      
      const initialWordStates = wordsArray.map(word => ({
        word,
        typedWord: '',
        isCompleted: false,
        isCorrect: false
      }));
      setWordStates(initialWordStates);
      
      setCurrentWordIndex(0);
      setCurrentInput('');
    }
  }, [lessonContent]);
  
  // Set current key based on next character to type
  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length) {
      const currentWord = words[currentWordIndex];
      if (currentInput.length < currentWord.length) {
        const nextKey = currentWord[currentInput.length].toLowerCase();
        setCurrentKey(nextKey);
        
        const keyInfo = keyboardMapping[nextKey];
        if (keyInfo) {
          setHighlightedFinger(keyInfo.finger);
        } else {
          setHighlightedFinger(null);
        }
      } else {
        // If at the end of the word, highlight space key
        setCurrentKey(' ');
        setHighlightedFinger('thumb');
      }
    }
  }, [words, currentWordIndex, currentInput]);
  
  // Create timer for typing session
  useEffect(() => {
    if (isActive && !intervalRef.current) {
      setStartTime(Date.now());
      intervalRef.current = window.setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          return newTime;
        });
      }, 1000);
      
      // Set up interval for accuracy updates (every 5 seconds)
      accuracyUpdateInterval.current = window.setInterval(() => {
        if (onAccuracyUpdate) {
          onAccuracyUpdate(accuracy);
        }
      }, 5000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (accuracyUpdateInterval.current) {
        clearInterval(accuracyUpdateInterval.current);
        accuracyUpdateInterval.current = null;
      }
    };
  }, [isActive, accuracy, onAccuracyUpdate]);

  // Update typing metrics
  useEffect(() => {
    if (isActive) {
      // Calculate completed characters
      let totalChars = 0;
      let correctChars = 0;
      
      wordStates.forEach(state => {
        if (state.isCompleted) {
          totalChars += state.word.length;
          if (state.isCorrect) {
            correctChars += state.word.length;
          }
        }
      });
      
      // Add current word progress
      if (currentWordIndex < wordStates.length) {
        totalChars += currentInput.length;
        for (let i = 0; i < currentInput.length; i++) {
          if (i < words[currentWordIndex].length && currentInput[i] === words[currentWordIndex][i]) {
            correctChars++;
          }
        }
      }
      
      // Calculate metrics
      const newAccuracy = calculateAccuracy(correctChars, totalChars);
      const newWpm = calculateWPM(correctChars, timeElapsed);
      
      setAccuracy(newAccuracy);
      setWpm(newWpm);
      
      // Check if time has exceeded lesson duration
      if (timeElapsed >= lessonDuration) {
        completeTyping();
      }
    }
  }, [timeElapsed, wordStates, currentWordIndex, currentInput, words, isActive, lessonDuration]);
  
  // Handle first key press
  const handleFirstKeyPress = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
      onTypingStart();
    }
  }, [isActive, onTypingStart]);
  
  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isActive) {
      handleFirstKeyPress();
      return;
    }
    
    if (currentWordIndex >= words.length) {
      // Reset to first word when reaching the end
      setCurrentWordIndex(0);
      setCurrentInput('');
      return;
    }
    
    const currentWord = words[currentWordIndex];
    
    // Handle space key to move to next word
    if (event.key === ' ') {
      event.preventDefault();
      
      // Update word state
      setWordStates(prev => {
        const newStates = [...prev];
        newStates[currentWordIndex] = {
          ...newStates[currentWordIndex],
          typedWord: currentInput,
          isCompleted: true,
          isCorrect: currentInput === currentWord
        };
        return newStates;
      });
      
      // If word is incorrect, add to mistakes
      if (currentInput !== currentWord) {
        setMistakes(prev => [
          ...prev,
          { index: currentWordIndex, expected: currentWord, actual: currentInput }
        ]);
      }
      
      // Move to next word or loop back to beginning
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
      } else {
        // Loop back to the beginning
        setCurrentWordIndex(0);
        
        // Reset all word states to not completed
        setWordStates(prev => prev.map(state => ({
          ...state,
          typedWord: '',
          isCompleted: false,
          isCorrect: false
        })));
      }
      
      setCurrentInput('');
      return;
    }
    
    // Regular key presses for typing the current word
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
      setCurrentInput(prev => prev + event.key);
    }
  }, [isActive, words, currentWordIndex, currentInput, handleFirstKeyPress]);
  
  // Add key handlers
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);
  
  // Focus input when active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);
  
  // Start typing session
  const startTyping = () => {
    setIsActive(true);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setMistakes([]);
    setTimeElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setStartTime(Date.now());
    
    // Reset word states
    const resetWordStates = words.map(word => ({
      word,
      typedWord: '',
      isCompleted: false,
      isCorrect: false
    }));
    setWordStates(resetWordStates);
  };
  
  // Complete typing session
  const completeTyping = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (accuracyUpdateInterval.current) {
      clearInterval(accuracyUpdateInterval.current);
      accuracyUpdateInterval.current = null;
    }
    
    onComplete({
      accuracy: accuracy,
      wpm: wpm,
      mistakes: mistakes.length
    });
  };
  
  // Render word boxes
  const renderWordBoxes = () => {
    // Get visible words (current word and a few before/after)
    const visibleStart = Math.max(0, currentWordIndex - 2);
    const visibleEnd = Math.min(words.length, currentWordIndex + 5);
    const visibleWords = wordStates.slice(visibleStart, visibleEnd);
    
    return (
      <div className="flex flex-wrap gap-1 my-4 justify-center">
        {visibleWords.map((wordState, index) => {
          const absoluteIndex = visibleStart + index;
          const isActive = absoluteIndex === currentWordIndex;
          
          return (
            <WordBox
              key={`${absoluteIndex}-${wordState.word}`}
              word={wordState.word}
              typedWord={isActive ? currentInput : wordState.typedWord}
              isActive={isActive}
              isCompleted={wordState.isCompleted}
            />
          );
        })}
      </div>
    );
  };
  
  // Render typing stats
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
            {renderWordBoxes()}
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
