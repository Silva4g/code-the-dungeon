import * as THREE from 'three';

export class Engine {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    this.scene.fog = new THREE.Fog(0x0a0a0f, 15, 35);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.6, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.systems = [];

    this._setupLighting();
    this._setupResize();
  }

  _setupLighting() {
    const ambient = new THREE.AmbientLight(0x1a1a2e, 0.3);
    this.scene.add(ambient);

    this.torchLight = new THREE.PointLight(0xc4a76c, 1.5, 12);
    this.torchLight.castShadow = true;
    this.torchLight.shadow.mapSize.set(512, 512);
    this.torchLight.position.copy(this.camera.position);
    this.scene.add(this.torchLight);
  }

  _setupResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  addSystem(system) {
    this.systems.push(system);
    if (system.init) system.init(this);
  }

  start() {
    const loop = () => {
      requestAnimationFrame(loop);
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      this.torchLight.position.copy(this.camera.position);
      this.torchLight.intensity = 1.5 + Math.sin(elapsed * 3) * 0.15;

      for (const sys of this.systems) {
        if (sys.update) sys.update(delta, elapsed);
      }

      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }
}
