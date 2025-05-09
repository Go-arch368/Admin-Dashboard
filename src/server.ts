// src/server.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 3001; // Different from Next.js (3000)

// Middleware
app.use(express.json());

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Express API' });
});

// Health check
app.get('/', (req, res) => {
  res.send('Express server running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`)
});