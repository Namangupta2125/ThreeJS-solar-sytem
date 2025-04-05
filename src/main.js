import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gsap } from "gsap";



// canvas
const canvas = document.getElementById('canvas')
//scene
const scene = new THREE.Scene();

//renderer
const renderer = new THREE.WebGLRenderer({canvas,antialias:true})


// texture loader
const textureLoader =  new THREE.TextureLoader();


//textures
const sunTexture = textureLoader.load('/textures/2k_sun.jpg')
const marsTexture = textureLoader.load("/textures/2k_mars.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const milkyWayTexture = textureLoader.load("/textures/2k_stars_milky_way.jpg");


//Geometry and Material
const spehereGeoMetry = new THREE.SphereGeometry(1,32,32)
const earthMaterial = new THREE.MeshStandardMaterial({
  map:earthTexture
});
const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
  emissiveMap:sunTexture,
  emissive: new THREE.Color(0xffffaa), // soft yellow
  emissiveIntensity: 3,
});

const moonMaterial = new THREE.MeshStandardMaterial({
  map:moonTexture
})
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture,
});

const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture,
});

const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture,
});

//test


// light
const ambientLight = new THREE.AmbientLight(0xffffff,0.2)
scene.add(ambientLight)

const sunLight = new THREE.PointLight(0xffcc66, 2000, 0); 
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

sunLight.castShadow = true;
renderer.shadowMap.enabled = true;



// const directionalLight = new THREE.DirectionalLight(0xffffff, 10); // increase range
// console.log(directionalLight.position)
// scene.add(directionalLight);


// const lightHelper = new THREE.PointLightHelper(pointLight, 2);
// scene.add(lightHelper);


// Mesh
const sun = new THREE.Mesh(spehereGeoMetry,sunMaterial)
sun.scale.setScalar(5)
scene.add(sun)




// const earth= new THREE.Mesh(spehereGeoMetry,earthMaterial)
// earth.position.x = 10;
// scene.add(earth)


// const moon = new THREE.Mesh(spehereGeoMetry,moonMaterial)
// moon.scale.setScalar(0.3)
// moon.position.x = 2;
// earth.add(moon)




// camera
const camera = new THREE.PerspectiveCamera(35,window.innerWidth/window.innerHeight,0.1,400)
camera.position.set(0,5,100)
scene.add(camera)



// planets array
const planetArray = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.002,
      },
      {
        name:"Deimos",
        radius:0.2,
        distance:3,
        speed:0.015,
        color:0xffffff
      }
    ],
  },
];


const planetMesh = planetArray.map((element)=>{
    const mesh = new THREE.Mesh(spehereGeoMetry,element.material);
    mesh.scale.setScalar(element.radius)
    mesh.position.x = element.distance
    element.moons.forEach((mn)=>{
      const moonMesh = new THREE.Mesh(spehereGeoMetry,moonMaterial);
      moonMesh.scale.setScalar(mn.radius);
      moonMesh.position.x = mn.distance
      mesh.add(moonMesh)
    })
    scene.add(mesh);
    return mesh;

})


// controls
const controls = new OrbitControls(camera, canvas);


//setting up renderer
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setPixelRatio(Math.min(window.innerWidth/window.innerHeight,2));

// dynamic siziing
window.addEventListener('resize',()=>{
   renderer.setSize(window.innerWidth, window.innerHeight);
   camera.aspect = window.innerWidth/window.innerHeight
   camera.updateProjectionMatrix()
})

// initializeing clock
const clock = new THREE.Clock()




const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('./textures/cubeMap/')
const backgroundtexture = cubeTextureLoader.load([
  'px.png', 
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png',

]);

scene.background = backgroundtexture
// animate function
function animate() {
  
  planetMesh.forEach((planet,index)=>{
    planet.rotation.y += planetArray[index].speed 
    planet.position.x= Math.sin(planet.rotation.y)*(planetArray[index].distance )
    planet.position.z = Math.cos(planet.rotation.y) * (planetArray[index].distance);
    planet.children.forEach((moon,ind)=>{
      moon.rotation.y += planetArray[index].moons[ind].speed
      moon.position.x = Math.sin(moon.rotation.y) * planetArray[index].moons[ind].distance;
       moon.position.z = Math.cos(planet.rotation.y) * planetArray[index].moons[ind].distance;
    })
  })


  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate()