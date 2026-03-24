import { Router } from 'express';

export const inventoryRoutes = Router();

// ============================================================
// PHASE 3 — Inventory & Loot endpoints
//
// Items start appearing in the 3D world! Glowing cubes on the
// ground, a chest that opens, an inventory screen with your gear.
//
// Concepts you'll learn:
//   - Array methods (filter, find, map, splice)
//   - Query parameters (?type=weapon&rarity=rare)
//   - switch/case (different item effects)
//   - Weighted random (loot drop tables)
//   - Enums / type checking
//
// Available data in ../data/game-data.js:
//   - ITEM_CATALOG: all item definitions
//   - LOOT_TABLES: drop tables per enemy type
//
// Utility: weightedRandom(table) from ../utils/helpers.js
// ============================================================

/**
 * GET /api/inventory/:playerId
 *
 * List all items the player has. Supports filtering.
 *
 * Query params (all optional):
 *   ?type=weapon      → only weapons
 *   ?type=consumable  → only consumables
 *   ?rarity=rare      → only rare items
 *
 * Expected response:
 * {
 *   items: [
 *     { id: "item-1", name: "Rusty Sword", type: "weapon", rarity: "common", stats: { atk: 3 } },
 *     { id: "item-2", name: "Health Potion", type: "consumable", rarity: "common", effect: { type: "heal", amount: 20 } }
 *   ],
 *   count: 2
 * }
 *
 * TODO: Implement this endpoint
 */
inventoryRoutes.get('/inventory/:playerId', (req, res) => {
  // Hint: get the player from state
  // Hint: player.inventory is an array of items
  // Hint: use req.query.type and req.query.rarity to filter
  // Hint: Array.filter() is your friend here

  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/inventory.js and implement GET /inventory/:playerId',
  });
});

/**
 * POST /api/inventory/use
 *
 * Use a consumable item. Each type has a different effect.
 *
 * Request body: { player_id: "player-1", item_id: "item-2" }
 *
 * Effects by type:
 *   - heal: restore HP by effect.amount
 *   - cure_poison: remove poison debuff
 *   - buff_atk: temporarily increase ATK
 *   - buff_def: temporarily increase DEF
 *
 * After use, REMOVE the item from inventory.
 *
 * Expected response:
 * {
 *   used: true,
 *   item_name: "Health Potion",
 *   effect: "Healed 20 HP",
 *   player_hp: 85,
 *   player_max_hp: 100
 * }
 *
 * If item not found: { error: "Item not in inventory" }
 * If not consumable: { error: "This item cannot be used" }
 *
 * TODO: Implement this endpoint
 */
inventoryRoutes.post('/inventory/use', (req, res) => {
  // Hint: find the item in player.inventory
  // Hint: use switch(item.effect.type) to handle different effects
  // Hint: after applying the effect, remove the item from the array
  // Hint: Array.splice() or Array.filter() to remove

  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/inventory.js and implement POST /inventory/use',
  });
});

/**
 * POST /api/inventory/equip
 *
 * Equip a weapon or armor piece. Updates player stats.
 *
 * Request body: { player_id: "player-1", item_id: "item-1", slot: "main_hand" }
 *
 * Slots: "main_hand", "off_hand", "armor"
 *
 * When equipping:
 *   - Add the item's stats to the player (e.g. +3 ATK)
 *   - If a slot already has an item, unequip it first
 *   - Move the old item back to inventory
 *
 * Expected response:
 * {
 *   equipped: true,
 *   slot: "main_hand",
 *   item_name: "Rusty Sword",
 *   player_atk: 8,
 *   player_def: 3
 * }
 *
 * TODO: Implement this endpoint
 */
inventoryRoutes.post('/inventory/equip', (req, res) => {
  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/inventory.js and implement POST /inventory/equip',
  });
});

/**
 * POST /api/loot/pickup
 *
 * Pick up a loot item from the ground.
 *
 * Request body: { player_id: "player-1", loot_id: "loot-1" }
 *
 * Expected response:
 * {
 *   picked_up: true,
 *   item: { id, name, type, rarity }
 * }
 *
 * TODO: Implement this endpoint
 */
inventoryRoutes.post('/loot/pickup', (req, res) => {
  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/inventory.js and implement POST /loot/pickup',
  });
});
