import { Router } from 'express';

export const combatRoutes = Router();

// ============================================================
// PHASE 2 — Combat endpoints
//
// Now the fun begins! When you implement these, clicking on
// enemies in the 3D world will actually deal damage, and
// you'll see HP bars and death animations.
//
// Concepts you'll learn:
//   - Math operations (damage formulas)
//   - if/else logic (is target alive? is it a crit?)
//   - Mutating state (reducing HP)
//   - Validation (does the target exist?)
//   - Error handling
//
// Utility functions available in ../utils/helpers.js:
//   - calcDamage(atk, def) → number
//   - isCrit(luck) → boolean
//   - roll(count, sides) → number (e.g. roll(1,6) = 1d6)
//   - clamp(value, min, max) → number
// ============================================================

/**
 * POST /api/combat/attack
 *
 * Player attacks an enemy. Calculate damage and apply it.
 *
 * Request body:
 * { player_id: "player-1", target_id: "enemy-1", weapon_id: null }
 *
 * Expected response:
 * {
 *   damage: 7,
 *   is_crit: false,
 *   target_hp: 23,
 *   target_max_hp: 30,
 *   killed: false,
 *   message: "You deal 7 damage to Skeleton!"
 * }
 *
 * If target is already dead: { error: "Target is already dead" }
 * If target doesn't exist: { error: "Target not found" }
 *
 * CRIT: 10% chance, deals 2x damage
 *
 * When enemy dies (hp <= 0):
 *   - Set killed: true
 *   - Award XP to player
 *   - Optionally drop loot (Phase 3)
 *
 * TODO: Implement this endpoint
 */
combatRoutes.post('/combat/attack', (req, res) => {
  // Hint: get player_id and target_id from req.body
  // Hint: look up the player and the enemy
  // Hint: use calcDamage() and isCrit() from utils/helpers.js
  // Hint: if crit, multiply damage by 2
  // Hint: subtract damage from enemy HP
  // Hint: check if enemy HP <= 0

  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/combat.js and implement POST /combat/attack',
  });
});

/**
 * POST /api/combat/defend
 *
 * Player defends, reducing damage taken next turn.
 *
 * Request body: { player_id: "player-1" }
 *
 * Expected response:
 * {
 *   defending: true,
 *   defense_bonus: 5,
 *   message: "You brace yourself! (+5 DEF this turn)"
 * }
 *
 * TODO: Implement this endpoint
 */
combatRoutes.post('/combat/defend', (req, res) => {
  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/combat.js and implement POST /combat/defend',
  });
});

/**
 * GET /api/combat/status/:combatId
 *
 * Get current combat state.
 *
 * Expected response:
 * {
 *   player_hp: 85,
 *   enemies: [{ id, name, hp, max_hp, alive }],
 *   turn: 3,
 *   active: true
 * }
 *
 * TODO: Implement this endpoint (optional, for advanced combat)
 */
combatRoutes.get('/combat/status/:combatId', (req, res) => {
  res.status(501).json({
    error: 'Not implemented yet!',
    hint: 'Open backend/src/routes/combat.js and implement GET /combat/status/:id',
  });
});
