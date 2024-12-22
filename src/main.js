import * as THREE from "three";
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

// FirstPersonControls
const FPSControls = new FirstPersonControls(camera, renderer.domElement);
FPSControls.movementSpeed = 5;
FPSControls.lookSpeed = 0.1;
FPSControls.lookVertical = true;

FPSControls.enabled = false;

/* Luzes */

// Luz Direcional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

/* Objetos */

// Solo
const groundGeometry = new THREE.PlaneGeometry(7, 7);
const groundTexture = textureLoader.load( './assets/textures/GrassTexture.jpg' );
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
groundMaterial.side = THREE.DoubleSide;
const ground = new THREE.Mesh(groundGeometry, groundMaterial);

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;
ground.castShadow = true;

scene.add( ground );

// Pedra
const rockGeometry = new THREE.SphereGeometry( 0.02, 32, 16 );
const rockTexture = textureLoader.load( './assets/textures/RockTexture.jpg' );
const rockMaterial = new THREE.MeshStandardMaterial({ map: rockTexture });
const rock = new THREE.Mesh( rockGeometry, rockMaterial );

rock.position.set(1.15, 0.01, 2.15);

rock.receiveShadow = true;
rock.castShadow = true;

scene.add(rock);

// Árvores
loader.load( './assets/3dModels/tree/scene.gltf', function ( gltf ) {

  let treeModel = gltf.scene;

  treeModel.traverse( function(node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  treeModel.scale.set(2, 2, 2) // Tamanho

  for ( let i=0; i<70; i++ ) {

    let positionX = Math.random() * ( 3 - (-3) ) + (-3);
    let positionZ = Math.random() * ( 3 - (-3) ) + (-3);

    if ( !( ( positionX > 1 && positionX < 3.5 ) && ( positionZ > 1 && positionZ < 3.5 ) ) ) { // Evitar Posição da Cabana

      let tree = treeModel.clone();
      tree.position.set( positionX , 0 , positionZ ); // Posição
      tree.rotation.y = 30*i; 

      scene.add( tree );

    }

  }

}, undefined, function( error ) {
  console.log( error );
} );

// Cabana
loader.load( './assets/3dModels/shelter/scene.gltf', function( gltf ) {

  let shelterModel = gltf.scene;

  shelterModel.scale.set(0.010, 0.010, 0.010); // Tamanho
  shelterModel.position.set(2, 0.1, 2); // Posição
  shelterModel.rotation.y = 200; // Rotação

  shelterModel.traverse( function(node) {
    if ( node.isMesh ) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  scene.add( shelterModel );

}, undefined, function( error ) {
  console.log( error );
} );

// Lobo
loader.load('./assets/3dModels/wolf/scene.gltf', function (gltf) {

  let wolfModel = gltf.scene;

  wolfModel.scale.set(0.3, 0.3, 0.3);
  wolfModel.position.set(1, 0, 2);
  wolfModel.rotation.y = 61;

  wolfModel.traverse( function(node) {
    if ( node.isMesh ) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  scene.add( wolfModel );

}, undefined, function (error) {
  console.log(error);
});

/* Função de animação */
const clock = new THREE.Clock();

function animar() {

  requestAnimationFrame(animar);

  const delta = clock.getDelta();
  FPSControls.update(delta); // Atualiza os controles apenas se habilitado

  renderer.render(scene, camera);

}

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
