// ── Audio sources ──
const POP_SOURCES = [
  "/audio/pop2.mp3",
  "/audio/pop2.mp3",
  "/audio/pop2.mp3",
] as const;

const MUSIC_SOURCE = "/audio/music.mp3";

// ── Module-level state (rerender-use-ref-transient-values) ──
let popAudios: HTMLAudioElement[] | null = null;
let musicAudio: HTMLAudioElement | null = null;
let lastPopIndex = -1;
let fadeOutRaf: ReturnType<typeof requestAnimationFrame> | null = null;

// ── Configuration (adjustable at runtime) ──
const DEFAULT_CONFIG = {
  musicVolume: 0.3,
  popVolume: 0.5,
  fadeOutDuration: 800,
  musicLoop: true,
} as const;

type AudioConfig = {
  musicVolume: number;
  popVolume: number;
  fadeOutDuration: number;
  musicLoop: boolean;
};

let config: AudioConfig = { ...DEFAULT_CONFIG };

/** Update audio configuration at runtime */
export function setAudioConfig(partial: Partial<AudioConfig>): void {
  config = { ...config, ...partial };

  if (musicAudio) {
    musicAudio.volume = config.musicVolume;
    musicAudio.loop = config.musicLoop;
  }

  if (popAudios) {
    const len = popAudios.length;
    for (let i = 0; i < len; i++) {
      popAudios[i].volume = config.popVolume;
    }
  }
}

/** Get current audio configuration */
export function getAudioConfig(): Readonly<AudioConfig> {
  return config;
}

/** Initialize audio elements lazily (called once) */
function ensureInitialized(): void {
  if (popAudios) return;

  popAudios = [];
  for (let i = 0; i < POP_SOURCES.length; i++) {
    const audio = new Audio(POP_SOURCES[i]);
    audio.volume = config.popVolume;
    audio.preload = "auto";
    popAudios.push(audio);
  }

  musicAudio = new Audio(MUSIC_SOURCE);
  musicAudio.volume = config.musicVolume;
  musicAudio.loop = config.musicLoop;
  musicAudio.preload = "auto";
}

/** Play a random pop sound (never repeats same consecutively) */
export function playRandomPop(): void {
  ensureInitialized();
  if (!popAudios || popAudios.length === 0) return;

  let index: number;
  if (popAudios.length === 1) {
    index = 0;
  } else {
    do {
      index = (Math.random() * popAudios.length) | 0;
    } while (index === lastPopIndex);
  }

  lastPopIndex = index;

  const audio = popAudios[index];
  audio.currentTime = 0;
  audio.volume = config.popVolume;
  audio.play().catch(() => {
    // Autoplay blocked — user hasn't interacted yet
  });
}

/** Start music playback */
export function playMusic(): void {
  ensureInitialized();
  if (!musicAudio) return;

  // Cancel any ongoing fade out
  if (fadeOutRaf !== null) {
    cancelAnimationFrame(fadeOutRaf);
    fadeOutRaf = null;
  }

  musicAudio.volume = config.musicVolume;
  musicAudio.play().catch(() => {
    // Autoplay blocked
  });
}

/** Stop music with smooth fade out */
export function stopMusic(): void {
  if (!musicAudio) return;

  const startVolume = musicAudio.volume;
  const startTime = performance.now();
  const duration = config.fadeOutDuration;

  function tick() {
    if (!musicAudio) return;

    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out quad for smooth fade
    const eased = 1 - (1 - progress) * (1 - progress);
    musicAudio.volume = startVolume * (1 - eased);

    if (progress < 1) {
      fadeOutRaf = requestAnimationFrame(tick);
    } else {
      musicAudio.pause();
      musicAudio.currentTime = 0;
      musicAudio.volume = config.musicVolume;
      fadeOutRaf = null;
    }
  }

  fadeOutRaf = requestAnimationFrame(tick);
}

/** Check if music is currently playing */
export function isMusicPlaying(): boolean {
  return musicAudio !== null && !musicAudio.paused;
}

/** Cleanup all audio resources */
export function destroyAudio(): void {
  if (fadeOutRaf !== null) {
    cancelAnimationFrame(fadeOutRaf);
    fadeOutRaf = null;
  }

  if (musicAudio) {
    musicAudio.pause();
    musicAudio.currentTime = 0;
    musicAudio = null;
  }

  if (popAudios) {
    const len = popAudios.length;
    for (let i = 0; i < len; i++) {
      popAudios[i].pause();
      popAudios[i].currentTime = 0;
    }
    popAudios = null;
  }

  lastPopIndex = -1;
}
