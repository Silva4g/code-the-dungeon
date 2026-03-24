import { Router } from 'express';
import { ROOMS } from '../data/game-data.js';
import { getRoomState } from '../data/state.js';

export const roomRoutes = Router();

// ============================================================
// PHASE 1 — Room endpoints
//
// These endpoints tell the frontend what's in each room.
// When you implement GET /room/:id, the 3D dungeon will
// render walls, doors, enemies, and loot based on YOUR response.
//
// Concepts you'll learn:
//   - Reading from data files (importing game-data.js)
//   - Spreading/merging objects
//   - Handling missing data (404)
// ============================================================

/**
 * GET /api/room/:id
 *
 * Return all data about a room. The frontend uses this to:
 *   - Build the 3D geometry (walls, floor, ceiling)
 *   - Place enemies
 *   - Place loot items
 *   - Show doors/exits
 *
 * Expected response:
 * {
 *   id: "room-1",
 *   name: "Entrance Hall",
 *   biome: "catacombs",
 *   description: "A cold stone chamber...",
 *   width: 3,
 *   depth: 3,
 *   exits: [{ id, direction, target_room, locked }],
 *   enemies: [{ id, name, type, hp, max_hp, atk, def, x, z }],
 *   loot: [{ id, name, type, rarity, x, z }],
 *   objects: [{ id, type, x, z }],
 *   map_x: 2,
 *   map_y: 4
 * }
 *
 * If room doesn't exist, return 404:
 * { error: "Room not found" }
 *
 * BONUS: Merge room state (dead enemies, opened chests) with
 * the base room data using getRoomState().
 *
 * TODO: Implement this endpoint
 */
roomRoutes.get('/room/:id', (req, res) => {
  // Hint: use req.params.id to get the room ID
  // Hint: look up the room in the ROOMS object
  // Hint: ROOMS['room-1'] gives you the data for room-1
  // Hint: if the room doesn't exist, return 404

  // BONUS (Phase 4): merge with getRoomState() to reflect
  // changes like dead enemies or opened chests

  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/room.js and implement GET /room/:id',
  });
});
