// ============================================================
// UTILITY FUNCTIONS — Use these in your route handlers
// ============================================================

/**
 * Roll dice: roll(1, 6) → 1d6, roll(2, 8) → 2d8
 */
export function roll(count, sides) {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

/**
 * Calculate damage: attacker ATK vs defender DEF
 * Formula: base_damage = atk - def + roll(1,6)
 * Minimum damage is always 1
 */
export function calcDamage(attackerAtk, defenderDef) {
  const base = attackerAtk - defenderDef + roll(1, 6);
  return Math.max(1, base);
}

/**
 * Check for critical hit (10% base chance)
 */
export function isCrit(luck = 0) {
  return Math.random() < (0.10 + luck * 0.01);
}

/**
 * Pick a random item from a weighted loot table
 * table: [{ item_id, weight }, ...]
 */
export function weightedRandom(table) {
  const totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const entry of table) {
    rand -= entry.weight;
    if (rand <= 0) return entry;
  }
  return table[table.length - 1];
}

/**
 * Calculate level from XP using the XP table
 */
export function calcLevel(xp, xpTable) {
  let level = 1;
  for (let i = 0; i < xpTable.length; i++) {
    if (xp >= xpTable[i]) level = i + 1;
    else break;
  }
  return level;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Generate a simple unique ID
 */
export function generateId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
