import * as THREE from 'three';

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
document.body.appendChild(renderer.domElement);




/* Luzes */

// Luz Direcional
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(5, 10, 5);

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

scene.add( ground );

// Cubo para testes de luz

const cubeGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
const cubeMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

cube.position.y = 1;

scene.add( cube );
/* Função de animação */
function animar() {
  requestAnimationFrame(animar);
  
  //cube.rotation.x += 0.05;
  //cube.rotation.y += 0.05;

  renderer.render(scene, camera);
}

// Inicia a animação
