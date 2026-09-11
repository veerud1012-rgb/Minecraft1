import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Alias for index (3).html in case of cached URLs or direct references
app.get('/index%20(3).html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/index (3).html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static assets from project root
app.use(express.static(__dirname));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
