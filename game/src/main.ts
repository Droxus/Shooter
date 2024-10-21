import './style.css'
import * as THREE from 'three';
import Stats from 'stats.js';

let camera: any, scene: any, renderer: any;
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const sensitivity = 1;

const clock = new THREE.Clock();
let delta = 0;

const init = () => {
  // Set up stats.js for FPS counter
  const stats = new Stats();
  stats.showPanel(0); // 0: FPS panel
  document.body.appendChild(stats.dom);

  // Set up the Three.js scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const appDiv = document.getElementById("app") as HTMLDivElement
  appDiv.appendChild( renderer.domElement );

  // Create a cube and add it to the scene
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Set the camera position
  camera.position.z = 5;

  // Animation loop
  const animate = () => {
    stats.begin(); // Begin measuring FPS

    delta = clock.getDelta();

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);

    playerMove()

    stats.end(); // End measuring FPS

    // Loop the animation
    requestAnimationFrame(animate);
  };

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

function lockScreen() {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  canvas.requestPointerLock();
}

function clamp(value: number, min: number, max: number) {
  return Math.max(Math.min(max, value), min)
}

function onMouseMove(event: MouseEvent) {
  const movementX = event.movementX;
  const movementY = event.movementY;

  euler.x -= movementY / (1 / sensitivity * 1000)
  euler.y -= movementX / (1 / sensitivity * 1000)

  const minAngle = -Math.PI / 2;
  const maxAngle = Math.PI / 2;

  euler.x = clamp(euler.x, minAngle, maxAngle)
  camera.quaternion.setFromEuler(euler);
}

function onPlay() {
  lockScreen();
  
  const menu = document.querySelector('#menu') as HTMLDivElement;
  menu.style.display = 'none';
}

const keys: any = {};
const speed = 1;

function playerMove() {
  Object.entries(keys).forEach(([key, value]) => {
    if (value == true) {
      switch (key) {
        case 'KeyW':
            camera.position.z += speed * Math.cos(camera.rotation.y) * delta
            break;
        case 'KeyA':
            camera.position.x += -speed * Math.sin(camera.rotation.y) * delta
            break;
        case 'KeyD':
            camera.position.z += -speed * Math.cos(camera.rotation.y) * delta
            break;
        case 'KeyS':
            camera.position.x += speed * Math.sin(camera.rotation.y) * delta
            break;
        case 'Space':
          camera.position.y += speed * delta
          break;
        case 'ShiftLeft':
          camera.position.y += -speed * delta
          break;
      }
    }
  })
}

function onKeydown(event: KeyboardEvent) {
  event.preventDefault();

    keys[event.code] = true
}

function onKeyup(event: KeyboardEvent) {
  event.preventDefault();

  keys[event.code] = false
}

function addEventListeners() {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('keydown', onKeydown, false);
  window.addEventListener('keyup', onKeyup, false)

  const playBtn = document.querySelector('#play') as HTMLButtonElement;
  playBtn.addEventListener('click', onPlay);
}

function main() {
  init();

  addEventListeners()
}
main()
