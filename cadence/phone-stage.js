const SCREEN_MATERIAL = 'MAT-F03V5-screen-b01-v8-library';

export function resolvePhoneStageMode({ reducedMotion, saveData, webglAvailable }) {
  return reducedMotion || saveData || !webglAvailable ? 'poster' : 'live';
}

export function selectActiveChapter(candidates, viewportHeight) {
  if (!candidates.length) return null;
  const centre = viewportHeight / 2;
  return candidates
    .map((candidate) => ({
      ...candidate,
      distance: candidate.top <= centre && candidate.bottom >= centre
        ? 0
        : Math.min(Math.abs(candidate.top - centre), Math.abs(candidate.bottom - centre)),
    }))
    .sort((left, right) => left.distance - right.distance)[0].chapter;
}

export function cameraOrbitForProgress(pose, progress) {
  const amount = Math.min(1, Math.max(0, progress));
  const interpolate = (from, to) => from + (to - from) * amount;
  return `${interpolate(pose.from.theta, pose.to.theta).toFixed(2)}deg `
    + `${interpolate(pose.from.phi, pose.to.phi).toFixed(2)}deg `
    + `${interpolate(pose.from.radius, pose.to.radius).toFixed(2)}%`;
}

export function smoothMotionProgress(progress) {
  const amount = Math.min(1, Math.max(0, progress));
  return amount * amount * (3 - 2 * amount);
}

export function modelOrientationForProgress(pose, progress) {
  const amount = Math.min(1, Math.max(0, progress));
  const interpolate = (from, to) => from + (to - from) * amount;
  return `${interpolate(pose.from.roll, pose.to.roll).toFixed(2)}deg `
    + `${interpolate(pose.from.pitch, pose.to.pitch).toFixed(2)}deg `
    + `${interpolate(pose.from.yaw, pose.to.yaw).toFixed(2)}deg`;
}

export function progressAcrossBounds(bounds, viewportHeight) {
  const start = viewportHeight * 0.82;
  const end = viewportHeight * 0.18;
  const height = Math.max(0, bounds.bottom - bounds.top);
  return Math.min(1, Math.max(0, (start - bounds.top) / Math.max(1, height + start - end)));
}

export function screenPlanForChapter(chapter) {
  if (chapter.screenImage) return { kind: 'image', source: chapter.screenImage };
  if (chapter.screenVideo) return { kind: 'video', source: chapter.screenVideo };
  return null;
}

export function shouldCommitVideoFrame(video, activeVideo) {
  return Boolean(video && video === activeVideo);
}

export function containRectForSource(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  if (!sourceWidth || !sourceHeight) return { x: 0, y: 0, width: targetWidth, height: targetHeight };
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
    width,
    height,
  };
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch (error) {
    console.warn('[Cadence] WebGL capability check failed; using the poster fallback.', error);
    return false;
  }
}

function visitorMode() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection?.saveData);

  // Do not create even a throwaway WebGL context for visitors who have
  // explicitly requested the lightweight poster experience.
  if (reducedMotion || saveData) return 'poster';

  return resolvePhoneStageMode({ reducedMotion, saveData, webglAvailable: supportsWebGL() });
}

function parsePose(chapter) {
  const parse = (value, fallback) => {
    const parts = String(value || '').split(',').map(Number);
    return parts.length === 3 && parts.every(Number.isFinite)
      ? { theta: parts[0], phi: parts[1], radius: parts[2] }
      : fallback;
  };
  return {
    from: parse(chapter.dataset.poseFrom, { theta: -10, phi: 78, radius: 105 }),
    to: parse(chapter.dataset.poseTo, { theta: 8, phi: 82, radius: 96 }),
  };
}

function parseOrientation(chapter) {
  const parse = (value, fallback) => {
    const parts = String(value || '').split(',').map(Number);
    return parts.length === 3 && parts.every(Number.isFinite)
      ? { roll: parts[0], pitch: parts[1], yaw: parts[2] }
      : fallback;
  };
  return {
    from: parse(chapter.dataset.orientationFrom, { roll: 15, pitch: -4, yaw: -8 }),
    to: parse(chapter.dataset.orientationTo, { roll: 15, pitch: 0, yaw: 0 }),
  };
}

function progressForChapter(chapter) {
  return progressAcrossBounds(chapter.getBoundingClientRect(), window.innerHeight);
}

function makeVideo(source) {
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;
  video.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none';
  video.src = source;
  document.body.append(video);
  return video;
}

async function waitForModel(viewer) {
  const isReady = () => Boolean(viewer.loaded || viewer.model?.materials?.length);
  if (isReady()) return;
  await new Promise((resolve, reject) => {
    let frames = 0;
    const cleanup = () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
    };
    const handleLoad = () => {
      cleanup();
      resolve();
    };
    const handleError = (error) => {
      cleanup();
      reject(error);
    };
    const checkReady = () => {
      if (isReady()) {
        handleLoad();
        return;
      }
      frames += 1;
      if (frames >= 180) {
        handleError(new Error('Cadence phone model timed out'));
        return;
      }
      window.requestAnimationFrame(checkReady);
    };
    viewer.addEventListener('load', handleLoad, { once: true });
    viewer.addEventListener('error', handleError, { once: true });
    window.requestAnimationFrame(checkReady);
  });
}

async function initialiseViewer(viewer) {
  viewer.dataset.initialising = 'true';
  await waitForModel(viewer);
  viewer.dataset.modelReady = 'true';
  const material = viewer.model?.getMaterialByName(SCREEN_MATERIAL);
  const baseColorTexture = material?.pbrMetallicRoughness?.baseColorTexture;
  if (!baseColorTexture || !material?.emissiveTexture) {
    throw new Error(`Cadence screen material ${SCREEN_MATERIAL} is missing`);
  }

  const setScreenTexture = (texture) => {
    baseColorTexture.setTexture(texture);
    material.emissiveTexture.setTexture(texture);
  };

  if (viewer.dataset.staticScreen) {
    const imageTexture = await viewer.createTexture(viewer.dataset.staticScreen);
    setScreenTexture(imageTexture);
    viewer.dataset.screenBound = 'true';
    viewer.dataset.controllerReady = 'true';
    viewer.dispatchEvent(new CustomEvent('cadence-phone-ready', { bubbles: true }));
    return;
  }

  const story = viewer.closest('[data-phone-story]');
  const chapters = story
    ? [...story.querySelectorAll('[data-phone-chapter]')]
    : [viewer.closest('[data-phone-chapter]')].filter(Boolean);
  const imageChapter = chapters.length === 1 && chapters[0].dataset.screenImage
    ? chapters[0]
    : null;
  let canvasTexture = null;
  let canvas = null;
  let context = null;

  if (imageChapter) {
    const imageTexture = await viewer.createTexture(imageChapter.dataset.screenImage);
    setScreenTexture(imageTexture);
  } else {
    canvasTexture = viewer.createCanvasTexture();
    canvas = canvasTexture.source.element;
    context = canvas.getContext('2d', { alpha: false });
    canvas.width = 620;
    canvas.height = 1348;
    baseColorTexture.setTexture(canvasTexture);
    material.emissiveTexture.setTexture(canvasTexture);
  }
  viewer.dataset.screenBound = 'true';

  const videos = new Map();
  const images = new Map();
  let activeChapter = null;
  let activeVideo = null;
  let frameRequested = false;

  const drawFrame = (video) => {
    if (!shouldCommitVideoFrame(video, activeVideo)
      || !context || !canvas || !canvasTexture || !video.videoWidth || !video.videoHeight) return;
    const destination = containRectForSource(
      video.videoWidth,
      video.videoHeight,
      canvas.width,
      canvas.height,
    );
    context.fillStyle = '#17181d';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(0, canvas.height);
    context.scale(1, -1);
    context.drawImage(video, destination.x, destination.y, destination.width, destination.height);
    context.restore();
    setScreenTexture(canvasTexture);
    canvasTexture.source.update();
    viewer.dataset.screenFrame = `${video.currentSrc}@${video.currentTime.toFixed(2)}`;
  };

  const imageFor = (chapter) => {
    if (!images.has(chapter)) images.set(chapter, viewer.createTexture(chapter.dataset.screenImage));
    return images.get(chapter);
  };

  const videoFor = (chapter) => {
    if (videos.has(chapter)) return videos.get(chapter);
    const video = makeVideo(chapter.dataset.screenVideo);
    video.addEventListener('loadedmetadata', requestUpdate, { once: true });
    video.addEventListener('loadeddata', () => drawFrame(video));
    video.addEventListener('seeked', () => drawFrame(video));
    video.addEventListener('error', () => {
      viewer.dataset.screenError = video.error?.message || 'screen video failed';
    });
    video.load();
    videos.set(chapter, video);
    return video;
  };

  const update = () => {
    frameRequested = false;
    viewer.dataset.updateCount = String(Number(viewer.dataset.updateCount || 0) + 1);
    const candidates = chapters.map((chapter) => {
      const bounds = chapter.getBoundingClientRect();
      return { chapter, top: bounds.top, bottom: bounds.bottom };
    });
    const chapter = selectActiveChapter(candidates, window.innerHeight);
    if (!chapter) return;

    const progress = progressForChapter(chapter);
    const physicalProgress = story
      ? progressAcrossBounds(story.getBoundingClientRect(), window.innerHeight)
      : progress;
    const motionProgress = smoothMotionProgress(physicalProgress);
    const motionSource = story || chapter;
    viewer.dataset.screenProgress = progress.toFixed(3);
    viewer.dataset.motionProgress = physicalProgress.toFixed(3);
    viewer.cameraOrbit = cameraOrbitForProgress(parsePose(motionSource), motionProgress);
    viewer.orientation = modelOrientationForProgress(parseOrientation(motionSource), motionProgress);
    viewer.fieldOfView = `${(25 - motionProgress * 2).toFixed(2)}deg`;
    viewer.dataset.modelOrientation = viewer.orientation;

    if (activeChapter !== chapter) {
      activeChapter = chapter;
      story?.querySelectorAll('[data-phone-chapter]').forEach((item) => {
        item.classList.toggle('is-active', item === chapter);
      });
      const status = story?.querySelector('[data-phone-status]');
      if (status) status.textContent = chapter.dataset.phoneStatus || '';
    }

    const screenPlan = screenPlanForChapter(chapter.dataset);
    if (screenPlan?.kind === 'image') {
      activeVideo = null;
      imageFor(chapter).then((texture) => {
        if (activeChapter !== chapter) return;
        setScreenTexture(texture);
        viewer.dataset.screenFrame = screenPlan.source;
      });
    } else if (screenPlan?.kind === 'video') {
      const video = videoFor(chapter);
      activeVideo = video;
      viewer.dataset.screenRequested = video.src;
      if (Number.isFinite(video.duration) && video.duration > 0) {
        const target = Math.min(video.duration - 0.04, video.duration * progress);
        viewer.dataset.screenTarget = target.toFixed(2);
        if (Math.abs(video.currentTime - target) > 0.04) video.currentTime = target;
        else drawFrame(video);
      }
    }
  };

  const requestUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  viewer.closest('.cadence-live-device')?.addEventListener('cadence-phone-ready', requestUpdate);
  chapters.filter((chapter) => chapter.dataset.screenVideo).forEach(videoFor);
  chapters.filter((chapter) => chapter.dataset.screenImage).forEach(imageFor);
  requestUpdate();
  viewer.dataset.controllerReady = 'true';
}

function posterSourceForChapter(chapter) {
  if (chapter.dataset.screenImage) return chapter.dataset.screenImage;
  return chapter.dataset.screenVideo?.replace(/\.mp4(?:\?.*)?$/, '.webp') || '';
}

function startPosterStory() {
  document.querySelectorAll('[data-phone-story]').forEach((story) => {
    const chapters = [...story.querySelectorAll('[data-phone-chapter]')];
    const device = story.querySelector('.cadence-live-device');
    const primaryPoster = device?.querySelector('.cadence-phone-model--primary > img[slot="poster"]');
    let frameRequested = false;

    const update = () => {
      frameRequested = false;
      const chapter = selectActiveChapter(chapters.map((item) => {
        const bounds = item.getBoundingClientRect();
        return { chapter: item, top: bounds.top, bottom: bounds.bottom };
      }), window.innerHeight);
      if (!chapter) return;
      chapters.forEach((item) => item.classList.toggle('is-active', item === chapter));
      const status = device?.querySelector('[data-phone-status]');
      if (status) status.textContent = chapter.dataset.phoneStatus || '';
      const source = posterSourceForChapter(chapter);
      if (primaryPoster && source && primaryPoster.getAttribute('src') !== source) {
        primaryPoster.setAttribute('src', source);
      }
    };
    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    requestUpdate();
  });
}

async function startPhoneStages() {
  const viewers = [...document.querySelectorAll('model-viewer[data-live-phone]')];
  if (!viewers.length) return;
  const mode = visitorMode();
  document.documentElement.dataset.phoneStage = mode;
  if (mode !== 'live') {
    startPosterStory();
    return;
  }

  await new Promise((resolve) => {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      resolve();
    }, { rootMargin: '400px' });
    viewers.forEach((viewer) => observer.observe(viewer));
  });

  await import('../assets/vendor/model-viewer.min.js');
  await customElements.whenDefined('model-viewer');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const viewer = entry.target;
      observer.unobserve(viewer);
      initialiseViewer(viewer).catch((error) => {
        viewer.dataset.failed = 'true';
        viewer.dataset.screenError = error instanceof Error ? error.message : 'Cadence phone failed';
        if (viewers.every((item) => item.dataset.failed === 'true')) {
          document.documentElement.dataset.phoneStage = 'poster';
        }
      });
    });
  }, { rootMargin: '400px' });
  viewers.forEach((viewer) => observer.observe(viewer));
}

if (typeof document !== 'undefined') startPhoneStages();
