/* ═══════════════════════════════════════════════════════════════
   Shi · scroll-scrub engine
   The visitor's scroll plays one continuous film in a pinned hero.
   ═══════════════════════════════════════════════════════════════ */

import '@fontsource/archivo-black/400.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CHAPTERS = 3;

/* ── smooth scroll ─────────────────────────────────────────────
   Lenis must NOT run its own rAF. GSAP drives it and pushes every
   frame into ScrollTrigger, otherwise the scrub stutters. */
function initSmoothScroll() {
  if (REDUCED) return null;

  const lenis = new Lenis({
    autoRaf: false,
    duration: 1.1,
    smoothWheel: true,
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/* ── frame sequence loader ─────────────────────────────────────
   Streams the webp sequence with a small parallel pool and always
   draws the nearest frame that has actually arrived. */
class FrameSequence {
  constructor({ count, path, pad, ext }) {
    this.count = count;
    this.path = path;
    this.pad = pad;
    this.ext = ext;
    this.images = new Array(count).fill(null);
    this.loaded = new Uint8Array(count);
    this.loadedTotal = 0;
  }

  url(i) {
    return `${this.path}/f-${String(i + 1).padStart(this.pad, '0')}.${this.ext}`;
  }

  loadOne(i) {
    return new Promise((resolve) => {
      if (this.loaded[i]) return resolve();
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        this.images[i] = img;
        this.loaded[i] = 1;
        this.loadedTotal += 1;
        resolve();
      };
      img.onerror = () => resolve();
      img.src = this.url(i);
    });
  }

  /* frame 1 first so the canvas can take over from the poster fast,
     then everything else through a 6-wide pool */
  async start(onFirst) {
    await this.loadOne(0);
    onFirst?.();

    const queue = [];
    for (let i = 1; i < this.count; i++) queue.push(i);

    const POOL = 6;
    const workers = Array.from({ length: POOL }, async () => {
      while (queue.length) {
        const i = queue.shift();
        if (i === undefined) break;
        await this.loadOne(i);
      }
    });
    await Promise.all(workers);
  }

  /* nearest loaded frame, searching outward from the wanted index */
  nearest(index) {
    if (this.loaded[index]) return this.images[index];
    for (let d = 1; d < this.count; d++) {
      const lo = index - d;
      const hi = index + d;
      if (lo >= 0 && this.loaded[lo]) return this.images[lo];
      if (hi < this.count && this.loaded[hi]) return this.images[hi];
    }
    return null;
  }
}

/* ── cover-fit canvas renderer ─────────────────────────────────── */
class CanvasStage {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.current = null;
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      if (this.current) this.draw(this.current);
    }, { passive: true });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }

  draw(img) {
    if (!img) return;
    this.current = img;
    const { ctx, w, h } = this;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }
}

/* ── the hero film ─────────────────────────────────────────────── */
async function initFilm() {
  const section = document.querySelector('.film');
  const canvas = document.querySelector('.film__canvas');
  const poster = document.querySelector('.film__poster');
  const railFill = document.querySelector('.film__rail i');
  const stages = gsap.utils.toArray('.film__stages .stage');
  const brand = document.querySelector('.film__brand');
  if (!section || !canvas) return;

  /* reduced motion: no pin, no scrub. Poster and chapter 1 only. */
  if (REDUCED) {
    canvas.remove();
    return;
  }

  let manifest;
  try {
    const res = await fetch('/frames/hero/manifest.json', { cache: 'force-cache' });
    if (!res.ok) throw new Error('no manifest');
    manifest = await res.json();
  } catch {
    /* film not generated yet: the poster stays, the page still works */
    canvas.remove();
    return;
  }

  const seq = new FrameSequence({
    count: manifest.count,
    path: manifest.path || '/frames/hero',
    pad: manifest.pad || 3,
    ext: manifest.ext || 'webp',
  });

  const stage = new CanvasStage(canvas);
  const state = { frame: 0 };
  let raf = null;

  const render = () => {
    raf = null;
    const idx = Math.min(seq.count - 1, Math.max(0, Math.round(state.frame)));
    const img = seq.nearest(idx);
    if (img) stage.draw(img);
  };
  const schedule = () => {
    if (raf === null) raf = requestAnimationFrame(render);
  };

  seq.start(() => {
    stage.draw(seq.images[0]);
    poster?.style.setProperty('opacity', '0');
  }).then(schedule);

  /* one trigger drives frame index, rail, chapter stages and logo */
  let activeStage = -1;
  const setStage = (i) => {
    if (i === activeStage) return;
    activeStage = i;
    stages.forEach((el, n) => el.classList.toggle('is-active', n === i));
  };
  setStage(0);

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate: (self) => {
      const p = self.progress;

      state.frame = p * (seq.count - 1);
      schedule();

      if (railFill) gsap.set(railFill, { scaleY: p });

      /* chapters occupy equal slices, but the last slice hands the
         final 12% over to the logo landing */
      const filmPart = Math.min(p / 0.88, 1);
      setStage(Math.min(CHAPTERS - 1, Math.floor(filmPart * CHAPTERS)));

      if (brand) {
        const t = gsap.utils.clamp(0, 1, (p - 0.95) / 0.05);
        gsap.set(brand, {
          opacity: t,
          backgroundColor: `rgba(12,31,36,${t * 0.82})`,
        });
        gsap.set(brand.querySelector('.film__wordmark'), {
          scale: 0.92 + t * 0.08,
        });
      }
    },
  });
}

/* ── section motion ────────────────────────────────────────────── */
function initSections() {
  if (REDUCED) return;

  /* gallery parallax, transform only */
  gsap.utils.toArray('.tile').forEach((tile) => {
    const depth = parseFloat(tile.dataset.par || '0.05');
    gsap.fromTo(
      tile,
      { y: 0 },
      {
        y: () => -window.innerHeight * depth,
        ease: 'none',
        scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });

  /* process rail draws with scroll */
  const railFill = document.querySelector('.process__rail i');
  if (railFill) {
    gsap.fromTo(
      railFill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top',
        scrollTrigger: { trigger: '.process', start: 'top 70%', end: 'bottom 80%', scrub: 0.5 },
      }
    );
  }

  /* steps and rows rise in once */
  gsap.utils.toArray('.step, .row, .info-block, .meta-rail > div').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  });
}

/* ── boot ──────────────────────────────────────────────────────── */
initSmoothScroll();
initFilm();
initSections();

window.addEventListener('load', () => ScrollTrigger.refresh());
