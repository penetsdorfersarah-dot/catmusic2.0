// Web Audio API engine — plays a piano-like tone with cat-meow character

import { noteToFrequency } from './pitchUtils.js';

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Active notes map: note -> { osc, gain }
const activeNotes = new Map();

export function playNote(note) {
  if (activeNotes.has(note)) return;
  const ac = getCtx();
  const freq = noteToFrequency(note);

  // Main oscillator — sawtooth for meow-ish timbre
  const osc = ac.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, ac.currentTime);

  // Pitch envelope — slight upward glide like a cat meow
  osc.frequency.linearRampToValueAtTime(freq * 1.04, ac.currentTime + 0.06);
  osc.frequency.linearRampToValueAtTime(freq, ac.currentTime + 0.18);

  // Low-pass filter — rounds off harshness
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 6, ac.currentTime);
  filter.frequency.exponentialRampToValueAtTime(freq * 2, ac.currentTime + 0.3);
  filter.Q.value = 2;

  // Amplitude envelope
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(0.35, ac.currentTime + 0.02);  // attack
  gain.gain.setTargetAtTime(0.2, ac.currentTime + 0.02, 0.15);      // decay to sustain

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime);

  activeNotes.set(note, { osc, gain });
}

export function stopNote(note) {
  const active = activeNotes.get(note);
  if (!active) return;
  const ac = getCtx();
  const { osc, gain } = active;

  gain.gain.cancelScheduledValues(ac.currentTime);
  gain.gain.setTargetAtTime(0, ac.currentTime, 0.08); // release

  osc.stop(ac.currentTime + 0.5);
  activeNotes.delete(note);
}
