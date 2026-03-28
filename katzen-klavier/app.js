import { KEY_TO_NOTE } from './modules/keyboardMap.js';
import { buildPiano, triggerDown, triggerUp } from './modules/piano.js';
import { preloadCatSound } from './modules/catSounds.js';

const pianoContainer = document.getElementById('piano');
buildPiano(pianoContainer);

const status = document.getElementById('status');
preloadCatSound()
  .then(() => { status.textContent = 'Katze bereit! Spiel los.'; })
  .catch(() => { status.textContent = 'Synth-Modus (kein API Key)'; });

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
