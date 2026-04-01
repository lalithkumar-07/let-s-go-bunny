const canvas = document.getElementById("globeCanvas");

// SCENE
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 3;

// RENDERER
renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true   // 🔥 IMPORTANT
});

renderer.setClearColor(0x000000, 0); // transparent
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// LIGHTS
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 3, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// EARTH
const geometry = new THREE.SphereGeometry(1, 64, 64);
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("/static/textures/earth.jpg");

const material = new THREE.MeshStandardMaterial({
    map: earthTexture
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// ===== ANIMATION STATES =====
let stage = 1;
let targetRotation = Math.PI / 1.5; // adjust for India
let zoomDone = false;

// ===== SCROLL TRIGGER =====
let triggered = false;

window.addEventListener("scroll", () => {
    const globeSection = document.getElementById("globe");
    const rect = globeSection.getBoundingClientRect();

    if (rect.top < window.innerHeight / 2 && !triggered) {
        triggered = true;
        stage = 2;
    }
});

// ===== ANIMATION LOOP =====
function animate() {
    requestAnimationFrame(animate);

    // STAGE 1 → ROTATE
    if (stage === 1) {
        earth.rotation.y += 0.003;
    }

    // STAGE 2 → STOP AT INDIA
    if (stage === 2) {
        if (earth.rotation.y < targetRotation) {
            earth.rotation.y += 0.01;
        } else {
            stage = 3;
        }
    }

    // STAGE 3 → ZOOM IN
    if (stage === 3 && !zoomDone) {
        camera.position.z -= 0.02;

        if (camera.position.z <= 1.5) {
            zoomDone = true;

            // Fade out globe
            document.querySelector("#globe").style.opacity = "0";

            // Show map
            setTimeout(() => {
                document.querySelector("#map").style.opacity = "1";
            }, 500);
        }
    }

    renderer.render(scene, camera);
}

animate();

// ===== RESPONSIVE =====
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
