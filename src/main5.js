// Import Three.js (include via <script> in HTML or a bundler)
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

// Setup a camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
);
camera.position.set(0, 5, 15);

// Setup the renderer and attach to canvas
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 2000);
scene.add(ambientLight);



// Add a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);



// Handle keyboard input
const keysPressed = {};
window.addEventListener('keydown', (event) => {
    keysPressed[event.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (event) => {
    keysPressed[event.key.toLowerCase()] = false;
});

// Movement and rotation speed
const moveSpeed = 0.1;
const rotationSpeed = 0.05;

// Handle keyboard actions
function handleKeyboardActions() {
    // Movement along the XZ plane
    if (keysPressed["arrowup"]) {
        mesh.position.z -= moveSpeed; // Move forward
    }
    if (keysPressed["arrowdown"]) {
        mesh.position.z += moveSpeed; // Move backward
    }
    if (keysPressed["arrowleft"]) {
        mesh.position.x -= moveSpeed; // Move left
    }
    if (keysPressed["arrowright"]) {
        mesh.position.x += moveSpeed; // Move right
    }

    // Movement along the Y-axis
    if (keysPressed[" "]) {
        mesh.position.y += moveSpeed; // Move up
    }
    if (keysPressed["shift"]) {
        mesh.position.y -= moveSpeed; // Move down
    }

    // Rotation along axes
    if (keysPressed["w"]) {
        mesh.rotation.x -= rotationSpeed; // Rotate up on X-axis
    }
    if (keysPressed["s"]) {
        mesh.rotation.x += rotationSpeed; // Rotate down on X-axis
    }
    if (keysPressed["a"]) {
        mesh.rotation.y -= rotationSpeed; // Rotate left on Y-axis
    }
    if (keysPressed["d"]) {
        mesh.rotation.y += rotationSpeed; // Rotate right on Y-axis
    }
    if (keysPressed["q"]) {
        mesh.rotation.z -= rotationSpeed; // Rotate counterclockwise on Z-axis
    }
    if (keysPressed["e"]) {
        mesh.rotation.z += rotationSpeed; // Rotate clockwise on Z-axis
    }

    // Update Tweakpane values
    params.positionX = mesh.position.x;
    params.positionY = mesh.position.y;
    params.positionZ = mesh.position.z;
    params.rotationX = mesh.rotation.x;
    params.rotationY = mesh.rotation.y;
    params.rotationZ = mesh.rotation.z;
    pane.refresh(); // Refresh pane to reflect updated values
}

// Tweakpane for debugging and live updates
const pane = new Pane();
const params = {
    positionX: mesh.position.x,
    positionY: mesh.position.y,
    positionZ: mesh.position.z,
    rotationX: mesh.rotation.x,
    rotationY: mesh.rotation.y,
    rotationZ: mesh.rotation.z,
};
pane.addBinding(params, 'positionX', { step: 0.1 }).on('change', (e) => {
    mesh.position.x = e.value;
});
pane.addBinding(params, 'positionY', { step: 0.1 }).on('change', (e) => {
    mesh.position.y = e.value;
});
pane.addBinding(params, 'positionZ', { step: 0.1 }).on('change', (e) => {
    mesh.position.z = e.value;
});
pane.addBinding(params, 'rotationX', { step: 0.1 }).on('change', (e) => {
    mesh.rotation.x = e.value;
});
pane.addBinding(params, 'rotationY', { step: 0.1 }).on('change', (e) => {
    mesh.rotation.y = e.value;
});
pane.addBinding(params, 'rotationZ', { step: 0.1 }).on('change', (e) => {
    mesh.rotation.z = e.value;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Handle movement and rotation
    handleKeyboardActions();

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
