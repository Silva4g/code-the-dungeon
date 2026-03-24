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
  // Hint: use req.params.id to get the player ID
  // Hint: use getPlayer(id) to look up the player
  // Hint: if player is null, respond with 404

  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/player.js and implement GET /player/:id',
  });
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
  // Hint: use req.body.name to get the name
  // Hint: validate that name exists and is a string
  // Hint: use createPlayer(id, name) to create the player
  // Hint: respond with 201 status for "created"

  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/player.js and implement POST /player/create',
  });
});
