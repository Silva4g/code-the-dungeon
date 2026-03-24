import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ============================================================
// DUNGEON BACKEND — Test Suite
//
// Run:  npm test
// Or:   docker compose exec backend npm test
//
// Tests are organized by phase. Each phase has its own section.
// Phases that return 501 are skipped automatically.
// ============================================================

const BASE = process.env.TEST_URL || 'http://localhost:3001/api';

let createdPlayerId = null;

async function req(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

function skipIf501(res, label) {
  if (res.status === 501) {
    console.log(`  ⏭️  Skipped: ${label} (not implemented yet)`);
    return true;
  }
  return false;
}

// ============================================================
// HEALTH CHECK
// ============================================================

describe('Health Check', () => {
  it('GET /health returns status ok', async () => {
    const res = await req('GET', '/health');
    assert.equal(res.status, 200);
    assert.equal(res.data.status, 'ok');
    assert.equal(typeof res.data.phase, 'number');
  });
});

// ============================================================
// PHASE 1 — Hello Dungeon
// ============================================================

describe('Phase 1 — Player', () => {
  it('POST /player/create — creates player with valid name', async () => {
    const res = await req('POST', '/player/create', { name: 'TestHero' });
    assert.equal(res.status, 201, `Expected 201, got ${res.status}`);
    assert.ok(res.data.id, 'Player should have an id');
    assert.equal(res.data.name, 'TestHero');
    assert.equal(res.data.hp, 100);
    assert.equal(res.data.max_hp, 100);
    assert.equal(res.data.level, 1);
    assert.equal(res.data.xp, 0);
    assert.equal(typeof res.data.atk, 'number');
    assert.equal(typeof res.data.def, 'number');

    createdPlayerId = res.data.id;
  });

  it('POST /player/create — rejects empty body (400)', async () => {
    const res = await req('POST', '/player/create', {});
    assert.equal(res.status, 400);
    assert.ok(res.data.error);
  });

  it('POST /player/create — rejects whitespace-only name (400)', async () => {
    const res = await req('POST', '/player/create', { name: '   ' });
    assert.equal(res.status, 400);
    assert.ok(res.data.error);
  });

  it('POST /player/create — rejects non-string name (400)', async () => {
    const res = await req('POST', '/player/create', { name: 12345 });
    assert.equal(res.status, 400);
    assert.ok(res.data.error);
  });

  it('GET /player/:id — returns created player', async () => {
    assert.ok(createdPlayerId, 'Player must be created first');
    const res = await req('GET', `/player/${createdPlayerId}`);
    assert.equal(res.status, 200);
    assert.equal(res.data.id, createdPlayerId);
    assert.equal(res.data.name, 'TestHero');
    assert.equal(res.data.hp, 100);
    assert.equal(res.data.max_hp, 100);
  });

  it('GET /player/:id — returns 404 for unknown player', async () => {
    const res = await req('GET', '/player/nonexistent-player-999');
    assert.equal(res.status, 404);
    assert.ok(res.data.error);
  });
});

describe('Phase 1 — Rooms', () => {
  it('GET /room/room-1 — returns Entrance Hall', async () => {
    const res = await req('GET', '/room/room-1');
    assert.equal(res.status, 200);
    assert.equal(res.data.id, 'room-1');
    assert.equal(res.data.name, 'Entrance Hall');
    assert.equal(res.data.biome, 'catacombs');
  });

  it('GET /room/room-1 — has correct dimensions', async () => {
    const res = await req('GET', '/room/room-1');
    assert.equal(res.data.width, 3);
    assert.equal(res.data.depth, 3);
  });

  it('GET /room/room-1 — has exits array with valid structure', async () => {
    const res = await req('GET', '/room/room-1');
    assert.ok(Array.isArray(res.data.exits));
    assert.ok(res.data.exits.length > 0, 'Entrance Hall should have at least 1 exit');

    const exit = res.data.exits[0];
    assert.ok(exit.id, 'Exit must have id');
    assert.ok(exit.direction, 'Exit must have direction');
    assert.ok(exit.target_room, 'Exit must have target_room');
    assert.equal(typeof exit.locked, 'boolean', 'Exit locked must be boolean');
  });

  it('GET /room/room-1 — has enemies array (empty for entrance)', async () => {
    const res = await req('GET', '/room/room-1');
    assert.ok(Array.isArray(res.data.enemies));
    assert.equal(res.data.enemies.length, 0);
  });

  it('GET /room/room-1 — has loot array with Rusty Sword', async () => {
    const res = await req('GET', '/room/room-1');
    assert.ok(Array.isArray(res.data.loot));
    assert.equal(res.data.loot.length, 1);
    assert.equal(res.data.loot[0].id, 'loot-1');
    assert.equal(res.data.loot[0].name, 'Rusty Sword');
    assert.equal(res.data.loot[0].type, 'weapon');
    assert.equal(res.data.loot[0].rarity, 'common');
  });

  it('GET /room/room-1 — has map coordinates', async () => {
    const res = await req('GET', '/room/room-1');
    assert.equal(res.data.map_x, 2);
    assert.equal(res.data.map_y, 4);
  });

  it('GET /room/room-2 — has 2 skeleton enemies', async () => {
    const res = await req('GET', '/room/room-2');
    assert.equal(res.status, 200);
    assert.equal(res.data.enemies.length, 2);

    const enemy = res.data.enemies[0];
    assert.ok(enemy.id);
    assert.equal(enemy.name, 'Skeleton');
    assert.equal(enemy.hp, 30);
    assert.equal(enemy.max_hp, 30);
    assert.equal(typeof enemy.atk, 'number');
    assert.equal(typeof enemy.def, 'number');
    assert.equal(typeof enemy.xp, 'number');
  });

  it('GET /room/room-2 — has locked door to the north', async () => {
    const res = await req('GET', '/room/room-2');
    const locked = res.data.exits.find(e => e.locked === true);
    assert.ok(locked, 'Room 2 should have a locked exit');
    assert.equal(locked.direction, 'north');
    assert.equal(locked.requires_key, 'iron-key');
  });

  it('GET /room/room-3 — has chest object with Iron Key inside', async () => {
    const res = await req('GET', '/room/room-3');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.objects));
    assert.equal(res.data.objects.length, 1);

    const chest = res.data.objects[0];
    assert.equal(chest.type, 'chest');
    assert.ok(Array.isArray(chest.contains));
    assert.equal(chest.contains[0].name, 'Iron Key');
  });

  it('GET /room/room-5 — has sewer biome with poison enemies', async () => {
    const res = await req('GET', '/room/room-5');
    assert.equal(res.status, 200);
    assert.equal(res.data.biome, 'sewer');
    assert.ok(res.data.enemies.length > 0);
    assert.equal(res.data.enemies[0].type, 'slime');
  });

  it('GET /room/room-5 — has hidden trap', async () => {
    const res = await req('GET', '/room/room-5');
    const trap = res.data.objects.find(o => o.type === 'trap');
    assert.ok(trap, 'Room 5 should have a trap');
    assert.equal(trap.visible, false, 'Trap should be hidden initially');
  });

  it('GET /room/fake-room — returns 404', async () => {
    const res = await req('GET', '/room/fake-room-999');
    assert.equal(res.status, 404);
    assert.ok(res.data.error);
  });

  it('All 5 rooms are accessible', async () => {
    for (const id of ['room-1', 'room-2', 'room-3', 'room-4', 'room-5']) {
      const res = await req('GET', `/room/${id}`);
      assert.equal(res.status, 200, `Room ${id} should return 200`);
      assert.equal(res.data.id, id);
    }
  });
});

// ============================================================
// PHASE 2 — Combat
// ============================================================

describe('Phase 2 — Combat', () => {
  it('POST /combat/attack — deals damage to enemy', async () => {
    const res = await req('POST', '/combat/attack', {
      player_id: createdPlayerId,
      target_id: 'enemy-1',
      weapon_id: null,
    });
    if (skipIf501(res, 'POST /combat/attack')) return;

    assert.equal(res.status, 200);
    assert.equal(typeof res.data.damage, 'number');
    assert.ok(res.data.damage > 0, 'Damage should be > 0');
    assert.equal(typeof res.data.is_crit, 'boolean');
    assert.equal(typeof res.data.target_hp, 'number');
    assert.equal(typeof res.data.target_max_hp, 'number');
    assert.ok(res.data.target_hp <= res.data.target_max_hp);
    assert.equal(typeof res.data.killed, 'boolean');
    assert.equal(typeof res.data.message, 'string');
  });

  it('POST /combat/attack — rejects invalid target', async () => {
    const res = await req('POST', '/combat/attack', {
      player_id: createdPlayerId,
      target_id: 'nonexistent-enemy',
      weapon_id: null,
    });
    if (skipIf501(res, 'POST /combat/attack (invalid target)')) return;

    assert.ok([400, 404].includes(res.status));
    assert.ok(res.data.error);
  });

  it('POST /combat/defend — applies defense buff', async () => {
    const res = await req('POST', '/combat/defend', {
      player_id: createdPlayerId,
    });
    if (skipIf501(res, 'POST /combat/defend')) return;

    assert.equal(res.status, 200);
    assert.equal(res.data.defending, true);
    assert.equal(typeof res.data.defense_bonus, 'number');
    assert.ok(res.data.defense_bonus > 0);
  });
});

// ============================================================
// PHASE 3 — Inventory & Loot
// ============================================================

describe('Phase 3 — Inventory & Loot', () => {
  it('GET /inventory/:id — returns items array with count', async () => {
    const res = await req('GET', `/inventory/${createdPlayerId}`);
    if (skipIf501(res, 'GET /inventory/:id')) return;

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.items));
    assert.equal(typeof res.data.count, 'number');
    assert.equal(res.data.count, res.data.items.length);
  });

  it('GET /inventory/:id?type=weapon — filters by type', async () => {
    const res = await req('GET', `/inventory/${createdPlayerId}?type=weapon`);
    if (skipIf501(res, 'GET /inventory/:id?type=weapon')) return;

    assert.equal(res.status, 200);
    for (const item of res.data.items) {
      assert.equal(item.type, 'weapon', `Item ${item.name} should be a weapon`);
    }
  });

  it('POST /loot/pickup — picks up item from room', async () => {
    const res = await req('POST', '/loot/pickup', {
      player_id: createdPlayerId,
      loot_id: 'loot-1',
    });
    if (skipIf501(res, 'POST /loot/pickup')) return;

    assert.equal(res.status, 200);
    assert.equal(res.data.picked_up, true);
    assert.ok(res.data.item);
    assert.ok(res.data.item.name);
  });

  it('POST /inventory/equip — equips weapon to main hand', async () => {
    const res = await req('POST', '/inventory/equip', {
      player_id: createdPlayerId,
      item_id: 'loot-1',
      slot: 'main_hand',
    });
    if (skipIf501(res, 'POST /inventory/equip')) return;

    assert.equal(res.status, 200);
    assert.equal(res.data.equipped, true);
    assert.equal(res.data.slot, 'main_hand');
  });

  it('POST /inventory/use — uses consumable', async () => {
    const res = await req('POST', '/inventory/use', {
      player_id: createdPlayerId,
      item_id: 'loot-2',
    });
    if (skipIf501(res, 'POST /inventory/use')) return;

    if (res.status === 200) {
      assert.equal(res.data.used, true);
      assert.equal(typeof res.data.player_hp, 'number');
      assert.equal(typeof res.data.player_max_hp, 'number');
      assert.ok(res.data.player_hp <= res.data.player_max_hp);
    } else {
      assert.ok([400, 404].includes(res.status));
    }
  });

  it('POST /inventory/use — rejects nonexistent item', async () => {
    const res = await req('POST', '/inventory/use', {
      player_id: createdPlayerId,
      item_id: 'nonexistent-item',
    });
    if (skipIf501(res, 'POST /inventory/use (invalid)')) return;

    assert.ok([400, 404].includes(res.status));
    assert.ok(res.data.error);
  });
});

// ============================================================
// PHASE 4 — World Interaction
// ============================================================

describe('Phase 4 — World Interaction', () => {
  it('POST /room/room-3/interact — opens chest', async () => {
    const res = await req('POST', '/room/room-3/interact', {
      object_id: 'obj-1',
      player_id: createdPlayerId,
    });
    if (skipIf501(res, 'POST /room/:id/interact (chest)')) return;

    assert.equal(res.status, 200);
    assert.equal(typeof res.data.message, 'string');
    assert.ok(Array.isArray(res.data.items));
  });

  it('POST /room/room-4/interact — pulls lever', async () => {
    const res = await req('POST', '/room/room-4/interact', {
      object_id: 'obj-2',
      player_id: createdPlayerId,
    });
    if (skipIf501(res, 'POST /room/:id/interact (lever)')) return;

    assert.equal(res.status, 200);
    assert.ok(res.data.effect);
  });

  it('POST /room/room-2/unlock — tries to unlock door', async () => {
    const res = await req('POST', '/room/room-2/unlock', {
      door_id: 'exit-2-north',
      player_id: createdPlayerId,
    });
    if (skipIf501(res, 'POST /room/:id/unlock')) return;

    if (res.status === 200) {
      assert.equal(res.data.unlocked, true);
      assert.equal(res.data.key_consumed, true);
    } else {
      assert.ok(res.data.error);
    }
  });

  it('GET /map/discovered — returns discovered rooms', async () => {
    const res = await req('GET', `/map/discovered?player_id=${createdPlayerId}`);
    if (skipIf501(res, 'GET /map/discovered')) return;

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.rooms));

    for (const room of res.data.rooms) {
      assert.ok(room.id);
      assert.equal(typeof room.map_x, 'number');
      assert.equal(typeof room.map_y, 'number');
    }
  });
});
