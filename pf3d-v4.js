(function () {
  if (window.__pf3dLoaded) return; window.__pf3dLoaded = true;
  // Three.js 0.160.0 is kept locally in assets/lib/three (MIT); same file as the "three" entry of the import map
  const THREE_URL = './assets/lib/three/build/three.module.js';
  let _T; const three = () => _T || (_T = import(THREE_URL));
  // GLTFLoader imports the bare specifier 'three': the import map in index.html points it to THREE_URL,
  // so the loader and this file share the same Three.js instance.
  const GLTF_URL = './assets/lib/three/examples/jsm/loaders/GLTFLoader.js';
  const CANOPY_GLB = 'assets/parachute-3d.glb';
  // The GLB is compressed with EXT_meshopt_compression (glTF-Transform): decoder kept locally (MIT, from three@0.160.0)
  const MESHOPT_URL = './assets/lib/meshopt_decoder.module.js';
  // Number of <pf-scene> on screen: their dialog covers the page, so the hero terrain stops rendering meanwhile
  let scenesOpen = 0;
  let _canopy = null;
  function loadCanopy() {
    return _canopy || (_canopy = (async () => {
      const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([import(GLTF_URL), import(MESHOPT_URL)]);
      const gl = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(CANOPY_GLB);
      // Materials are shared between parts in the file: one copy per mesh so a highlight stays on its part
      gl.scene.traverse(o => { if (o.isMesh) o.material = o.material.clone(); });
      return gl.scene;
    })().catch(e => { _canopy = null; throw e; }));
  }
  const theme = () => window.__pfTheme || { bg: '#f4f2ee', fg: '#222', accent: '#8a5cf6', dark: false };
  const cache = {};
  function toRGB(css) {
    if (cache[css]) return cache[css];
    const c = document.createElement('canvas'); c.width = c.height = 1;
    const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillStyle = css; x.fillRect(0, 0, 1, 1);
    const d = x.getImageData(0, 0, 1, 1).data; return (cache[css] = [d[0] / 255, d[1] / 255, d[2] / 255]);
  }
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
  function noise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fakeH(x, y) {
    let h = 0, amp = 1, f = 0.22, w = 0;
    for (let i = 0; i < 6; i++) { const n = 1 - Math.abs(noise(x * f + 11, y * f + 7) * 2 - 1); h += n * n * amp; w += amp; amp *= 0.5; f *= 2.05; }
    h /= w; const r = Math.sqrt(x * x + y * y);
    const valley = Math.exp(-((x - 0.8) ** 2) / 3.5) * 0.55;
    return Math.max(0.02, h * 2.6 * (1 - valley) - 0.25 + r * 0.04);
  }

  // Real elevation — Aérodrome de Chambéry-Aix-les-Bains (LFLB), Savoie Parachutisme
  const LFLB = { lat: 45.6381, lon: 5.8803 }, Z = 11, TS = 256, SPAN = 2.8, SIZE = 14;
  // kre.pin = centroid of the Kreaddis building in assets/kreaddis-osm.json (6 rue André Ampère, ZA des Césardes,
  // geocoded 45.88704, 6.07600). It used to point ~1.5 km west, which broke the region <-> neighbourhood alignment.
  const SITES = { lflb: { key: 'lflb', lat: 45.6381, lon: 5.8803, z: 11, water: 232.6 }, kre: { key: 'kre', lat: 45.878, lon: 6.108, z: 12, pin: [45.88721, 6.0757], water: 449.5, seed: [45.875, 6.163] } };
  function tileF(lat, lon, z = Z) { const n = 2 ** z, lr = lat * Math.PI / 180; return [(lon + 180) / 360 * n, (1 - Math.log(Math.tan(lr) + 1 / Math.cos(lr)) / Math.PI) / 2 * n]; }
  function ll2xz(lat, lon, S = SITES.lflb) { const [ax, ay] = tileF(S.lat, S.lon, S.z), [fx, fy] = tileF(lat, lon, S.z); return [(fx - ax) / SPAN * SIZE, (fy - ay) / SPAN * SIZE]; }
  const demPs = {};
  function loadDEM(S = SITES.lflb) {
    if (demPs[S.key]) return demPs[S.key];
    const Zs = S.z;
    const p = demPs[S.key] = (async () => {
      const [fx, fy] = tileF(S.lat, S.lon, Zs), tx = Math.floor(fx), ty = Math.floor(fy);
      const cv = document.createElement('canvas'); cv.width = cv.height = TS * 3;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      const jobs = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) jobs.push(new Promise((res, rej) => {
        const im = new Image(); im.crossOrigin = 'anonymous';
        im.onload = () => { cx.drawImage(im, (dx + 1) * TS, (dy + 1) * TS); res(); }; im.onerror = rej;
        // Terrarium tiles frozen locally (tools/fetch_terrain_tiles.py), originally from AWS Open Data
        im.src = `assets/terrain/${Zs}/${tx + dx}/${ty + dy}.png`;
      }));
      await Promise.all(jobs);
      const W = TS * 3, px = cx.getImageData(0, 0, W, W).data, el = new Float32Array(W * W);
      for (let i = 0; i < W * W; i++) el[i] = px[i * 4] * 256 + px[i * 4 + 1] + px[i * 4 + 2] / 256 - 32768;
      const sd = S.seed ? tileF(S.seed[0], S.seed[1], Zs) : null;
      return { W, el, cx: (fx - tx + 1) * TS, cy: (fy - ty + 1) * TS, water: S.water, seed: sd ? [Math.round((sd[0] - tx + 1) * TS), Math.round((sd[1] - ty + 1) * TS)] : null };
    })();
    p.catch(() => { delete demPs[S.key]; });
    return p;
  }
  function demAt(D, x, z) {
    const px = D.cx + x / SIZE * SPAN * TS, py = D.cy + z / SIZE * SPAN * TS;
    const x0 = Math.max(0, Math.min(D.W - 2, Math.floor(px))), y0 = Math.max(0, Math.min(D.W - 2, Math.floor(py)));
    const fx = Math.min(1, Math.max(0, px - x0)), fy = Math.min(1, Math.max(0, py - y0)), i = y0 * D.W + x0;
    return D.el[i] * (1 - fx) * (1 - fy) + D.el[i + 1] * fx * (1 - fy) + D.el[i + D.W] * (1 - fx) * fy + D.el[i + D.W + 1] * fx * fy;
  }
  const E2Y = e => Math.max(0, (e - 232) / 1000 * 0.85);
  // Region (kreregion) and neighbourhood maps (kreaddis, iut) share one scene so the tabs can zoom into each other.
  const GEO_LAYER = { kreregion: 'region', kreaddis: 'kreaddis', iut: 'iut' };
  const CITY_RAD = 21.5; // radius of a neighbourhood map, in its own units (RAD in buildCity)
  // A neighbourhood map unit is 50 m; in region units (Web Mercator tiles at zoom S.z) that is:
  const cityScale = (lat, S = SITES.kre) => 50 * SIZE * 2 ** S.z / (SPAN * 40075016.686 * Math.cos(lat * Math.PI / 180));

  function lakeMask(D) {
    if (D.mask) return D.mask;
    const W = D.W; let m = new Float32Array(W * W);
    const wl = D.water || 232.6;
    if (D.seed) {
      let si = D.seed[1] * W + D.seed[0], best = 1e9;
      for (let dy = -10; dy <= 10; dy++) for (let dx = -10; dx <= 10; dx++) { const j = (D.seed[1] + dy) * W + D.seed[0] + dx; if (D.el[j] < best) { best = D.el[j]; si = j; } }
      const wl2 = Math.min(wl + 6, best + 1.2); D.water = wl2;
      const st = [si];
      while (st.length) { const i = st.pop(); if (m[i] || D.el[i] >= wl2 || D.el[i] < best - 2.5) continue; m[i] = 1; const x = i % W, y = (i / W) | 0;
        if (x > 0) st.push(i - 1); if (x < W - 1) st.push(i + 1); if (y > 0) st.push(i - W); if (y < W - 1) st.push(i + W); }
    } else for (let i = 0; i < W * W; i++) m[i] = D.el[i] < wl ? 1 : 0;
    for (let pass = 0; pass < 3; pass++) {
      const o = new Float32Array(W * W);
      for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
        let s = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < W) { s += m[yy * W + xx]; n++; } }
        o[y * W + x] = s / n;
      }
      m = o;
    }
    const u8 = new Uint8Array(W * W); for (let i = 0; i < W * W; i++) u8[i] = Math.round(m[i] * 255);
    return (D.mask = u8);
  }
  function makeTerrain(T, D, seg) {
    const geo = new T.PlaneGeometry(SIZE, SIZE, seg, seg); geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    let tex, mp;
    if (D) {
      const mk = lakeMask(D);
      tex = new T.DataTexture(mk, D.W, D.W, T.RedFormat, T.UnsignedByteType);
      tex.magFilter = T.LinearFilter; tex.minFilter = T.LinearFilter; tex.needsUpdate = true;
      const k = SPAN * TS / SIZE; mp = new T.Vector4(D.cx / D.W, D.cy / D.W, k / D.W, 1);
    } else { tex = new T.DataTexture(new Uint8Array([0]), 1, 1, T.RedFormat, T.UnsignedByteType); tex.needsUpdate = true; mp = new T.Vector4(0, 0, 0, 0); }
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      if (D) {
        const px = Math.round(D.cx + x / SIZE * SPAN * TS), py = Math.round(D.cy + z / SIZE * SPAN * TS);
        const mv = D.mask[Math.max(0, Math.min(D.W - 1, py)) * D.W + Math.max(0, Math.min(D.W - 1, px))] / 255;
        pos.setY(i, mv > .35 ? E2Y((D.water || 232.6) - .6) : E2Y(demAt(D, x, z)));
      } else pos.setY(i, fakeH(x, z));
    }
    geo.computeVertexNormals();
    const mat = new T.ShaderMaterial({
      transparent: true,
      uniforms: { uBg: { value: new T.Color() }, uFg: { value: new T.Color() }, uAc: { value: new T.Color() }, uDark: { value: 0 }, uTime: { value: 0 }, uLand: { value: new T.Vector3() }, uMask: { value: tex }, uMP: { value: mp }, uOp: { value: 1 } },
      vertexShader: `varying float vH; varying vec3 vN; varying vec3 vW; varying float vD;
        void main(){ vH=position.y; vN=normal; vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vec4 mv=viewMatrix*w; vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uBg; uniform vec3 uFg; uniform vec3 uAc; uniform float uDark; uniform float uTime; uniform vec3 uLand; uniform sampler2D uMask; uniform vec4 uMP; uniform float uOp;
        varying float vH; varying vec3 vN; varying vec3 vW; varying float vD;
        void main(){
          float m = uMP.w > .5 ? texture2D(uMask, vec2(uMP.x + vW.x*uMP.z, uMP.y + vW.z*uMP.z)).r : 0.;
          float aa = max(fwidth(m), 1e-4);
          float water = smoothstep(.5-aa, .5+aa, m);
          float shore = (1.-min(abs(m-.5)/(aa*1.2),1.)) * uMP.w;
          float shade = clamp(dot(normalize(vN), normalize(vec3(-.5,.8,.35))),0.,1.);
          vec3 base = mix(uBg, uFg, mix(.03,.12,1.-shade) + uDark*.02);
          float h = vH*9.; float f = abs(fract(h)-.5)/fwidth(h); float line = 1.-min(f,1.);
          float hM = vH*1.8; float fM = abs(fract(hM)-.5)/fwidth(hM); float major = 1.-min(fM*.7,1.);
          vec3 col = mix(base, uFg, (line*.32 + major*.35) * (1.-water));
          vec3 wcol = mix(mix(uBg, uFg, .05), uAc, .1 + uDark*.05);
          col = mix(col, wcol, water);
          col = mix(col, uFg, shore*.55);
          float dl = length(vW.xz-uLand.xz);
          float pulse = smoothstep(.06,.0,abs(dl - fract(uTime*.25)*1.6)) * (1.-fract(uTime*.25));
          col = mix(col, uAc, pulse*.9 + smoothstep(.12,.0,dl)*.8);
          float edge = smoothstep(7.,4.2,max(abs(vW.x),abs(vW.z))*1.08);
          float fog = smoothstep(30.,9.,vD);
          gl_FragColor = vec4(col, edge*fog*uOp);
        }`
    });
    mat.extensions = { derivatives: true };
    const land = D ? new T.Vector3(0.06, E2Y(demAt(D, 0.06, 0)) + .01, 0) : new T.Vector3(.9, fakeH(.9, 1.2) + .01, 1.2);
    mat.uniforms.uLand.value.copy(land);
    return { mesh: new T.Mesh(geo, mat), mat, land };
  }
  function makePath(T, land, top, sx = 1) {
    const o = (x, y, z) => new T.Vector3(land.x + x * sx, y, land.z + z);
    return new T.CatmullRomCurve3([o(-3.4, top, -2.8), o(-2.1, top * .74, -1.7), o(-.6, top * .46, -.5), o(-.05, land.y + top * .16, .1), land.clone()]);
  }
  function themeTerrain(mat) {
    const t = theme();
    mat.uniforms.uBg.value.setRGB(...toRGB(t.bg)); mat.uniforms.uFg.value.setRGB(...toRGB(t.fg));
    mat.uniforms.uAc.value.setRGB(...toRGB(t.accent)); mat.uniforms.uDark.value = t.dark ? 1 : 0;
  }

  function makeJump(T, D, L, lay) {
    const top = D ? E2Y(4232) : 5.2, oy = D ? E2Y(1232) : 1.6;
    const gh = (x, z) => D ? E2Y(demAt(D, x, z)) : fakeH(x, z);
    const P = (dx, y, dz) => { const x = L.x + dx, z = L.z + dz; return new T.Vector3(x, Math.max(y, gh(x, z) + .06), z); };
    const exit = P(.78, top, -.95), open = P(.58, oy, -.72);
    const pts = [open];
    const cx = .46, cz = -.46, r = .2, a0 = Math.atan2(-.72 - cz, .58 - cx), turns = 1.35, N = 18;
    for (let i = 1; i <= N; i++) { const u = i / N, a = a0 - u * turns * Math.PI * 2; pts.push(P(cx + Math.cos(a) * r * (1 - u * .15), oy * (1 - u * .5), cz + Math.sin(a) * r * (1 - u * .15))); }
    pts.push(P(.34, oy * .4, -.42), P(.3, oy * .3, -.12), P(.29, oy * .21, .2), P(.2, oy * .13, .36), P(.04, oy * .08, .37), P(.01, oy * .035, .18), new T.Vector3(L.x, L.y + .01, L.z));
    const can = new T.CatmullRomCurve3(pts, false, 'centripetal');
    const ff = new T.LineCurve3(exit, open);
    const dir = new T.Vector3(L.x - exit.x, 0, L.z - exit.z).normalize();
    return { exit, open, ff, can, gh, top, oy, dir, y2alt: y => Math.max(0, Math.round(((y / .85) * 1000 - (D ? 3 : 0)) / 10) * 10) };
  }
  function makePlane(T, mats, fgMats) {
    const p = new T.Group(), fm = new T.MeshBasicMaterial(), am = new T.MeshBasicMaterial(); fgMats.push(fm); mats.push(am);
    const body = new T.Mesh(new T.CapsuleGeometry(.034, .3, 6, 14), fm); body.rotation.x = Math.PI / 2; p.add(body);
    const wing = new T.Mesh(new T.BoxGeometry(.66, .012, .085), fm); wing.position.set(0, .03, .04); p.add(wing);
    [-1, 1].forEach(s => { const tip = new T.Mesh(new T.BoxGeometry(.06, .013, .086), am); tip.position.set(s * .3, .031, .04); p.add(tip);
      const st = new T.Mesh(new T.BoxGeometry(.006, .006, .18), fm); st.position.set(s * .12, .005, .04); st.rotation.set(0, 0, s * .5); p.add(st); });
    const ht = new T.Mesh(new T.BoxGeometry(.24, .008, .055), fm); ht.position.set(0, .012, -.19); p.add(ht);
    const fin = new T.Mesh(new T.BoxGeometry(.008, .085, .07), am); fin.position.set(0, .05, -.2); p.add(fin);
    const prop = new T.Mesh(new T.CircleGeometry(.075, 24), new T.MeshBasicMaterial({ transparent: true, opacity: .25, side: T.DoubleSide })); fgMats.push(prop.material);
    prop.position.set(0, 0, .2); p.add(prop);
    p.scale.setScalar(1.35); p.userData.prop = prop; return p;
  }
  const TP = 3, TF = 5, TC = 24, TH = 3, TT = TP + TF + TC + TH;
  function jumpClock(t) {
    const k = t % TT;
    const pj = k < TP ? 0 : k < TP + TF ? (k - TP) / TF * FFR : k < TP + TF + TC ? FFR + (k - TP - TF) / TC * (1 - FFR) : 1;
    return { k, pj, pre: k < TP, pt: k - TP };
  }
  function jumpFrame(J, jo, t) {
    const c = jumpClock(t), st = jumpAt(J, c.pj);
    jo.dot.position.copy(st.pos); jo.halo.position.copy(st.pos); jo.halo.scale.setScalar(1 + Math.sin(t * 5) * .15);
    jo.dot.visible = jo.halo.visible = !c.pre;
    const pp = J.exit.clone().addScaledVector(J.dir, c.pt * .45); pp.y += .04;
    jo.plane.position.copy(pp); jo.plane.lookAt(pp.clone().add(J.dir)); jo.plane.visible = c.pt < 5;
    const sc = 1.35 * Math.min(1, Math.max(0, (5 - c.pt) / 1.2), Math.max(.001, (c.pt + TP) / .8)); jo.plane.scale.setScalar(Math.max(.001, sc));
    jo.plane.userData.prop.rotation.z += .8;
    const s = 1 + Math.sin(t * 2.4) * .12; jo.ring.scale.set(s, s, s);
    return { st: c.pre ? { pos: J.exit, phase: 'plane' } : st, c };
  }
  function jumpObjects(T, J, mats, fgMats = []) {
    const g = new T.Group();
    const pm = new T.LineDashedMaterial({ dashSize: .1, gapSize: .06 }); mats.push(pm);
    const ffl = new T.Line(new T.BufferGeometry().setFromPoints([J.exit, J.open]), pm); ffl.computeLineDistances(); g.add(ffl);
    const cm = new T.LineBasicMaterial(); mats.push(cm);
    g.add(new T.Line(new T.BufferGeometry().setFromPoints(J.can.getPoints(240)), cm));
    const drop = new T.LineBasicMaterial({ transparent: true, opacity: .3 }); mats.push(drop);
    g.add(new T.Line(new T.BufferGeometry().setFromPoints([J.exit, new T.Vector3(J.exit.x, J.gh(J.exit.x, J.exit.z), J.exit.z)]), drop));
    const dm = new T.MeshBasicMaterial(); mats.push(dm);
    const dot = new T.Mesh(new T.SphereGeometry(.085, 20, 20), dm); g.add(dot);
    const hm = new T.MeshBasicMaterial({ transparent: true, opacity: .22, depthWrite: false }); mats.push(hm);
    const halo = new T.Mesh(new T.SphereGeometry(.2, 20, 20), hm); g.add(halo);
    const ringM = new T.MeshBasicMaterial({ side: T.DoubleSide }); mats.push(ringM);
    const land = J.can.getPointAt(1);
    const ring = new T.Mesh(new T.RingGeometry(.18, .22, 48), ringM); ring.rotation.x = -Math.PI / 2; ring.position.copy(land).y += .01; g.add(ring);
    const om = new T.Mesh(new T.TorusGeometry(.12, .015, 8, 32), ringM); om.position.copy(J.open); om.rotation.x = Math.PI / 2; g.add(om);
    return { g, dot, halo, ring };
  }
  const FFR = .22; // part of the scroll spent in freefall
  function jumpAt(J, p) {
    if (p < FFR) { const u = p / FFR; return { pos: J.ff.getPoint(u * u * .35 + u * .65), phase: 'ff' }; }
    if (p < 1) return { pos: J.can.getPointAt((p - FFR) / (1 - FFR)), phase: 'canopy' };
    return { pos: J.can.getPointAt(1), phase: 'landed' };
  }

  /* ---------- <pf-terrain> : hero background ---------- */
  class PfTerrain extends HTMLElement {
    static get observedAttributes() { return ['mode', 'source', 'view']; }
    connectedCallback() {
      Object.assign(this.style, { display: 'block', width: '100%', height: '100%', position: this.style.position || 'relative' });
      this._onTheme = () => this.applyTheme(); window.addEventListener('pf-theme', this._onTheme);
      if (!this._started) { this._started = true; this.init(); }
    }
    disconnectedCallback() {
      window.removeEventListener('pf-theme', this._onTheme); window.removeEventListener('pointermove', this._onMove);
      cancelAnimationFrame(this._raf); this._ro && this._ro.disconnect();
      if (this._renderer) { this._renderer.dispose(); this._renderer.forceContextLoss(); }
      this._started = false; this._canvas && this._canvas.remove();
    }
    attributeChangedCallback(n) { if ((n === 'source' || n === 'view') && this._ready) { this.buildTerrain(); this._resize && this._resize(); } }
    get mode() { return this.getAttribute('mode') || 'A'; }
    get view() { const v = this.getAttribute('view'); return ['orig', 'mirror', 'top', 'chase'].includes(v) ? v : 'orig'; }
    applyTheme() {
      if (!this._mat) return; themeTerrain(this._mat);
      const ac = toRGB(theme().accent), fg = toRGB(theme().fg);
      const anim = document.documentElement.classList.contains('pf-recolor');
      const set = (mats, rgb) => (mats || []).forEach(m => {
        if (!anim) { m.color.setRGB(...rgb); return; }
        const a = m.color.toArray(), t0 = performance.now(); cancelAnimationFrame(m.userData.pfRc);
        const st = () => { const k = Math.min(1, (performance.now() - t0) / 500), e = 1 - Math.pow(1 - k, 3); m.color.setRGB(...a.map((v, i) => v + (rgb[i] - v) * e)); if (k < 1) m.userData.pfRc = requestAnimationFrame(st); };
        st();
      });
      set(this._accMats, ac); set(this._fgMats, fg);
    }
    status(s) { window.dispatchEvent(new CustomEvent('pf-terrain-status', { detail: s })); }
    async buildTerrain() {
      const T = this.T, real = this.getAttribute('source') === 'real';
      const tok = (this._tok = (this._tok || 0) + 1);
      let D = null;
      if (real) { this.status('loading'); try { D = await loadDEM(); } catch (e) { this.status('error'); } if (tok !== this._tok) return; }
      if (this._terr) { this.scene.remove(this._terr.mesh); this._terr.mesh.geometry.dispose(); }
      if (this._jo) this.scene.remove(this._jo.g);
      this._terr = makeTerrain(T, D, D ? 260 : 220); this._mat = this._terr.mat; this.scene.add(this._terr.mesh);
      this._accMats = []; this._fgMats = [];
      if (this.mode === 'B' && this.view !== 'orig') {
        this.J = makeJump(T, D, this._terr.land, this.view === 'mirror' ? 'mirror' : null);
        this._jo = jumpObjects(T, this.J, this._accMats, this._fgMats);
        this.mid = this.J.exit.clone().lerp(this.J.can.getPointAt(1), .5);
      } else {
        this.J = null; this.curve = makePath(T, this._terr.land, D ? 3.6 : 6.2, this.view === 'mirror' && this.mode === 'B' ? -1 : 1);
        const g = new T.Group(), pm = new T.LineDashedMaterial({ dashSize: .09, gapSize: .06 }); this._accMats.push(pm);
        const l = new T.Line(new T.BufferGeometry().setFromPoints(this.curve.getPoints(160)), pm); l.computeLineDistances(); g.add(l);
        const dm = new T.MeshBasicMaterial(); this._accMats.push(dm);
        const dot = new T.Mesh(new T.SphereGeometry(.06, 16, 16), dm); g.add(dot);
        const rm = new T.MeshBasicMaterial({ side: T.DoubleSide }); this._accMats.push(rm);
        const ring = new T.Mesh(new T.RingGeometry(.16, .19, 48), rm); ring.rotation.x = -Math.PI / 2; ring.position.copy(this._terr.land).y += .02; g.add(ring);
        this._jo = { g, dot, ring, halo: null };
      }
      this.scene.add(this._jo.g);
      this.applyTheme(); if (real) this.status(D ? 'ready' : 'error');
    }
    async init() {
      const T = this.T = await three();
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this._renderer = renderer; this._canvas = renderer.domElement;
      Object.assign(this._canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
      this.appendChild(this._canvas);
      const scene = this.scene = new T.Scene(), camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
      await this.buildTerrain(); this._ready = true;
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      this._onMove = e => { mouse.tx = (e.clientX / innerWidth - .5) * 2; mouse.ty = (e.clientY / innerHeight - .5) * 2; };
      window.addEventListener('pointermove', this._onMove, { passive: true });
      const resize = () => {
        const w = this.clientWidth || 1, h = this.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h;
        const v = this.view;
        if (this.mode === 'B' && (v === 'top' || v === 'chase')) { if (w < 700) camera.setViewOffset(w, h, 0, h * .18, w, h); else camera.setViewOffset(w, h, -w * .2, 0, w, h); }
        else camera.clearViewOffset();
        camera.updateProjectionMatrix();
      };
      this._resize = resize;
      this._ro = new ResizeObserver(resize); this._ro.observe(this); resize();
      const start = performance.now(); let sp = 0, lastAlt = '', tgt = new T.Vector3();
      const tick = () => {
        this._raf = requestAnimationFrame(tick);
        if (scenesOpen > 0) return; // hidden behind a full-screen <pf-scene> dialog
        const t = (performance.now() - start) / 1000; this._mat.uniforms.uTime.value = t;
        mouse.x += (mouse.tx - mouse.x) * .04; mouse.y += (mouse.ty - mouse.y) * .04;
        const max = Math.max(1, document.documentElement.scrollHeight - innerHeight), p = Math.min(1, scrollY / max); sp += (p - sp) * .08;
        const narrow = this.clientWidth < 700, jo = this._jo;
        const v = this.view;
        if (this.mode === 'B' && this.J) {
          const TF = 5, TC = 24, TH = 3, k = t % (TF + TC + TH), pj = k < TF ? (k / TF) * FFR : k < TF + TC ? FFR + (k - TF) / TC * (1 - FFR) : 1;
          const st = jumpAt(this.J, pj);
          jo.dot.position.copy(st.pos); jo.halo.position.copy(st.pos); jo.halo.scale.setScalar(1 + Math.sin(t * 5) * .15);
          if (v === 'mirror') {
            const alt = 11 - sp * 7.5, ang = 0.6 - sp * 1.4 - mouse.x * .12, r = (narrow ? 9 : 7) - sp * 2.5;
            camera.position.set(Math.sin(ang) * r, alt + mouse.y * .3, Math.cos(ang) * r); camera.lookAt(-0.3, 0.4, 0.5);
          } else if (v === 'top') {
            tgt.copy(this.mid).lerp(st.pos, .3);
            const ang = .4 + sp * .9 + mouse.x * .08, r = (narrow ? 2.6 : 2.2);
            camera.position.set(tgt.x + Math.sin(ang) * r, tgt.y + (narrow ? 11 : 9) - sp * 3 + mouse.y * .3, tgt.z + Math.cos(ang) * r);
            camera.lookAt(tgt);
          } else {
            const ang = .9 + sp * 1.6 + mouse.x * .15, r = 3.4 + (1 - sp) * 1.6;
            const want = new T.Vector3(st.pos.x + Math.sin(ang) * r, st.pos.y + 1.1 + (1 - sp) * .8 + mouse.y * .2, st.pos.z + Math.cos(ang) * r);
            camera.position.lerp(want, .08); tgt.lerp(st.pos, .1); camera.lookAt(tgt);
          }
          const alt = st.phase === 'landed' ? 0 : this.J.y2alt(st.pos.y), key = alt + st.phase;
          if (key !== lastAlt) { lastAlt = key; window.dispatchEvent(new CustomEvent('pf-alt', { detail: { alt, phase: st.phase } })); }
        } else if (this.mode === 'B') {
          const sx = v === 'mirror' ? -1 : 1;
          const alt = 11 - sp * 7.5, ang = -0.6 + sp * 1.4 + mouse.x * .12, r = (narrow ? 9 : 7) - sp * 2.5;
          camera.position.set(Math.sin(ang) * r * sx, alt + mouse.y * .3, Math.cos(ang) * r); camera.lookAt(0.3 * sx, 0.4, 0.5);
          jo.dot.position.copy(this.curve.getPointAt(Math.min(.999, sp * .9 + ((t * .08) % 1) * .1)));
          const al = Math.round((1 - sp) * 400) * 10, ph = al > 1000 ? 'ff' : al > 0 ? 'canopy' : 'landed', key = al + ph;
          if (key !== lastAlt) { lastAlt = key; window.dispatchEvent(new CustomEvent('pf-alt', { detail: { alt: al, phase: ph } })); }
        } else {
          const ang = 0.55 + t * .03 + mouse.x * .18, r = narrow ? 12.5 : 10.5;
          camera.position.set(Math.sin(ang) * r, 5.4 - mouse.y * .5, Math.cos(ang) * r); camera.lookAt(0, 0.9, 0);
          if (this.curve) jo.dot.position.copy(this.curve.getPointAt((t * .11) % 1));
        }
        const s = 1 + Math.sin(t * 2.4) * .12; jo.ring.scale.set(s, s, s);
        renderer.render(scene, camera);
      };
      tick();
    }
  }
  customElements.define('pf-terrain', PfTerrain);

  /* ---------- <pf-scene> : passions viewer ---------- */
  const LBL = {
    fr: { exit: 'Sortie · 4 000 m', open: 'Ouverture · ~1 000 m', ff: 'Chute libre', canopy: 'Sous voile', landed: 'Posé', plane: 'Avion · largage', kreaddis: 'Kreaddis · Chavanod', iut: 'IUT d’Annecy', annecy: 'Annecy', lac: 'Lac d’Annecy', semnoz: 'Semnoz', land: 'Zone de posé · LFLB', lake: 'Lac du Bourget', aix: 'Aix-les-Bains', chy: 'Chambéry', chat: 'Mont du Chat', voilure: 'Voilure', suspentes: 'Suspentes', commandes: 'Commandes de frein', slider: 'Slider', elevateurs: 'Élévateurs', sellette: 'Sellette-conteneur', extracteur: 'Extracteur', caissons: 'Caissons · entrées d’air', stabilisateurs: 'Stabilisateurs', moteur: 'Moteur', reservoir: 'Réservoir', selle: 'Selle', roues: 'Roues 17″', suspensions: 'Suspensions', chassis: 'Cadre', echappement: 'Échappement', cardio: 'Cardio', racks: 'Racks', halteres: 'Poids libres', machines: 'Machines guidées', etirement: 'Étirements', planche: 'Planche', fixations: 'Fixations', piste: 'Balisage', trace: 'Trace' },
    en: { exit: 'Exit · 4,000 m', open: 'Deployment · ~1,000 m', ff: 'Freefall', canopy: 'Under canopy', landed: 'Landed', plane: 'Aircraft · jump run', kreaddis: 'Kreaddis · Chavanod', iut: 'IUT Annecy', annecy: 'Annecy', lac: 'Lake Annecy', semnoz: 'Semnoz', land: 'Landing area · LFLB', lake: 'Lake Bourget', aix: 'Aix-les-Bains', chy: 'Chambéry', chat: 'Mont du Chat', voilure: 'Canopy', suspentes: 'Lines', commandes: 'Brake lines', slider: 'Slider', elevateurs: 'Risers', sellette: 'Harness-container', extracteur: 'Pilot chute', caissons: 'Cells · air inlets', stabilisateurs: 'Stabilizers', moteur: 'Engine', reservoir: 'Tank', selle: 'Seat', roues: '17″ wheels', suspensions: 'Suspension', chassis: 'Frame', echappement: 'Exhaust', cardio: 'Cardio', racks: 'Racks', halteres: 'Free weights', machines: 'Machines', etirement: 'Stretching', planche: 'Board', fixations: 'Bindings', piste: 'Piste markers', trace: 'Track' }
  };
  class PfScene extends HTMLElement {
    static get observedAttributes() { return ['mode', 'highlight', 'lang']; }
    connectedCallback() {
      Object.assign(this.style, { display: 'block', width: '100%', height: '100%', position: 'relative', touchAction: 'none' });
      scenesOpen++;
      this._onTheme = () => this.recolor(); window.addEventListener('pf-theme', this._onTheme);
      if (!this._started) { this._started = true; this.init(); }
    }
    disconnectedCallback() {
      scenesOpen = Math.max(0, scenesOpen - 1);
      window.removeEventListener('pf-theme', this._onTheme); cancelAnimationFrame(this._raf); this._ro && this._ro.disconnect();
      if (this.R) { this.R.dispose(); this.R.forceContextLoss(); }
      this._started = false; this._ready = false; this.innerHTML = '';
    }
    attributeChangedCallback(n, oldV, newV) {
      if (!this._ready) return;
      if (n === 'highlight') return this.recolor();
      // Region <-> neighbourhood: animate inside the existing scene instead of rebuilding it
      if (n === 'mode' && this.geo && GEO_LAYER[newV]) return this.geoGo(GEO_LAYER[newV]);
      this.build();
    }
    get hl() { return this.getAttribute('highlight') || ''; }
    colorFor(kind) {
      const t = theme(), bg = toRGB(t.bg), fg = toRGB(t.fg);
      switch (kind) {
        case 'dark': return [.11, .11, .12];
        case 'light': return mix(bg, fg, .1);
        case 'ink': return mix(bg, fg, .62);
        case 'brand': return [.16, .38, .86];
        case 'helmet': return [.78, .88, .16];
        case 'snow': return [.93, .95, .97];
        case 'tree': return [.16, .26, .21];
        case 'piste': return [.15, .35, .85];
        case 'accent': return toRGB(t.accent);
        case 'vc': return [1, 1, 1];
        case 'linec': return [.86, .86, .82];
        case 'brk': return [.93, .52, .2];
        case 'navy': return [.1, .14, .36];
        case 'yellow': return [.95, .74, .12];
        case 'teal': return [.08, .62, .68];
        case 'skin': return [.86, .66, .55];
        case 'web': return [.16, .17, .2];
        case 'board': return [.08, .09, .12];
        case 'groove': return [.72, .78, .88];
        case 'jacketk': return [.86, .32, .14];
        case 'ground': return t.dark ? mix(bg, fg, .06) : mix(bg, fg, .07);
        case 'road': return t.dark ? mix(bg, fg, .2) : mix(bg, [1, 1, 1], .85);
        case 'roadM': return t.dark ? mix(bg, fg, .34) : [1, 1, 1];
        case 'casing': return mix(bg, fg, t.dark ? .1 : .2);
        case 'casingM': return mix(bg, fg, t.dark ? .16 : .32);
        case 'bld': return mix(bg, fg, t.dark ? .2 : .1);
        case 'wood': return mix(mix(bg, fg, .06), [.32, .52, .36], t.dark ? .16 : .26);
        case 'green': return mix(mix(bg, fg, .05), [.42, .62, .42], t.dark ? .12 : .18);
        case 'zone': return mix(bg, fg, t.dark ? .09 : .11);
        case 'water': return mix(bg, [.3, .52, .8], t.dark ? .3 : .38);
        case 'cGround': return bg;
        case 'cGreen': return mix(bg, fg, .035);
        case 'cWood': return mix(bg, fg, .06);
        case 'cWater': return mix(mix(bg, fg, .05), toRGB(t.accent), .14 + (t.dark ? .06 : 0));
        case 'cWaterL': return mix(bg, toRGB(t.accent), .35);
        case 'cRoad': return mix(bg, fg, t.dark ? .2 : .16);
        case 'cRoadM': return mix(bg, fg, t.dark ? .42 : .36);
        case 'cBld': return mix(bg, fg, t.dark ? .1 : .06);
        case 'cEdge': return mix(bg, fg, t.dark ? .55 : .5);
        default: return mix(bg, fg, .28);
      }
    }
    mat(key, kind, line) {
      const T = this.T;
      const m = line ? new T.LineBasicMaterial({ transparent: true, opacity: .95 }) : this._phys ? new T.MeshPhysicalMaterial({ roughness: .62, metalness: 0, sheen: 1, sheenRoughness: .5, sheenColor: new T.Color(1, 1, 1) }) : new T.MeshStandardMaterial({ roughness: .7, metalness: .08 });
      m.userData = { key, kind, line }; this.mats.push(m); return m;
    }
    add(parent, geo, key, kind, p, r, edges = true) {
      const T = this.T, m = new T.Mesh(geo, this.mat(key, kind));
      if (p) m.position.set(...p); if (r) m.rotation.set(...r);
      if (edges) m.add(new T.LineSegments(new T.EdgesGeometry(geo, 28), this.lineMat));
      parent.add(m); return m;
    }
    tube(parent, a, b, r, key, kind) {
      const T = this.T, A = new T.Vector3(...a), B = new T.Vector3(...b), d = B.clone().sub(A);
      const m = new T.Mesh(new T.CylinderGeometry(r, r, d.length(), 10), this.mat(key, kind));
      m.position.copy(A).add(B).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
      parent.add(m); return m;
    }
    recolor() {
      if (!this.mats) return;
      const t = theme(), hl = this.hl, ac = toRGB(t.accent), fg = toRGB(t.fg);
      this.lineMat.color.setRGB(...fg); this.lineMat.opacity = t.dark ? .22 : .28;
      this.mats.forEach(m => {
        const on = hl && m.userData.key === hl, c = on ? ac : this.colorFor(m.userData.kind);
        if (m.userData.kind === 'none') return;
        if (m.isMeshPhysicalMaterial || this._srgb) m.color.setRGB(c[0], c[1], c[2], this.T.SRGBColorSpace); else m.color.setRGB(...c);
        if (!m.userData.line && m.emissive) m.emissive.setRGB(...(on ? ac.map(v => v * .35) : [0, 0, 0]));
      });
      if (this.terr) themeTerrain(this.terr.mat);
      const cs = this._srgb ? this.T.SRGBColorSpace : undefined;
      if (this.accentMats) this.accentMats.forEach(m => m.color.setRGB(ac[0], ac[1], ac[2], cs));
      if (this.fgMats) this.fgMats.forEach(m => m.color.setRGB(fg[0], fg[1], fg[2], cs));
      (this.labels || []).forEach(l => {
        if (l.fixed) return; const on = hl && l.key === hl;
        l.el.style.borderColor = on ? 'var(--accent)' : 'var(--line)'; l.el.style.color = on ? 'var(--accent)' : 'var(--fg)';
      });
      // Highlight = plain accent colour: the texture is dropped while selected, otherwise it tints the accent
      // (yellow toggles x violet = red) or a glow alone washes it out
      if (this.glbParts) this.glbParts.forEach(p => {
        const on = hl && p.keys.includes(hl), cs = this.T.SRGBColorSpace, m = p.mat, map = on ? null : p.map;
        if (m.map !== map) { m.map = map; m.needsUpdate = true; }
        if (on) { m.color.setRGB(ac[0], ac[1], ac[2], cs); m.emissive.setRGB(ac[0] * .25, ac[1] * .25, ac[2] * .25, cs); }
        else { m.color.copy(p.base); m.emissive.setRGB(0, 0, 0); }
      });
      // Only move the camera when the selected part changes, not on a theme change
      if (this.focus && hl !== this._lastHl) {
        this._lastHl = hl; const f = this.focus[hl] || this.focus[''];
        this._goto = { tgt: new this.T.Vector3(...f[0]), r: f[1] };
      }
    }
    label(key, p, text) {
      const el = document.createElement('div');
      Object.assign(el.style, { position: 'absolute', left: 0, top: 0, font: '500 11px/1.2 var(--fm, monospace)', letterSpacing: '.04em', padding: '4px 7px', whiteSpace: 'nowrap', background: 'color-mix(in oklch, var(--bg) 86%, transparent)', border: '1px solid var(--line)', color: 'var(--fg)', borderRadius: '2px', pointerEvents: 'none', willChange: 'transform' });
      el.textContent = text || (LBL[this.lang] || LBL.fr)[key] || key;
      this.lblRoot.appendChild(el);
      const l = { key, p: p.isVector3 ? p : new this.T.Vector3(...p), el }; this.labels.push(l); return l;
    }
    get lang() { return this.getAttribute('lang') === 'en' ? 'en' : 'fr'; }
    async init() {
      const T = this.T = await three();
      const R = this.R = new T.WebGLRenderer({ antialias: true, alpha: true });
      R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      Object.assign(R.domElement.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', cursor: 'grab' });
      this.appendChild(R.domElement);
      this.lblRoot = document.createElement('div'); Object.assign(this.lblRoot.style, { position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' });
      this.appendChild(this.lblRoot);
      this.cam = new T.PerspectiveCamera(36, 1, 0.05, 200);
      this.orb = { th: .8, ph: 1.1, r: 8, tgt: new T.Vector3(), drag: null, idle: 0 };
      const el = R.domElement, pts = new Map();
      el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); el.style.cursor = 'grabbing'; this.orb.idle = 0; this._goto = null; });
      el.addEventListener('pointermove', e => {
        if (!pts.has(e.pointerId)) return; const [px, py] = pts.get(e.pointerId);
        if (this.geo && this.geo.tr) { pts.set(e.pointerId, [e.clientX, e.clientY]); return; } // camera driven by the transition
        if (pts.size === 1) { this.orb.th -= (e.clientX - px) * .006; this.orb.ph = Math.min(this.phMax || 1.5, Math.max(.2, this.orb.ph - (e.clientY - py) * .005)); }
        else { const o = [...pts.entries()].find(([k]) => k !== e.pointerId)[1]; const d0 = Math.hypot(px - o[0], py - o[1]), d1 = Math.hypot(e.clientX - o[0], e.clientY - o[1]), r0 = this.orb.r, f = d0 / (d1 || 1);
          this.orb.r = Math.min(this.rMax, Math.max(this.rMin, r0 * f)); if (this.geo) this.geoOverscroll((f - 1) * 800, r0); }
        pts.set(e.pointerId, [e.clientX, e.clientY]); this.orb.idle = 0;
      });
      const up = e => { pts.delete(e.pointerId); el.style.cursor = 'grab'; };
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
      el.addEventListener('wheel', e => {
        e.preventDefault(); if (this.geo && this.geo.tr) return;
        const r0 = this.orb.r; this.orb.r = Math.min(this.rMax, Math.max(this.rMin, r0 * (1 + e.deltaY * .001))); this.orb.idle = 0; this._goto = null;
        if (this.geo) this.geoOverscroll(e.deltaY, r0);
      }, { passive: false });
      const resize = () => { const w = this.clientWidth || 1, h = this.clientHeight || 1; R.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); this.W = w; this.H = h; };
      this._ro = new ResizeObserver(resize); this._ro.observe(this); resize();
      this._ready = true; await this.build();
      const start = performance.now(), v = new T.Vector3();
      const tick = () => { this._raf = requestAnimationFrame(tick); frame(); };
      const frame = this._frame = () => {
        const t = (performance.now() - start) / 1000, o = this.orb;
        o.idle += 1 / 60; if (o.idle > 2.5) o.th += .0016;
        if (this.update) this.update(t);
        const c = this.cam; c.position.set(o.tgt.x + o.r * Math.sin(o.ph) * Math.sin(o.th), o.tgt.y + o.r * Math.cos(o.ph), o.tgt.z + o.r * Math.sin(o.ph) * Math.cos(o.th));
        c.lookAt(o.tgt);
        if (this.scene) R.render(this.scene, c);
        // Small screens: compact labels, and labels that would overlap an already placed one are hidden
        // (highlighted / live labels placed first)
        const small = this.W < 560, placed = [];
        const order = small ? (this.labels || []).slice().sort((a, b) => ((b.fixed || b.key === this.hl) ? 1 : 0) - ((a.fixed || a.key === this.hl) ? 1 : 0)) : (this.labels || []);
        order.forEach(l => {
          if (small !== !!l.compact) { l.compact = small; Object.assign(l.el.style, small ? { fontSize: '10px', padding: '3px 5px', letterSpacing: '.02em' } : { fontSize: '', padding: '4px 7px', letterSpacing: '.04em' }); l.w = 0; }
          v.copy(l.p).project(c); let vis = !l.off && v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
          const x = (v.x * .5 + .5) * this.W, y = (-v.y * .5 + .5) * this.H;
          if (vis && small) {
            if (!l.w) { l.el.style.display = 'block'; l.w = l.el.offsetWidth; l.h = l.el.offsetHeight; }
            const bx = x - l.w / 2, by = y - l.h * 1.3, pad = 3;
            if (placed.some(p => bx < p[2] + pad && bx + l.w + pad > p[0] && by < p[3] + pad && by + l.h + pad > p[1])) vis = false;
            else placed.push([bx, by, bx + l.w, by + l.h]);
          }
          l.el.style.display = vis ? 'block' : 'none';
          if (vis) l.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -130%)`;
        });
      };
      tick();
    }
    async build() {
      const T = this.T, mode = this.getAttribute('mode') || 'canopy', tok = (this._tok = (this._tok || 0) + 1);
      this.mats = []; this.accentMats = []; this.fgMats = []; this.labels = []; this.lblRoot.innerHTML = ''; this.update = null; this.terr = null;
      this.glbParts = null; this.focus = null; this._goto = null; this.geo = null; this._geoQueue = null;
      if (this.scene) this.scene.traverse(o => { o.geometry && o.geometry.dispose(); });
      const scene = this._scene = new T.Scene(); this._phys = false; this._srgb = false; this._sky = null;
      this.cam.far = 200; this.cam.updateProjectionMatrix();
      this.R.toneMapping = T.NoToneMapping; this.R.toneMappingExposure = 1; this.R.shadowMap.enabled = false; this.R.shadowMap.autoUpdate = true;
      // The skydiving dialog opens on the map tab: fetch the canopy model meanwhile, ready for the second tab
      if (mode === 'map') loadCanopy().catch(() => {});
      const hemi = this._hemi = new T.HemisphereLight(0xffffff, 0x9a948c, 1.5); scene.add(hemi);
      const sun = this._sun = new T.DirectionalLight(0xffffff, 1.9); sun.position.set(4, 9, 6); scene.add(sun);
      const fill = this._fill = new T.DirectionalLight(0xffffff, .5); fill.position.set(-6, 3, -4); scene.add(fill);
      this.lineMat = new T.LineBasicMaterial({ transparent: true, opacity: .28 });
      if (this.R) { this.R.toneMapping = T.NoToneMapping; this.R.shadowMap.enabled = false; }
      const g = new T.Group(); scene.add(g); this.rMin = 2; this.rMax = 40; this.phMax = 1.5;
      if (mode === 'map') { await this.buildMap(g); if (tok !== this._tok) return; }
      else if (mode === 'moto') this.buildMoto(g);
      else if (mode === 'gym') this.buildGym(g);
      else if (mode === 'snow') this.buildSnow(g);
      else if (GEO_LAYER[mode]) { await this.buildGeo(g, mode, tok); if (tok !== this._tok) return; }
      else { this.scene = null; this.R.clear(); await this.buildCanopyGlb(g); if (tok !== this._tok) return; }
      this.scene = scene; this.recolor();
      if (this._frame) this._frame();
    }
    view(tgt, r, ph, th, rMin, rMax) {
      // Portrait phone screens: step back so the whole object fits the narrow width
      const W = this.clientWidth, H = this.clientHeight, k = W && W < 560 && W / H < .9 ? Math.min(1.45, .9 / (W / H) * .95) : 1;
      const o = this.orb; o.tgt.set(...tgt); o.r = Math.min(r * k, rMax * 1.2); o.ph = ph; o.th = th; this.rMin = rMin; this.rMax = k > 1 ? rMax * 1.2 : rMax;
    }

    async buildMap(g) {
      const T = this.T; let D = null; try { D = await loadDEM(); } catch (e) {}
      const terr = this.terr = makeTerrain(T, D, 300); g.add(terr.mesh);
      const J = makeJump(T, D, terr.land); this.fgMats = []; const jo = jumpObjects(T, J, this.accentMats, this.fgMats); g.add(jo.g);
      this.label('exit', J.exit.clone().add(new T.Vector3(0, .12, 0))); this.label('open', J.open.clone().add(new T.Vector3(0, .32, 0))); this.label('land', terr.land.clone().add(new T.Vector3(0, .15, 0)));
      if (D) {
        const pl = (k, lat, lon, dy = .12) => { const [x, z] = ll2xz(lat, lon); this.label(k, [x, E2Y(demAt(D, x, z)) + dy, z]); };
        pl('lake', 45.735, 5.862); pl('aix', 45.6885, 5.9153); pl('chy', 45.5646, 5.9178); pl('chat', 45.6466, 5.8236);
      }
      const live = this.label('live', jo.dot.position, ' ');
      Object.assign(live.el.style, { background: 'var(--accent)', color: 'var(--on-accent)', borderColor: 'var(--accent)' }); live.fixed = true;
      const TF = 5, TC = 24, TH = 3, TT = TF + TC + TH, Lb = LBL[this.lang] || LBL.fr;
      let lastTxt = '';
      this.update = t => {
        terr.mat.uniforms.uTime.value = t;
        const k = t % TT, p = k < TF ? (k / TF) * FFR : k < TF + TC ? FFR + (k - TF) / TC * (1 - FFR) : 1;
        const st = jumpAt(J, p); jo.dot.position.copy(st.pos); jo.halo.position.copy(st.pos); jo.halo.scale.setScalar(1 + Math.sin(t * 5) * .15);
        const s = 1 + Math.sin(t * 2.4) * .12; jo.ring.scale.set(s, s, s);
        const alt = J.y2alt(st.pos.y), phase = Lb[st.phase];
        const txt = (st.phase === 'landed' ? '' : alt.toLocaleString(this.lang === 'en' ? 'en-US' : 'fr-FR') + ' m · ') + phase;
        if (txt !== lastTxt) { live.el.textContent = txt; lastTxt = txt; }
      };
      this.view([.2, 1.1, -.5], 12.5, 1.02, .55, 3, 24);
    }

    // Detailed canopy + rig model (assets/parachute-3d.glb). Falls back to the procedural buildCanopy if it cannot load.
    async buildCanopyGlb(g) {
      const T = this.T;
      const wait = document.createElement('div');
      Object.assign(wait.style, { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', font: '500 12px/1.4 var(--fm, monospace)', letterSpacing: '.04em', color: 'var(--muted)' });
      wait.textContent = this.lang === 'en' ? 'Loading 3D model...' : 'Chargement du modèle 3D...';
      this.lblRoot.appendChild(wait);
      let root;
      try { root = await loadCanopy(); } catch (e) {
        wait.remove(); console.warn('pf-scene: parachute GLB unavailable, procedural fallback', e);
        return this.buildCanopy(g);
      }
      wait.remove();
      // Node names in the GLB are "family / material" (canopy, lines, risers, slider, rig, pilot)
      const keysOf = n => /^pilot/.test(n) ? ['extracteur'] : /^slider/.test(n) ? ['slider'] : /^lines/.test(n) ? ['suspentes']
        : /Steering/.test(n) ? ['commandes'] : /^risers/.test(n) || /^canopy.*Brushed/.test(n) ? ['elevateurs']
        : /^rig/.test(n) ? ['sellette'] : ['voilure', 'caissons', 'stabilisateurs'];
      g.add(root); this.glbParts = [];
      root.traverse(o => {
        if (!o.isMesh) return;
        o.frustumCulled = false; if (o.material.normalMap) o.material.normalScale.set(.2, .2);
        const m = o.material, u = m.userData; if (!u.base) { u.base = m.color.clone(); u.map = m.map; }
        this.glbParts.push({ mat: m, base: u.base, map: u.map, keys: keysOf(o.userData.name || o.name) });
      });
      // Positions in metres, measured from the model bounds (leading edge towards -z, pilot chute towards +z)
      const L = { voilure: [-1.2, 4.85, .3], caissons: [.9, 3.85, -1.0], stabilisateurs: [3.0, 3.3, .3], suspentes: [-1.5, 2.4, .3], commandes: [.42, .86, -.12],
        slider: [.42, 1.29, -.04], elevateurs: [-.42, 1.0, -.05], sellette: [.4, .38, .12], extracteur: [.17, 4.85, 2.35] };
      Object.entries(L).forEach(([k, p]) => this.label(k, p));
      this.focus = { '': [[0, 2.4, .3], 11], voilure: [[0, 4, .3], 8], caissons: [[0, 3.8, -.6], 5.5], stabilisateurs: [[2.6, 3.5, .3], 4.5], suspentes: [[0, 2.6, .3], 9],
        commandes: [[0, .88, -.1], 1.4], slider: [[0, 1.25, 0], 1.5], elevateurs: [[0, .95, 0], 1.6], sellette: [[0, .4, 0], 1.6], extracteur: [[.1, 4.6, 1.6], 3.5] };
      this._lastHl = this.hl;
      // 330k triangles: the shadow pass costs as much as the image itself. The model only sways slowly,
      // so its shadow map is refreshed every 4th frame (restored to auto in build()).
      const R = this.R; let frameNo = 0; R.shadowMap.autoUpdate = false; R.shadowMap.needsUpdate = true;
      this.update = t => {
        if (++frameNo % 4 === 0) R.shadowMap.needsUpdate = true;
        g.rotation.z = Math.sin(t * .55) * .02; g.position.y = Math.sin(t * .8) * .04;
        const go = this._goto, o = this.orb;
        if (go) { o.tgt.lerp(go.tgt, .08); o.r += (go.r - o.r) * .08; if (o.tgt.distanceTo(go.tgt) < .005 && Math.abs(o.r - go.r) < .01) this._goto = null; }
      };
      this.realism(g, { noFabric: true }); this.phMax = 2.3;
      this.view([0, 2.4, .3], 11, 1.35, 2.48, .6, 24);
    }

    buildCanopy(g) {
      const T = this.T, NC = 9, R = 4.4, HS = 2.25, C = 1.95, H = 3.7, SEG = 14, CS = 44; this._phys = true;
      const PAL = [[.1, .14, .36], [.1, .14, .36], [.93, .93, .9], [.95, .74, .12], [.95, .74, .12], [.95, .74, .12], [.93, .93, .9], [.1, .14, .36], [.1, .14, .36]];
      const th = c => 5 * .17 * (0.2969 * Math.sqrt(c) - 0.126 * c - 0.3516 * c * c + 0.2843 * c ** 3 - 0.1036 * c ** 4);
      const cam = c => .045 * Math.sin(Math.PI * Math.pow(c, .8));
      const P = (x, c, side, f) => {
        const a = x / R, nx = Math.sin(a), ny = Math.cos(a), z = (.38 - c) * C;
        const bul = Math.sin(Math.PI * f);
        let off = side > 0 ? (cam(c) + th(c) * .82) * C + bul * .045 * C * Math.sin(Math.PI * Math.min(1, c * 1.15 + .05))
                           : (cam(c) - th(c) * .22) * C - bul * .018 * C * Math.sin(Math.PI * c);
        const te = c > .9 ? Math.sin(f * Math.PI * 3) * .02 * (c - .9) / .1 : 0;
        off += (noise(x * 7 + side * 3, c * 14) - .5) * .014 * bul + (noise(x * 19, c * 31) - .5) * .004;
        return [R * nx + nx * off, R * ny - R + H + ny * off + te, z];
      };
      const can = new T.Group(); g.add(can);
      const surf = (side, c0) => {
        const pos = [], col = [], idx = [], uv = [];
        for (let k = 0; k < NC; k++) {
          const x0 = -HS + k * 2 * HS / NC, x1 = x0 + 2 * HS / NC, base = pos.length / 3, cl = PAL[k];
          for (let j = 0; j <= CS; j++) for (let i = 0; i <= SEG; i++) {
            const f = i / SEG, c = c0 + (1 - c0) * (1 - Math.cos(j / CS * Math.PI)) / 2;
            pos.push(...P(x0 + (x1 - x0) * f, c, side, f)); uv.push((x0 + (x1 - x0) * f + HS) * 5, c * C * 5);
            const sh = side > 0 ? 1 : .78, lin = v => Math.pow(v * sh, 2.2); col.push(lin(cl[0]), lin(cl[1]), lin(cl[2]));
          }
          for (let j = 0; j < CS; j++) for (let i = 0; i < SEG; i++) {
            const q = base + j * (SEG + 1) + i;
            idx.push(q, q + 1, q + SEG + 1, q + 1, q + SEG + 2, q + SEG + 1);
          }
        }
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new T.Float32BufferAttribute(col, 3)); geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
        const m = this.mat('voilure', 'vc'); m.vertexColors = true; m.side = T.DoubleSide; m.roughness = .55;
        can.add(new T.Mesh(geo, m));
      };
      surf(1, 0); surf(-1, .06);
      const ribPos = [];
      for (let k = 0; k <= NC; k++) {
        const x = -HS + k * 2 * HS / NC, pts = [];
        for (let j = 0; j <= 24; j++) { const c = .06 + .94 * j / 24; pts.push(P(x, c, 1, 0), P(x, c, -1, 0)); }
        const pos = [], idx = []; pts.forEach(p => pos.push(...p));
        for (let j = 0; j < 24; j++) { const q = j * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
        const m = this.mat('caissons', 'light'); m.side = T.DoubleSide; can.add(new T.Mesh(geo, m));
        ribPos.push(x);
      }
      [-1, 1].forEach(sd => {
        const x = sd * HS, a = P(x, .12, -1, 0), b = P(x, .78, -1, 0), tip = [a[0] * 1.01 + sd * .02, a[1] - .42, (a[2] + b[2]) / 2 + .1];
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute([...a, ...b, ...tip], 3)); geo.computeVertexNormals();
        const m = this.mat('stabilisateurs', 'navy'); m.side = T.DoubleSide; can.add(new T.Mesh(geo, m));
      });
      const rY = -.25, V = (p) => new T.Vector3(...p);
      const risers = { FL: V([-.21, rY, .07]), RL: V([-.21, rY, -.07]), FR: V([.21, rY, .07]), RR: V([.21, rY, -.07]) };
      const rows = [[.06, 'F'], [.3, 'F'], [.55, 'R'], [.8, 'R']];
      const lineR = .0055;
      rows.forEach(([c, fr]) => {
        for (let k = 0; k < NC; k += 2) {
          const ks = [k, Math.min(NC, k + 1)];
          const att = ks.map(kk => V(P(ribPos[kk], c, -1, 0)));
          const mid = att[0].clone().add(att[1]).multiplyScalar(.5);
          if (att[0].x < 0 && att[1].x > 0) { att.forEach(at => this.tube(g, at.toArray(), risers[fr + (at.x < 0 ? 'L' : 'R')].toArray(), lineR, 'suspentes', 'linec')); continue; }
          const side = mid.x < 0 ? 'L' : 'R', rp = risers[fr + side];
          const casc = mid.clone().lerp(rp, .42);
          att.forEach(at => this.tube(g, at.toArray(), casc.toArray(), lineR, 'suspentes', 'linec'));
          this.tube(g, casc.toArray(), rp.toArray(), lineR * 1.4, 'suspentes', 'linec');
        }
        if (NC % 2 === 0) return;
      });
      const toggles = { L: V([-.27, rY - .2, -.13]), R: V([.27, rY - .2, -.13]) };
      ['L', 'R'].forEach(sd => {
        const ks = sd === 'L' ? [0, 1, 2, 3] : [NC, NC - 1, NC - 2, NC - 3];
        const att = ks.map(kk => V(P(ribPos[kk], 1, 1, 0)));
        const bc = att.reduce((acc, v) => acc.add(v), new T.Vector3()).multiplyScalar(1 / att.length).lerp(toggles[sd], .5);
        att.forEach(at => this.tube(g, at.toArray(), bc.toArray(), lineR, 'commandes', 'brk'));
        this.tube(g, bc.toArray(), toggles[sd].toArray(), lineR * 1.5, 'commandes', 'brk');
        this.add(g, new T.BoxGeometry(.035, .09, .025), 'commandes', 'brk', toggles[sd].toArray(), null, false);
      });
      const sl = new T.PlaneGeometry(.62, .5, 8, 8); sl.rotateX(-Math.PI / 2);
      const sp = sl.attributes.position; for (let i = 0; i < sp.count; i++) { const x = sp.getX(i), z = sp.getZ(i); sp.setY(i, -.06 * (1 - (x / .31) ** 2) * (1 - (z / .25) ** 2)); }
      sl.computeVertexNormals();
      const slm = this.mat('slider', 'navy'); slm.side = T.DoubleSide;
      const sm = new T.Mesh(sl, slm); sm.position.set(0, rY + .38, 0); g.add(sm);
      [[-.29, .23], [.29, .23], [-.29, -.23], [.29, -.23]].forEach(([x, z]) => this.add(g, new T.TorusGeometry(.03, .008, 8, 20), 'slider', 'light', [x, rY + .36, z], [Math.PI / 2, 0, 0], false));
      const sh = { L: V([-.19, -.78, 0]), R: V([.19, -.78, 0]) };
      Object.entries(risers).forEach(([k, rp]) => {
        this.tube(g, rp.toArray(), sh[k[1]].clone().add(new T.Vector3(0, 0, k[0] === 'F' ? .04 : -.06)).toArray(), .018, 'elevateurs', 'web');
        this.add(g, new T.TorusGeometry(.022, .006, 8, 16), 'elevateurs', 'light', rp.toArray(), null, false);
      });
      this.add(g, new T.BoxGeometry(.36, .52, .2), 'sellette', 'web', [0, -1.02, -.2]);
      this.add(g, new T.BoxGeometry(.3, .14, .16), 'sellette', 'web', [0, -.72, -.18]);
      [-1, 1].forEach(sd => {
        this.tube(g, [sd * .19, -.78, 0], [sd * .12, -1.25, .1], .02, 'sellette', 'web');
        this.tube(g, [sd * .12, -1.25, .1], [sd * .1, -1.33, -.1], .02, 'sellette', 'web');
      });
      this.tube(g, [-.17, -.98, .12], [.17, -.98, .12], .016, 'sellette', 'web');
      this.add(g, new T.CapsuleGeometry(.15, .38, 6, 14), 'pilote', 'yellow', [0, -1.0, 0], null, false);
      this.add(g, new T.SphereGeometry(.105, 20, 16), 'pilote', 'skin', [0, -.62, .04], null, false);
      this.add(g, new T.SphereGeometry(.125, 22, 16, 0, Math.PI * 2, 0, Math.PI * .62), 'pilote', 'helmet', [0, -.6, .03], [-.25, 0, 0], false);
      [-1, 1].forEach(sd => {
        const shp = [sd * .19, -.8, 0], el = [sd * .34, -.62, .05], hd = [sd * .27, rY - .22, -.12];
        this.tube(g, shp, el, .05, 'pilote', 'yellow'); this.tube(g, el, hd, .043, 'pilote', 'yellow');
        this.add(g, new T.SphereGeometry(.045, 12, 10), 'pilote', 'skin', hd, null, false);
        const hip = [sd * .09, -1.3, 0], kn = [sd * .11, -1.58, .22], ft = [sd * .1, -1.95, .14];
        this.tube(g, hip, kn, .07, 'pilote', 'teal'); this.tube(g, kn, ft, .06, 'pilote', 'teal');
        this.add(g, new T.BoxGeometry(.09, .07, .2), 'pilote', 'light', [ft[0], ft[1] - .03, ft[2] + .04], null, false);
      });
      const top = V(P(0, .42, 1, .5)), pc = new T.Vector3(0, H + .9, -2.3), bag = top.clone().lerp(pc, .35);
      this.tube(g, top.toArray(), pc.toArray(), .006, 'extracteur', 'web');
      this.add(g, new T.BoxGeometry(.24, .16, .12), 'extracteur', 'navy', bag.toArray());
      const pch = new T.SphereGeometry(.32, 24, 10, 0, Math.PI * 2, 0, Math.PI * .45);
      const pcm = this.mat('extracteur', 'navy'); pcm.side = T.DoubleSide;
      const pcMesh = new T.Mesh(pch, pcm); pcMesh.position.copy(pc); pcMesh.rotation.x = -Math.PI / 2 + .25; g.add(pcMesh);
      const mesh = new T.Mesh(new T.CylinderGeometry(.12, .3, .2, 24, 1, true), this.mat('extracteur', 'light')); mesh.material.side = T.DoubleSide; mesh.material.transparent = true; mesh.material.opacity = .55;
      mesh.position.copy(pc).add(new T.Vector3(0, -.03, .14)); mesh.rotation.x = Math.PI / 2 + .25; g.add(mesh);
      this.label('voilure', V(P(-1.25, .3, 1, .5)).add(new T.Vector3(0, .15, 0))); this.label('caissons', V(P(.75, 0, 1, .5)).add(new T.Vector3(0, .05, .1)));
      this.label('stabilisateurs', [HS + .1, 2.6, -.2]); this.label('suspentes', [-1.0, 1.4, .3]);
      this.label('commandes', [1.15, .8, -.7]); this.label('slider', [.45, rY + .42, 0]); this.label('elevateurs', [-.3, -.48, .07]);
      this.label('sellette', [.3, -1.05, -.25]); this.label('extracteur', pc.clone().add(new T.Vector3(0, .35, 0)));
      this.update = t => {
        g.rotation.z = Math.sin(t * .55) * .035; g.rotation.x = -.06 + Math.sin(t * .4) * .02; g.position.y = Math.sin(t * .8) * .05;
        pcMesh.rotation.z = Math.sin(t * 3) * .08;
      };
      this.realism(g); this.phMax = 2.3;
      this.view([0, 1.3, 0], 11.5, 1.66, .85, 3, 22);
    }
    ripstop() {
      if (PfScene._rip) return PfScene._rip;
      const T = this.T, N = 256, c = document.createElement('canvas'); c.width = c.height = N;
      const x = c.getContext('2d'), img = x.createImageData(N, N), h = new Float32Array(N * N);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const gx = Math.min(i % 32, 32 - (i % 32)), gy = Math.min(j % 32, 32 - (j % 32));
        const ridge = Math.max(Math.exp(-gx * gx / 1.6), Math.exp(-gy * gy / 1.6));
        const weave = ((i + j) % 4 < 2 ? .25 : 0) + ((i - j + 512) % 4 < 2 ? .15 : 0);
        h[j * N + i] = ridge * 1.0 + weave * .35 + hash(i, j) * .08;
      }
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const L = h[j * N + ((i + N - 1) % N)], Rr = h[j * N + ((i + 1) % N)], U = h[((j + N - 1) % N) * N + i], Dn = h[((j + 1) % N) * N + i];
        let nx = (L - Rr) * 2, ny = (U - Dn) * 2, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
        const o = (j * N + i) * 4; img.data[o] = (nx * .5 + .5) * 255; img.data[o + 1] = (ny * .5 + .5) * 255; img.data[o + 2] = (nz * .5 + .5) * 255; img.data[o + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 8;
      return (PfScene._rip = t);
    }
    realism(g, opt = {}) {
      const T = this.T, R = this.R, scene = this._scene, SR = opt.sky || 90;
      R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
      R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
      const skyMat = new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, uniforms: { uSun: { value: new T.Vector3(.45, .55, .7).normalize() } },
        vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
        fragmentShader: `uniform vec3 uSun; varying vec3 vD;
          void main(){ float y = vD.y;
            vec3 zen = vec3(.06,.18,.48), hor = vec3(.52,.68,.86), haze = vec3(.46,.54,.6), gnd = vec3(.16,.22,.19);
            vec3 c = y > 0. ? mix(hor, zen, pow(y, .55)) : mix(haze, gnd, pow(-y, .45));
            float sd = max(dot(vD, uSun), 0.); c += vec3(1., .92, .78) * (pow(sd, 400.) * 6. + pow(sd, 12.) * .25);
            gl_FragColor = vec4(c, 1.); }` });
      const sky = new T.Mesh(new T.SphereGeometry(SR, 48, 24), skyMat); sky.frustumCulled = false; scene.add(sky); this._sky = sky;
      const envScene = new T.Scene(); envScene.add(new T.Mesh(new T.SphereGeometry(90, 48, 24), skyMat.clone()));
      const pm = new T.PMREMGenerator(R); scene.environment = pm.fromScene(envScene, .02).texture; pm.dispose();
      this._hemi.color.setRGB(.75, .85, 1); this._hemi.groundColor.setRGB(.42, .44, .36); this._hemi.intensity = .55;
      const sun = this._sun; sun.color.setRGB(1, .95, .86); sun.intensity = 2.8; sun.position.set(4.5, 9, 6);
      sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); const sc = sun.shadow.camera; sc.left = sc.bottom = -5; sc.right = sc.top = 5; sc.near = 1; sc.far = 30; sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
      sun.target.position.set(0, 1, 0); scene.add(sun.target);
      this._fill.intensity = .25;
      if (opt.noFabric) { g.traverse(o => { if (o.isMesh && !o.userData.noShadow) { o.castShadow = true; o.receiveShadow = true; } }); this.lineMat.visible = false; return; }
      const rip = this.ripstop(), fabric = new Set(['voilure', 'caissons', 'stabilisateurs', 'slider', 'extracteur', 'sellette', 'pilote', 'elevateurs']);
      g.traverse(o => {
        if (!o.isMesh) return; o.castShadow = true; o.receiveShadow = true;
        const m = o.material; if (!m || !m.userData) return;
        const k = m.userData.key;
        if (fabric.has(k)) { m.normalMap = rip; m.normalScale = new T.Vector2(k === 'voilure' ? .55 : .3, k === 'voilure' ? .55 : .3); }
        if (k === 'voilure' || k === 'caissons') { m.roughness = .58; m.sheenRoughness = .4; }
        if (m.userData.kind === 'linec') { m.roughness = .4; m.sheen = 0; }
        if (m.userData.kind === 'skin') { m.sheen = .3; m.roughness = .55; }
        if (m.userData.kind === 'helmet') { m.roughness = .25; m.sheen = 0; m.clearcoat = 1; m.clearcoatRoughness = .1; }
        m.needsUpdate = true;
      });
      this.lineMat.visible = false;
    }

    buildMoto(g) {
      const T = this.T;
      const wheel = x => {
        const w = new T.Group(); w.position.set(x, .3, 0); g.add(w);
        this.add(w, new T.TorusGeometry(.245, .065, 14, 48), 'roues', 'dark', null, null, false);
        this.add(w, new T.TorusGeometry(.19, .014, 8, 48), 'roues', 'brand', null, null, false);
        for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; this.add(w, new T.BoxGeometry(.19, .022, .03), 'roues', 'brand', [Math.cos(a) * .1, Math.sin(a) * .1, 0], [0, 0, a], false); }
        this.add(w, new T.CylinderGeometry(.035, .035, .16, 12), 'roues', 'light', null, [Math.PI / 2, 0, 0], false);
        return w;
      };
      this.wF = wheel(.73); this.wR = wheel(-.73);
      [-.075, .075].forEach(z => this.add(this.wF, new T.CylinderGeometry(.15, .15, .008, 32), 'roues', 'light', [0, 0, z], [Math.PI / 2, 0, 0], false));
      const H = [.5, .93], P = [-.22, .5], A = [.05, .62], B = [-.15, .88], Rr = [-.72, .92];
      [-.13, .13].forEach(z => {
        const p = q => [q[0], q[1], z];
        [[H, B], [H, A], [A, P], [B, P], [A, B], [B, Rr], [P, Rr]].forEach(([a, b]) => this.tube(g, p(a), p(b), .018, 'chassis', 'brand'));
        this.tube(g, [P[0], P[1], z * .9], [-.73, .3, z * .9], .028, 'chassis', 'base');
        this.tube(g, [.48, 1.05, z * .75], [.73, .3, z * .75], .026, 'suspensions', 'light');
      });
      this.tube(g, [.5, .93, -.13], [.5, .93, .13], .02, 'chassis', 'brand');
      this.tube(g, [-.12, .58, 0], [-.36, .4, 0], .035, 'suspensions', 'light');
      this.add(g, new T.BoxGeometry(.42, .32, .3), 'moteur', 'dark', [.08, .46, 0]);
      this.add(g, new T.BoxGeometry(.22, .22, .3), 'moteur', 'base', [.24, .67, 0], [0, 0, .35]);
      this.add(g, new T.CylinderGeometry(.1, .1, .04, 24), 'moteur', 'base', [.02, .44, .17], [Math.PI / 2, 0, 0]);
      this.tube(g, [.32, .55, .08], [.18, .2, .08], .025, 'echappement', 'light');
      this.add(g, new T.BoxGeometry(.38, .13, .2), 'echappement', 'dark', [-.08, .2, .1]);
      this.add(g, new T.BoxGeometry(.5, .24, .38), 'reservoir', 'dark', [.12, .98, 0], [0, 0, -.1]);
      [-.2, .2].forEach(z => this.add(g, new T.BoxGeometry(.3, .22, .03), 'reservoir', 'base', [.33, .84, z], [0, 0, .5]));
      this.add(g, new T.BoxGeometry(.42, .07, .26), 'selle', 'dark', [-.3, .94, 0], [0, 0, .05]);
      this.add(g, new T.BoxGeometry(.22, .06, .2), 'selle', 'dark', [-.6, 1.01, 0], [0, 0, .12]);
      this.add(g, new T.BoxGeometry(.25, .06, .12), 'carrosserie', 'base', [-.84, 1.02, 0], [0, 0, .2]);
      this.add(g, new T.BoxGeometry(.32, .03, .14), 'carrosserie', 'base', [.73, .62, 0], [0, 0, -.2]);
      [.96, .87].forEach(y => this.add(g, new T.BoxGeometry(.06, .07, .12), 'carrosserie', 'light', [.62, y, 0]));
      this.tube(g, [.42, 1.13, -.37], [.42, 1.13, .37], .014, 'guidon', 'ink');
      [-.3, .3].forEach(z => { this.tube(g, [.42, 1.13, z], [.36, 1.3, z * 1.15], .008, 'guidon', 'ink'); this.add(g, new T.BoxGeometry(.03, .07, .12), 'guidon', 'dark', [.36, 1.32, z * 1.15]); });
      this.label('moteur', [.1, .32, .2]); this.label('reservoir', [.12, 1.14, 0]); this.label('selle', [-.36, 1.02, 0]);
      this.label('roues', [-.73, .62, 0]); this.label('suspensions', [.62, .7, .1]); this.label('chassis', [-.2, .9, .14]); this.label('echappement', [-.1, .12, .2]);
      this.view([0, .6, 0], 3.6, 1.28, .75, 1.8, 8);
    }

    buildGym(g) {
      const T = this.T;
      this.add(g, new T.BoxGeometry(14, .04, 10), 'sol', 'light', [0, -.02, 0], null, false);
      const grid = new T.GridHelper(14, 28); grid.material = this.lineMat; grid.position.y = .005; g.add(grid);
      this.add(g, new T.BoxGeometry(14, 3.2, .1), 'mur', 'light', [0, 1.6, -5]);
      this.add(g, new T.BoxGeometry(.1, 3.2, 10), 'mur', 'light', [-7, 1.6, 0]);
      this.add(g, new T.BoxGeometry(12, 1.8, .02), 'miroir', 'base', [0, 1.45, -4.94]);
      for (let i = 0; i < 5; i++) {
        const x = -5.2 + i * 1.3, z = -3.6;
        this.add(g, new T.BoxGeometry(.8, .2, 1.9), 'cardio', 'base', [x, .1, z]);
        this.add(g, new T.BoxGeometry(.6, .02, 1.5), 'cardio', 'dark', [x, .21, z + .1], null, false);
        [-.35, .35].forEach(dx => this.tube(g, [x + dx, .2, z - .7], [x + dx, 1.3, z - .85], .025, 'cardio', 'ink'));
        this.add(g, new T.BoxGeometry(.8, .3, .12), 'cardio', 'dark', [x, 1.38, z - .86], [-.4, 0, 0]);
      }
      for (let i = 0; i < 3; i++) {
        const z = -1.2 + i * 2.3, x = -5.9;
        [[-.6, -.6], [-.6, .6], [.6, -.6], [.6, .6]].forEach(([dx, dz]) => this.add(g, new T.BoxGeometry(.08, 2.3, .08), 'racks', 'dark', [x + dx, 1.15, z + dz]));
        [-.6, .6].forEach(dx => this.add(g, new T.BoxGeometry(.08, .08, 1.28), 'racks', 'dark', [x + dx, 2.3, z]));
        this.add(g, new T.CylinderGeometry(.022, .022, 2.1, 10), 'racks', 'ink', [x + .45, 1.4, z], [Math.PI / 2, 0, 0], false);
        [-.82, .82].forEach(dz => this.add(g, new T.CylinderGeometry(.22, .22, .05, 28), 'racks', 'dark', [x + .45, 1.4, z + dz], [Math.PI / 2, 0, 0]));
        this.add(g, new T.BoxGeometry(1.4, .02, 1.4), 'racks', 'base', [x, .01, z], null, false);
      }
      this.add(g, new T.BoxGeometry(3.4, .55, .6), 'halteres', 'dark', [4.6, .28, -4.4]);
      for (let i = 0; i < 9; i++) {
        const x = 3.1 + i * .37, r = .055 + i * .006;
        this.add(g, new T.CylinderGeometry(.015, .015, .32, 8), 'halteres', 'ink', [x, .62, -4.4], [Math.PI / 2, 0, 0], false);
        [-.14, .14].forEach(dz => this.add(g, new T.CylinderGeometry(r, r, .07, 14), 'halteres', 'base', [x, .62, -4.4 + dz], [Math.PI / 2, 0, 0], false));
      }
      [3.6, 5.4].forEach(x => { this.add(g, new T.BoxGeometry(.32, .08, 1.2), 'halteres', 'dark', [x, .45, -2.6]); this.add(g, new T.BoxGeometry(.06, .42, .06), 'halteres', 'ink', [x, .21, -2.3]); this.add(g, new T.BoxGeometry(.06, .42, .06), 'halteres', 'ink', [x, .21, -2.9]); });
      for (let i = 0; i < 3; i++) {
        const x = 1.6 + i * 2, z = 2;
        this.add(g, new T.BoxGeometry(1.2, .08, 1.4), 'machines', 'base', [x, .04, z]);
        this.add(g, new T.BoxGeometry(.08, 2.1, .08), 'machines', 'ink', [x - .45, 1.05, z - .55]);
        this.add(g, new T.BoxGeometry(.08, 2.1, .08), 'machines', 'ink', [x + .45, 1.05, z - .55]);
        this.add(g, new T.BoxGeometry(1, .08, .08), 'machines', 'ink', [x, 2.1, z - .55]);
        this.add(g, new T.BoxGeometry(.36, 1.1, .22), 'machines', 'dark', [x, .65, z - .55]);
        this.add(g, new T.BoxGeometry(.45, .08, .5), 'machines', 'dark', [x, .5, z + .2]);
        this.add(g, new T.BoxGeometry(.45, .6, .08), 'machines', 'dark', [x, .85, z + .45], [-.15, 0, 0]);
      }
      for (let i = 0; i < 4; i++) this.add(g, new T.BoxGeometry(.65, .02, 1.8), 'etirement', 'base', [-2.6 + i * .85, .02, 3.4]);
      this.label('cardio', [-2.6, 1.8, -3.6]); this.label('racks', [-5.9, 2.55, 1.1]); this.label('halteres', [4.6, .95, -4.4]);
      this.label('machines', [3.6, 2.4, 1.5]); this.label('etirement', [-1.3, .3, 3.4]);
      this.view([0, .6, 0], 16, .95, .7, 6, 28);
    }

    async buildKre(g) { return this.buildCity(g, 'assets/kreaddis-osm.json', { key: 'kreaddis', label: 'Kreaddis · 6 rue André Ampère', street: 'Rue André Ampère', ref: true }); }
    async buildIut(g) { return this.buildCity(g, 'assets/iut-osm.json', { key: 'iut', label: 'IUT d’Annecy · 9 rue de l’Arc en Ciel', street: 'Rue de l’Arc en Ciel', alt: "Rue de l'Arc en Ciel" }); }
    flatMat(key, kind, extra) { const m = new this.T.MeshBasicMaterial(Object.assign({ transparent: true }, extra || {})); m.userData = { key, kind, line: true }; this.mats.push(m); return m; }
    async buildCity(g, file, site) {
      const T = this.T, S = 1 / 50, RAD = CITY_RAD; this._srgb = true;
      PfScene._osmC = PfScene._osmC || {};
      let O; try { O = PfScene._osmC[file] || (PfScene._osmC[file] = await (await fetch(file)).json()); } catch (e) { if (this._geoBuilding) throw e; return this.buildKreRegion(g); }
      // Edge fade in world space: (centre x, centre z, outer radius, inner radius). buildGeo moves and shrinks it
      // when the map is placed on the region relief, and animates the radii to reveal the map from its centre.
      const fadeU = { value: new T.Vector4(0, 0, RAD, RAD - 5) }; g.userData.fade = fadeU;
      const fade = m => { m.transparent = true; m.onBeforeCompile = sh => {
        sh.uniforms.uFade = fadeU;
        sh.vertexShader = 'varying vec2 vFw;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\nvFw = (modelMatrix * vec4(transformed, 1.)).xz;');
        sh.fragmentShader = 'uniform vec4 uFade; varying vec2 vFw;\n' + sh.fragmentShader.replace('#include <fog_fragment>', '#include <fog_fragment>\ngl_FragColor.a *= smoothstep(uFade.z, uFade.w, length(vFw - uFade.xy));');
      }; return m; };
      const F = (key, kind, extra) => fade(this.flatMat(key, kind, extra));
      this._hemi.color.setRGB(1, 1, 1); this._hemi.groundColor.setRGB(.5, .5, .5); this._hemi.intensity = 2.1; this._sun.intensity = .9; this._sun.position.set(-5, 10, 7); this._fill.intensity = .35;
      this.cam.near = .1; this.cam.far = 300; this.cam.updateProjectionMatrix();
      const pt = p => [p[0] * S, p[1] * S], near = (p, r = RAD + 1) => Math.hypot(p[0] * S, p[1] * S) < r;
      const merge = geos => {
        const pos = []; geos.forEach(ge => { const n = ge.index ? ge.toNonIndexed() : ge; const a2 = n.attributes.position.array; for (let i = 0; i < a2.length; i++) pos.push(a2[i]); });
        const out = new T.BufferGeometry(); out.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); out.computeVertexNormals(); return out;
      };
      const add = (geo, m, y) => { const me = new T.Mesh(geo, m); me.position.y = y; g.add(me); return me; };
      add(new T.CircleGeometry(RAD + .5, 128).rotateX(-Math.PI / 2), F('sol', 'cGround'), 0);
      const gp = []; for (let v = -RAD; v <= RAD; v += 2) { gp.push(new T.Vector3(v, .001, -RAD), new T.Vector3(v, .001, RAD), new T.Vector3(-RAD, .001, v), new T.Vector3(RAD, .001, v)); }
      const gm = fade(new T.LineBasicMaterial({ transparent: true, opacity: .07 })); this.fgMats.push(gm); g.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(gp), gm));
      const poly = (list, key, kind, y) => {
        const geos = []; list.forEach(a2 => { if (a2.g.length < 4 || !a2.g.some(q => near(q))) return; const ge = new T.ShapeGeometry(new T.Shape(a2.g.map(q => new T.Vector2(q[0] * S, -q[1] * S)))); ge.rotateX(-Math.PI / 2); geos.push(ge); });
        if (geos.length) add(merge(geos), F(key, kind), y);
      };
      const AREA = { forest: 'wood', wood: 'wood', scrub: 'wood', meadow: 'green', grass: 'green', farmland: 'green', grassland: 'green', garden: 'green', park: 'green', pitch: 'green', recreation_ground: 'green', golf_course: 'green', cemetery: 'green' };
      poly(O.a.filter(x => AREA[x.c] === 'green'), 'zones', 'cGreen', .003); poly(O.a.filter(x => AREA[x.c] === 'wood'), 'zones', 'cWood', .005);
      poly(O.w.filter(w => w.c === 'water'), 'eau', 'cWater', .007);
      const W = { motorway: 22, trunk: 18, primary: 14, secondary: 12, tertiary: 10, unclassified: 7, residential: 7, living_street: 6, service: 4, motorway_link: 8, trunk_link: 8, primary_link: 8, secondary_link: 8, tertiary_link: 7 };
      const ribbon = (pl, w) => {
        const p = pl.map(pt), pos = [], idx = []; if (p.length < 2) return null;
        for (let i = 0; i < p.length; i++) {
          const a2 = p[Math.max(0, i - 1)], b2 = p[Math.min(p.length - 1, i + 1)]; let dx = b2[0] - a2[0], dz = b2[1] - a2[1]; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
          pos.push(p[i][0] - dz * w / 2, 0, p[i][1] + dx * w / 2, p[i][0] + dz * w / 2, 0, p[i][1] - dx * w / 2);
          if (i) { const k = i * 2; idx.push(k, k - 1, k - 2, k, k + 1, k - 1); }
        }
        p.forEach(q => { const n = new T.CircleGeometry(w / 2, 8).rotateX(-Math.PI / 2).translate(q[0], 0, q[1]).toNonIndexed(); const base = pos.length / 3; const a3 = n.attributes.position.array; for (let j = 0; j < a3.length; j++) pos.push(a3[j]); for (let j = 0; j < n.attributes.position.count; j++) idx.push(base + j); });
        const ge = new T.BufferGeometry(); ge.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); ge.setIndex(idx); return ge.toNonIndexed();
      };
      const isStreet = h => h.n === site.street || h.n === site.alt;
      const roads = O.h.filter(h => W[h.c] && h.g.some(q => near(q)));
      const major = h => /motorway|trunk|primary|secondary/.test(h.c);
      const layer = (list, key, kind, y) => { const geos = list.map(h => ribbon(h.g, W[h.c] * S)).filter(Boolean); if (geos.length) add(merge(geos), F(key, kind), y); };
      layer(roads.filter(h => !major(h) && !isStreet(h)), 'routes', 'cRoad', .01); layer(roads.filter(h => major(h) && !isStreet(h)), 'routes', 'cRoadM', .012); layer(roads.filter(isStreet), 'rue', 'cRoadM', .014);
      const dm = fade(new T.LineDashedMaterial({ dashSize: .06, gapSize: .07, transparent: true, opacity: .3 })); this.fgMats.push(dm);
      O.h.filter(h => ['footway', 'path', 'cycleway', 'track', 'steps', 'rail', 'pedestrian'].includes(h.c) && h.g.some(q => near(q))).forEach(h => { const l = new T.Line(new T.BufferGeometry().setFromPoints(h.g.map(q => new T.Vector3(q[0] * S, .016, q[1] * S))), dm); l.computeLineDistances(); g.add(l); });
      O.w.filter(w => w.c !== 'water' && w.g.some(q => near(q))).forEach(w => { const m = F('eau', 'cWaterL'); const r = ribbon(w.g, 3 * S); if (r) add(r, m, .008); });
      const area = q => { let a2 = 0; for (let i = 0, k = q.length - 1; i < q.length; k = i++) a2 += (q[k][0] + q[i][0]) * (q[k][1] - q[i][1]); return Math.abs(a2 / 2); };
      const hOf = b => { if (b.h) return b.h; const a2 = area(b.g); if (/garage|shed|roof|carport|hut/.test(b.t)) return 3; if (/apartments|office|university|college|school|hospital/.test(b.t)) return 12; if (/industrial|warehouse|commercial|retail/.test(b.t) || a2 > 900) return 9; return a2 > 160 ? 7.5 : 4.5; };
      const keyIdx = new Set(O.k || []), bg = [], kg = [], ep = [], X = 1.5;
      let kc = [0, 0, 0], kn = 0, kTop = 0;
      O.b.forEach((b, i) => {
        if (b.g.length < 4) return; const c = b.g.reduce((s2, q) => [s2[0] + q[0], s2[1] + q[1]], [0, 0]).map(v => v / b.g.length * S); if (Math.hypot(c[0], c[1]) > RAD - .3) return;
        const h = hOf(b) * S * X, ge = new T.ExtrudeGeometry(new T.Shape(b.g.map(q => new T.Vector2(q[0] * S, -q[1] * S))), { depth: h, bevelEnabled: false }); ge.rotateX(-Math.PI / 2);
        if (keyIdx.has(i)) { kg.push(ge); kc[0] += c[0]; kc[2] += c[1]; kn++; kTop = Math.max(kTop, h); return; }
        bg.push(ge);
        const p = b.g.map(pt), n = p.length - 1;
        for (let j = 0; j < n; j++) { ep.push(p[j][0], h, p[j][1], p[j + 1][0], h, p[j + 1][1]);
          const a2 = p[(j - 1 + n) % n], b2 = p[j + 1], d1 = Math.atan2(p[j][1] - a2[1], p[j][0] - a2[0]), d2 = Math.atan2(b2[1] - p[j][1], b2[0] - p[j][0]); let dd = Math.abs(d2 - d1); if (dd > Math.PI) dd = 2 * Math.PI - dd;
          if (dd > .5) ep.push(p[j][0], 0, p[j][1], p[j][0], h, p[j][1]); }
      });
      const bmat = fade(this.mat('batiments', 'cBld')); bmat.roughness = 1; bmat.metalness = 0; add(merge(bg), bmat, 0);
      const eg = new T.BufferGeometry(); eg.setAttribute('position', new T.Float32BufferAttribute(ep, 3));
      const em = fade(new T.LineBasicMaterial({ transparent: true, opacity: .5 })); em.userData = { key: 'batiments', kind: 'cEdge', line: true }; this.mats.push(em); g.add(new T.LineSegments(eg, em));
      if (kn) { kc = [kc[0] / kn, 0, kc[2] / kn]; } const K = new T.Vector3(kc[0], 0, kc[2]);
      let kEm = null; // local: buildGeo builds two maps in the same scene
      if (kg.length) { const km = new T.MeshStandardMaterial({ roughness: .7, emissiveIntensity: 1 }); this.accentMats.push(km); const kmesh = add(merge(kg), km, 0);
        const ke = new T.LineBasicMaterial({ transparent: true, opacity: .9 }); this.fgMats.push(ke); kmesh.add(new T.LineSegments(new T.EdgesGeometry(kmesh.geometry, 30), ke)); kEm = km; }
      const am = new T.MeshBasicMaterial(), fm = new T.MeshBasicMaterial(); this.accentMats.push(am); this.fgMats.push(fm);
      const pin = new T.Mesh(new T.CylinderGeometry(.01, .01, 1.6, 8), fm); pin.position.set(K.x, kTop + .8, K.z); g.add(pin);
      const head = new T.Mesh(new T.SphereGeometry(.1, 20, 16), am); g.add(head);
      const ringM = new T.MeshBasicMaterial({ transparent: true, side: T.DoubleSide, depthWrite: false }); this.accentMats.push(ringM);
      const ring = new T.Mesh(new T.RingGeometry(.96, 1, 96).rotateX(-Math.PI / 2), ringM); ring.position.set(K.x, .02, K.z); g.add(ring);
      const rd = fade(new T.LineDashedMaterial({ dashSize: .18, gapSize: .14, transparent: true, opacity: .55 })); this.accentMats.push(rd);
      [250, 500, 1000].forEach(m => { const r = m * S, pts = []; for (let i = 0; i <= 160; i++) { const a2 = i / 160 * Math.PI * 2; pts.push(new T.Vector3(K.x + Math.cos(a2) * r, .02, K.z + Math.sin(a2) * r)); }
        const l = new T.Line(new T.BufferGeometry().setFromPoints(pts), rd); l.computeLineDistances(); g.add(l);
        const lb = this.label('rayon', new T.Vector3(K.x + r * .707, .05, K.z + r * .707), m >= 1000 ? (m / 1000) + ' km' : m + ' m'); Object.assign(lb.el.style, { background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '10px' }); lb.fixed = true; });
      this.label(site.key, new T.Vector3(K.x, kTop + 1.85, K.z), site.label);
      const len = h => { let L = 0; for (let i = 1; i < h.g.length; i++) L += Math.hypot(h.g[i][0] - h.g[i - 1][0], h.g[i][1] - h.g[i - 1][1]); return L; };
      const best = {}; roads.forEach(h => { if (!h.n) return; const L = len(h); if (!best[h.n] || best[h.n].L < L) best[h.n] = { h, L }; });
      Object.values(best).sort((x, y) => y.L - x.L).filter(o => { const q = o.h.g[Math.floor(o.h.g.length / 2)]; return near(q, RAD * .62); }).slice(0, 7).concat(Object.values(best).filter(o => isStreet(o.h))).forEach(o => {
        const q = o.h.g[Math.floor(o.h.g.length / 2)], st = isStreet(o.h);
        const l = this.label(st ? 'rue' : 'routes', new T.Vector3(q[0] * S, .05, q[1] * S), o.h.n); Object.assign(l.el.style, { background: 'transparent', border: 'none', fontSize: '10px', opacity: st ? '1' : '.7' });
      });
      if (site.ref) { const mw = O.h.find(h => h.c === 'motorway' && h.g.some(q => near(q, RAD * .6))); if (mw) { const q = mw.g.find(q2 => near(q2, RAD * .6)); const l = this.label('routes', new T.Vector3(q[0] * S, .05, q[1] * S), mw.ref || 'A41'); l.el.style.fontWeight = '600'; } }
      g.userData.center = [pin, head, ring]; // marker objects, shown only once the map is fully in place
      this.update = t => { head.position.set(K.x, kTop + 1.62 + Math.sin(t * 2) * .04, K.z); const u = (t * .45) % 1; ring.scale.setScalar(.3 + u * 2.2); ringM.opacity = .9 * (1 - u); if (kEm) { const ac = toRGB(theme().accent); kEm.emissive.setRGB(ac[0] * .35, ac[1] * .35, ac[2] * .35, T.SRGBColorSpace); } };
      this.phMax = 1.32; this.view([K.x, 0, K.z], 24, .82, .5, 3, 46);
    }

    async buildKreRegion(g) {
      const T = this.T, S = SITES.kre; let D = null; try { D = await loadDEM(S); } catch (e) {}
      const terr = this.terr = makeTerrain(T, D, 300); g.add(terr.mesh);
      const gy = (x, z) => D ? E2Y(demAt(D, x, z)) : fakeH(x, z);
      const P = (lat, lon, dy = 0) => { const [x, z] = ll2xz(lat, lon, S); return new T.Vector3(x, gy(x, z) + dy, z); };
      const k = P(S.pin[0], S.pin[1]), am = new T.MeshBasicMaterial(), fm = new T.MeshBasicMaterial(); this.accentMats.push(am); this.fgMats.push(fm);
      terr.mat.uniforms.uLand.value.copy(k);
      const pin = new T.Mesh(new T.CylinderGeometry(.012, .012, .9, 8), fm); pin.position.copy(k).y += .45; g.add(pin);
      const head = new T.Mesh(new T.SphereGeometry(.08, 20, 16), am); head.position.copy(k).y += .92; g.add(head);
      const bld = new T.Mesh(new T.BoxGeometry(.14, .07, .09), am); bld.position.copy(k).y += .035; g.add(bld);
      const iut = P(45.9206, 6.1535), dash = new T.LineDashedMaterial({ dashSize: .06, gapSize: .05 }); this.accentMats.push(dash);
      const arc = new T.QuadraticBezierCurve3(k.clone().add(new T.Vector3(0, .05, 0)), k.clone().lerp(iut, .5).add(new T.Vector3(0, .9, 0)), iut.clone().add(new T.Vector3(0, .05, 0)));
      const al = new T.Line(new T.BufferGeometry().setFromPoints(arc.getPoints(80)), dash); al.computeLineDistances(); g.add(al);
      const im = new T.Mesh(new T.SphereGeometry(.05, 16, 12), fm); im.position.copy(iut).y += .05; g.add(im);
      this.label('kreaddis', k.clone().add(new T.Vector3(0, 1.08, 0))); this.label('iut', iut.clone().add(new T.Vector3(0, .2, 0)));
      this.label('annecy', P(45.8992, 6.1294, .14)); this.label('lac', P(45.858, 6.168, .1)); this.label('semnoz', P(45.796, 6.098, .14));
      this.update = t => { terr.mat.uniforms.uTime.value = t; head.position.y = k.y + .92 + Math.sin(t * 2) * .03; };
      this.view([-.2, .4, .6], 13, .92, .15, 3, 22);
    }

    /* ---------- Region <-> neighbourhood: one scene, continuous zoom ----------
       The region relief and the two neighbourhood maps (Kreaddis, IUT) live in region coordinates: each map is
       scaled down to its true size (1 map unit = 50 m) and placed at its real position on the relief. Switching
       tab, clicking a site on the region, or zooming past the limits plays a camera move between the two framings
       while the relief fades out, the map is revealed from its centre and its buildings rise. */
    async buildGeo(g, mode, tok) {
      const T = this.T, S = SITES.kre;
      this._geoBuilding = true;
      const take = async fn => {
        const group = new T.Group(), l0 = this.labels.length; this.update = null;
        await fn(group);
        const o = this.orb;
        return { group, labels: this.labels.slice(l0), update: this.update,
          view: { tgt: o.tgt.clone(), r: o.r, ph: o.ph, th: o.th, rMin: this.rMin, rMax: this.rMax, phMax: this.phMax } };
      };
      try {
        const region = await take(gr => this.buildKreRegion(gr)); if (tok !== this._tok) return;
        // Pins are sized to be read from afar: up close they would tower over the map, so they leave first
        region.mats = []; region.markers = [];
        region.group.traverse(o => { if (!o.material) return; if (o.isMesh && !o.material.uniforms) region.markers.push(o); else region.mats.push(o.material); });
        let D = null; try { D = await loadDEM(S); } catch (e) {}
        const gy = (x, z) => D ? E2Y(demAt(D, x, z)) : fakeH(x, z);
        const L = { region };
        for (const [key, fn, file] of [['kreaddis', gr => this.buildKre(gr), 'assets/kreaddis-osm.json'], ['iut', gr => this.buildIut(gr), 'assets/iut-osm.json']]) {
          let lay; try { lay = await take(fn); } catch (e) { continue; } // map unavailable: the region simply has no dive for it
          if (tok !== this._tok) return;
          const O = PfScene._osmC[file], k = cityScale(O.c[0]), [cx, cz] = ll2xz(O.c[0], O.c[1], S), rad = CITY_RAD * k;
          // The map is flat: lift it above the highest point of the relief under its disc so it is never buried
          let top = -Infinity;
          for (let i = 0; i < 48; i++) for (const f of [0, .35, .7, 1]) { const a = i / 48 * Math.PI * 2; top = Math.max(top, gy(cx + Math.cos(a) * rad * f, cz + Math.sin(a) * rad * f)); }
          const gr = lay.group; gr.position.set(cx, top + .002, cz); gr.scale.setScalar(k); gr.updateMatrixWorld(true);
          lay.labels.forEach(l => l.p.applyMatrix4(gr.matrixWorld));
          const v = lay.view; v.tgt.applyMatrix4(gr.matrixWorld); v.r *= k; v.rMin *= k; v.rMax *= k;
          Object.assign(lay, { k, rad, fade: gr.userData.fade, center: gr.userData.center || [] });
          if (lay.fade) lay.fade.value.set(cx, cz, rad, rad * (CITY_RAD - 5) / CITY_RAD);
          gr.traverse(o => { o.renderOrder = 1; }); // drawn after the (fading, transparent) relief
          L[key] = lay;
        }
        Object.values(L).forEach(l => g.add(l.group));
        const G = this.geo = { L, cur: L[GEO_LAYER[mode]] ? GEO_LAYER[mode] : 'region', tr: null };
        // On the region, the Kreaddis and IUT labels lead into their neighbourhood
        region.labels.forEach(l => {
          if (!L[l.key] || l.key === 'region') return;
          Object.assign(l.el.style, { pointerEvents: 'auto', cursor: 'pointer' });
          l.el.title = this.lang === 'en' ? 'Zoom into the neighbourhood' : 'Plonger dans le quartier';
          l.el.addEventListener('click', () => this.geoNav(l.key));
        });
        this.update = t => { Object.values(L).forEach(l => l.update && l.update(t)); this.geoTick(); };
        this.geoSet(G.cur === 'region' ? 0 : 1, G.cur === 'region' ? null : G.cur);
        this.geoView(L[G.cur].view);
      } finally { this._geoBuilding = false; }
    }
    geoView(v) { const o = this.orb; o.tgt.copy(v.tgt); o.r = v.r; o.ph = v.ph; o.th = v.th; this.rMin = v.rMin; this.rMax = v.rMax; this.phMax = v.phMax; }
    // p = progress towards the neighbourhood `city` (0 = region only, 1 = neighbourhood only)
    geoSet(p, city) {
      const L = this.geo.L, ramp = (a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
      const fr = 1 - ramp(.45, .85), fc = ramp(.35, .8), grow = .02 + .98 * ramp(.6, 1), fl = ramp(.85, 1), rl = 1 - ramp(0, .25);
      const R = L.region; R.group.visible = fr > .001;
      R.mats.forEach(m => {
        if (m.uniforms && m.uniforms.uOp) { m.uniforms.uOp.value = fr; m.depthWrite = fr > .999; } // the relief must not hide the map while fading
        else { m.transparent = true; m.opacity = fr; }
      });
      const fm = Math.min(fr, 1 - ramp(0, .3));
      R.markers.forEach(o => { o.visible = fm > .001; o.material.transparent = true; o.material.opacity = fm; });
      R.labels.forEach(l => { l.off = rl <= .01; l.el.style.opacity = rl; });
      ['kreaddis', 'iut'].forEach(key => {
        const C = L[key]; if (!C) return;
        const on = key === city, f = on ? fc : 0;
        C.group.visible = f > .001; C.group.scale.set(C.k, C.k * (on ? grow : .02), C.k);
        if (C.fade) { const r = Math.max(1e-4, C.rad * f); C.fade.value.z = r; C.fade.value.w = r * (CITY_RAD - 5) / CITY_RAD; }
        C.center.forEach(o => { o.visible = on && p > .9; });
        C.labels.forEach(l => { l.off = !on || fl <= .01; l.el.style.opacity = on ? fl : 0; });
      });
    }
    geoGo(target) {
      const G = this.geo; if (!G || !G.L[target]) return;
      if (G.tr) { this._geoQueue = target; return; }   // replayed when the current move ends
      if (target === G.cur) return;
      if (G.cur !== 'region' && target !== 'region') { this._geoQueue = target; target = 'region'; } // map -> other map goes through the region
      const o = this.orb;
      G.tr = { to: target, city: target === 'region' ? G.cur : target, dir: target === 'region' ? -1 : 1, t0: performance.now(), dur: 2600,
        A: { tgt: o.tgt.clone(), r: o.r, ph: o.ph, th: o.th }, B: G.L[target].view };
      this._goto = null;
    }
    geoTick() {
      const G = this.geo, o = this.orb, c = this.cam;
      // Scale spans ~27x between the two framings: keep the depth range proportional to the camera distance
      const near = Math.max(5e-4, o.r * .004), far = Math.max(60, o.r * 30);
      if (c.near !== near || c.far !== far) { c.near = near; c.far = far; c.updateProjectionMatrix(); }
      const tr = G.tr; if (!tr) return;
      const u = Math.min(1, (performance.now() - tr.t0) / tr.dur), e = u < .5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2;
      // Diving in: centre the site first, then descend. Leaving: rise first, then recentre on the region.
      const et = tr.dir > 0 ? 1 - (1 - Math.min(1, u * 1.6)) ** 3 : Math.max(0, (u - .375) / .625) ** 2;
      const A = tr.A, B = tr.B;
      o.tgt.copy(A.tgt).lerp(B.tgt, et);
      o.r = Math.exp(Math.log(A.r) + (Math.log(B.r) - Math.log(A.r)) * e);
      o.ph = A.ph + (B.ph - A.ph) * e;
      o.th = A.th + Math.atan2(Math.sin(B.th - A.th), Math.cos(B.th - A.th)) * e;
      o.idle = 0;
      this.geoSet(tr.dir > 0 ? e : 1 - e, tr.city);
      if (u >= 1) {
        G.cur = tr.to; G.tr = null; this.rMin = B.rMin; this.rMax = B.rMax; this.phMax = B.phMax;
        // Queued targets already match the page's tab (they come from `mode`), so move without asking again
        if (this._geoQueue) { const q = this._geoQueue; this._geoQueue = null; this.geoGo(q); }
      }
    }
    // Ask the page to switch tab (it updates `mode`, which calls geoGo); without a listener, move directly
    geoNav(target) {
      const ev = new CustomEvent('pf-geo-nav', { detail: target, bubbles: true, composed: true, cancelable: true });
      if (this.dispatchEvent(ev)) this.geoGo(target);
    }
    // Zooming past the limits: out of a neighbourhood -> region; into the region -> the site nearest the centre
    geoOverscroll(delta, r0) {
      const G = this.geo, now = performance.now();
      if (!G || G.tr) return;
      if (now - (this._ovT || 0) > 700) this._ov = 0;
      this._ovT = now;
      if (G.cur !== 'region' && delta > 0 && r0 >= this.rMax * .999) this._ov += delta;
      else if (G.cur === 'region' && delta < 0 && r0 <= this.rMin * 1.001) this._ov -= delta;
      else { this._ov = 0; return; }
      if (this._ov < 260) return;
      this._ov = 0;
      if (G.cur !== 'region') return this.geoNav('region');
      const v = new this.T.Vector3(); let best = null, bd = Infinity;
      G.L.region.labels.forEach(l => { if (!G.L[l.key] || l.key === 'region') return; v.copy(l.p).project(this.cam); const d = Math.hypot(v.x, v.y); if (d < bd) { bd = d; best = l.key; } });
      if (best) this.geoNav(best);
    }

    buildSnow(g) {
      const T = this.T, slope = (x, z) => -z * .36 + noise(x * .25 + 3, z * .25) * .6 + Math.max(0, Math.abs(x) - 5) * .35;
      const geo = new T.PlaneGeometry(22, 44, 66, 132); geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, slope(pos.getX(i), pos.getZ(i)));
      geo.computeVertexNormals(); this.add(g, geo, 'neige', 'snow', null, null, false);
      for (let i = 0; i < 90; i++) {
        const side = i % 2 ? 1 : -1, x = side * (5.6 + hash(i, 1) * 4.5), z = -21 + hash(i, 2) * 42, h = 1.2 + hash(i, 3) * 1.4;
        this.add(g, new T.ConeGeometry(h * .32, h, 7), 'arbres', 'tree', [x, slope(x, z) + h / 2, z], null, false);
      }
      for (let z = -20; z <= 20; z += 4) [-4.3, 4.3].forEach(x => {
        const y = slope(x, z); this.tube(g, [x, y, z], [x, y + 1.2, z], .025, 'piste', 'ink');
        this.add(g, new T.CylinderGeometry(.04, .04, .28, 10), 'piste', 'piste', [x, y + 1.05, z], null, false);
      });
      const L = 1.55, W = .27, r = W / 2, s = new T.Shape();
      s.moveTo(-L / 2 + r, -r); s.lineTo(L / 2 - r, -r); s.absarc(L / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2); s.lineTo(-L / 2 + r, r); s.absarc(-L / 2 + r, 0, r, Math.PI / 2, Math.PI * 1.5);
      const bg = new T.ExtrudeGeometry(s, { depth: .02, bevelEnabled: true, bevelSize: .008, bevelThickness: .006, bevelSegments: 2, curveSegments: 16 });
      bg.rotateX(Math.PI / 2); bg.rotateY(Math.PI / 2);
      const board = new T.Group(), roll = new T.Group(); board.add(roll); g.add(board);
      this.add(roll, bg, 'planche', 'dark', [0, .03, 0]);
      [-.26, .26].forEach(z => {
        this.add(roll, new T.BoxGeometry(.2, .03, .12), 'fixations', 'brand', [0, .06, z], [0, .25, 0]);
        this.add(roll, new T.BoxGeometry(.18, .2, .025), 'fixations', 'brand', [0, .15, z - .07], [-.2, .25, 0]);
      });
      const N = 220, tr = new Float32Array(N * 3), tg = new T.BufferGeometry(); tg.setAttribute('position', new T.BufferAttribute(tr, 3));
      const trail = new T.Line(tg, this.mat('trace', 'ink', true)); trail.frustumCulled = false; g.add(trail);
      const hist = [];
      const pAt = u => { const z = -19 + u * 38, x = Math.sin(z * .32) * 2.6; return new T.Vector3(x, slope(x, z) + .02, z); };
      const nrm = new T.Vector3(0, 1, .36).normalize();
      const lb = this.label('planche', [0, 0, 0]), lf = this.label('fixations', [0, 0, 0]), lt = this.label('trace', [0, 0, 0]);
      this.label('piste', [4.3, slope(4.3, -4) + 1.4, -4]);
      let lastU = 0;
      this.update = t => {
        const u = (t * .028) % 1; if (u < lastU) hist.length = 0; lastU = u;
        const p = pAt(u), q = pAt(Math.min(1, u + .004));
        board.position.copy(p); board.up.copy(nrm); board.lookAt(q);
        roll.rotation.z = -Math.cos((-19 + u * 38) * .32) * .45;
        hist.push(p.clone()); if (hist.length > N) hist.shift();
        for (let i = 0; i < N; i++) { const h = hist[Math.max(0, hist.length - N + i)] || p; tr[i * 3] = h.x; tr[i * 3 + 1] = h.y + .01; tr[i * 3 + 2] = h.z; }
        tg.attributes.position.needsUpdate = true;
        lb.p.copy(p).add(new T.Vector3(0, .5, 0)); lf.p.copy(p).add(new T.Vector3(.3, .25, 0));
        if (hist.length > 40) lt.p.copy(hist[hist.length - 40]).add(new T.Vector3(0, .25, 0));
        this.orb.tgt.lerp(p, .08);
      };
      this.view([0, 0, -19], 11, 1.1, .6, 3, 22);
    }
  }
  customElements.define('pf-scene', PfScene);
})();
