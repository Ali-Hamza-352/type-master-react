// Define finger mapping for each key
export type Finger = 'leftPinky' | 'leftRing' | 'leftMiddle' | 'leftIndex' | 'rightIndex' | 'rightMiddle' | 'rightRing' | 'rightPinky' | 'thumb';

export interface KeyInfo {
  finger: Finger;
  row: 'top' | 'home' | 'bottom' | 'space';
}

export const keyboardMapping: Record<string, KeyInfo> = {
  // Number row
  '`': { finger: 'leftPinky', row: 'top' },
  '1': { finger: 'leftPinky', row: 'top' },
  '2': { finger: 'leftRing', row: 'top' },
  '3': { finger: 'leftMiddle', row: 'top' },
  '4': { finger: 'leftIndex', row: 'top' },
  '5': { finger: 'leftIndex', row: 'top' },
  '6': { finger: 'rightIndex', row: 'top' },
  '7': { finger: 'rightIndex', row: 'top' },
  '8': { finger: 'rightMiddle', row: 'top' },
  '9': { finger: 'rightRing', row: 'top' },
  '0': { finger: 'rightPinky', row: 'top' },
  '-': { finger: 'rightPinky', row: 'top' },
  '=': { finger: 'rightPinky', row: 'top' },
  
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
  ' ': { finger: 'thumb', row: 'space' },
  
  // Additional keys
  'Tab': { finger: 'leftPinky', row: 'top' },
  'Caps': { finger: 'leftPinky', row: 'home' },
  'Shift': { finger: 'leftPinky', row: 'bottom' },
  'Enter': { finger: 'rightPinky', row: 'home' },
  'Backspace': { finger: 'rightPinky', row: 'top' },
  '[': { finger: 'rightPinky', row: 'top' },
  ']': { finger: 'rightPinky', row: 'top' },
  '\\': { finger: 'rightPinky', row: 'top' },
  "'": { finger: 'rightPinky', row: 'home' },
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
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
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

// Generate text based on lesson type
export const generateText = (type: string): string => {
  switch (type) {
    case 'keys':
      return generateKeyDrillText();
    case 'words':
      return generateWordList(25);
    case 'paragraph':
      return generateParagraph();
    default:
      return generateWordList(25);
  }
};

const generateKeyDrillText = (): string => {
  return 'f f j j f j f j k k d d s l a ; space f j k d s l a';
};

const generateParagraph = (): string => {
  return `The quick brown fox jumps over the lazy dog. A wizard's job is to vex chumps quickly in fog. How vexingly quick daft zebras jump! The five boxing wizards jump quickly. Pack my box with five dozen liquor jugs.`;
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
