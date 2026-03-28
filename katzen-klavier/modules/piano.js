// Builds and manages the visual piano keyboard

import { KEY_TO_NOTE, NOTE_ORDER } from './keyboardMap.js';
import { playNote, stopNote } from './audioEngine.js';

// Reverse map: note -> key label
const NOTE_TO_KEY = {};
for (const [key, { note }] of Object.entries(KEY_TO_NOTE)) {
  NOTE_TO_KEY[note] = key === 'Enter' ? '↵' : key.toUpperCase();
}

const NOTE_TYPE = {};
for (const { note, type } of Object.values(KEY_TO_NOTE)) {
  NOTE_TYPE[note] = type;
}

export function buildPiano(container) {
  container.innerHTML = '';
  const whiteKeys = NOTE_ORDER.filter(n => NOTE_TYPE[n] === 'white');
  const wrapper = document.createElement('div');
  wrapper.className = 'piano-wrapper';

  // We render whites first, then overlay blacks
  const whites = document.createElement('div');
  whites.className = 'white-keys';

  whiteKeys.forEach(note => {
    const key = document.createElement('div');
    key.className = 'piano-key white';
    key.dataset.note = note;

    const label = document.createElement('span');
    label.className = 'key-label';
    label.textContent = NOTE_TO_KEY[note] ?? '';
    key.appendChild(label);

    key.addEventListener('mousedown', () => triggerDown(note));
    key.addEventListener('mouseup', () => triggerUp(note));
    key.addEventListener('mouseleave', () => triggerUp(note));

    whites.appendChild(key);
  });

  wrapper.appendChild(whites);

  // Black keys — positioned absolutely relative to wrapper
  const blacks = document.createElement('div');
  blacks.className = 'black-keys';

  // Map white index to note so we can position black keys
  const blackNotes = NOTE_ORDER.filter(n => NOTE_TYPE[n] === 'black');
  blackNotes.forEach(note => {
    const key = document.createElement('div');
    key.className = 'piano-key black';
    key.dataset.note = note;

    const label = document.createElement('span');
    label.className = 'key-label';
    label.textContent = NOTE_TO_KEY[note] ?? '';
    key.appendChild(label);

    key.addEventListener('mousedown', (e) => { e.stopPropagation(); triggerDown(note); });
    key.addEventListener('mouseup', (e) => { e.stopPropagation(); triggerUp(note); });
    key.addEventListener('mouseleave', () => triggerUp(note));

    blacks.appendChild(key);
  });

  wrapper.appendChild(blacks);
  container.appendChild(wrapper);

  // Position black keys via CSS custom property (index into whites)
  positionBlackKeys();
}

function positionBlackKeys() {
  // For each black key, find the white key to its left and offset
  const WHITE_KEY_WIDTH = 52; // px, must match CSS
  const blackOffsets = {
    'C#': 0.6, 'D#': 1.6, 'F#': 3.6, 'G#': 4.6, 'A#': 5.6,
  };

  const whiteNotes = NOTE_ORDER.filter(n => NOTE_TYPE[n] === 'white');

  NOTE_ORDER.filter(n => NOTE_TYPE[n] === 'black').forEach(note => {
    const el = document.querySelector(`.piano-key[data-note="${note}"]`);
    if (!el) return;

    // Find position: which white key index does this black key sit after?
    const noteName = note.replace(/\d/, '');
    const octave = note.match(/\d/)[0];
    const baseWhite = noteName.replace('#', '');
    const baseNote = baseWhite + octave;
    const whiteIdx = whiteNotes.indexOf(baseNote);

    const offset = blackOffsets[noteName] ?? 0;
    const leftPx = (whiteIdx + offset) * WHITE_KEY_WIDTH - 18;
    el.style.left = `${leftPx}px`;
  });
}

export function triggerDown(note) {
  const el = document.querySelector(`.piano-key[data-note="${note}"]`);
  if (el) el.classList.add('pressed');
  playNote(note);
}

export function triggerUp(note) {
  const el = document.querySelector(`.piano-key[data-note="${note}"]`);
  if (el) el.classList.remove('pressed');
  stopNote(note);
}
