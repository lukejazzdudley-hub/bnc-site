export function resolveMediaMode({ reducedMotion, saveData }) {
  return reducedMotion || saveData ? 'static' : 'motion';
}

export function shouldPlayMedia({
  documentVisible,
  intersecting,
  reducedMotion,
  saveData,
}) {
  return documentVisible && intersecting && !reducedMotion && !saveData;
}

const MIN_ACTIVE_RATIO = 0.35;

export function selectActiveMedia(candidates) {
  let selected = null;

  for (const candidate of candidates) {
    if (!candidate.intersecting || candidate.ratio < MIN_ACTIVE_RATIO) continue;
    if (!selected || candidate.ratio > selected.ratio) selected = candidate;
  }

  return selected?.media ?? null;
}

export function normalizedScrollProgress({ start, end, position }) {
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (position - start) / (end - start)));
}

function visitorPreferences() {
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: Boolean(navigator.connection?.saveData),
  };
}

function mediaController() {
  const videos = [...document.querySelectorAll('video[data-autoplay]')];
  if (!videos.length) return;

  const preferences = visitorPreferences();
  const intersections = new Map();
  const visitorMode = resolveMediaMode(preferences);
  document.body.classList.toggle('is-static', visitorMode === 'static');

  const updateVideo = (video, activeVideo) => {
    const canPlay = shouldPlayMedia({
      ...preferences,
      documentVisible: document.visibilityState === 'visible',
      intersecting: video === activeVideo,
    });

    if (!canPlay || video.dataset.manuallyPaused === 'true') {
      video.pause();
      return;
    }

    video.play().catch(() => {
      video.dataset.manuallyPaused = 'true';
      syncToggle(video);
    });
  };

  const syncToggle = (video) => {
    const button = video.parentElement?.querySelector('[data-media-toggle]');
    if (!button) return;
    const paused = video.paused || video.dataset.manuallyPaused === 'true';
    button.textContent = paused ? 'Play' : 'Pause';
    button.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} ${video.getAttribute('aria-label') || 'product demonstration'}`);
  };

  const reconcileVideos = () => {
    const activeVideo = selectActiveMedia(videos.map((video) => ({
      media: video,
      ...(intersections.get(video) || { intersecting: false, ratio: 0 }),
    })));

    for (const video of videos) {
      updateVideo(video, activeVideo);
      syncToggle(video);
    }
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      intersections.set(entry.target, {
        intersecting: entry.isIntersecting,
        ratio: entry.intersectionRatio,
      });
    }
    reconcileVideos();
  }, { threshold: [0, 0.35, 0.7] });

  for (const video of videos) {
    intersections.set(video, { intersecting: false, ratio: 0 });
    observer.observe(video);
    video.addEventListener('play', () => syncToggle(video));
    video.addEventListener('pause', () => syncToggle(video));

    const button = video.parentElement?.querySelector('[data-media-toggle]');
    button?.addEventListener('click', () => {
      const shouldResume = video.paused || video.dataset.manuallyPaused === 'true';
      video.dataset.manuallyPaused = shouldResume ? 'false' : 'true';
      if (shouldResume) {
        reconcileVideos();
      } else {
        video.pause();
      }
      syncToggle(video);
    });
  }

  document.addEventListener('visibilitychange', () => {
    reconcileVideos();
  });
}

function sceneController() {
  const pointerScene = document.querySelector('[data-pointer-scene]');
  const scrollScenes = [...document.querySelectorAll('[data-scroll-scene]')];
  const { reducedMotion } = visitorPreferences();
  if (reducedMotion) return;

  pointerScene?.addEventListener('pointermove', (event) => {
    const bounds = pointerScene.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    pointerScene.style.setProperty('--pointer-x', x.toFixed(3));
    pointerScene.style.setProperty('--pointer-y', y.toFixed(3));
  });

  pointerScene?.addEventListener('pointerleave', () => {
    pointerScene.style.setProperty('--pointer-x', '0');
    pointerScene.style.setProperty('--pointer-y', '0');
  });

  let frameRequested = false;
  const updateScenes = () => {
    frameRequested = false;
    for (const scene of scrollScenes) {
      const bounds = scene.getBoundingClientRect();
      const progress = normalizedScrollProgress({
        start: -bounds.height,
        end: window.innerHeight,
        position: -bounds.top,
      });
      scene.style.setProperty('--scene-progress', progress.toFixed(3));
    }
  };

  window.addEventListener('scroll', () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateScenes);
  }, { passive: true });

  updateScenes();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  mediaController();
  sceneController();
}
