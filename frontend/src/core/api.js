const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
    this.connected = false;
  }

  async request(method, path, body = null) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);

    try {
      const res = await fetch(`${this.baseUrl}${path}`, opts);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        return { ok: false, status: res.status, error: err.error || 'Unknown error' };
      }
      const data = await res.json();
      return { ok: true, data };
    } catch (e) {
      return { ok: false, status: 0, error: e.message };
    }
  }

  // === Phase 1: Hello Dungeon ===

  async getPlayer(id) {
    return this.request('GET', `/player/${id}`);
  }

  async createPlayer(name) {
    return this.request('POST', '/player/create', { name });
  }

  async getRoom(id) {
    return this.request('GET', `/room/${id}`);
  }

  // === Phase 2: Combat ===

  async attack(playerId, targetId, weaponId) {
    return this.request('POST', '/combat/attack', { player_id: playerId, target_id: targetId, weapon_id: weaponId });
  }

  async defend(playerId) {
    return this.request('POST', '/combat/defend', { player_id: playerId });
  }

  async getCombatStatus(combatId) {
    return this.request('GET', `/combat/status/${combatId}`);
  }

  // === Phase 3: Inventory ===

  async getInventory(playerId, filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const query = params ? `?${params}` : '';
    return this.request('GET', `/inventory/${playerId}${query}`);
  }

  async useItem(playerId, itemId) {
    return this.request('POST', '/inventory/use', { player_id: playerId, item_id: itemId });
  }

  async equipItem(playerId, itemId, slot) {
    return this.request('POST', '/inventory/equip', { player_id: playerId, item_id: itemId, slot });
  }

  async pickupLoot(playerId, lootId) {
    return this.request('POST', '/loot/pickup', { player_id: playerId, loot_id: lootId });
  }

  // === Phase 4: World Interaction ===

  async interactWithObject(roomId, objectId, playerId) {
    return this.request('POST', `/room/${roomId}/interact`, { object_id: objectId, player_id: playerId });
  }

  async unlockDoor(roomId, doorId, playerId) {
    return this.request('POST', `/room/${roomId}/unlock`, { door_id: doorId, player_id: playerId });
  }

  async getDiscoveredMap(playerId) {
    return this.request('GET', `/map/discovered?player_id=${playerId}`);
  }

  // === Phase 5: Persistence ===

  async saveGame(playerId) {
    return this.request('POST', `/save/${playerId}`);
  }

  async getLeaderboard() {
    return this.request('GET', '/leaderboard');
  }

  async register(username, password) {
    return this.request('POST', '/auth/register', { username, password });
  }

  async login(username, password) {
    return this.request('POST', '/auth/login', { username, password });
  }

  // === Health check ===

  async healthCheck() {
    const res = await this.request('GET', '/health');
    this.connected = res.ok;
    return res;
  }
}

export const api = new ApiClient();
