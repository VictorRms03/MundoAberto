import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";  
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

/* Cena, Câmera, Renderizador e Carregadores */

// Cena
const scene = new THREE.Scene();

// Câmera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 1.6, 5);
camera.lookAt(0, 0, 0);

// Renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Carregador de Objetos
const loader = new GLTFLoader();

// Carregador de Textura
const textureLoader = new THREE.TextureLoader();

/* Controles */

// OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);

// FirstPersonControls
const FPSControls = new FirstPersonControls(camera, renderer.domElement);
FPSControls.movementSpeed = 5;
FPSControls.lookSpeed = 0.1;
FPSControls.lookVertical = true;

// Inicialmente, desativa os controles de FPS
FPSControls.enabled = false;

/* Luzes */

// Luz Direcional
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

/* Objetos */

// Solo
const groundGeometry = new THREE.PlaneGeometry(7, 7);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xBA8E23 });
groundMaterial.side = THREE.DoubleSide;
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Árvore
loader.load('./assets/3dModels/tree/scene.gltf', function (gltf) {
  gltf.scene.scale.set(1, 1, 1);
  scene.add(gltf.scene);
}, undefined, function (error) {
  console.log(error);
});

// Cabana
loader.load('./assets/3dModels/shelter/scene.gltf', function (gltf) {
  gltf.scene.scale.set(0.005, 0.005, 0.005);
  gltf.scene.position.set(2, 0.1, 2);
  gltf.scene.rotation.y = 200;
  scene.add(gltf.scene);
}, undefined, function (error) {
  console.log(error);
});

/* Função de animação */
function animar() {
  requestAnimationFrame(animar);

  // Calcula o tempo entre os frames
  const delta = clock.getDelta();
  FPSControls.update(delta); // Atualiza os controles apenas se habilitado

  renderer.render(scene, camera);
}

// Inicia a animação
const clock = new THREE.Clock();
animar();

/* Controle de Mouse e Teclado */

// Detectar o movimento do mouse
let mouseMoved = false;

document.addEventListener('mousemove', () => {
  mouseMoved = true;
  FPSControls.enabled = true; // Ativa os controles se o mouse for movido
  clearTimeout(mouseTimeout); // Limpa o timeout para impedir desativação
  handleMouseStop();
});

// Função que desativa os controles FPS quando o mouse não está mais se movendo
let mouseTimeout;

function handleMouseStop() {
  mouseTimeout = setTimeout(() => {
    mouseMoved = false;
    if (!isAnyKeyPressed()) {
      FPSControls.enabled = false; // Desativa os controles se o mouse parar e nenhuma tecla estiver pressionada
    }
  }, 100);
}

// Estado para monitorar se as teclas WASD estão pressionadas
const keysPressed = { w: false, a: false, s: false, d: false };

// Função para verificar se alguma tecla WASD está pressionada
function isAnyKeyPressed() {
  return keysPressed.w || keysPressed.a || keysPressed.s || keysPressed.d;
}

// Adiciona ouvintes para pressionamento de teclas
document.addEventListener('keydown', (event) => {
  if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
    keysPressed[event.key] = true;
    FPSControls.enabled = true; // Ativa os controles quando uma tecla é pressionada
  }
});

// Adiciona ouvintes para liberação de teclas
document.addEventListener('keyup', (event) => {
  if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
    keysPressed[event.key] = false;
    if (!isAnyKeyPressed() && !mouseMoved) {
      FPSControls.enabled = false; // Desativa os controles se nenhuma tecla estiver pressionada e o mouse não se mover
    }
  }
});
