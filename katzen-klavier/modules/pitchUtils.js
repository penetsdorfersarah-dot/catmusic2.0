// Converts note names like "C#4" to frequencies in Hz

const NOTE_SEMITONES = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };

export function noteToFrequency(note) {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) throw new Error(`Invalid note: ${note}`);
  const [, name, octave] = match;
  const semitone = NOTE_SEMITONES[name];
  // MIDI number: C4 = 60
  const midi = (parseInt(octave) + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}
