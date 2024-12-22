import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* Cena, Câmera e Renderizador */

// Cena
const scene = new THREE.Scene();

// Câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.y = 3;
camera.position.z = 5;

// Renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);


/* Controles */

// OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);

/* Luzes */

// Luz Direcional
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(5, 10, 5);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

scene.add( directionalLight );

// Luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

/* Objetos */

// Solo

const groundGeometry = new THREE.PlaneGeometry( 4, 4 );
const groundMaterial = new THREE.MeshPhongMaterial( { color: 0xBA8E23 } );
groundMaterial.side = THREE.DoubleSide; //Apenas para renderizar o outro lado do piso
const ground = new THREE.Mesh( groundGeometry, groundMaterial );

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

scene.add( ground );

// Cubo para testes de luz

const cubeGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
const cubeMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

cube.position.y = 1;

cube.receiveShadow = true;
cube.castShadow = true;

scene.add( cube );
/* Função de animação */
function animar() {
  requestAnimationFrame(animar);
  
  //cube.rotation.x += 0.05;
  //cube.rotation.y += 0.05;

  orbitControls.update();
  
  renderer.render(scene, camera);
}

// Inicia a animação
animar();
