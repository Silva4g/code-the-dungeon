// ============================================================
// GAME STATE — In-memory store
// This is the "database" for Phases 1-4.
// In Phase 5, you'll replace this with SQLite.
// ============================================================

const state = {
  players: new Map(),
  combats: new Map(),
  roomStates: new Map(), // tracks changes to rooms (opened chests, killed enemies, etc.)
};

export function getState() {
  return state;
}

// --- Player helpers ---

export function getPlayer(id) {
  return state.players.get(id) || null;
}

export function createPlayer(id, name) {
  const player = {
    id,
    name,
    hp: 100,
    max_hp: 100,
    atk: 5,
    def: 3,
    level: 1,
    xp: 0,
    position: { room_id: 'room-1' },
    inventory: [],
    equipped: { main_hand: null, off_hand: null, armor: null },
    buffs: [],
    discovered_rooms: ['room-1'],
  };
  state.players.set(id, player);
  return player;
}

export function updatePlayer(id, updates) {
  const player = state.players.get(id);
  if (!player) return null;
  Object.assign(player, updates);
  return player;
}

// --- Room state helpers ---

export function getRoomState(roomId) {
  return state.roomStates.get(roomId) || null;
}

export function setRoomState(roomId, roomState) {
  state.roomStates.set(roomId, roomState);
}

// --- Combat helpers ---

export function getCombat(id) {
  return state.combats.get(id) || null;
}

export function setCombat(id, combat) {
  state.combats.set(id, combat);
}

export function deleteCombat(id) {
  state.combats.delete(id);
}
