// Maps keyboard keys to piano notes (2 octaves, C3–E5, 29 keys)
// White keys: A S D F G H J K L ; ' Enter
// Black keys: W E T Y U O P [ ] \

export const KEY_TO_NOTE = {
  // Octave 3
  'a': { note: 'C3',  type: 'white' },
  'w': { note: 'C#3', type: 'black' },
  's': { note: 'D3',  type: 'white' },
  'e': { note: 'D#3', type: 'black' },
  'd': { note: 'E3',  type: 'white' },
  'f': { note: 'F3',  type: 'white' },
  't': { note: 'F#3', type: 'black' },
  'g': { note: 'G3',  type: 'white' },
  'y': { note: 'G#3', type: 'black' },
  'h': { note: 'A3',  type: 'white' },
  'u': { note: 'A#3', type: 'black' },
  'j': { note: 'B3',  type: 'white' },
  // Octave 4
  'k': { note: 'C4',  type: 'white' },
  'o': { note: 'C#4', type: 'black' },
  'l': { note: 'D4',  type: 'white' },
  'p': { note: 'D#4', type: 'black' },
  ';': { note: 'E4',  type: 'white' },
  "'": { note: 'F4',  type: 'white' },
  '[': { note: 'F#4', type: 'black' },
  'Enter': { note: 'G4',  type: 'white' },
  ']': { note: 'G#4', type: 'black' },
  // Octave 5 partial
  'z': { note: 'A4',  type: 'white' },
  '\\': { note: 'A#4', type: 'black' },
  'x': { note: 'B4',  type: 'white' },
  'c': { note: 'C5',  type: 'white' },
  'v': { note: 'C#5', type: 'black' },
  'b': { note: 'D5',  type: 'white' },
  'n': { note: 'D#5', type: 'black' },
  'm': { note: 'E5',  type: 'white' },
};

export const NOTE_ORDER = [
  'C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3',
  'C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4',
  'C5','C#5','D5','D#5','E5',
];
