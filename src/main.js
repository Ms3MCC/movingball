import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

// Setup a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(0, 5, 15);

// Setup the renderer and attach to canvas
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 2000);
scene.add(ambientLight);

// Create a sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Raycaster and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;

// Event listeners for mouse interactions
canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    controls.enabled = false; // Disable OrbitControls while dragging
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    controls.enabled = true; // Re-enable OrbitControls after dragging
});

canvas.addEventListener('mousemove', (event) => {
    if (!isDragging) return; // Only move the sphere when the mouse is pressed

    // Normalize mouse coordinates to [-1, 1]
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast a ray from the camera in the direction of the mouse position
    raycaster.setFromCamera(mouse, camera);

    // Move the sphere along the raycaster's direction
    // Set a fixed distance from the camera (e.g., 5 units)
    const distanceFromCamera = 5;
    const newSpherePosition = new THREE.Vector3();
    newSpherePosition.copy(raycaster.ray.origin).add(raycaster.ray.direction.multiplyScalar(distanceFromCamera));

    // Update the sphere's position
    sphere.position.copy(newSpherePosition);

    // Print the sphere's coordinates to the console
    console.log(`Sphere Position: x: ${sphere.position.x.toFixed(2)}, y: ${sphere.position.y.toFixed(2)}, z: ${sphere.position.z.toFixed(2)}`);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
