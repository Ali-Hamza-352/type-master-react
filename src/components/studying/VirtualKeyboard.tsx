
import React from 'react';
import { keyboardLayout, keyboardMapping, Finger, getFingerColor } from '@/utils/keyboardUtils';

interface VirtualKeyboardProps {
  currentKey: string;
  highlightedFinger: Finger | null;
}

export const VirtualKeyboard = ({ currentKey, highlightedFinger }: VirtualKeyboardProps) => {
  return (
    <div className="mt-4">
      <div className="flex flex-col items-center gap-1 max-w-3xl mx-auto">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 w-full justify-center">
            {row.map((key) => {
              const isCurrentKey = key === currentKey.toLowerCase();
              const keyInfo = keyboardMapping[key];
              const isHighlightedFinger = keyInfo && highlightedFinger === keyInfo.finger;
              
              return (
                <div
                  key={key}
                  className={`
                    ${key === ' ' ? 'w-64' : 'w-10'} 
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
                    uppercase
                    font-medium
                  `}
                >
                  {key === ' ' ? 'Space' : key}
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
