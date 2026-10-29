import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { soundManager } from '../audio';
import { InventoryItem } from '../types';
import { ALL_ITEMS } from './gameState';

export interface WorldInteractable {
  id: string;
  type: 'loot' | 'extraction' | 'terminal';
  position: THREE.Vector3;
  data?: any;
  mesh: THREE.Object3D;
  collected?: boolean;
}

export class ExpeditionGameWorld {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private isSoftwareGl: boolean = false;
  private animationFrameId: number = 0;
  private clock: THREE.Clock;

  // Player state
  private playerPos: THREE.Vector3 = new THREE.Vector3(0, 1.6, 22);
  private playerVel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private playerYaw: number = 0;
  private playerPitch: number = 0;
  private moveState = { forward: false, backward: false, left: false, right: false, sprint: false };
  private isPointerLocked: boolean = false;

  // Game objects
  private interactables: WorldInteractable[] = [];
  private wardenMesh: THREE.Group | null = null;
  private wardenPos: THREE.Vector3 = new THREE.Vector3(15, 0, -20);
  private wardenState: 'patrol' | 'investigate' | 'chase' = 'patrol';
  private wardenWaypoints: THREE.Vector3[] = [
    new THREE.Vector3(15, 0, -20),
    new THREE.Vector3(-15, 0, -20),
    new THREE.Vector3(-15, 0, 10),
    new THREE.Vector3(15, 0, 10),
  ];
  private currentWaypointIndex: number = 0;

  // Callbacks
  private onInteractCallback: (item: WorldInteractable) => void;
  private onHealthChangeCallback: (hp: number) => void;
  private onWardenAlertCallback: (alert: boolean) => void;
  private onNearbyInteractableCallback: (item: WorldInteractable | null) => void;

  private playerHp: number = 100;
  private isGameOver: boolean = false;
  private isExtracted: boolean = false;
  private boundKeyDown: (e: KeyboardEvent) => void = () => {};
  private boundKeyUp: (e: KeyboardEvent) => void = () => {};
  private boundMouseMove: (e: MouseEvent) => void = () => {};
  private boundMouseDown: () => void = () => {};

  constructor(
    container: HTMLDivElement,
    callbacks: {
      onInteract: (item: WorldInteractable) => void;
      onHealthChange: (hp: number) => void;
      onWardenAlert: (alert: boolean) => void;
      onNearbyInteractable: (item: WorldInteractable | null) => void;
    }
  ) {
    this.container = container;
    this.onInteractCallback = callbacks.onInteract;
    this.onHealthChangeCallback = callbacks.onHealthChange;
    this.onWardenAlertCallback = callbacks.onWardenAlert;
    this.onNearbyInteractableCallback = callbacks.onNearbyInteractable;
    this.clock = new THREE.Clock();

    // 1. Detect software WebGL
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 3. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f141c);
    this.scene.fog = new THREE.FogExp2(0x0f141c, 0.025);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 200);

    // Environment map
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    this.buildWorld();
    this.setupListeners();

    // Start loop
    this.animate();
  }

  private buildWorld() {
    // Lighting
    const ambient = new THREE.HemisphereLight(0x8ab4f8, 0x3c2a21, 0.6);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = !this.isSoftwareGl;
    if (dirLight.castShadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0005;
    }
    this.scene.add(dirLight);

    // Ground (District asphalt)
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1e222b,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid lines on ground
    const grid = new THREE.GridHelper(120, 30, 0x3b82f6, 0x2d3748);
    grid.position.y = 0.01;
    this.scene.add(grid);

    // Procedural Buildings (Market, Power Station, Transit Tunnel)
    this.createBuilding(-25, 0, -25, 18, 10, 18, 0x2a303c); // Market Building
    this.createBuilding(25, 0, -25, 20, 12, 16, 0x322a3a); // Power Station
    this.createBuilding(0, 0, -45, 30, 8, 12, 0x222831); // Transit Tunnel

    // Street obstacles & barriers (3-12 part procedural style)
    for (let i = -40; i <= 40; i += 20) {
      if (i === 0) continue;
      this.createBarricade(i, 0, -10);
      this.createBarricade(-10, 0, i);
    }

    // Spawn Loot Containers & Artifacts across the district
    const lootConfigs = [
      { pos: new THREE.Vector3(-22, 0.5, -22), defId: 'scrap_metal' },
      { pos: new THREE.Vector3(-26, 0.5, -28), defId: 'copper_wire' },
      { pos: new THREE.Vector3(-20, 0.5, -20), defId: 'circuit_board' },
      { pos: new THREE.Vector3(22, 0.5, -22), defId: 'power_cell' },
      { pos: new THREE.Vector3(28, 0.5, -28), defId: 'signal_lens' },
      { pos: new THREE.Vector3(0, 0.5, -42), defId: 'echo_cassette' },
      { pos: new THREE.Vector3(15, 0.5, 5), defId: 'scrap_metal' },
      { pos: new THREE.Vector3(-15, 0.5, 8), defId: 'cracked_compass' },
      { pos: new THREE.Vector3(5, 0.5, -15), defId: 'warden_core' },
    ];

    lootConfigs.forEach((cfg, idx) => {
      const def = ALL_ITEMS.find((d) => d.id === cfg.defId) || ALL_ITEMS[0];
      const crateGroup = new THREE.Group();

      // Crate body
      const boxMat = new THREE.MeshStandardMaterial({
        color: def.rarity === 'Anomalous' || def.rarity === 'Epic' ? 0x9333ea : def.rarity === 'Rare' ? 0x3b82f6 : 0xd97706,
        roughness: 0.4,
        metalness: 0.6,
      });
      const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), boxMat);
      boxMesh.position.y = 0.4;
      boxMesh.castShadow = true;
      crateGroup.add(boxMesh);

      // Glowing indicator ring
      const ringGeo = new THREE.RingGeometry(0.6, 0.75, 16);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: def.rarity === 'Anomalous' ? 0xff00ff : 0x00ffff,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.02;
      crateGroup.add(ring);

      crateGroup.position.copy(cfg.pos);
      this.scene.add(crateGroup);

      this.interactables.push({
        id: `loot_${idx}`,
        type: 'loot',
        position: cfg.pos,
        data: def,
        mesh: crateGroup,
        collected: false,
      });
    });

    // Extraction Zone Beacon at (0, 0, 32)
    const extractionGroup = new THREE.Group();
    const padGeo = new THREE.CylinderGeometry(4, 4, 0.2, 32);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.8 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.1;
    extractionGroup.add(pad);

    // Glowing vertical extraction beams
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
      const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 10, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(Math.cos(angle) * 3, 5, Math.sin(angle) * 3);
      extractionGroup.add(beam);
    }

    extractionGroup.position.set(0, 0, 32);
    this.scene.add(extractionGroup);

    this.interactables.push({
      id: 'extraction_zone',
      type: 'extraction',
      position: new THREE.Vector3(0, 0, 32),
      mesh: extractionGroup,
    });

    // Create Warden Automaton Enemy
    this.createWarden();
  }

  private createBuilding(x: number, y: number, z: number, w: number, h: number, d: number, color: number) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.3 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.y = h / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Accent trim
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.2, metalness: 0.8 });
    const trim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.5, d + 0.2), trimMat);
    trim.position.y = h - 0.25;
    group.add(trim);

    group.position.set(x, y, z);
    this.scene.add(group);
  }

  private createBarricade(x: number, y: number, z: number) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.5, metalness: 0.7 });
    const barrier = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 0.8), mat);
    barrier.position.y = 0.75;
    barrier.castShadow = true;
    group.add(barrier);

    group.position.set(x, y, z);
    this.scene.add(group);
  }

  private createWarden() {
    const wardenGroup = new THREE.Group();
    // Body
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, metalness: 0.8 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 2.5, 12), bodyMat);
    body.position.y = 1.25;
    body.castShadow = true;
    wardenGroup.add(body);

    // Glowing visor eye
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.4), eyeMat);
    eye.position.set(0, 2.2, 0.5);
    wardenGroup.add(eye);

    wardenGroup.position.copy(this.wardenPos);
    this.scene.add(wardenGroup);
    this.wardenMesh = wardenGroup;
  }

  private setupListeners() {
    this.boundKeyDown = (e: KeyboardEvent) => {
      if (this.isGameOver || this.isExtracted) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.moveState.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.moveState.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.moveState.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.moveState.right = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.moveState.sprint = true;

      if (e.code === 'KeyE') {
        this.tryInteract();
      }
    };

    this.boundKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.moveState.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.moveState.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.moveState.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.moveState.right = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.moveState.sprint = false;
    };

    this.boundMouseMove = (e: MouseEvent) => {
      if (!this.isPointerLocked) return;
      const sensitivity = 0.003;
      this.playerYaw -= e.movementX * sensitivity;
      this.playerPitch -= e.movementY * sensitivity;
      this.playerPitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.playerPitch));
    };

    this.boundMouseDown = () => {
      if (!this.isPointerLocked && !this.isGameOver && !this.isExtracted) {
        this.renderer.domElement.requestPointerLock();
      }
    };

    const onPointerLockChange = () => {
      this.isPointerLocked = document.pointerLockElement === this.renderer.domElement;
    };

    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
    document.addEventListener('mousemove', this.boundMouseMove);
    this.renderer.domElement.addEventListener('click', this.boundMouseDown);
    document.addEventListener('pointerlockchange', onPointerLockChange);
  }

  private tryInteract() {
    let nearest: WorldInteractable | null = null;
    let minDist = 3.5;

    for (const obj of this.interactables) {
      if (obj.collected) continue;
      const dist = this.playerPos.distanceTo(obj.position);
      if (dist < minDist) {
        minDist = dist;
        nearest = obj;
      }
    }

    if (nearest) {
      this.onInteractCallback(nearest);
    }
  }

  public markCollected(id: string) {
    const obj = this.interactables.find((o) => o.id === id);
    if (obj) {
      obj.collected = true;
      obj.mesh.visible = false;
    }
  }

  private updateWarden(delta: number) {
    if (!this.wardenMesh) return;

    const targetWaypoint = this.wardenWaypoints[this.currentWaypointIndex];
    const distToWaypoint = this.wardenPos.distanceTo(targetWaypoint);

    // Check distance to player for chase state
    const distToPlayer = this.wardenPos.distanceTo(this.playerPos);
    if (distToPlayer < 12) {
      this.wardenState = 'chase';
      this.onWardenAlertCallback(true);
    } else if (distToPlayer > 20 && this.wardenState === 'chase') {
      this.wardenState = 'patrol';
      this.onWardenAlertCallback(false);
    }

    let moveTarget = targetWaypoint;
    let speed = 2.5;

    if (this.wardenState === 'chase') {
      moveTarget = this.playerPos;
      speed = 4.8;
    }

    // Move warden towards target
    const dir = new THREE.Vector3().subVectors(moveTarget, this.wardenPos).normalize();
    this.wardenPos.addScaledVector(dir, speed * delta);
    this.wardenMesh.position.copy(this.wardenPos);
    this.wardenMesh.lookAt(moveTarget.x, this.wardenPos.y, moveTarget.z);

    if (this.wardenState === 'patrol' && distToWaypoint < 1.5) {
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.wardenWaypoints.length;
    }

    // Check damage to player
    if (distToPlayer < 2.0 && !this.isGameOver && !this.isExtracted) {
      this.playerHp -= delta * 35;
      this.onHealthChangeCallback(Math.max(0, Math.round(this.playerHp)));
      if (this.playerHp <= 0) {
        this.isGameOver = true;
        soundManager.playGameOver();
      }
    }
  }

  private checkNearbyInteractable() {
    let nearest: WorldInteractable | null = null;
    let minDist = 4.0;

    for (const obj of this.interactables) {
      if (obj.collected) continue;
      const dist = this.playerPos.distanceTo(obj.position);
      if (dist < minDist) {
        minDist = dist;
        nearest = obj;
      }
    }
    this.onNearbyInteractableCallback(nearest);
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.05);

    if (!this.isGameOver && !this.isExtracted) {
      // Player movement physics
      const speed = this.moveState.sprint ? 7.5 : 4.5;
      const forwardDir = new THREE.Vector3(Math.sin(this.playerYaw), 0, Math.cos(this.playerYaw));
      const rightDir = new THREE.Vector3(Math.cos(this.playerYaw), 0, -Math.sin(this.playerYaw));

      const moveDir = new THREE.Vector3();
      if (this.moveState.forward) moveDir.add(forwardDir);
      if (this.moveState.backward) moveDir.sub(forwardDir);
      if (this.moveState.right) moveDir.add(rightDir);
      if (this.moveState.left) moveDir.sub(rightDir);
      moveDir.normalize();

      this.playerPos.addScaledVector(moveDir, speed * delta);

      // Boundary clamp
      this.playerPos.x = Math.max(-55, Math.min(55, this.playerPos.x));
      this.playerPos.z = Math.max(-55, Math.min(55, this.playerPos.z));

      // Camera sync
      this.camera.position.copy(this.playerPos);
      this.camera.position.y = 1.6; // head height

      const euler = new THREE.Euler(this.playerPitch, this.playerYaw, 0, 'YXZ');
      this.camera.quaternion.setFromEuler(euler);

      // Footstep audio trigger when moving
      if (moveDir.lengthSq() > 0.1 && Math.random() < delta * 4) {
        soundManager.playFootstep();
      }

      // Update Warden AI
      this.updateWarden(delta);

      // Check nearby interactive objects
      this.checkNearbyInteractable();
    }

    if (this.isSoftwareGl) {
      setTimeout(() => this.renderer.render(this.scene, this.camera), 16);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  };

  public setExtracted(extracted: boolean) {
    this.isExtracted = extracted;
  }

  public dispose() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    document.removeEventListener('mousemove', this.boundMouseMove);
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
