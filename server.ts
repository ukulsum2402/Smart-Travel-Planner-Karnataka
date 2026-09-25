import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { app, initializeDatabaseIfConnected } from './server/index.js';

async function startServer() {
  const PORT = 3000;

  // Initialize DB if DATABASE_URL is provided
  initializeDatabaseIfConnected().catch(err => {
    console.warn('DB initialization error:', err.message);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Smart Travel Planner server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
