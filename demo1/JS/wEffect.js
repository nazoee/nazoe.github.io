import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import GUI from 'three/addons/libs/lil-gui.module.min.js';

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


const planeGeometry = new THREE.PlaneGeometry(10, 10);
let planes = [];

const planeSettings = {
    planeCount: 15
};

// const j = { value: 15 };
function generatePlanes(count) {

    planes.forEach(plane => scene.remove(plane));
    planes = [];

    for (let i = 0; i < count; i++) {
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
        });

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // Randomly place the planes within the (-100, 100) range on x and y axes
        plane.position.x = Math.random() * 200 - 100;
        plane.position.y = Math.random() * 200 - 100;
        plane.position.z = Math.random() * 200 - 100;

        // Randomly rotate the planes
        plane.rotation.x = Math.random() * Math.PI;
        plane.rotation.y = Math.random() * Math.PI;
        plane.rotation.z = Math.random() * Math.PI;

        scene.add(plane);
        planes.push(plane);
    }
}

generatePlanes(planeSettings.planeCount);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

window.addEventListener('click', (e) => {
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planes);

    if (intersects.length > 0) {
        const intersectedPlane = intersects[0].object;
        const currentColor = intersectedPlane.material.color.getHex();

        // Toggle color between blue with blur and white
        if (currentColor === 0xFFFFFF) {
            intersectedPlane.material.color.set(0x0000FF);
            intersectedPlane.material.transparent = true;
            intersectedPlane.material.opacity = 0.8;
            intersectedPlane.material.needsUpdate = true;
        } else {
            intersectedPlane.material.color.set(0xFFFFFF);
            intersectedPlane.material.transparent = false;
            intersectedPlane.material.opacity = 1.0;
            intersectedPlane.material.needsUpdate = true;
        }
    }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

const gui = new GUI();
let folder = gui.addFolder('generate');
folder.add(planeSettings, 'planeCount', 1, 50).step(1).name('Plane Count').onChange(generatePlanes);
folder.add(camera.position, 'x', -100, 100).name('Camera X');
folder.add(camera.position, 'y', -100, 100).name('Camera Y');
folder.add(camera.position, 'z', -100, 100).name('Camera Z');

