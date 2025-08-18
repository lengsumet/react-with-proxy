import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Proxy API requests
app.use('/turbo', createProxyMiddleware({
  target: process.env.VITE_LUFFY_HOST_API,
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/turbo/, ''),
}));

app.use('/user', createProxyMiddleware({
  target: process.env.VITE_GOLDEN_HOST_API,
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/user/, ''),
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
