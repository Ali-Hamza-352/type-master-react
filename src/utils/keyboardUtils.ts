
// Define finger mapping for each key
export type Finger = 'leftPinky' | 'leftRing' | 'leftMiddle' | 'leftIndex' | 'rightIndex' | 'rightMiddle' | 'rightRing' | 'rightPinky' | 'thumb';

export interface KeyInfo {
  finger: Finger;
  row: 'top' | 'home' | 'bottom' | 'space';
}

export const keyboardMapping: Record<string, KeyInfo> = {
  // Top row
  'q': { finger: 'leftPinky', row: 'top' },
  'w': { finger: 'leftRing', row: 'top' },
  'e': { finger: 'leftMiddle', row: 'top' },
  'r': { finger: 'leftIndex', row: 'top' },
  't': { finger: 'leftIndex', row: 'top' },
  'y': { finger: 'rightIndex', row: 'top' },
  'u': { finger: 'rightIndex', row: 'top' },
  'i': { finger: 'rightMiddle', row: 'top' },
  'o': { finger: 'rightRing', row: 'top' },
  'p': { finger: 'rightPinky', row: 'top' },
  
  // Home row
  'a': { finger: 'leftPinky', row: 'home' },
  's': { finger: 'leftRing', row: 'home' },
  'd': { finger: 'leftMiddle', row: 'home' },
  'f': { finger: 'leftIndex', row: 'home' },
  'g': { finger: 'leftIndex', row: 'home' },
  'h': { finger: 'rightIndex', row: 'home' },
  'j': { finger: 'rightIndex', row: 'home' },
  'k': { finger: 'rightMiddle', row: 'home' },
  'l': { finger: 'rightRing', row: 'home' },
  ';': { finger: 'rightPinky', row: 'home' },
  
  // Bottom row
  'z': { finger: 'leftPinky', row: 'bottom' },
  'x': { finger: 'leftRing', row: 'bottom' },
  'c': { finger: 'leftMiddle', row: 'bottom' },
  'v': { finger: 'leftIndex', row: 'bottom' },
  'b': { finger: 'leftIndex', row: 'bottom' },
  'n': { finger: 'rightIndex', row: 'bottom' },
  'm': { finger: 'rightIndex', row: 'bottom' },
  ',': { finger: 'rightMiddle', row: 'bottom' },
  '.': { finger: 'rightRing', row: 'bottom' },
  '/': { finger: 'rightPinky', row: 'bottom' },
  
  // Space bar
  ' ': { finger: 'thumb', row: 'space' }
};

// Get finger name for display
export const getFingerName = (finger: Finger): string => {
  switch (finger) {
    case 'leftPinky': return 'Left Pinky';
    case 'leftRing': return 'Left Ring';
    case 'leftMiddle': return 'Left Middle';
    case 'leftIndex': return 'Left Index';
    case 'rightIndex': return 'Right Index';
    case 'rightMiddle': return 'Right Middle';
    case 'rightRing': return 'Right Ring';
    case 'rightPinky': return 'Right Pinky';
    case 'thumb': return 'Thumb';
    default: return 'Unknown';
  }
};

// Get color for finger highlighting
export const getFingerColor = (finger: Finger): string => {
  switch (finger) {
    case 'leftPinky': return 'bg-purple-500';
    case 'leftRing': return 'bg-blue-500';
    case 'leftMiddle': return 'bg-green-500';
    case 'leftIndex': return 'bg-yellow-500';
    case 'rightIndex': return 'bg-orange-500';
    case 'rightMiddle': return 'bg-red-500';
    case 'rightRing': return 'bg-pink-500';
    case 'rightPinky': return 'bg-indigo-500';
    case 'thumb': return 'bg-gray-500';
    default: return 'bg-gray-300';
  }
};

// Create keyboard layout data
export const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' ']
];

// Generate random word list for typing practice
export const generateWordList = (wordCount: number = 20): string => {
  const commonWords = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
    'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
    'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
    'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'
  ];
  
  let text = '';
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    text += commonWords[randomIndex] + ' ';
  }
  
  return text.trim();
};

// Calculate WPM
export const calculateWPM = (charCount: number, timeInSeconds: number): number => {
  // Standard: 5 characters = 1 word
  const words = charCount / 5;
  const minutes = timeInSeconds / 60;
  
  return Math.round(words / minutes);
};

// Calculate accuracy
export const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};
