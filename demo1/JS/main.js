// import * as THREE from '/demo1/JS/three/build/three.module.js';
// import { OrbitControls } from '/demo1/JS/three/examples/jsm/controls/OrbitControls.js';
// import { Water } from '/demo1/JS/three/examples/jsm/objects/Water2.js';
// import { GLTFLoader } from '/demo1/JS/three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from '/demo1/JS/three/examples/jsm/loaders/DRACOLoader.js';
// import { RGBELoader } from '/demo1/JS/three/examples/jsm/loaders/RGBELoader.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water2.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// set up the scene
const scene = new THREE.Scene();
// set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

// set camera position
camera.position.set(-50,50,130);
camera.aspect = window.innerWidth / window.innerHeight;
// update the camera projection matrix
camera.updateProjectionMatrix();

scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer(
  {
    antialias: true,
  }
);

renderer.outputEncoding = THREE.sRGBEncoding;

renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('three').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

function render(){
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();


const skyGeometry = new THREE.SphereGeometry(4000, 100, 100);
const skyMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("/demo1/model/1R.jpg"),
});
skyGeometry.scale(1, 1, -1);
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

// const planeGeometry = new THREE.PlaneGeometry(10, 10);
// const planeMaterial = new THREE.MeshBasicMaterial({
//   color: 0xFFFFFF,
//   side: THREE.DoubleSide,
// });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);

const video = document.createElement('video');
video.src = "/demo1/model/1R.mp4";
video.loop = true;

window.addEventListener('click', (e) =>{
  if(video.paused){
    video.play();
    let texture = new THREE.VideoTexture(video);
    skyMaterial.map = texture;
    skyMaterial.map.needsUpdate = true;
  }
});

//load hdr
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync('/demo1/model/blouberg_sunrise_2_1k.hdr').then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// create the water
const waterGeometry = new THREE.CircleGeometry(300, 64); //CircleBufferGeometry(300, 64);
const water = new Water(waterGeometry, {
  normalMap0: new THREE.TextureLoader().load("/demo1/model/Water_1_M_Normal.jpg"),
  normalMap1: new THREE.TextureLoader().load("/demo1/model/Water_2_M_Normal.jpg"),
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 1,
  flowSpeed: 0.05,
  reflectivity: 0.1,
  
});
water.rotation.x = -Math.PI / 2;
scene.add(water);

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/demo1/draco/');
loader.setDRACOLoader(dracoLoader);

loader.load(
  '/demo1/model/moss2.glb',(gltf) => {
    const model1 = gltf.scene;
    model1.position.set(0, 10, 0);
    model1.scale.set(50, 50, 50);
    scene.add(model1);
  
});

loader.load(
  '/demo1/model/character.glb',(gltf) => {
    const model2 = gltf.scene;
    model2.position.set(0, 10, 0);
    model2.scale.set(10, 10, 10);
    scene.add(model2);
  
});
