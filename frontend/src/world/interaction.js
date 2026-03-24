import * as THREE from 'three';
import { api } from '../core/api.js';

export class InteractionSystem {
  constructor(hud) {
    this.hud = hud;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 4;
    this.interactables = [];
    this.playerId = null;
    this.currentRoomId = null;
    this.cooldown = false;
  }

  init(engine) {
    this.engine = engine;
    this.camera = engine.camera;

    document.addEventListener('mousedown', (e) => {
      if (e.button === 0) this._onLeftClick();
      if (e.button === 2) this._onRightClick();
    });

    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyE') this._onInteract();
      if (e.code === 'KeyF') this._onLeftClick();
    });
  }

  setInteractables(list) {
    this.interactables = list;
  }

  _getTarget() {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const hits = this.raycaster.intersectObjects(this.interactables, true);
    if (hits.length === 0) return null;

    let obj = hits[0].object;
    while (obj && !obj.userData?.type) obj = obj.parent;
    return obj;
  }

  async _onLeftClick() {
    if (this.cooldown) return;
    const target = this._getTarget();
    if (!target) return;

    if (target.userData.type === 'enemy' && target.userData.alive !== false) {
      this._setCooldown(500);
      this.hud.showStatus('Attacking...');

      const res = await api.attack(this.playerId, target.userData.id, null);
      if (res.ok) {
        const { damage, target_hp, is_crit, killed } = res.data;
        this.hud.showDamage(damage, is_crit);

        if (killed) {
          target.userData.alive = false;
          this._animateDeath(target);
          this.hud.showStatus(`${target.userData.name || 'Enemy'} defeated!`);
        }
      } else {
        this.hud.showStatus(res.error || 'Attack missed!');
      }
    }

    if (target.userData.type === 'loot') {
      const res = await api.pickupLoot(this.playerId, target.userData.id);
      if (res.ok) {
        this.hud.showStatus(`Picked up ${res.data.item?.name || 'item'}!`);
        target.visible = false;
        const idx = this.interactables.indexOf(target);
        if (idx > -1) this.interactables.splice(idx, 1);
      } else {
        this.hud.showStatus(res.error || 'Cannot pick up');
      }
    }
  }

  async _onRightClick() {
    if (this.cooldown) return;
    this._setCooldown(500);

    const res = await api.defend(this.playerId);
    if (res.ok) {
      this.hud.showStatus('Defending!');
    }
  }

  async _onInteract() {
    const target = this._getTarget();
    if (!target) return;

    if (target.userData.type === 'door') {
      const exit = target.userData.exit;
      if (exit.locked) {
        const res = await api.unlockDoor(this.currentRoomId, exit.id, this.playerId);
        if (res.ok) {
          target.material.opacity = 0.3;
          target.material.transparent = true;
          target.userData.exit.locked = false;
          this.hud.showStatus('Door unlocked!');
        } else {
          this.hud.showStatus(res.error || 'Door is locked');
        }
      } else {
        this.hud.showStatus('Entering...');
        document.dispatchEvent(new CustomEvent('room:enter', { detail: { roomId: exit.target_room } }));
      }
    }

    if (target.userData.type === 'object') {
      const res = await api.interactWithObject(this.currentRoomId, target.userData.id, this.playerId);
      if (res.ok) {
        this.hud.showStatus(res.data.message || 'Interacted!');
      } else {
        this.hud.showStatus(res.error || 'Nothing happens');
      }
    }
  }

  _animateDeath(mesh) {
    const start = mesh.position.y;
    const startScale = mesh.scale.clone();
    let t = 0;
    const animate = () => {
      t += 0.02;
      mesh.position.y = start - t * 0.5;
      mesh.scale.setScalar(Math.max(0, 1 - t));
      mesh.material.opacity = Math.max(0, 1 - t);
      mesh.material.transparent = true;
      if (t < 1) requestAnimationFrame(animate);
      else mesh.visible = false;
    };
    animate();
  }

  _setCooldown(ms) {
    this.cooldown = true;
    setTimeout(() => { this.cooldown = false; }, ms);
  }

  update() {
    const target = this._getTarget();
    document.body.style.cursor = target ? 'crosshair' : 'default';
  }
}
