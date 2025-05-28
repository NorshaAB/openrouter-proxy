<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors({
  origin: "https://norshaab.github.io"
}));

app.use(express.json());

app.post('/ai', async (req, res) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
=======
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors({
  origin: "https://norshaab.github.io"
}));

app.use(express.json());

app.post('/ai', async (req, res) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
>>>>>>> d1f4ab6ab5ff6534290b20917075781feda70a11
