// Fetches one cat meow from ElevenLabs (via /api/cat-sound),
// decodes it, and pitch-shifts it per note using Web Audio playbackRate.

import { noteToFrequency } from './pitchUtils.js';

const BASE_NOTE = 'A4'; // assumed pitch of the generated meow
const BASE_FREQ = noteToFrequency(BASE_NOTE); // 440 Hz

let audioCtx = null;
let meowBuffer = null;
let loadPromise = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export async function preloadCatSound() {
  if (meowBuffer) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const res = await fetch('/api/cat-sound');
    if (!res.ok) throw new Error(`Cat sound API error: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    meowBuffer = await getCtx().decodeAudioData(arrayBuffer);
  })();

  return loadPromise;
}

// Active sources map so we can stop them
const activeSources = new Map();

export function playCatNote(note) {
  if (!meowBuffer) return;
  stopCatNote(note);

  const ctx = getCtx();
  const source = ctx.createBufferSource();
  source.buffer = meowBuffer;

  // Pitch-shift: playbackRate = target frequency / base frequency
  const targetFreq = noteToFrequency(note);
  source.playbackRate.value = targetFreq / BASE_FREQ;

  // Slight gain envelope to avoid clicks
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.01);

  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime);

  activeSources.set(note, { source, gain });

  // Auto-cleanup when buffer ends
  source.onended = () => activeSources.delete(note);
}

export function stopCatNote(note) {
  const active = activeSources.get(note);
  if (!active) return;
  const ctx = getCtx();
  const { gain, source } = active;
  gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
  try { source.stop(ctx.currentTime + 0.2); } catch {}
  activeSources.delete(note);
}
