(function () {

  const container = document.getElementById("globeContainer");
  if (!container) return;

  const W = container.clientWidth  || window.innerWidth;
  const H = container.clientHeight || window.innerHeight;

  // ── RENDERER ──
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x020c1b);
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
  camera.position.set(0, 0, 3.2);

  // ── LIGHTING ──
  scene.add(new THREE.AmbientLight(0x334466, 3));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(5, 3, 5);
  scene.add(sun);
  const rimLight = new THREE.DirectionalLight(0x1a3a6a, 1.2);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);

  // ── GLOBE ──
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshPhongMaterial({
      color: 0x0d2b55, emissive: 0x071428,
      specular: 0x2255aa, shininess: 25,
    })
  );
  scene.add(globe);

  // Atmosphere halo
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.04, 64, 64),
    new THREE.MeshPhongMaterial({
      color: 0x1155cc, transparent: true,
      opacity: 0.10, side: THREE.FrontSide, depthWrite: false,
    })
  ));

  // ── STARS ──
  const starVerts = [];
  for (let i = 0; i < 1800; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 8 + Math.random() * 4;
    starVerts.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starVerts, 3));
  scene.add(new THREE.Points(starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.022 })));

  // ── HELPERS ──
  function latLngTo3D(lat, lng, r) {
    const phi   = (90 - lat)  * Math.PI / 180;
    const theta = (lng + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    );
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // ── CITY DOTS + PULSE RINGS ──
  const CITIES = {
    Delhi:     { lat: 28.61, lng: 77.21 },
    Mumbai:    { lat: 19.08, lng: 72.88 },
    Bangalore: { lat: 12.97, lng: 77.59 },
    Hyderabad: { lat: 17.38, lng: 78.49 },
    Chennai:   { lat: 13.08, lng: 80.27 },
    Kolkata:   { lat: 22.57, lng: 88.36 },
    Pune:      { lat: 18.52, lng: 73.86 },
    Jaipur:    { lat: 26.91, lng: 75.79 },
  };

  const dotGeo = new THREE.SphereGeometry(0.013, 8, 8);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0xffd600 });
  const pulseRings = [];

  Object.values(CITIES).forEach(c => {
    const pos = latLngTo3D(c.lat, c.lng, 1.012);

    // City dot
    const dot = new THREE.Mesh(dotGeo, dotMat.clone());
    dot.position.copy(pos);
    globe.add(dot);

    // Pulse ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.018, 0.024, 16),
      new THREE.MeshBasicMaterial({
        color: 0xffd600, transparent: true,
        opacity: 0.7, side: THREE.DoubleSide, depthWrite: false,
      })
    );
    ring.position.copy(latLngTo3D(c.lat, c.lng, 1.013));
    ring.lookAt(ring.position.clone().multiplyScalar(2));
    globe.add(ring);
    pulseRings.push({ mesh: ring, phase: Math.random() * Math.PI * 2 });
  });

  // ── ROUTE ARCS ──
  const ROUTES = [
    ["Delhi", "Mumbai"],    ["Mumbai", "Bangalore"],
    ["Delhi", "Kolkata"],   ["Hyderabad", "Chennai"],
    ["Delhi", "Jaipur"],    ["Mumbai", "Pune"],
    ["Bangalore", "Hyderabad"], ["Chennai", "Kolkata"],
  ];

  const vehicles = [];

  ROUTES.forEach(([a, b]) => {
    const p1  = latLngTo3D(CITIES[a].lat, CITIES[a].lng, 1.0);
    const p2  = latLngTo3D(CITIES[b].lat, CITIES[b].lng, 1.0);
    const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(1.18);
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);

    // Arc line
    const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
    globe.add(new THREE.Line(arcGeo,
      new THREE.LineBasicMaterial({ color: 0xffd600, transparent: true, opacity: 0.5 })));

    // Moving vehicle dot
    const v = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff6600 })
    );
    globe.add(v);
    vehicles.push({ curve, mesh: v, t: Math.random(), speed: 0.0018 + Math.random() * 0.001 });
  });

  // ── INDIA OUTLINE ──
  const INDIA_POLY = [
    [8.4,77.1],[8.1,77.5],[8.9,78.2],[10.0,79.8],[11.0,79.9],[12.0,80.3],
    [13.1,80.3],[14.8,80.0],[16.0,81.1],[17.5,82.3],[18.8,84.5],[19.8,85.8],
    [20.7,86.9],[21.5,87.5],[22.3,88.0],[22.6,88.5],[23.6,89.5],[24.3,89.0],
    [24.9,88.0],[25.6,88.5],[26.6,89.2],[27.0,89.7],[27.5,88.8],[28.0,88.2],
    [28.3,87.1],[28.1,86.0],[28.6,85.0],[29.3,83.5],[30.4,80.2],[31.1,78.8],
    [32.5,76.7],[33.9,76.3],[34.5,74.5],[33.7,73.0],[34.2,72.0],[34.0,71.2],
    [33.5,70.5],[32.2,70.2],[31.5,69.5],[30.5,68.3],[29.0,67.7],[27.5,68.5],
    [25.2,68.1],[24.6,68.8],[23.9,69.7],[23.1,70.1],[22.5,70.1],[21.3,69.7],
    [20.7,71.0],[20.5,72.2],[20.0,73.1],[18.8,72.7],[17.5,71.6],[16.5,73.0],
    [15.0,74.0],[14.0,74.5],[13.5,74.7],[12.5,74.9],[11.0,75.7],[10.0,76.3],
    [8.9,76.9],[8.4,77.1],
  ];
  const indiaPts = INDIA_POLY.map(([lat, lng]) => latLngTo3D(lat, lng, 1.016));
  indiaPts.push(indiaPts[0]);
  globe.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(indiaPts),
    new THREE.LineBasicMaterial({ color: 0x3399ff, transparent: true, opacity: 0.7 })
  ));

  // ── CAMERA PHASES ──
  // 0–5s  : global spin
  // 5–8s  : zoom into India
  // 8–18s : orbit India close-up
  // 18–21s: zoom back out → loop
  let startTime = null;
  let globeRotY = 0;

  function animate(ts) {
    requestAnimationFrame(animate);
    if (!startTime) startTime = ts;
    const elapsed = (ts - startTime) / 1000;

    // Globe rotation
    globeRotY += 0.0018;
    globe.rotation.y = globeRotY;

    // Pulse rings
    pulseRings.forEach(r => {
      const s = 1.0 + 0.45 * Math.sin(elapsed * 2 + r.phase);
      r.mesh.scale.setScalar(s);
      r.mesh.material.opacity = 0.7 * (1 - ((s - 1) / 0.45) * 0.6);
    });

    // Vehicles
    vehicles.forEach(v => {
      v.t = (v.t + v.speed) % 1;
      v.mesh.position.copy(v.curve.getPointAt(v.t));
    });

    // Camera
    if (elapsed < 5) {
      const a = elapsed * 0.35;
      camera.position.set(Math.sin(a) * 3.2, 0.4, Math.cos(a) * 3.2);
      camera.lookAt(0, 0, 0);

    } else if (elapsed < 8) {
      const t = easeInOut(Math.min((elapsed - 5) / 3, 1));
      const s = new THREE.Vector3(Math.sin(5 * 0.35) * 3.2, 0.4, Math.cos(5 * 0.35) * 3.2);
      const e = new THREE.Vector3(0.8, 0.6, 2.2);
      camera.position.lerpVectors(s, e, t);
      camera.lookAt(0, 0, 0);

    } else if (elapsed < 18) {
      const orbit = (elapsed - 8) * 0.25;
      camera.position.set(
        Math.sin(orbit) * 1.26 + 0.7,
        0.55,
        Math.cos(orbit) * 1.05 + 1.5
      );
      camera.lookAt(0.3, 0.1, 0);

    } else {
      const t = easeInOut(Math.min((elapsed - 18) / 3, 1));
      const resumeA = (elapsed - 18) * 0.35;
      const zoomOut = new THREE.Vector3(Math.sin(resumeA) * 3.2, 0.4, Math.cos(resumeA) * 3.2);
      camera.position.lerpVectors(new THREE.Vector3(0.8, 0.6, 2.2), zoomOut, t);
      camera.lookAt(0, 0, 0);
      if (elapsed > 21) startTime = ts - 1000; // loop back to phase 0
    }

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);

  // ── RESPONSIVE ──
  window.addEventListener("resize", () => {
    const nW = container.clientWidth;
    const nH = container.clientHeight;
    renderer.setSize(nW, nH);
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
  });

})();