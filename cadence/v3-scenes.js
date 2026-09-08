export function selectCadenceSceneVariant(scene, viewportWidth) {
  return viewportWidth <= 720 ? scene.mobile : scene.desktop;
}

export function progressAcrossScene(bounds, viewportHeight) {
  const start = viewportHeight * 0.8;
  const end = viewportHeight * 0.2;
  const travel = Math.max(1, (bounds.bottom - bounds.top) + start - end);
  return Math.min(1, Math.max(0, (start - bounds.top) / travel));
}

export function resolveCadenceSceneMode({ reducedMotion, saveData, webglAvailable }) {
  return reducedMotion || saveData || !webglAvailable ? 'poster' : 'live';
}

export function renderDimensionsForScene(variant, displayedWidth) {
  const width = Math.max(1, Math.min(variant.width, Math.round(displayedWidth)));
  return {
    width,
    height: Math.max(1, Math.round(width * variant.height / variant.width)),
  };
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch (error) {
    console.warn('[Cadence V3] WebGL check failed; using the verified poster.', error);
    return false;
  }
}

async function createCadenceRenderer(canvas, variant, dimensions) {
  const [THREE, { GLTFLoader }, { DRACOLoader }, { RoomEnvironment }] = await Promise.all([
    import('three'),
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/loaders/DRACOLoader.js'),
    import('three/addons/environments/RoomEnvironment.js'),
  ]);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(1);
  renderer.setSize(dimensions.width, dimensions.height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  room.dispose();
  pmrem.dispose();
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.65;

  const hemisphere = new THREE.HemisphereLight(0xeaf1ff, 0x33313a, 1);
  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(-3, 4, 5);
  scene.add(hemisphere, key);

  const draco = new DRACOLoader();
  draco.setDecoderPath(new URL('../assets/vendor/three/draco/', import.meta.url).href);
  draco.setWorkerLimit(1);
  let gltf;
  try {
    gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync(variant.model);
  } finally {
    draco.dispose();
  }
  scene.add(gltf.scene);

  let authoredLights = 0;
  gltf.scene.traverse((object) => {
    if (object.isLight) authoredLights += 1;
    if (!object.isMesh) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (material?.name?.startsWith('SCREEN-') || /registered-screen/.test(object.name)) {
        material.toneMapped = false;
        if (material.map) {
          material.map.colorSpace = THREE.SRGBColorSpace;
          material.map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        }
      }
    });
  });
  if (authoredLights) {
    key.intensity = 0.15;
    hemisphere.intensity = 0.25;
    scene.environmentIntensity = 0.25;
  }

  const camera = gltf.cameras[0];
  if (!camera) throw new Error('Cadence V3 scene has no authored camera');
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const actions = gltf.animations.map((clip) => {
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    return action;
  });
  const duration = Math.max(0, ...gltf.animations.map((clip) => clip.duration));

  function render(progress) {
    const amount = Math.min(1, Math.max(0, progress));
    actions.forEach((action) => {
      action.enabled = true;
      action.paused = false;
    });
    mixer.setTime(Math.min(amount * duration, Math.max(0, duration - 0.000001)));
    camera.aspect = dimensions.width / dimensions.height;
    camera.updateProjectionMatrix();
    scene.updateMatrixWorld(true);
    renderer.render(scene, camera);
  }

  return {
    render,
    dispose() {
      mixer.stopAllAction();
      mixer.uncacheRoot(gltf.scene);
      const geometries = new Set();
      const materials = new Set();
      const textures = new Set();
      gltf.scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) {
          (Array.isArray(object.material) ? object.material : [object.material])
            .forEach((material) => materials.add(material));
        }
      });
      materials.forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value?.isTexture) textures.add(value);
        });
        material.dispose();
      });
      textures.forEach((texture) => texture.dispose());
      geometries.forEach((geometry) => geometry.dispose());
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

function readScene(host) {
  const number = (value) => Number.parseInt(value, 10);
  return {
    desktop: {
      model: host.dataset.desktopModel,
      poster: host.dataset.desktopPoster,
      width: number(host.dataset.desktopWidth),
      height: number(host.dataset.desktopHeight),
    },
    mobile: {
      model: host.dataset.mobileModel,
      poster: host.dataset.mobilePoster,
      width: number(host.dataset.mobileWidth),
      height: number(host.dataset.mobileHeight),
    },
  };
}

function mountScene(host) {
  const scene = readScene(host);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 720px)');
  const saveData = navigator.connection?.saveData === true;
  let webglAvailable;
  const poster = document.createElement('img');
  poster.className = 'cadence-v3-poster';
  poster.alt = '';
  poster.decoding = 'async';
  host.append(poster);

  let viewer;
  let canvas;
  let visible = false;
  let loading = false;
  let frame = 0;
  let generation = 0;

  const variant = () => selectCadenceSceneVariant(scene, window.innerWidth);
  const mode = () => {
    if (reduced.matches || saveData) return 'poster';
    if (webglAvailable === undefined) webglAvailable = supportsWebGL();
    return resolveCadenceSceneMode({
      reducedMotion: false,
      saveData: false,
      webglAvailable,
    });
  };
  const syncFrame = () => {
    frame = 0;
    if (!viewer || !visible || mode() !== 'live') return;
    viewer.render(progressAcrossScene(host.getBoundingClientRect(), window.innerHeight));
  };
  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(syncFrame);
  };
  const dispose = () => {
    generation += 1;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    viewer?.dispose();
    viewer = undefined;
    canvas?.remove();
    canvas = undefined;
    poster.style.visibility = 'visible';
    host.dataset.sceneReady = 'poster';
  };
  const applyVariant = () => {
    const selected = variant();
    host.style.aspectRatio = `${selected.width} / ${selected.height}`;
    poster.src = selected.poster;
    poster.width = selected.width;
    poster.height = selected.height;
    host.dataset.sceneVariant = mobile.matches ? 'mobile' : 'desktop';
  };
  const load = async () => {
    if (!visible || loading || viewer || mode() !== 'live') return;
    loading = true;
    const token = generation;
    const selected = variant();
    const dimensions = renderDimensionsForScene(selected, host.getBoundingClientRect().width);
    canvas = document.createElement('canvas');
    canvas.className = 'cadence-v3-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.append(canvas);
    try {
      const next = await createCadenceRenderer(canvas, selected, dimensions);
      if (token !== generation || !visible || mode() !== 'live') {
        next.dispose();
        return;
      }
      viewer = next;
      syncFrame();
      canvas.style.visibility = 'visible';
      poster.style.visibility = 'hidden';
      host.dataset.sceneReady = 'live';
    } catch (error) {
      if (token === generation) {
        canvas?.remove();
        canvas = undefined;
        host.dataset.sceneError = error instanceof Error ? error.message : 'Scene failed to load';
        console.error('[Cadence V3] Falling back to the verified poster.', error);
      }
    } finally {
      loading = false;
      if (token !== generation && visible && mode() === 'live') load();
    }
  };
  const reset = () => {
    dispose();
    applyVariant();
    if (visible) load();
  };

  applyVariant();
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) load();
    else dispose();
  }, { rootMargin: '120px 0px' });
  observer.observe(host);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', reset);
  mobile.addEventListener('change', reset);
}

function startCadenceScenes() {
  document.querySelectorAll('[data-cadence-v3-scene]').forEach(mountScene);
}

if (typeof document !== 'undefined') startCadenceScenes();
