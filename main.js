import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * CORE THREEJS SETUP
 */
// Scene initialization
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background

// Camera configuration
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.set(5, 3, 8);

// Renderer configuration
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadow edges
document.body.appendChild(renderer.domElement);

// Controls for camera interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05;
controls.minDistance = 3; // Zoom limits
controls.maxDistance = 20;

/**
 * LIGHTING SETUP
 */
// Base ambient light for global illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Main directional light (sun)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;

// Shadow map configuration for quality shadows
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

/**
 * ENVIRONMENT CREATION
 */
// Ground plane for the parking lot
const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333, // Dark asphalt color
  roughness: 0.8, // Rough surface
  metalness: 0.2, // Slightly reflective
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
ground.receiveShadow = true;
scene.add(ground);

// Create parking space markings
function createParkingLines() {
  const lineGroup = new THREE.Group();

  const lineGeometry = new THREE.PlaneGeometry(0.1, 2.5);
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Create a grid of parking spaces
  for (let x = -12; x <= 12; x += 3) {
    for (let z = -12; z <= 12; z += 6) {
      // Leave open space in center
      if (Math.abs(x) < 3 && Math.abs(z) < 3) continue;

      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.01, z); // Slightly above ground to prevent z-fighting
      lineGroup.add(line);
    }
  }

  scene.add(lineGroup);
}
createParkingLines();

/**
 * MOTORCYCLE MODEL
 */
function createMotorbike() {
  // Group for all motorcycle parts
  const motorcycle = new THREE.Group();

  /**
   * Main Components
   */
  // Frame - main body structure
  const frameGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.5);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222, // Dark metal
    roughness: 0.5,
    metalness: 0.7,
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.y = 0.5;
  frame.castShadow = true;
  motorcycle.add(frame);

  // Seat - rider position
  const seatGeometry = new THREE.BoxGeometry(0.8, 0.15, 0.4);
  const seatMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111, // Black leather
    roughness: 0.9, // Not reflective
    metalness: 0.1,
  });
  const seat = new THREE.Mesh(seatGeometry, seatMaterial);
  seat.position.set(-0.2, 0.8, 0);
  seat.castShadow = true;
  motorcycle.add(seat);

  // Fuel tank - central curved element
  const tankGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16);
  const tankMaterial = new THREE.MeshStandardMaterial({
    color: 0xcc0000, // Bright red
    roughness: 0.2, // Smooth, polished
    metalness: 0.8, // Highly metallic
  });
  const tank = new THREE.Mesh(tankGeometry, tankMaterial);
  tank.rotation.z = Math.PI / 2; // Orient horizontally
  tank.position.set(0.3, 0.8, 0);
  tank.castShadow = true;
  motorcycle.add(tank);

  // Handlebars - steering control
  const handlebarGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16);
  const handlebarMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888, // Chrome metal
    roughness: 0.2,
    metalness: 0.9, // Very shiny
  });
  const handlebar = new THREE.Mesh(handlebarGeometry, handlebarMaterial);
  handlebar.rotation.x = Math.PI / 2; // Orient appropriately
  handlebar.position.set(0.7, 0.9, 0);
  handlebar.castShadow = true;
  motorcycle.add(handlebar);

  // Front fork - suspension system
  const forkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
  const forkMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa, // Aluminum/silver
    roughness: 0.2,
    metalness: 0.9,
  });
  const fork = new THREE.Mesh(forkGeometry, forkMaterial);
  fork.position.set(0.7, 0.5, 0);
  fork.castShadow = true;
  motorcycle.add(fork);

  // Headlight - front illumination
  const headlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffcc, // Warm yellow
    emissive: 0xffffcc, // Self-illumination
    emissiveIntensity: 0.5, // Brightness of glow
    roughness: 0.2,
    metalness: 0.9,
  });
  const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
  headlight.position.set(0.85, 0.7, 0);
  motorcycle.add(headlight);

  /**
   * Wheel Creation
   */
  function createWheel(posX) {
    const wheelGroup = new THREE.Group();

    // Tire - outer rubber part
    const tireGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111, // Black rubber
      roughness: 0.9, // Matte texture
      metalness: 0.1,
    });
    const tire = new THREE.Mesh(tireGeometry, tireMaterial);
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Hub - central wheel part
    const hubGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const hubMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888, // Metal
      roughness: 0.2,
      metalness: 0.9,
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.rotation.x = Math.PI / 2;
    hub.castShadow = true;
    wheelGroup.add(hub);

    // Spokes - radiating from hub to rim
    for (let i = 0; i < 8; i++) {
      const spokeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.28, 8);
      const spoke = new THREE.Mesh(spokeGeometry, hubMaterial);
      spoke.rotation.z = (i * Math.PI) / 4; // Evenly space spokes
      spoke.castShadow = true;
      wheelGroup.add(spoke);
    }

    wheelGroup.rotation.y = Math.PI / 2;
    wheelGroup.position.set(posX, 0.3, 0);

    return wheelGroup;
  }

  // Add front and rear wheels
  const frontWheel = createWheel(0.8);
  motorcycle.add(frontWheel);

  const rearWheel = createWheel(-0.6);
  motorcycle.add(rearWheel);

  // Exhaust pipe - engine exhaust system
  const exhaustGeometry = new THREE.CylinderGeometry(0.05, 0.07, 0.7, 16);
  const exhaustMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd, // Chrome/metal
    roughness: 0.2, // Polished
    metalness: 0.9, // Very metallic
  });
  const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
  exhaust.rotation.z = Math.PI / 4; // Angle appropriately
  exhaust.position.set(-0.6, 0.3, 0.2);
  exhaust.castShadow = true;
  motorcycle.add(exhaust);

  return motorcycle;
}

// Create and add motorcycle to scene
const motorbike = createMotorbike();
scene.add(motorbike);

/**
 * ADDITIONAL SCENE ELEMENTS
 */
function addParkingLotElements() {
  // Add background building
  const buildingGeometry = new THREE.BoxGeometry(10, 5, 10);
  const buildingMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // Light gray concrete
    roughness: 0.7, // Rough surface
    metalness: 0.2, // Slightly reflective
  });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.set(-10, 2.5, -10);
  building.castShadow = true;
  building.receiveShadow = true;
  scene.add(building);

  // Create light pole with lamp
  function createLightPole(x, z) {
    const poleGroup = new THREE.Group();

    // Vertical pole
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555, // Dark gray metal
      roughness: 0.7,
      metalness: 0.3,
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 2;
    pole.castShadow = true;
    poleGroup.add(pole);

    // Light fixture housing
    const fixtureGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8);
    const fixtureMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333, // Dark housing
      roughness: 0.7,
      metalness: 0.3,
    });
    const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
    fixture.position.y = 4;
    fixture.castShadow = true;
    poleGroup.add(fixture);

    // Light source
    const light = new THREE.PointLight(0xffffcc, 0.6, 15);
    light.position.y = 3.9;
    light.castShadow = true;
    poleGroup.add(light);

    poleGroup.position.set(x, 0, z);
    return poleGroup;
  }

  // Add light poles at parking lot corners
  scene.add(createLightPole(10, 10));
  scene.add(createLightPole(-10, 10));
  scene.add(createLightPole(10, -10));
  scene.add(createLightPole(-10, -10));
}

addParkingLotElements();

/**
 * RESPONSIVE DESIGN & ANIMATION
 */
// Handle window resize for responsive display
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop for continuous rendering
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update camera controls
  renderer.render(scene, camera);
}

// Start animation loop
animate();
