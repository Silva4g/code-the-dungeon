import * as THREE from 'three';

export class PlayerController {
  constructor() {
    this.moveSpeed = 4;
    this.lookSpeed = 0.002;
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.keys = {};
    this.locked = false;
    this.position = new THREE.Vector3(0, 1.6, 0);
    this.colliders = [];
  }

  init(engine) {
    this.engine = engine;
    this.camera = engine.camera;

    document.addEventListener('click', () => {
      if (!this.locked) document.body.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === document.body;
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      this.euler.setFromQuaternion(this.camera.quaternion);
      this.euler.y -= e.movementX * this.lookSpeed;
      this.euler.x -= e.movementY * this.lookSpeed;
      this.euler.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    });

    document.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
    document.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
  }

  setColliders(meshes) {
    this.colliders = meshes;
  }

  _checkCollision(newPos) {
    const playerRadius = 0.3;
    const playerBox = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(newPos.x, 1, newPos.z),
      new THREE.Vector3(playerRadius * 2, 1.6, playerRadius * 2)
    );

    for (const mesh of this.colliders) {
      if (!mesh.geometry) continue;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      const box = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);
      if (playerBox.intersectsBox(box)) return true;
    }
    return false;
  }

  update(delta) {
    if (!this.locked) return;

    this.velocity.set(0, 0, 0);

    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (this.keys['KeyW']) this.velocity.add(forward);
    if (this.keys['KeyS']) this.velocity.sub(forward);
    if (this.keys['KeyA']) this.velocity.sub(right);
    if (this.keys['KeyD']) this.velocity.add(right);

    if (this.velocity.length() > 0) {
      this.velocity.normalize().multiplyScalar(this.moveSpeed * delta);

      const newPos = this.camera.position.clone().add(this.velocity);

      const tryX = this.camera.position.clone();
      tryX.x = newPos.x;
      if (!this._checkCollision(tryX)) {
        this.camera.position.x = tryX.x;
      }

      const tryZ = this.camera.position.clone();
      tryZ.z = newPos.z;
      if (!this._checkCollision(tryZ)) {
        this.camera.position.z = tryZ.z;
      }
    }

    this.position.copy(this.camera.position);
  }
}
