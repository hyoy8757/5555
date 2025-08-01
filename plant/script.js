const container = document.getElementById('planetContainer');

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Planet
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0x800080, roughness: 0.6 });
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// Ring (like Saturn's)
const ringGeometry = new THREE.RingGeometry(1.3, 1.6, 64);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2.2;
ring.rotation.y = 0.5;
planet.add(ring);

// Text ring (simulated with dots)
const points = [];
const textCount = 50;
const radius = 1.45;
for (let i = 0; i < textCount; i++) {
  const angle = (i / textCount) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const textDiv = document.createElement('div');
  textDiv.style.position = 'absolute';
  textDiv.style.color = 'white';
  textDiv.style.fontSize = '12px';
  textDiv.textContent = "I’m sorry".charAt(i % "I’m sorry".length);
  textDiv.style.transform = `translate(-50%, -50%)`;
  container.appendChild(textDiv);
  points.push({ el: textDiv, angle });
}

// Shooting stars
const stars = [];
const starCount = 20;
for (let i = 0; i < starCount; i++) {
  const star = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 3 + 2
  };
  stars.push(star);
}

// Create canvas for stars
const starCanvas = document.createElement('canvas');
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;
starCanvas.style.position = 'absolute';
starCanvas.style.top = 0;
starCanvas.style.left = 0;
container.appendChild(starCanvas);
const starCtx = starCanvas.getContext('2d');

function animateStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach(star => {
    starCtx.beginPath();
    const gradient = starCtx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    starCtx.fillStyle = gradient;
    starCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    starCtx.fill();
    star.x -= star.speed;
    star.y += star.speed;
    if (star.x < 0 || star.y > window.innerHeight) {
      star.x = Math.random() * window.innerWidth + window.innerWidth;
      star.y = Math.random() * window.innerHeight * -1;
    }
  });
  requestAnimationFrame(animateStars);
}

animateStars();

// Animate 3D scene and rotating text
function animate() {
  requestAnimationFrame(animate);
  planet.rotation.y += 0.002;

  // Rotate text ring
  points.forEach((point, i) => {
    point.angle += 0.002;
    const x = Math.cos(point.angle) * radius;
    const z = Math.sin(point.angle) * radius;
    const vector = new THREE.Vector3(x, 0, z);
    vector.project(camera);
    const xPos = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const yPos = (-vector.y * 0.5 + 0.5) * window.innerHeight;
    point.el.style.left = `${xPos}px`;
    point.el.style.top = `${yPos}px`;
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
});