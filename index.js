import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Allow cross-origin requests from your GitHub Pages site
app.use(cors({
  origin: 'https://norshaab.github.io'
}));

app.use(express.json());

app.post('/ai', async (req, res) => {
  // Your AI proxy code here
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
