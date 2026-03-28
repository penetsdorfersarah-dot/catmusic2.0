import { KEY_TO_NOTE } from './modules/keyboardMap.js';
import { buildPiano, triggerDown, triggerUp } from './modules/piano.js';

const pianoContainer = document.getElementById('piano');
buildPiano(pianoContainer);

const heldKeys = new Set();

document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const key = e.key === 'Enter' ? 'Enter' : e.key.toLowerCase();
  const mapping = KEY_TO_NOTE[key];
  if (!mapping) return;
  e.preventDefault();
  if (heldKeys.has(key)) return;
  heldKeys.add(key);
  triggerDown(mapping.note);
});

document.addEventListener('keyup', (e) => {
  const key = e.key === 'Enter' ? 'Enter' : e.key.toLowerCase();
  const mapping = KEY_TO_NOTE[key];
  if (!mapping) return;
  heldKeys.delete(key);
  triggerUp(mapping.note);
});
