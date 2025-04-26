let lastUrl = location.href;
let currentVideo = null;
let watchInterval = null;
let lastCurrentTime = 0;

function goToNextShort() {
  const nextButton = document.querySelector('button[aria-label="Siguiente vídeo"]');
  if (nextButton) {
    console.log('✅ Pasando al siguiente Short');
    nextButton.click();
  } else {
    console.warn('⚠️ Botón siguiente no encontrado');
  }
}

function cleanUp() {
  if (watchInterval) {
    clearInterval(watchInterval);
    watchInterval = null;
  }
}

function startWatchingVideo(video) {
  cleanUp();
  lastCurrentTime = 0;

  console.log('🎥 Empezando a observar video...');

  watchInterval = setInterval(() => {
    if (!video || !video.duration) return;

    const current = video.currentTime;
    const duration = video.duration;

    if (lastCurrentTime > 1 && current < 0.5) {
      console.log('🔄 Video se reseteó, saltando...');
      cleanUp();
      goToNextShort();
      return;
    }

    if (duration - current <= 0.5) {
      console.log(`⌛ Casi terminado: ${current.toFixed(2)}s / ${duration.toFixed(2)}s`);
    }

    lastCurrentTime = current;
  }, 200);
}

function findVideoAndWatch() {
  const video = document.querySelector('ytd-reel-video-renderer[is-active] video') || document.querySelector('video');
  if (video) {
    currentVideo = video;
    startWatchingVideo(currentVideo);
  } else {
    console.warn('⚠️ Video no encontrado aún, reintentando...');
    setTimeout(findVideoAndWatch, 500);
  }
}

function observeUrlChange() {
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      console.log(`🔄 Cambio de URL detectado: ${lastUrl} → ${location.href}`);
      lastUrl = location.href;
      findVideoAndWatch();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function initialize() {
  console.log('🚀 Inicializando ShortFlow');
  findVideoAndWatch();
  observeUrlChange();
}

initialize();