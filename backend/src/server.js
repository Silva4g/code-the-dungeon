import express from 'express';
import cors from 'cors';
import { playerRoutes } from './routes/player.js';
import { roomRoutes } from './routes/room.js';
import { combatRoutes } from './routes/combat.js';
import { inventoryRoutes } from './routes/inventory.js';
import { worldRoutes } from './routes/world.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', phase: 1, message: 'Dungeon Backend is alive!' });
});

// --- Routes ---
// Phase 1: Hello Dungeon
app.use('/api', playerRoutes);
app.use('/api', roomRoutes);

// Phase 2: Combat
app.use('/api', combatRoutes);

// Phase 3: Inventory & Loot
app.use('/api', inventoryRoutes);

// Phase 4: World Interaction
app.use('/api', worldRoutes);

// --- Error handling ---
app.use(errorHandler);

// --- Start ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ⚔️  Dungeon Backend running on port ${PORT}
  
  Phase 1 endpoints to implement:
    GET  /api/player/:id
    POST /api/player/create
    GET  /api/room/:id

  Health check: http://localhost:${PORT}/api/health
  `);
});
