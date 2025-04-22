
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

const isBoxLesson = (lessonContent?: string, lessonType?: string) => {
  // Only use box style for .1 lessons, e.g., content coming from 1.1, 2.1, 3.1, 12.1 etc.
  // This can be detected if lessonContent is very repetitive and lessonType=words or keys.
  // But better: ask parent via lessonType, or use the prop lessonContent from route.
  // We'll add a workaround: if there are only a few unique words and lessonContent < 40 letters, consider it a box lesson.
  // But let's use a more accurate flag: if the lessonContent is NOT paragraphs/sentences (no period), AND lessonType is words, then it's a box UI.
  if (!lessonContent) return false;
  if (lessonType === 'words' || lessonType === 'keys' || lessonType === undefined) {
    // Hard-code for lessons .1 by checking if words repeat a lot and only letters/no punctuation.
    if (/^([a-zA-Z]+\s+)+[a-zA-Z]+$/.test(lessonContent.trim()) && lessonContent.length < 160) return true;
  }
  return false;
};

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

  // Custom: accuracy over time for chart
  const [progressPoints, setProgressPoints] = useState<{time: number, accuracy: number}[]>([]);

  const boxUI = isBoxLesson(lessonContent, lessonType);

  // Initialize lesson content
  useEffect(() => {
    if (lessonContent) {
      const wordsArray = lessonContent.split(/\s+/).filter(Boolean);
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
        setCurrentKey(' ');
        setHighlightedFinger('thumb');
      }
    }
  }, [words, currentWordIndex, currentInput]);
  
  // Timer for typing session & progress points every second
  useEffect(() => {
    if (isActive && !intervalRef.current) {
      setStartTime(Date.now());
      intervalRef.current = window.setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          return newTime;
        });
      }, 1000);
      // progress points for chart
      accuracyUpdateInterval.current = window.setInterval(() => {
        // Save accuracy at each second (Typing Master 11 style)
        setProgressPoints(prev => [
          ...prev, 
          { time: timeElapsed, accuracy }
        ]);
        if (onAccuracyUpdate) onAccuracyUpdate(accuracy);
      }, 1000);
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
  }, [isActive, accuracy, onAccuracyUpdate, timeElapsed]);

  // Update typing metrics (Accuracy, WPM) on word or char typed
  useEffect(() => {
    if (isActive) {
      let totalChars = 0;
      let correctChars = 0;
      wordStates.forEach(state => {
        if (state.isCompleted) {
          totalChars += state.word.length;
          if (state.isCorrect) correctChars += state.word.length;
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
      const newAccuracy = calculateAccuracy(correctChars, totalChars);
      const newWpm = calculateWPM(correctChars, timeElapsed);
      setAccuracy(newAccuracy);
      setWpm(newWpm);

      // End on timeout
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

  // Main typing handler (keypress)
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isActive) {
      handleFirstKeyPress();
      return;
    }
    // End = handle repeat
    if (currentWordIndex >= words.length) {
      setCurrentWordIndex(0);
      setCurrentInput('');
      return;
    }
    const currentWord = words[currentWordIndex];
    // For box UI, only allow letters/spaces up to current word length
    if (boxUI) {
      if (event.key === ' ') {
        event.preventDefault();
        // Mark word completed
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
        // Record mistake
        if (currentInput !== currentWord) {
          setMistakes(prev => [
            ...prev,
            { index: currentWordIndex, expected: currentWord, actual: currentInput }
          ]);
        }
        // Move to next word, or loop if at end
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
        } else {
          // Loop: reset all to not completed, clear word states except mistakes
          setCurrentWordIndex(0);
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

      if (/^[a-zA-Z;]$/.test(event.key) && currentInput.length < currentWord.length) {
        setCurrentInput(prev => prev + event.key);
      }
      // Allow backspace for mistake (edit)
      if (event.key === 'Backspace') {
        setCurrentInput(prev => prev.slice(0, -1));
      }
    } else {
      // Original behaviour for non-box lessons
      if (event.key === ' ') {
        event.preventDefault();
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
        if (currentInput !== currentWord) {
          setMistakes(prev => [
            ...prev,
            { index: currentWordIndex, expected: currentWord, actual: currentInput }
          ]);
        }
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
        } else {
          setCurrentWordIndex(0);
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
      if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
        setCurrentInput(prev => prev + event.key);
      }
      if (event.key === 'Backspace') {
        setCurrentInput(prev => prev.slice(0, -1));
      }
    }
  }, [isActive, words, currentWordIndex, currentInput, handleFirstKeyPress, boxUI]);

  // Add key handlers
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
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
    setProgressPoints([]);
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

  // Render sentence (for paragraph/non-box lessons)
  const renderSentence = () => (
    <div className="w-full mx-auto bg-gray-50 rounded-lg p-6 mt-2 text-xl font-mono leading-relaxed min-h-24">
      {words.map((word, idx) => {
        // Build typed
        let typed = '';
        if (idx < currentWordIndex) {
          typed = word;
        } else if (idx === currentWordIndex) {
          typed = currentInput;
        }
        return (
          <span
            key={idx}
            className={`mx-1 px-0.5 py-0.5 rounded
              ${idx < currentWordIndex && word === typed ? 'bg-green-100 text-green-700' : ''}
              ${idx < currentWordIndex && word !== typed ? 'bg-red-100 text-red-700' : ''}
              ${idx === currentWordIndex ? 'underline bg-yellow-100' : ''}
            `}
          >
            {word}{' '}
          </span>
        );
      })}
    </div>
  );

  // Render typing stats
  const renderStats = () => (
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
            {boxUI ? renderWordBoxes() : renderSentence()}
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

// NOTE FOR USER: This file is reaching 400+ lines. Please consider refactoring into smaller focused components next time!
