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
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key is missing from server configuration");
    }

    // Get user prompt or use default
    const userPrompt = req.body.prompt || 'Hello';
    if (typeof userPrompt !== 'string') {
      throw new Error("Prompt must be a string");
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.7
      }),
      timeout: 10000 // 10 seconds timeout
    });

    // Handle OpenAI response
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || openaiResponse.statusText}`);
    }

    const data = await openaiResponse.json();
    res.json(data);

  } catch (err) {
    console.error('Error:', err.message);
    
    // Send appropriate error response
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
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Allowed origin: ${allowedOrigin}`);
  console.log(`OpenAI key present: ${!!process.env.OPENAI_API_KEY}`);
});