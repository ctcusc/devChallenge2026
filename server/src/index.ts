import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import apiRouter from './routes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// --- Global middleware ---
app.use(cors({ origin: clientOrigin.split(',').map((o) => o.trim()) }));
app.use(express.json());
app.use(requestLogger);

// --- Health check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// --- API routes ---
app.use('/', apiRouter);

// --- Error handler (must be registered last) ---
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Feeding Brennen API listening on http://localhost:${port}`);
});
