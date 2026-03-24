import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ============================================================
// TESTS — Run with: npm test
//
// These tests verify your endpoints work correctly.
// Start with Phase 1 tests. As you implement more phases,
// uncomment the later test sections.
// ============================================================

const BASE = 'http://localhost:3001/api';

async function req(method, path, body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  return { status: res.status, data: await res.json() };
}

describe('Phase 1 — Hello Dungeon', () => {
  it('GET /health returns ok', async () => {
    const { status, data } = await req('GET', '/health');
    assert.equal(status, 200);
    assert.equal(data.status, 'ok');
  });

  it('POST /player/create creates a player', async () => {
    const { status, data } = await req('POST', '/player/create', { name: 'TestHero' });
    assert.equal(status, 201);
    assert.equal(data.name, 'TestHero');
    assert.ok(data.hp > 0);
    assert.ok(data.id);
  });

  it('POST /player/create without name returns 400', async () => {
    const { status } = await req('POST', '/player/create', {});
    assert.equal(status, 400);
  });

  it('GET /player/:id returns the player', async () => {
    const create = await req('POST', '/player/create', { name: 'Finder' });
    const { status, data } = await req('GET', `/player/${create.data.id}`);
    assert.equal(status, 200);
    assert.equal(data.name, 'Finder');
  });

  it('GET /player/:id returns 404 for unknown player', async () => {
    const { status } = await req('GET', '/player/nobody');
    assert.equal(status, 404);
  });

  it('GET /room/room-1 returns room data', async () => {
    const { status, data } = await req('GET', '/room/room-1');
    assert.equal(status, 200);
    assert.equal(data.id, 'room-1');
    assert.equal(data.name, 'Entrance Hall');
    assert.ok(Array.isArray(data.exits));
    assert.ok(Array.isArray(data.enemies));
    assert.ok(Array.isArray(data.loot));
  });

  it('GET /room/fake-room returns 404', async () => {
    const { status } = await req('GET', '/room/fake-room');
    assert.equal(status, 404);
  });
});

// ============================================================
// Uncomment these as you progress through the phases:
// ============================================================

// describe('Phase 2 — Combat', () => {
//   it('POST /combat/attack deals damage', async () => {
//     const { data } = await req('POST', '/combat/attack', {
//       player_id: 'player-1', target_id: 'enemy-1', weapon_id: null
//     });
//     assert.ok(data.damage > 0);
//     assert.ok(typeof data.is_crit === 'boolean');
//   });
// });

// describe('Phase 3 — Inventory', () => {
//   it('GET /inventory/:id returns items array', async () => {
//     const { status, data } = await req('GET', '/inventory/player-1');
//     assert.equal(status, 200);
//     assert.ok(Array.isArray(data.items));
//   });
// });
