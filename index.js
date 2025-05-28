import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Allow CORS from GitHub Pages
app.use(cors({
  origin: 'https://norshaab.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Allow preflight requests
app.options('*', cors());

app.post('/ai', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
