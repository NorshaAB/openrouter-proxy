import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// ✅ Allow requests only from your GitHub Pages site
const allowedOrigin = 'https://norshaab.github.io';

// ✅ Handle preflight CORS requests for /ai
app.options('/ai', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.sendStatus(200);
});

// ✅ Main AI route
app.post('/ai', async (req, res) => {
  res.set('Access-Control-Allow-Origin', allowedOrigin);

  try {
    const userPrompt = req.body.prompt || 'Hello';
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await openaiResponse.json();
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch from OpenAI API' });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Proxy running on port ${port}`);
});
