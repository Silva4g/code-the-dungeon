import { Router } from 'express';
import { getPlayer, createPlayer } from '../data/state.js';

export const playerRoutes = Router();

// ============================================================
// PHASE 1 — Player endpoints
//
// Your first task! Make these endpoints return the right data
// so the frontend can load your player into the dungeon.
//
// Concepts you'll learn:
//   - Express routing (req.params, req.body)
//   - JSON responses (res.json)
//   - HTTP status codes (200, 201, 404)
//   - Basic validation
// ============================================================

/**
 * GET /api/player/:id
 *
 * Return the player's data. The frontend calls this on startup
 * to show your HP, level, and name on the HUD.
 *
 * Expected response:
 * {
 *   id: "player-1",
 *   name: "Adventurer",
 *   hp: 100,
 *   max_hp: 100,
 *   atk: 5,
 *   def: 3,
 *   level: 1,
 *   xp: 0
 * }
 *
 * If player doesn't exist, return 404:
 * { error: "Player not found" }
 *
 * TODO: Implement this endpoint
 */
playerRoutes.get('/player/:id', (req, res) => {
  const player = getPlayer(req.params.id);

  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }

  res.json(player);
});

/**
 * POST /api/player/create
 *
 * Create a new player. The frontend sends a name in the body.
 *
 * Request body: { name: "Adventurer" }
 *
 * Expected response (201):
 * {
 *   id: "player-1",
 *   name: "Adventurer",
 *   hp: 100,
 *   max_hp: 100,
 *   ...
 * }
 *
 * If name is missing, return 400:
 * { error: "Name is required" }
 *
 * TODO: Implement this endpoint
 */
playerRoutes.post('/player/create', (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const id = `player-${Date.now()}`;
  const player = createPlayer(id, name.trim());
  res.status(201).json(player);
});
