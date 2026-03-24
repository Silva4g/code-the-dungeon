import { api } from '../core/api.js';

export class Minimap {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.rooms = new Map();
    this.currentRoomId = null;
    this.playerId = null;
  }

  init() {
    this.canvas = document.getElementById('minimap');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 160;
    this.canvas.height = 160;
  }

  setCurrentRoom(roomId) {
    this.currentRoomId = roomId;
    this.render();
  }

  addRoom(roomData) {
    if (!this.rooms.has(roomData.id)) {
      this.rooms.set(roomData.id, {
        id: roomData.id,
        name: roomData.name,
        x: roomData.map_x ?? this.rooms.size % 5,
        y: roomData.map_y ?? Math.floor(this.rooms.size / 5),
        exits: roomData.exits || [],
        cleared: false,
      });
    }
    this.render();
  }

  markCleared(roomId) {
    const room = this.rooms.get(roomId);
    if (room) room.cleared = true;
    this.render();
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (this.rooms.size === 0) {
      ctx.fillStyle = '#555';
      ctx.font = '11px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('No map data', w / 2, h / 2);
      return;
    }

    const cellSize = 24;
    const gap = 4;
    const step = cellSize + gap;

    let minX = Infinity, minY = Infinity;
    for (const room of this.rooms.values()) {
      minX = Math.min(minX, room.x);
      minY = Math.min(minY, room.y);
    }

    const currentRoom = this.rooms.get(this.currentRoomId);
    const offsetX = w / 2 - ((currentRoom?.x ?? 0) - minX) * step - cellSize / 2;
    const offsetY = h / 2 - ((currentRoom?.y ?? 0) - minY) * step - cellSize / 2;

    for (const room of this.rooms.values()) {
      const rx = (room.x - minX) * step + offsetX;
      const ry = (room.y - minY) * step + offsetY;

      if (room.id === this.currentRoomId) {
        ctx.fillStyle = '#c4a76c';
      } else if (room.cleared) {
        ctx.fillStyle = '#4a4a4a';
      } else {
        ctx.fillStyle = '#2a2a3a';
      }

      ctx.fillRect(rx, ry, cellSize, cellSize);
      ctx.strokeStyle = '#555';
      ctx.strokeRect(rx, ry, cellSize, cellSize);

      for (const exit of room.exits) {
        ctx.strokeStyle = exit.locked ? '#8b4513' : '#666';
        ctx.lineWidth = exit.locked ? 1 : 2;
        const cx = rx + cellSize / 2;
        const cy = ry + cellSize / 2;

        ctx.beginPath();
        if (exit.direction === 'north') { ctx.moveTo(cx, ry); ctx.lineTo(cx, ry - gap); }
        if (exit.direction === 'south') { ctx.moveTo(cx, ry + cellSize); ctx.lineTo(cx, ry + cellSize + gap); }
        if (exit.direction === 'west') { ctx.moveTo(rx, cy); ctx.lineTo(rx - gap, cy); }
        if (exit.direction === 'east') { ctx.moveTo(rx + cellSize, cy); ctx.lineTo(rx + cellSize + gap, cy); }
        ctx.stroke();
      }
    }
  }

  async fetchMap() {
    if (!this.playerId) return;
    const res = await api.getDiscoveredMap(this.playerId);
    if (res.ok && res.data.rooms) {
      for (const room of res.data.rooms) {
        this.addRoom(room);
      }
    }
  }
}
