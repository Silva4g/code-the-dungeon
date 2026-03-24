import { Router } from 'express';

export const worldRoutes = Router();

// ============================================================
// PHASE 4 — World Interaction endpoints
//
// The dungeon becomes alive! Doors that need keys, chests with
// hidden loot, levers that reveal traps, and a fog-of-war map.
//
// Concepts you'll learn:
//   - Complex conditionals (key X opens door Y)
//   - State machines (trap: hidden → triggered → disarmed)
//   - Graph traversal (room connections / fog of war)
//   - Nested objects and deep updates
//   - Cause and effect chains
// ============================================================

/**
 * POST /api/room/:id/interact
 *
 * Interact with an object in a room (chest, lever, trap, etc.)
 *
 * Request body: { object_id: "obj-1", player_id: "player-1" }
 *
 * Object types and behaviors:
 *
 *   chest (locked: false):
 *     → Add contents to player inventory
 *     → Mark chest as opened in room state
 *     → Response: { message: "Opened chest! Found: Iron Key", items: [...] }
 *
 *   chest (locked: true):
 *     → Check if player has the required key
 *     → If yes: unlock and open
 *     → If no: { error: "This chest requires a key" }
 *
 *   lever:
 *     → Toggle active state
 *     → Apply effect (e.g. "reveal_trap" makes a hidden trap visible)
 *     → Response: { message: "Lever pulled!", effect: "reveal_trap" }
 *
 *   trap (triggered: false):
 *     → Deal damage to player
 *     → Mark as triggered
 *     → Response: { message: "You triggered a trap!", damage: 15 }
 *
 * TODO: Implement this endpoint
 */
worldRoutes.post('/room/:id/interact', (req, res) => {
  // Hint: get room from ROOMS and its state from getRoomState()
  // Hint: find the object by object_id
  // Hint: use if/else or switch to handle different object types
  // Hint: update room state with setRoomState()

  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/world.js and implement POST /room/:id/interact',
  });
});

/**
 * POST /api/room/:id/unlock
 *
 * Try to unlock a door using a key from inventory.
 *
 * Request body: { door_id: "exit-2-north", player_id: "player-1" }
 *
 * Logic:
 *   1. Find the door in the room's exits
 *   2. Check if door is locked
 *   3. Check if player has the required key (door.requires_key)
 *   4. If yes: unlock door, remove key from inventory
 *   5. If no: return error
 *
 * Expected response:
 * {
 *   unlocked: true,
 *   door_id: "exit-2-north",
 *   message: "Used Iron Key to unlock the door!",
 *   key_consumed: true
 * }
 *
 * TODO: Implement this endpoint
 */
worldRoutes.post('/room/:id/unlock', (req, res) => {
  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/world.js and implement POST /room/:id/unlock',
  });
});

/**
 * GET /api/map/discovered
 *
 * Return all rooms the player has visited (fog of war).
 *
 * Query: ?player_id=player-1
 *
 * Expected response:
 * {
 *   rooms: [
 *     { id: "room-1", name: "Entrance Hall", map_x: 2, map_y: 4, exits: [...], cleared: true },
 *     { id: "room-2", name: "Skeleton Guard Room", map_x: 2, map_y: 3, exits: [...], cleared: false }
 *   ]
 * }
 *
 * A room is "cleared" when all enemies in it are dead.
 *
 * TODO: Implement this endpoint
 */
worldRoutes.get('/map/discovered', (req, res) => {
  // Hint: get player.discovered_rooms array
  // Hint: map each room ID to its data from ROOMS
  // Hint: check room state to determine if cleared

  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/world.js and implement GET /map/discovered',
  });
});
