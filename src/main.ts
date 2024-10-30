import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats.js';

let camera: any, scene: any, renderer: any;
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const sensitivity = 0.01;

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
  camera.position.set(0, 50, 0)
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
  const movementX = event.movementX * delta * sensitivity * 10; // Adjust multiplier as needed
  const movementY = event.movementY * delta * sensitivity * 10;

  // Update Euler angles for rotation
  euler.x -= movementY;
  euler.y -= movementX;

  // Clamp the up/down rotation to prevent flipping
  const minAngle = -Math.PI / 2;
  const maxAngle = Math.PI / 2;
  euler.x = clamp(euler.x, minAngle, maxAngle);

  // Create a target quaternion from the updated Euler angles
  const targetQuaternion = new THREE.Quaternion().setFromEuler(euler);

  // Smoothly interpolate (slerp) the camera quaternion towards the target quaternion
  camera.quaternion.slerp(targetQuaternion, 0.2); // Adjust 0.2 for different levels of smoothing
}



function onPlay() {
  lockScreen();
  
  const menu = document.querySelector('#menu') as HTMLDivElement;
  menu.style.display = 'none';
}

const keys: any = {};
const speed = 50;

function playerMove() {
  Object.entries(keys).forEach(([key, value]) => {
    if (value == true) {
      switch (key) {
        case 'KeyW':
          camera.translateZ(-speed * delta);
          // camera.position.z += Math.cos(camera.rotation.y) * -speed
          // camera.position.x += Math.sin(camera.rotation.y) * -speed
            break;
        case 'KeyA':
          camera.translateX(-speed * delta);
          // camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * -speed
          // camera.position.z += Math.cos(camera.rotation.y + Math.PI / 2) * -speed
            break;
        case 'KeyD':
          camera.translateX(speed * delta);
          // camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * speed 
          // camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * speed 
            break;
        case 'KeyS':
          camera.translateZ(speed * delta);
          // camera.position.z += Math.cos(camera.rotation.y) * speed
          // camera.position.x += Math.sin(camera.rotation.y) * speed 
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

function loadMap() {
  const loader = new GLTFLoader();
  
  // Load a glTF resource
  console.log( `${location.href}assetes/de_dust_2_cs_map/scene.gltf`)
  loader.load(
    // resource URL
    `${import.meta.env.BASE_URL}assetes/de_dust_2_cs_map/scene.gltf`,
    // called when the resource is loaded
    function ( gltf ) {
  
      scene.add( gltf.scene );
  
      const model = gltf.scene;
      const kef = 40;
      model.position.set(0 * kef, -100 * kef, -120 * kef); // Adjust based on model's initial position
      model.scale.set(0.1 * kef, 0.1 * kef, 0.1 * kef); // Scale to make the model more visible
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
      console.log(gltf)
  
    },
    // called while loading is progressing
    function ( xhr ) {
  
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
    },
    // called when loading has errors
    function ( error ) {
  
      console.log( 'An error happened', error );
  
    }
  );

}

function createDirectionalLight(position: any, color: any, intensity: any) {
  const { x, y, z } = position;
  const directionalLight1 = new THREE.DirectionalLight(color, intensity);

  directionalLight1.position.set(x, y, z);

  scene.add(directionalLight1);
}

const defaultDirectionalLightColor = '#ffffff';
const defaultDirectionalLightIntensity = 0.2;
const lightDistanceRange = 200;

function initLight() {
  let position;
  const [color, intensity] = [defaultDirectionalLightColor, defaultDirectionalLightIntensity];

  position = new THREE.Vector3(0, lightDistanceRange, lightDistanceRange);
  createDirectionalLight(position, color, intensity);

  position = new THREE.Vector3(0, lightDistanceRange, -lightDistanceRange);
  createDirectionalLight(position, color, intensity);

  position = new THREE.Vector3(lightDistanceRange, lightDistanceRange, 0);
  createDirectionalLight(position, color, intensity);

  position = new THREE.Vector3(-lightDistanceRange, lightDistanceRange, 0);
  createDirectionalLight(position, color, intensity);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
}

function main() {
  init();

  addEventListeners()

  initLight() 
  loadMap()
}
main()
