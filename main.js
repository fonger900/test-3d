import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue background

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 3, 8);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 20;

// Lighting
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Directional light (sun)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// Create parking lot ground
const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    roughness: 0.8,
    metalness: 0.2
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Add parking lines
function createParkingLines() {
    const lineGroup = new THREE.Group();
    
    const lineGeometry = new THREE.PlaneGeometry(0.1, 2.5);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    // Create a grid of parking spaces
    for (let x = -12; x <= 12; x += 3) {
        for (let z = -12; z <= 12; z += 6) {
            if (Math.abs(x) < 3 && Math.abs(z) < 3) continue; // Skip center area
            
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(x, 0.01, z);
            lineGroup.add(line);
        }
    }
    
    scene.add(lineGroup);
}
createParkingLines();

// Create motorbike
function createMotorbike() {
    // Create a group to hold all motorcycle parts
    const motorcycle = new THREE.Group();
    
    // Main body - frame
    const frameGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.5);
    const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        roughness: 0.5,
        metalness: 0.7
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.y = 0.5;
    frame.castShadow = true;
    motorcycle.add(frame);
    
    // Seat
    const seatGeometry = new THREE.BoxGeometry(0.8, 0.15, 0.4);
    const seatMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.1
    });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.set(-0.2, 0.8, 0);
    seat.castShadow = true;
    motorcycle.add(seat);
    
    // Fuel tank
    const tankGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16);
    const tankMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcc0000,
        roughness: 0.2,
        metalness: 0.8
    });
    const tank = new THREE.Mesh(tankGeometry, tankMaterial);
    tank.rotation.z = Math.PI / 2;
    tank.position.set(0.3, 0.8, 0);
    tank.castShadow = true;
    motorcycle.add(tank);
    
    // Handlebars
    const handlebarGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16);
    const handlebarMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x888888,
        roughness: 0.2,
        metalness: 0.9
    });
    const handlebar = new THREE.Mesh(handlebarGeometry, handlebarMaterial);
    handlebar.rotation.x = Math.PI / 2;
    handlebar.position.set(0.7, 0.9, 0);
    handlebar.castShadow = true;
    motorcycle.add(handlebar);
    
    // Front fork
    const forkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
    const forkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa,
        roughness: 0.2,
        metalness: 0.9
    });
    const fork = new THREE.Mesh(forkGeometry, forkMaterial);
    fork.position.set(0.7, 0.5, 0);
    fork.castShadow = true;
    motorcycle.add(fork);
    
    // Headlight
    const headlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffcc,
        emissive: 0xffffcc,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.9
    });
    const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight.position.set(0.85, 0.7, 0);
    motorcycle.add(headlight);
    
    // Create wheels
    function createWheel(posX) {
        const wheelGroup = new THREE.Group();
        
        // Tire
        const tireGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
        const tireMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            roughness: 0.9,
            metalness: 0.1
        });
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        tire.castShadow = true;
        wheelGroup.add(tire);
        
        // Hub
        const hubGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
        const hubMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            roughness: 0.2,
            metalness: 0.9
        });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.rotation.x = Math.PI / 2;
        hub.castShadow = true;
        wheelGroup.add(hub);
        
        // Spokes
        for (let i = 0; i < 8; i++) {
            const spokeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.28, 8);
            const spoke = new THREE.Mesh(spokeGeometry, hubMaterial);
            spoke.rotation.z = (i * Math.PI) / 4;
            spoke.position.y = 0;
            spoke.castShadow = true;
            wheelGroup.add(spoke);
        }
        
        wheelGroup.rotation.y = Math.PI / 2;
        wheelGroup.position.set(posX, 0.3, 0);
        
        return wheelGroup;
    }
    
    // Add wheels
    const frontWheel = createWheel(0.8);
    motorcycle.add(frontWheel);
    
    const rearWheel = createWheel(-0.6);
    motorcycle.add(rearWheel);
    
    // Exhaust pipe
    const exhaustGeometry = new THREE.CylinderGeometry(0.05, 0.07, 0.7, 16);
    const exhaustMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xdddddd,
        roughness: 0.2,
        metalness: 0.9
    });
    const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
    exhaust.rotation.z = Math.PI / 4;
    exhaust.position.set(-0.6, 0.3, 0.2);
    exhaust.castShadow = true;
    motorcycle.add(exhaust);
    
    // Position the motorcycle
    motorcycle.position.set(0, 0, 0);
    motorcycle.castShadow = true;
    
    return motorcycle;
}

const motorbike = createMotorbike();
scene.add(motorbike);

// Add some decorative elements
function addParkingLotElements() {
    // Add a simple building
    const buildingGeometry = new THREE.BoxGeometry(10, 5, 10);
    const buildingMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.7,
        metalness: 0.2
    });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(-10, 2.5, -10);
    building.castShadow = true;
    building.receiveShadow = true;
    scene.add(building);
    
    // Add some light poles
    function createLightPole(x, z) {
        const poleGroup = new THREE.Group();
        
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
        const poleMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.7,
            metalness: 0.3
        });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 2;
        pole.castShadow = true;
        poleGroup.add(pole);
        
        // Light fixture
        const fixtureGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8);
        const fixtureMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.7,
            metalness: 0.3
        });
        const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
        fixture.position.y = 4;
        fixture.castShadow = true;
        poleGroup.add(fixture);
        
        // Light
        const light = new THREE.PointLight(0xffffcc, 0.6, 15);
        light.position.y = 3.9;
        light.castShadow = true;
        poleGroup.add(light);
        
        poleGroup.position.set(x, 0, z);
        return poleGroup;
    }
    
    // Add light poles at corners
    scene.add(createLightPole(10, 10));
    scene.add(createLightPole(-10, 10));
    scene.add(createLightPole(10, -10));
    scene.add(createLightPole(-10, -10));
}

addParkingLotElements();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();