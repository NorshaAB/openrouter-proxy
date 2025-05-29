import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// ✅ Configure CORS properly
const allowedOrigin = 'https://norshaab.github.io';
const corsOptions = {
  origin: allowedOrigin,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

// Apply CORS to the /ai endpoint
app.options('/ai', cors(corsOptions)); // Handle preflight
app.post('/ai', cors(corsOptions), async (req, res) => {
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