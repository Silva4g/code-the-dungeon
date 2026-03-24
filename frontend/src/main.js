import { Engine } from './core/engine.js';
import { PlayerController } from './core/controls.js';
import { api } from './core/api.js';
import { RoomBuilder } from './world/room-builder.js';
import { InteractionSystem } from './world/interaction.js';
import { HUD } from './ui/hud.js';
import { Minimap } from './ui/minimap.js';

const PLAYER_ID = 'player-1';
const START_ROOM = 'room-1';

class Game {
  constructor() {
    this.engine = null;
    this.controller = null;
    this.roomBuilder = null;
    this.interaction = null;
    this.hud = null;
    this.minimap = null;
    this.currentRoomId = null;
  }

  async start() {
    this.hud = new HUD();
    this.hud.init();
    this.hud.setLoadStatus('Initializing engine...');

    this.engine = new Engine();
    this.controller = new PlayerController();
    this.roomBuilder = new RoomBuilder();
    this.interaction = new InteractionSystem(this.hud);
    this.minimap = new Minimap();

    this.engine.addSystem(this.controller);
    this.engine.addSystem(this.roomBuilder);
    this.engine.addSystem(this.interaction);

    this.minimap.init();
    this.minimap.playerId = PLAYER_ID;
    this.interaction.playerId = PLAYER_ID;

    document.addEventListener('room:enter', (e) => {
      this.enterRoom(e.detail.roomId);
    });

    this.hud.setLoadStatus('Connecting to backend...');
    await this._connectWithRetry();

    this.hud.setLoadStatus('Loading player...');
    await this._loadPlayer();

    this.hud.setLoadStatus('Entering dungeon...');
    await this.enterRoom(START_ROOM);

    this.hud.hideLoading();
    this.engine.start();
  }

  async _connectWithRetry() {
    let attempts = 0;
    while (attempts < 30) {
      const res = await api.healthCheck();
      if (res.ok) return;
      attempts++;
      this.hud.setLoadStatus(`Waiting for backend... (${attempts})`);
      await new Promise(r => setTimeout(r, 2000));
    }
    this.hud.setLoadStatus('Backend not responding. Make sure your server is running!');
  }

  async _loadPlayer() {
    let res = await api.getPlayer(PLAYER_ID);

    if (!res.ok) {
      res = await api.createPlayer('Adventurer');
    }

    if (res.ok) {
      this.hud.updatePlayer(res.data);
    } else {
      this.hud.showStatus('Could not load player — implement GET /api/player/:id');
    }
  }

  async enterRoom(roomId) {
    this.currentRoomId = roomId;
    this.interaction.currentRoomId = roomId;

    const res = await api.getRoom(roomId);

    if (res.ok) {
      const roomData = res.data;
      const { colliders, interactables } = this.roomBuilder.buildRoom(roomData);
      this.controller.setColliders(colliders);
      this.interaction.setInteractables(interactables);
      this.hud.updateRoom(roomData);
      this.minimap.addRoom(roomData);
      this.minimap.setCurrentRoom(roomId);

      this.controller.camera.position.set(0, 1.6, 0);
    } else {
      this._buildFallbackRoom(roomId);
      this.hud.showStatus(`Room "${roomId}" not found — implement GET /api/room/:id`);
    }
  }

  _buildFallbackRoom(roomId) {
    const fallback = {
      id: roomId,
      name: 'Empty Room',
      biome: 'catacombs',
      width: 3,
      depth: 3,
      exits: [],
      enemies: [],
      loot: [],
      objects: [],
    };
    const { colliders } = this.roomBuilder.buildRoom(fallback);
    this.controller.setColliders(colliders);
    this.hud.updateRoom(fallback);
  }
}

const game = new Game();
game.start().catch(console.error);
