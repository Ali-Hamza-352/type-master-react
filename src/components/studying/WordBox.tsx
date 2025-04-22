
import React from 'react';
import { Check, X } from 'lucide-react';

interface WordBoxProps {
  word: string;
  typedWord: string;
  isActive: boolean;
  isCompleted: boolean;
}

export const WordBox: React.FC<WordBoxProps> = ({ 
  word, 
  typedWord, 
  isActive, 
  isCompleted 
}) => {
  const isCorrect = word === typedWord;

  return (
    <div className={`
      relative inline-flex items-center justify-center 
      border rounded-md m-1 p-2 min-w-16 min-h-16
      ${isActive ? 'border-blue-500 shadow-md' : 'border-gray-300'}
      ${isCompleted && isCorrect ? 'bg-green-100 border-green-500' : ''}
      ${isCompleted && !isCorrect ? 'bg-red-100 border-red-500' : ''}
      transition-all duration-200
    `}>
      <div className="flex">
        {word.split('').map((char, idx) => {
          const typedChar = typedWord[idx] || '';
          const isCharCorrect = char === typedChar;
          const isTyped = idx < typedWord.length;
          return (
            <span 
              key={idx} 
              className={`
                ${isTyped && isCharCorrect ? 'text-green-600' : ''}
                ${isTyped && !isCharCorrect ? 'text-red-600' : ''}
                ${isActive && idx === typedWord.length ? 'bg-blue-200 animate-pulse' : ''}
                text-lg font-medium
              `}
            >
              {char}
            </span>
          );
        })}
      </div>
      
      {isCompleted && (
        <div className="absolute -top-2 -right-2">
          {isCorrect ? (
            <div className="bg-green-500 rounded-full p-0.5 flex items-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          ) : (
            <div className="bg-red-500 rounded-full p-0.5 flex items-center">
              <X className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
