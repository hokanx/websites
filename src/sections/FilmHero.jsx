import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { business, chapters } from '../data/business.js'
import Logo from '../components/Logo.jsx'
import './film-hero.css'

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = chapters.length
const MANIFEST = `${import.meta.env.BASE_URL}frames/hero/manifest.json`

/** Cover-fit draw so the film never letterboxes, whatever the viewport. */
function drawCover(ctx, img, w, h) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

export default function FilmHero() {
  const rootRef = useRef(null)
  const stickyRef = useRef(null)
  const canvasRef = useRef(null)
  const railRef = useRef(null)
  const logoRef = useRef(null)
  const stageRefs = useRef([])
  const [hasFilm, setHasFilm] = useState(false)
  const [hasPoster, setHasPoster] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: false })
    let frames = []
    let images = []
    let loadedCount = 0
    let current = -1
    let cancelled = false
    const ctxTriggers = []

    /* ---------- canvas sizing ---------- */
    const resize = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { clientWidth: w, clientHeight: h } = canvas
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        render(current < 0 ? 0 : current, true)
      }
    }

    /** Draw the requested frame, or the nearest already-loaded one. */
    const render = (index, force = false) => {
      if (!ctx || !images.length) return
      let i = Math.max(0, Math.min(images.length - 1, Math.round(index)))
      if (!images[i]?.complete || !images[i]?.naturalWidth) {
        let nearest = -1
        for (let d = 1; d < images.length; d++) {
          const lo = i - d
          const hi = i + d
          if (lo >= 0 && images[lo]?.complete && images[lo].naturalWidth) {
            nearest = lo
            break
          }
          if (hi < images.length && images[hi]?.complete && images[hi].naturalWidth) {
            nearest = hi
            break
          }
        }
        if (nearest < 0) return
        i = nearest
      }
      if (i === current && !force) return
      current = i
      drawCover(ctx, images[i], canvas.clientWidth, canvas.clientHeight)
    }

    /* ---------- frame streaming: 6 parallel loaders ---------- */
    const stream = () => {
      let cursor = 0
      const LANES = 6
      const next = () => {
        if (cancelled) return
        const i = cursor++
        if (i >= frames.length) return
        const img = new Image()
        img.decoding = 'async'
        img.onload = img.onerror = () => {
          loadedCount++
          if (loadedCount === 1) render(0, true)
          next()
        }
        img.src = frames[i]
        images[i] = img
      }
      for (let l = 0; l < LANES; l++) next()
    }

    /* ---------- scroll wiring ---------- */
    const wire = () => {
      const stages = stageRefs.current.filter(Boolean)

      // Stage 1 must be fully visible at scroll 0, before any trigger fires.
      stages.forEach((el, i) => {
        gsap.set(el, {
          clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
          yPercent: i === 0 ? 0 : 8,
        })
      })
      if (railRef.current) gsap.set(railRef.current, { scaleY: 0 })
      if (logoRef.current) gsap.set(logoRef.current, { autoAlpha: 0, scale: 0.86 })

      if (reduced) {
        // No pin, no scrub: land on the last frame and leave chapter 1 readable.
        if (images.length) render(images.length - 1, true)
        if (logoRef.current) gsap.set(logoRef.current, { autoAlpha: 1, scale: 1 })
        return
      }

      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyRef.current,
        pinSpacing: false,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress

          if (frames.length) render(p * (frames.length - 1))

          if (railRef.current) gsap.set(railRef.current, { scaleY: p })

          // Chapter stages: transform + clip only, never opacity-to-zero.
          // Chapter one carries no reveal, so it is already whole at progress 0.
          const span = 1 / CHAPTERS
          const REVEAL = 0.16
          stages.forEach((el, i) => {
            const start = i * span
            const end = (i + 1) * span

            if (p < start) {
              // Waiting below the line.
              gsap.set(el, { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 8 })
            } else if (i < CHAPTERS - 1 && p >= end) {
              // Already pressed through, clipped away upward.
              gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)', yPercent: -6 })
            } else {
              const local = gsap.utils.clamp(0, 1, (p - start) / span)
              const t = i === 0 ? 1 : gsap.utils.clamp(0, 1, local / REVEAL)
              gsap.set(el, {
                clipPath: `inset(0% 0% ${(1 - t) * 100}% 0%)`,
                yPercent: (1 - t) * 8,
              })
            }
          })

          // Logo landing in the final 5% — always the real, crisp logo file.
          if (logoRef.current) {
            const l = gsap.utils.clamp(0, 1, (p - 0.95) / 0.05)
            gsap.set(logoRef.current, { autoAlpha: l, scale: 0.86 + l * 0.14 })
          }
        },
      })
      ctxTriggers.push(st)
    }

    /* ---------- boot ---------- */
    resize()
    window.addEventListener('resize', resize)

    fetch(MANIFEST)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no manifest'))))
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data) ? data : data.frames
        if (!list?.length) throw new Error('empty manifest')
        frames = list.map((f) => `${import.meta.env.BASE_URL}frames/hero/${f}`)
        images = new Array(frames.length)
        setHasFilm(true)
        stream()
        wire()
        ScrollTrigger.refresh()
      })
      .catch(() => {
        // No film yet: the poster and chapter one still carry the hero.
        if (!cancelled) wire()
      })

    return () => {
      cancelled = true
      window.removeEventListener('resize', resize)
      ctxTriggers.forEach((t) => t.kill())
    }
  }, [])

  return (
    <header
      ref={rootRef}
      className="film"
      style={{ '--chapters': CHAPTERS }}
      aria-label={`${business.name} — the film`}
    >
      <div ref={stickyRef} className="film__sticky">
        {/* Poster paints a finished hero before JS or frames arrive. If the
            still has not been delivered yet, the sticky layer's own ground
            gradient carries the hero instead of showing a broken image. */}
        {hasPoster && (
          <img
            className="film__poster"
            src={`${import.meta.env.BASE_URL}assets/hero-poster.jpg`}
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority="high"
            onError={() => setHasPoster(false)}
          />
        )}
        <canvas
          ref={canvasRef}
          className={`film__canvas${hasFilm ? ' is-live' : ''}`}
          aria-hidden="true"
        />
        <div className="film__scrim" aria-hidden="true" />

        <div className="film__rail" aria-hidden="true">
          <span ref={railRef} className="film__rail-fill" />
        </div>

        <div className="film__topbar">
          <span className="mono">{business.name}</span>
          <span className="mono ar">{business.nameAr}</span>
        </div>

        <div className="film__stages">
          {chapters.map((c, i) => (
            <div
              key={c.kicker}
              className="film__stage"
              ref={(el) => (stageRefs.current[i] = el)}
            >
              <span className="mono film__stage-kicker">{c.kicker}</span>
              <h1 className="film__stage-headline">{c.headline}</h1>
              <p className="film__stage-body">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Logo landing — the real mark, unclipped by scroll progress. */}
        <div ref={logoRef} className="film__logo" aria-hidden="true">
          <Logo className="film__logo-mark" height={undefined} />
        </div>

        <a className="cta-notch film__cta" href={business.order.primary.url} target="_blank" rel="noopener noreferrer">
          <span>Order now</span>
        </a>

        <span className="mono film__hint">Scroll to press</span>
      </div>
    </header>
  )
}
