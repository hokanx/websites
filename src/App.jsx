import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FilmHero from './sections/FilmHero.jsx'
import { About, Menu, Process, Reviews, Contact, Footer } from './sections/Sections.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Without this bridge the canvas scrub stutters against Lenis' own RAF.
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <FilmHero />
      <main>
        <About />
        <Menu />
        <Process />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
