// Basic setup for Three.js scene
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create spaceship (basic cube for now)
let geometry = new THREE.BoxGeometry();
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let spaceship = new THREE.Mesh(geometry, material);
scene.add(spaceship);

// Add a light source
let light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Camera setup
camera.position.z = 5;

// Level setup
let level = 1;
let levelDuration = 5; // Duration in seconds for each level
let lastLevelTime = Date.now();
let asteroidSpeed = 0.02;
let asteroidSpawnRate = 1; // Time between asteroid spawns in seconds
let asteroidCount = 0;
let asteroids = [];

// Create asteroids
function createAsteroid() {
    let size = Math.random() * 0.5 + 0.5;
    let geometry = new THREE.SphereGeometry(size, 32, 32);
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let asteroid = new THREE.Mesh(geometry, material);
    asteroid.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, -Math.random() * 50 - 5);
    scene.add(asteroid);
    asteroids.push(asteroid);
}

// Increase difficulty
function increaseDifficulty() {
    let elapsedTime = (Date.now() - lastLevelTime) / 1000;
    if (elapsedTime > levelDuration) {
        level++;
        lastLevelTime = Date.now();
        asteroidSpeed += 0.01; // Increase speed of asteroids
        asteroidSpawnRate -= 0.1; // Spawn asteroids faster
        console.log(`Level ${level}!`);
        if (level % 2 === 0) {
            createAsteroid(); // Add an extra asteroid every two levels
        }
    }
}

// Handle player movement
let moveSpeed = 0.1;
let turnSpeed = 0.05;

function animate() {
    requestAnimationFrame(animate);
    
    // Keyboard input for movement (WASD)
    if (keys['w']) spaceship.position.z -= moveSpeed;
    if (keys['s']) spaceship.position.z += moveSpeed;
    if (keys['a']) spaceship.position.x -= moveSpeed;
    if (keys['d']) spaceship.position.x += moveSpeed;

    // Mouse look
    spaceship.rotation.x = mouseY * turnSpeed;
    spaceship.rotation.y = mouseX * turnSpeed;

    // Spawn asteroids
    if (Math.random() < asteroidSpawnRate / 100) {
        createAsteroid();
    }

    // Move asteroids
    for (let asteroid of asteroids) {
        asteroid.position.z += asteroidSpeed;
        if (asteroid.position.z > 5) {
            scene.remove(asteroid);
            asteroids = asteroids.filter(a => a !== asteroid);
        }
    }

    // Increase difficulty as player progresses
    increaseDifficulty();

    // Render the scene
    renderer.render(scene, camera);
}

// Handle mouse movement
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight * 2 - 1);
});

// Handle keyboard input
let keys = {};
window.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

// Run the game
animate();
