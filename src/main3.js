import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// Create a scene
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

// Default geometry and material
let currentGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
let mesh = new THREE.Mesh(currentGeometry, material);
scene.add(mesh);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Tweakpane
const pane = new Pane();
const params = {
    geometry: "Sphere",
    positionX: mesh.position.x,
    positionY: mesh.position.y,
    positionZ: mesh.position.z,
    color: "#ff0000", // Mesh color
};

// Function to update geometry
function updateGeometry(geometryType) {
    let newGeometry;
    switch (geometryType) {
        case "Sphere":
            newGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
        case "Box":
            newGeometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        case "Cone":
            newGeometry = new THREE.ConeGeometry(0.5, 1, 32);
            break;
        case "Cylinder":
            newGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
            break;
        default:
            newGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    }

    // Replace the current geometry with the new one
    mesh.geometry.dispose();
    mesh.geometry = newGeometry;
    currentGeometry = newGeometry;
}

// Add geometry selector to Tweakpane
pane.addBinding(params, "geometry", {
    options: {
        Sphere: "Sphere",
        Box: "Box",
        Cone: "Cone",
        Cylinder: "Cylinder",
    },
}).on("change", (ev) => {
    updateGeometry(ev.value);
});

// Bind mesh position controls
pane.addBinding(params, "positionX", { min: -14, max: 14, step: 0.1 }).on("change", (ev) => {
    mesh.position.x = ev.value;
});
pane.addBinding(params, "positionY", { min: -14, max: 14, step: 0.1 }).on("change", (ev) => {
    mesh.position.y = ev.value;
});
pane.addBinding(params, "positionZ", { min: -14, max: 15, step: 0.1 }).on("change", (ev) => {
    mesh.position.z = ev.value;
});

// Bind color control
pane.addBinding(params, "color").on("change", (ev) => {
    mesh.material.color.set(ev.value);
});

// Raycaster and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;

// Event listeners for mouse interactions
canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    controls.enabled = false; // Disable OrbitControls while dragging
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
    controls.enabled = true; // Re-enable OrbitControls after dragging
});

canvas.addEventListener("mousemove", (event) => {
    if (!isDragging) return; // Only move the mesh when the mouse is pressed

    // Normalize mouse coordinates to [-1, 1]
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast a ray from the camera in the direction of the mouse position
    raycaster.setFromCamera(mouse, camera);

    // Move the mesh along the raycaster's direction
    const distanceFromCamera = 5; // Set a fixed distance from the camera
    const newPosition = new THREE.Vector3();
    newPosition
        .copy(raycaster.ray.origin)
        .add(raycaster.ray.direction.multiplyScalar(distanceFromCamera));

    // Update the mesh's position
    mesh.position.copy(newPosition);

    // Update Tweakpane values
    params.positionX = mesh.position.x;
    params.positionY = mesh.position.y;
    params.positionZ = mesh.position.z;

    pane.refresh(); // Refresh pane to reflect new values
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
