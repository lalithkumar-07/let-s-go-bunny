import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Globe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth  || 500;
    const H = container.clientHeight || 500;

    /* ── RENDERER ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(0, 0, 3.0);

    /* ── LIGHTING ── */
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(6, 4, 6);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x88aaff, 0.8);
    fill.position.set(-4, -2, -4);
    scene.add(fill);

    /* ── STARS ── */
    const sv = [];
    for (let i = 0; i < 1600; i++) {
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      const r = 7 + Math.random() * 3;
      sv.push(r*Math.sin(p)*Math.cos(t), r*Math.cos(p), r*Math.sin(p)*Math.sin(t));
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.Float32BufferAttribute(sv, 3));
    scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.02 })));

    /* ── GLOBE GROUP — everything rotates together ── */
    const G = new THREE.Group();
    scene.add(G);

    /* Ocean */
    G.add(new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x1a4a8a, emissive: 0x071428, shininess: 60, specular: 0x3366bb })
    ));

    /* Atmosphere */
    G.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.025, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x4488ff, transparent: true, opacity: 0.06, side: THREE.FrontSide, depthWrite: false })
    ));

    /* ── HELPERS ── */
    function ll(lat, lng, r = 1.0) {
      const phi   = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta)
      );
    }

    function addLand(poly, color) {
      const R   = 1.003;
      const pts = poly.map(([la, ln]) => ll(la, ln, R));
      const cx  = new THREE.Vector3();
      pts.forEach(p => cx.add(p));
      cx.divideScalar(pts.length).normalize().multiplyScalar(R);
      const verts = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        verts.push(cx.x, cx.y, cx.z, a.x, a.y, a.z, b.x, b.y, b.z);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      geo.computeVertexNormals();
      G.add(new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide, shininess: 5 })));
    }

    function addBorder(poly, color, r = 1.006, closed = true) {
      const pts = poly.map(([la, ln]) => ll(la, ln, r));
      if (closed) pts.push(pts[0].clone());
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      G.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 })));
    }

    /* ── LANDMASSES ── */
    const INDIA = [
      [8.1,77.6],[8.4,77.0],[8.9,76.6],[9.5,76.3],[10.2,76.0],[10.9,75.9],
      [11.2,75.6],[11.8,75.2],[12.5,74.9],[13.1,74.8],[13.7,74.5],[14.2,74.3],
      [14.8,74.0],[15.5,73.9],[16.2,73.2],[16.9,73.0],[17.4,71.8],[18.0,72.0],
      [18.8,72.8],[19.5,72.9],[20.2,73.0],[20.7,71.1],[21.0,70.5],[21.4,69.8],
      [22.0,69.5],[22.5,70.1],[22.8,70.8],[23.2,70.2],[23.8,69.8],[24.5,68.9],
      [25.2,68.3],[26.0,68.0],[27.0,68.3],[28.5,68.4],[29.5,67.5],[30.5,68.2],
      [31.5,69.4],[32.4,70.3],[33.4,70.4],[34.0,71.1],[34.3,72.0],[33.8,73.1],
      [34.5,74.4],[34.1,76.6],[33.6,78.0],[32.7,78.5],[31.6,79.0],[30.5,80.1],
      [29.4,80.9],[29.4,83.4],[28.6,85.0],[28.2,86.1],[28.3,87.2],[27.8,88.1],
      [27.5,88.9],[27.0,89.6],[26.6,89.2],[25.7,88.6],[25.0,88.1],[24.4,89.0],
      [23.7,89.5],[22.7,88.5],[22.3,88.0],[21.5,87.5],[20.7,87.0],[19.9,85.9],
      [18.9,84.5],[17.6,82.4],[17.1,82.1],[16.1,81.2],[14.9,80.1],[13.2,80.3],
      [12.1,80.3],[11.1,79.9],[10.1,79.8],[9.0,78.3],[8.1,77.6],
    ];
    addLand(INDIA, 0x2a7a36);
    addBorder(INDIA, 0x00ffcc, 1.007, true);

    const AFRICA = [
      [37,10],[35,12],[32,14],[27,14],[22,15],[16,15],[10,13],[5,10],[3,5],[1,2],
      [-1,2],[-3,3],[-5,5],[-5,8],[-4,9],[-5,11],[-6,14],[-9,16],[-11,17],
      [-13,16],[-15,17],[-17,15],[-19,13],[-21,14],[-24,14],[-27,15],[-30,17],
      [-33,18],[-34,22],[-34,26],[-30,30],[-26,33],[-22,35],[-18,37],[-14,40],
      [-10,40],[-6,40],[-2,41],[2,41],[5,42],[8,44],[11,44],[14,43],[17,42],
      [20,41],[22,38],[26,34],[28,33],[31,32],[33,35],[35,36],[37,36],[38,38],
      [36,42],[34,42],[31,40],[26,33],[22,37],[18,38],[14,41],[11,42],[12,38],
      [14,37],[18,37],[22,37],[26,33],[29,31],[31,30],[34,33],[36,34],[37,10],
    ];
    addLand(AFRICA, 0x3a7a35);

    const EUROPE = [
      [36,5],[38,2],[40,-1],[41,2],[43,3],[44,8],[43,10],[44,12],[45,14],[44,16],
      [45,17],[47,16],[48,17],[50,14],[51,15],[54,14],[55,14],[57,12],[59,10],
      [60,11],[62,11],[63,14],[65,13],[66,14],[68,15],[70,18],[71,20],[70,25],
      [69,28],[68,30],[66,26],[65,25],[62,26],[60,27],[58,27],[56,21],[55,21],
      [54,20],[54,18],[56,17],[58,16],[60,25],[62,30],[64,30],[66,33],[68,35],
      [70,27],[72,24],[70,20],[68,17],[65,14],[63,13],[61,11],[60,5],[58,6],
      [57,8],[55,9],[53,9],[52,5],[51,3],[50,1],[49,0],[47,2],[46,6],[44,8],
      [43,7],[42,4],[40,-1],[38,1],[36,5],
    ];
    addLand(EUROPE, 0x4a8840);

    const ASIA = [
      [70,30],[72,50],[73,70],[73,90],[72,110],[70,130],[68,145],[65,170],
      [62,170],[60,150],[58,140],[55,130],[52,115],[50,100],[47,90],[44,70],
      [42,58],[40,52],[38,45],[36,38],[32,35],[30,35],[28,34],[26,50],[24,57],
      [22,60],[20,58],[18,53],[16,44],[14,44],[12,44],[10,50],[14,53],[18,56],
      [22,60],[25,65],[28,68],[30,72],[32,74],[34,74],[36,74],[38,72],[40,70],
      [42,68],[44,72],[46,78],[48,85],[50,92],[52,102],[54,112],[56,122],
      [58,130],[60,140],[62,152],[64,165],[66,178],[68,178],[70,170],[72,155],
      [74,135],[76,115],[78,95],[78,75],[76,55],[74,45],[72,38],[70,30],
    ];
    addLand(ASIA, 0x3d7a38);

    const N_AMER = [
      [70,-140],[68,-136],[66,-128],[62,-124],[58,-137],[56,-132],[50,-124],
      [46,-124],[42,-124],[38,-122],[34,-120],[30,-116],[26,-105],[22,-97],
      [18,-88],[14,-90],[10,-85],[8,-77],[4,-76],[0,-78],[-4,-81],[-8,-78],
      [-12,-77],[-18,-70],[-24,-70],[-30,-71],[-36,-72],[-42,-73],[-48,-75],
      [-54,-71],[-56,-67],[-54,-67],[-50,-70],[-46,-65],[-42,-62],[-38,-60],
      [-34,-53],[-30,-50],[-26,-48],[-22,-41],[-18,-39],[-12,-37],[-8,-35],
      [-5,-35],[-2,-41],[0,-50],[4,-52],[6,-54],[8,-60],[10,-62],[12,-62],
      [14,-61],[16,-62],[18,-66],[20,-72],[22,-75],[24,-77],[26,-80],[28,-80],
      [30,-81],[32,-80],[34,-78],[36,-76],[38,-74],[40,-74],[42,-70],[44,-66],
      [46,-64],[48,-66],[50,-64],[52,-56],[54,-56],[56,-62],[58,-66],[60,-65],
      [62,-64],[64,-65],[66,-72],[68,-80],[70,-86],[72,-94],[74,-100],[76,-90],
      [78,-80],[76,-70],[74,-80],[72,-90],[70,-100],[68,-110],[66,-120],
      [64,-130],[62,-136],[64,-140],[68,-140],[70,-140],
    ];
    addLand(N_AMER, 0x4a8840);

    const S_AMER = [
      [0,-50],[4,-52],[6,-54],[8,-60],[10,-62],[8,-63],[6,-61],[4,-60],
      [2,-60],[0,-60],[-2,-60],[-4,-62],[-8,-70],[-12,-77],[-18,-70],
      [-24,-70],[-30,-71],[-36,-72],[-42,-73],[-48,-75],[-54,-71],[-56,-67],
      [-54,-67],[-50,-70],[-46,-65],[-42,-62],[-38,-60],[-34,-53],[-30,-50],
      [-26,-48],[-22,-41],[-18,-39],[-12,-37],[-8,-35],[-5,-35],[-2,-41],[0,-50],
    ];
    addLand(S_AMER, 0x4a8840);

    const AUS = [
      [-18,122],[-14,126],[-12,131],[-12,136],[-14,136],[-15,137],[-17,140],
      [-20,148],[-24,152],[-28,154],[-32,152],[-36,150],[-39,146],[-38,144],
      [-37,140],[-36,137],[-34,135],[-34,123],[-34,116],[-30,115],[-24,114],
      [-20,118],[-18,122],
    ];
    addLand(AUS, 0x5a8840);

    /* ── CITY DOTS + PULSE RINGS ── */
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

    const pulses = [];
    const dotGeo = new THREE.SphereGeometry(0.012, 10, 10);
    const ringGeo = new THREE.RingGeometry(0.020, 0.026, 20);

    Object.values(CITIES).forEach(c => {
      const pos = ll(c.lat, c.lng, 1.015);
      const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xffd600 }));
      dot.position.copy(pos);
      G.add(dot);

      const ring = new THREE.Mesh(ringGeo,
        new THREE.MeshBasicMaterial({ color: 0xffd600, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false })
      );
      const rpos = ll(c.lat, c.lng, 1.016);
      ring.position.copy(rpos);
      ring.lookAt(rpos.clone().multiplyScalar(3));
      G.add(ring);
      pulses.push({ mesh: ring, phase: Math.random() * Math.PI * 2 });
    });

    /* ── ROUTE ARCS + VEHICLES ── */
    const ROUTES = [
      ["Delhi","Mumbai"],["Mumbai","Bangalore"],["Delhi","Kolkata"],
      ["Hyderabad","Chennai"],["Delhi","Jaipur"],["Mumbai","Pune"],
      ["Bangalore","Hyderabad"],["Chennai","Kolkata"],
    ];
    const vehicles = [];

    ROUTES.forEach(([a, b]) => {
      const p1  = ll(CITIES[a].lat, CITIES[a].lng, 1.0);
      const p2  = ll(CITIES[b].lat, CITIES[b].lng, 1.0);
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(1.13);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);

      const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60));
      G.add(new THREE.Line(arcGeo,
        new THREE.LineBasicMaterial({ color: 0xffd600, transparent: true, opacity: 0.5 })
      ));

      const v = new THREE.Mesh(
        new THREE.SphereGeometry(0.016, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xff5500 })
      );
      G.add(v);
      vehicles.push({ curve, mesh: v, t: Math.random(), speed: 0.0014 + Math.random() * 0.0012 });
    });

    /* ── CAMERA PHASES ── */
    let t0 = null;
    const CAM_DIST  = 3.0;
    const CAM_INDIA = new THREE.Vector3(0.55, 0.38, 2.05);

    function globalCamPos(angle) {
      return new THREE.Vector3(Math.sin(angle)*CAM_DIST, 0.35, Math.cos(angle)*CAM_DIST);
    }
    function eio(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

    let animId;
    function tick(ts) {
      animId = requestAnimationFrame(tick);
      if (!t0) t0 = ts;
      const el = (ts - t0) / 1000;

      G.rotation.y += 0.0016;

      pulses.forEach(p => {
        const s = 1.0 + 0.55 * Math.sin(el * 1.8 + p.phase);
        p.mesh.scale.setScalar(s);
        p.mesh.material.opacity = 0.75 * (1 - ((s - 1) / 0.55) * 0.65);
      });

      vehicles.forEach(v => {
        v.t = (v.t + v.speed) % 1;
        v.mesh.position.copy(v.curve.getPointAt(v.t));
      });

      if (el < 5) {
        camera.position.copy(globalCamPos(el * 0.28));
        camera.lookAt(0, 0, 0);
      } else if (el < 8) {
        const prog = eio(Math.min((el - 5) / 3, 1));
        camera.position.lerpVectors(globalCamPos(5 * 0.28), CAM_INDIA, prog);
        camera.lookAt(0, 0, 0);
      } else if (el < 18) {
        const orb = (el - 8) * 0.20;
        camera.position.set(Math.sin(orb)*1.0+0.45, 0.38, Math.cos(orb)*0.85+1.55);
        camera.lookAt(0.15, 0.05, 0);
      } else {
        const prog = eio(Math.min((el - 18) / 3, 1));
        const ra   = (el - 18) * 0.28;
        camera.position.lerpVectors(CAM_INDIA, globalCamPos(ra), prog);
        camera.lookAt(0, 0, 0);
        if (el > 21) t0 = ts - 1000;
      }

      renderer.render(scene, camera);
    }
    animId = requestAnimationFrame(tick);

    /* ── RESIZE ── */
    const onResize = () => {
      const nW = container.clientWidth;
      const nH = container.clientHeight;
      renderer.setSize(nW, nH);
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* ── CLEANUP ── */
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
}