import './style.css'
import * as THREE from 'three';
import Stats from 'stats.js';

const init = () => {
  // Set up stats.js for FPS counter
  const stats = new Stats();
  stats.showPanel(0); // 0: FPS panel
  document.body.appendChild(stats.dom);

  // Set up the Three.js scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
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

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);

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

// Initialize the scene
init();
