
import React from 'react';
import { keyboardLayout, keyboardMapping, Finger, getFingerColor } from '@/utils/keyboardUtils';

interface VirtualKeyboardProps {
  currentKey: string;
  highlightedFinger: Finger | null;
}

export const VirtualKeyboard = ({ currentKey, highlightedFinger }: VirtualKeyboardProps) => {
  return (
    <div className="mt-4">
      <div className="flex flex-col items-center gap-1 max-w-5xl mx-auto">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 w-full justify-center">
            {row.map((key) => {
              const isCurrentKey = key.toLowerCase() === currentKey.toLowerCase();
              const keyInfo = keyboardMapping[key.toLowerCase()];
              const isHighlightedFinger = keyInfo && highlightedFinger === keyInfo.finger;
              
              let keyWidth = 'w-10';
              if (key === 'Backspace') keyWidth = 'w-20';
              if (key === 'Tab' || key === 'Caps') keyWidth = 'w-16';
              if (key === 'Enter') keyWidth = 'w-20';
              if (key === 'Shift') keyWidth = 'w-24';
              if (key === ' ') keyWidth = 'w-64';
              
              return (
                <div
                  key={key}
                  className={`
                    ${keyWidth}
                    h-10 
                    flex 
                    items-center 
                    justify-center 
                    border 
                    rounded-md 
                    shadow 
                    ${isCurrentKey ? 'bg-yellow-300 border-yellow-500' : 'bg-white border-gray-300'}
                    ${isHighlightedFinger ? `ring-2 ring-offset-1 ${getFingerColor(keyInfo.finger)}` : ''}
                    transition-all
                    duration-150
                    text-center
                    text-sm
                    font-medium
                  `}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {highlightedFinger && (
        <div className="text-center mt-3 text-sm font-medium">
          Use your <span className="font-bold">{highlightedFinger.replace('left', 'Left ').replace('right', 'Right ').replace('thumb', 'Thumb')}</span> finger
        </div>
      )}
    </div>
  );
};
