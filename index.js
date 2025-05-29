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

// Handle preflight requests
app.options('/ai', cors(corsOptions));

// Main AI endpoint
app.post('/ai', cors(corsOptions), async (req, res) => {
  try {
    // Verify API key exists
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key is missing from server configuration");
    }

    // Get user prompt or use default
    const userPrompt = req.body.prompt || 'Hello';
    if (typeof userPrompt !== 'string') {
      throw new Error("Prompt must be a string");
    }

    // Call OpenRouter API
   const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
  'Authorization': `Bearer ${apiKey}`,
  'HTTP-Referer': 'https://norshaab.github.io', // ← Must match exactly
  'X-Title': 'SQL AI Ebook', // ← Any name you want
  'Content-Type': 'application/json'
},
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // Specify model via OpenRouter
        messages: [{ role: 'user', content: userPrompt }]
      }),
      timeout: 15000 // 15 seconds timeout
    });

    // Handle OpenRouter response
    if (!openrouterResponse.ok) {
      const errorData = await openrouterResponse.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || openrouterResponse.statusText}`);
    }

    const data = await openrouterResponse.json();
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'OpenRouter Proxy'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Allowed origin: ${allowedOrigin}`);
  console.log(`OpenRouter key present: ${!!process.env.OPENROUTER_API_KEY}`);
});