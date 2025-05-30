import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// CORS Configuration
const allowedOrigin = 'https://norshaab.github.io';
const corsOptions = {
  origin: allowedOrigin,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

// Handle preflight
app.options('/ai', cors(corsOptions));

// AI Endpoint
app.post('/ai', cors(corsOptions), async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key is missing");
    }

    // The frontend is sending the entire messages array, not just prompt
    const { model, messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://norshaab.github.io',
        'X-Title': 'SQL Checker',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SQL expert. Analyze the provided SQL schema for correctness, suggest improvements, and identify errors. Respond with bullet points using emojis (✅, ⚠️, ❌, 💡) and end with "Grade: [A-F]".'
          },
          ...messages
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({
      error: 'AI request failed',
      details: err.message,
      suggestion: 'Please check your API key and try again'
    });
  }
});

// Health check
app.get('/health', cors(), (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'OpenRouter Proxy'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Allowed origin: ${allowedOrigin}`);
  console.log(`OpenRouter key present: ${!!process.env.OPENROUTER_API_KEY}`);
});
