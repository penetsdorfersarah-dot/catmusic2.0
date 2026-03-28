// Audio engine — uses ElevenLabs cat sounds when loaded, synth as fallback

import { noteToFrequency } from './pitchUtils.js';
import { playCatNote, stopCatNote, preloadCatSound } from './catSounds.js';

let catSoundsReady = false;

// Start loading immediately — will be ready before the user plays
preloadCatSound()
  .then(() => { catSoundsReady = true; })
  .catch(() => { /* fallback to synth silently */ });

// ── Synth fallback ────────────────────────────────────────────────────────────

let ctx = null;
function getCtx() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

const activeNotes = new Map();

function playSynth(note) {
  if (activeNotes.has(note)) return;
  const ac = getCtx();
  const freq = noteToFrequency(note);

  const osc = ac.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  osc.frequency.linearRampToValueAtTime(freq * 1.04, ac.currentTime + 0.06);
  osc.frequency.linearRampToValueAtTime(freq, ac.currentTime + 0.18);

  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 6, ac.currentTime);
  filter.frequency.exponentialRampToValueAtTime(freq * 2, ac.currentTime + 0.3);
  filter.Q.value = 2;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(0.35, ac.currentTime + 0.02);
  gain.gain.setTargetAtTime(0.2, ac.currentTime + 0.02, 0.15);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime);

  activeNotes.set(note, { osc, gain });
}

function stopSynth(note) {
  const active = activeNotes.get(note);
  if (!active) return;
  const ac = getCtx();
  const { osc, gain } = active;
  gain.gain.cancelScheduledValues(ac.currentTime);
  gain.gain.setTargetAtTime(0, ac.currentTime, 0.08);
  osc.stop(ac.currentTime + 0.5);
  activeNotes.delete(note);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function playNote(note) {
  if (catSoundsReady) {
    playCatNote(note);
  } else {
    playSynth(note);
  }
}

export function stopNote(note) {
  if (catSoundsReady) {
    stopCatNote(note);
  } else {
    stopSynth(note);
  }
}
