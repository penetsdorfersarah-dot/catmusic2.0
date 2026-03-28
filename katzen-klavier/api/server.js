// Phase 2 — Node.js proxy server for ElevenLabs API
// Keeps the API key server-side, away from the browser

// Usage: node api/server.js
// Requires: npm install express node-fetch dotenv

/*
import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
const PORT = 3001;

app.get('/api/cat-sound', async (req, res) => {
  const { note } = req.query;
  if (!note) return res.status(400).json({ error: 'Missing note param' });

  // TODO Phase 2: craft the ElevenLabs prompt based on the note pitch
  // Higher notes = higher-pitched meow, lower notes = deeper meow
  const prompt = `A cat meowing at pitch ${note}, single short meow`;

  const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: prompt, duration_seconds: 0.8 }),
  });

  res.setHeader('Content-Type', 'audio/mpeg');
  response.body.pipe(res);
});

app.listen(PORT, () => console.log(`Katzen-Klavier API ready on :${PORT}`));
*/

console.log('Phase 2 server — uncomment code above and add ELEVENLABS_API_KEY to .env');
