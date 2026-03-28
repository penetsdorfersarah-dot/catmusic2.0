// Audio engine — plays the single meow.mp3, pitch-shifted per note

import { playCatNote, stopCatNote } from './catSounds.js';

export function playNote(note) {
  playCatNote(note);
}

export function stopNote(note) {
  stopCatNote(note);
}
