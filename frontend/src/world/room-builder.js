import * as THREE from 'three';

const WALL_HEIGHT = 3;
const ROOM_UNIT = 6;

const MATERIALS = {
  floor: new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 }),
  wall: new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.85 }),
  ceiling: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.95 }),
  door_locked: new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.7 }),
  door_open: new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.7, transparent: true, opacity: 0.3 }),
  chest: new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.6, metalness: 0.3 }),
  torch_holder: new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.5, metalness: 0.8 }),
};

const BIOME_PALETTES = {
  catacombs: { floor: 0x2a2a2a, wall: 0x3a3a3a, accent: 0x5a5a4a },
  sewer: { floor: 0x1a2a1a, wall: 0x2a3a2a, accent: 0x4a8a4a },
  forge: { floor: 0x2a1a1a, wall: 0x3a2a2a, accent: 0xc44a20 },
  library: { floor: 0x1a1a2a, wall: 0x2a2a4a, accent: 0x6a6ac4 },
  abyss: { floor: 0x0a0a0a, wall: 0x1a1a1a, accent: 0xc4a76c },
};

export class RoomBuilder {
  constructor() {
    this.currentRoom = null;
    this.roomGroup = new THREE.Group();
    this.colliders = [];
    this.interactables = [];
    this.enemies = [];
    this.lootItems = [];
  }

  init(engine) {
    this.engine = engine;
    this.scene = engine.scene;
    this.scene.add(this.roomGroup);
  }

  clear() {
    while (this.roomGroup.children.length) {
      const child = this.roomGroup.children[0];
      this.roomGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
    }
    this.colliders = [];
    this.interactables = [];
    this.enemies = [];
    this.lootItems = [];
  }

  buildRoom(roomData) {
    this.clear();
    this.currentRoom = roomData;

    const biome = roomData.biome || 'catacombs';
    const palette = BIOME_PALETTES[biome] || BIOME_PALETTES.catacombs;
    const w = (roomData.width || 3) * ROOM_UNIT;
    const d = (roomData.depth || 3) * ROOM_UNIT;

    this._buildFloor(w, d, palette);
    this._buildCeiling(w, d);
    this._buildWalls(w, d, roomData.exits || [], palette);
    this._addTorches(w, d);

    if (roomData.enemies) this._spawnEnemies(roomData.enemies, w, d);
    if (roomData.loot) this._spawnLoot(roomData.loot, w, d);
    if (roomData.objects) this._spawnObjects(roomData.objects, w, d);

    return { colliders: this.colliders, interactables: this.interactables };
  }

  _buildFloor(w, d, palette) {
    const geo = new THREE.PlaneGeometry(w, d);
    const mat = MATERIALS.floor.clone();
    mat.color.setHex(palette.floor);
    const floor = new THREE.Mesh(geo, mat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.roomGroup.add(floor);
  }

  _buildCeiling(w, d) {
    const geo = new THREE.PlaneGeometry(w, d);
    const ceil = new THREE.Mesh(geo, MATERIALS.ceiling);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = WALL_HEIGHT;
    this.roomGroup.add(ceil);
  }

  _buildWalls(w, d, exits, palette) {
    const wallMat = MATERIALS.wall.clone();
    wallMat.color.setHex(palette.wall);

    const wallDefs = [
      { pos: [0, WALL_HEIGHT / 2, -d / 2], rot: [0, 0, 0], size: [w, WALL_HEIGHT], dir: 'north' },
      { pos: [0, WALL_HEIGHT / 2, d / 2], rot: [0, Math.PI, 0], size: [w, WALL_HEIGHT], dir: 'south' },
      { pos: [-w / 2, WALL_HEIGHT / 2, 0], rot: [0, Math.PI / 2, 0], size: [d, WALL_HEIGHT], dir: 'west' },
      { pos: [w / 2, WALL_HEIGHT / 2, 0], rot: [0, -Math.PI / 2, 0], size: [d, WALL_HEIGHT], dir: 'east' },
    ];

    for (const def of wallDefs) {
      const exit = exits.find(e => e.direction === def.dir);

      if (exit) {
        const doorWidth = 1.8;
        const doorHeight = 2.4;
        const wallW = def.size[0];
        const wallH = def.size[1];

        const sideW = (wallW - doorWidth) / 2;
        if (sideW > 0.01) {
          for (const side of [-1, 1]) {
            const geo = new THREE.BoxGeometry(sideW, wallH, 0.3);
            const wall = new THREE.Mesh(geo, wallMat);
            wall.position.set(
              def.pos[0] + (def.dir === 'west' || def.dir === 'east' ? 0 : side * (sideW / 2 + doorWidth / 2)),
              def.pos[1],
              def.pos[2] + (def.dir === 'north' || def.dir === 'south' ? 0 : side * (sideW / 2 + doorWidth / 2))
            );
            wall.rotation.set(...def.rot);
            wall.castShadow = true;
            wall.receiveShadow = true;
            this.roomGroup.add(wall);
            this.colliders.push(wall);
          }
        }

        const topH = wallH - doorHeight;
        if (topH > 0.01) {
          const geo = new THREE.BoxGeometry(doorWidth, topH, 0.3);
          const top = new THREE.Mesh(geo, wallMat);
          top.position.set(def.pos[0], doorHeight + topH / 2, def.pos[2]);
          top.rotation.set(...def.rot);
          this.roomGroup.add(top);
        }

        const doorGeo = new THREE.BoxGeometry(doorWidth, doorHeight, 0.15);
        const doorMat = exit.locked ? MATERIALS.door_locked : MATERIALS.door_open;
        const door = new THREE.Mesh(doorGeo, doorMat.clone());
        door.position.set(def.pos[0], doorHeight / 2, def.pos[2]);
        door.rotation.set(...def.rot);
        door.userData = { type: 'door', exit, roomId: exit.target_room };
        this.roomGroup.add(door);
        this.interactables.push(door);
        if (exit.locked) this.colliders.push(door);
      } else {
        const geo = new THREE.BoxGeometry(def.size[0], def.size[1], 0.3);
        const wall = new THREE.Mesh(geo, wallMat);
        wall.position.set(...def.pos);
        wall.rotation.set(...def.rot);
        wall.castShadow = true;
        wall.receiveShadow = true;
        this.roomGroup.add(wall);
        this.colliders.push(wall);
      }
    }
  }

  _addTorches(w, d) {
    const positions = [
      [-w / 2 + 0.2, 2.2, -d / 4],
      [w / 2 - 0.2, 2.2, d / 4],
    ];

    for (const pos of positions) {
      const holder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.3, 6),
        MATERIALS.torch_holder
      );
      holder.position.set(...pos);
      this.roomGroup.add(holder);

      const flame = new THREE.PointLight(0xff6622, 0.6, 6);
      flame.position.set(pos[0], pos[1] + 0.2, pos[2]);
      this.roomGroup.add(flame);
    }
  }

  _spawnEnemies(enemies, w, d) {
    for (const enemy of enemies) {
      const size = enemy.size || 1;
      const geo = new THREE.CapsuleGeometry(0.3 * size, 0.6 * size, 4, 8);

      const colorMap = {
        skeleton: 0xccccaa, rat: 0x776655, slime: 0x44aa44,
        golem: 0x888899, ghost: 0x8888cc, default: 0xcc4444,
      };
      const color = colorMap[enemy.type] || colorMap.default;

      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
      const mesh = new THREE.Mesh(geo, mat);

      const x = enemy.x ?? (Math.random() - 0.5) * (w - 3);
      const z = enemy.z ?? (Math.random() - 0.5) * (d - 3);
      mesh.position.set(x, 0.6 * size + 0.3, z);
      mesh.castShadow = true;

      mesh.userData = { type: 'enemy', ...enemy };

      const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 0.8 });
      for (const side of [-0.12, 0.12]) {
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(side, 0.35 * size, 0.25 * size);
        mesh.add(eye);
      }

      this.roomGroup.add(mesh);
      this.enemies.push(mesh);
      this.interactables.push(mesh);
    }
  }

  _spawnLoot(loot, w, d) {
    for (const item of loot) {
      const rarityColors = {
        common: 0xaaaaaa, rare: 0x4488ff, epic: 0xaa44ff, legendary: 0xffaa00,
      };
      const color = rarityColors[item.rarity] || rarityColors.common;

      const geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      const mat = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.3, roughness: 0.4, metalness: 0.6,
      });
      const mesh = new THREE.Mesh(geo, mat);

      const x = item.x ?? (Math.random() - 0.5) * (w - 3);
      const z = item.z ?? (Math.random() - 0.5) * (d - 3);
      mesh.position.set(x, 0.25, z);
      mesh.userData = { type: 'loot', ...item };

      this.roomGroup.add(mesh);
      this.lootItems.push(mesh);
      this.interactables.push(mesh);
    }
  }

  _spawnObjects(objects, w, d) {
    for (const obj of objects) {
      let mesh;

      if (obj.type === 'chest') {
        const geo = new THREE.BoxGeometry(0.8, 0.5, 0.5);
        mesh = new THREE.Mesh(geo, MATERIALS.chest.clone());
        mesh.position.set(obj.x || 0, 0.25, obj.z || 0);
      } else if (obj.type === 'lever') {
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.2), MATERIALS.torch_holder);
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6), MATERIALS.torch_holder);
        arm.position.y = 0.3;
        arm.rotation.z = obj.active ? 0 : Math.PI / 4;
        mesh = new THREE.Group();
        mesh.add(base, arm);
        mesh.position.set(obj.x || 0, 0.6, obj.z || 0);
      } else if (obj.type === 'trap') {
        const geo = new THREE.PlaneGeometry(1, 1);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xaa2222, transparent: true, opacity: obj.visible ? 0.4 : 0.05,
        });
        mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(obj.x || 0, 0.01, obj.z || 0);
      } else {
        const geo = new THREE.SphereGeometry(0.3, 8, 8);
        mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x888888 }));
        mesh.position.set(obj.x || 0, 0.3, obj.z || 0);
      }

      if (mesh) {
        mesh.userData = { type: 'object', ...obj };
        this.roomGroup.add(mesh);
        this.interactables.push(mesh);
      }
    }
  }

  update(delta, elapsed) {
    for (const loot of this.lootItems) {
      loot.rotation.y = elapsed * 1.5;
      loot.position.y = 0.25 + Math.sin(elapsed * 2) * 0.08;
    }

    for (const enemy of this.enemies) {
      if (enemy.userData.alive !== false) {
        enemy.position.y += Math.sin(elapsed * 2 + enemy.id) * 0.0005;
      }
    }
  }
}
