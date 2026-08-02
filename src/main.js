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

/* ── the hero film: two chaptered clips, scroll-driven ───────────
   The clips weren't generated with last-frame chaining, so this
   plays as a hard-cut chaptered film rather than one blended take:
   clip A (mise en place) then clip B (fire through to the plate),
   each scrubbed by setting currentTime from scroll progress. */
function initFilm() {
  const section = document.querySelector('.film');
  const poster = document.querySelector('.film__poster');
  const videos = gsap.utils.toArray('.film__video');
  const railFill = document.querySelector('.film__rail i');
  const stages = gsap.utils.toArray('.film__stages .stage');
  const brand = document.querySelector('.film__brand');
  if (!section || !videos.length) return;

  /* reduced motion: no pin, no scrub. Poster and chapter 1 only. */
  if (REDUCED) {
    videos.forEach((v) => v.remove());
    return;
  }

  const CHAPTER_END = 0.88; // final 12% is held on the last frame for the logo landing
  const boundary = CHAPTER_END / CHAPTERS; // end of clip A's slice

  const ready = new Uint8Array(videos.length);
  videos.forEach((v, i) => {
    v.addEventListener('loadedmetadata', () => { ready[i] = 1; });
    v.pause();
  });
  videos[0]?.addEventListener('loadeddata', () => poster?.style.setProperty('opacity', '0'), { once: true });

  let activeIndex = -1;
  const setActive = (i) => {
    if (i === activeIndex) return;
    activeIndex = i;
    videos.forEach((v, n) => v.classList.toggle('is-active', n === i));
  };
  setActive(0);

  let activeStage = -1;
  const setStage = (i) => {
    if (i === activeStage) return;
    activeStage = i;
    stages.forEach((el, n) => el.classList.toggle('is-active', n === i));
  };
  setStage(0);

  let raf = null;
  let pendingP = 0;
  const render = () => {
    raf = null;
    const p = pendingP;
    const clipIndex = p < boundary ? 0 : 1;
    setActive(clipIndex);
    const v = videos[clipIndex];
    if (!ready[clipIndex] || !v.duration) return;
    const local = clipIndex === 0
      ? p / boundary
      : (p - boundary) / (CHAPTER_END - boundary);
    v.currentTime = gsap.utils.clamp(0, v.duration, gsap.utils.clamp(0, 1, local) * v.duration);
  };
  const schedule = () => {
    if (raf === null) raf = requestAnimationFrame(render);
  };

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate: (self) => {
      const p = self.progress;
      pendingP = p;
      schedule();

      if (railFill) gsap.set(railFill, { scaleY: p });

      /* chapters occupy equal slices, but the last slice hands the
         final 12% over to the logo landing */
      const filmPart = Math.min(p / CHAPTER_END, 1);
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
