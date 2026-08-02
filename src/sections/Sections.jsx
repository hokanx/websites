import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { business, menu, reviews, process } from '../data/business.js'
import Logo from '../components/Logo.jsx'
import './sections.css'

gsap.registerPlugin(ScrollTrigger)

const Label = ({ n, children }) => (
  <div className="section__label">
    <span className="mono">{n}</span>
    <span className="mono">{children}</span>
  </div>
)

/* ---------------- 02 · About — editorial offset ---------------- */

export function About() {
  return (
    <section className="section about" id="about">
      <Label n="02">The idea</Label>
      <div className="about__grid">
        <div className="about__lead">
          <h2>
            A stamp is one
            <br />
            press. So is
            <br />
            <em>a burger.</em>
          </h2>
          <p className="about__body">
            STAMP BURGER is a home-grown Saudi burger brand. The build is short on
            purpose: two cuts of beef, one house sauce, cheddar, and a bun that
            comes down once. Everything on the board is a variation of that single
            gesture, which is where the name comes from.
          </p>
          <p className="about__body">
            The Al Yasmeen counter sits on Al Qadisiyah Street, and the kitchen now
            runs across most of Riyadh.
          </p>
        </div>

        <aside className="about__rail">
          <div className="about__rail-row">
            <span className="mono">Street</span>
            <span>{business.address.street}</span>
          </div>
          <div className="about__rail-row">
            <span className="mono">City</span>
            <span>
              {business.address.city} {business.address.postcode}
            </span>
          </div>
          <div className="about__rail-row">
            <span className="mono">Rated</span>
            <span>
              {business.rating.value}/{business.rating.outOf} · {business.rating.count}{' '}
              ratings
              <small className="mono"> {business.rating.source}</small>
            </span>
          </div>
          <div className="about__rail-row">
            <span className="mono">Riyadh</span>
            <span className="about__branches">
              {business.branches.join(' · ')}
            </span>
          </div>
          <div className="about__rail-row">
            <span className="mono">Social</span>
            <span>
              <a href={business.social.instagram} target="_blank" rel="noopener noreferrer">
                {business.social.instagramHandle}
              </a>
            </span>
          </div>
        </aside>
      </div>
    </section>
  )
}

/* ---------------- 03 · Menu — accordion rows ---------------- */

export function Menu() {
  const [open, setOpen] = useState(menu[0].id)

  return (
    <section className="section menu" id="menu">
      <Label n="03">The stamps</Label>

      <ul className="menu__list">
        {menu.map((item) => {
          const isOpen = open === item.id
          return (
            <li key={item.id} className={`menu__row${isOpen ? ' is-open' : ''}`}>
              <button
                className="menu__trigger"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
              >
                <span className="mono menu__kicker">{item.kicker}</span>
                <h3 className="menu__name">{item.name}</h3>
                <span className="menu__mark" aria-hidden="true" />
              </button>
              <div
                className="menu__panel"
                id={`panel-${item.id}`}
                role="region"
                hidden={!isOpen}
              >
                <p className="menu__spec mono">{item.spec}</p>
                <p className="menu__note">{item.note}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="menu__pricing mono">
        Prices change by branch and platform. HungerStation carries the live board.
      </p>

      <a
        className="cta-underline"
        href={business.order.primary.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="mono">Full board</span>
        <span className="cta-underline__label">Full menu on HungerStation</span>
      </a>
    </section>
  )
}

/* ---------------- 04 · Process — numbered rail journey ---------------- */

const glyphs = [
  // grinder
  <>
    <path d="M4 9h11l4 3-4 3H4z" />
    <path d="M8 15v4h6" />
    <circle cx="7" cy="12" r="1.4" />
  </>,
  // griddle + heat
  <>
    <path d="M3 15h18" />
    <path d="M5 15v2h14v-2" />
    <path d="M8 10c0-1.5 1.5-1.8 1.5-3.4M12 10c0-1.5 1.5-1.8 1.5-3.4M16 10c0-1.5 1.5-1.8 1.5-3.4" />
  </>,
  // squeeze bottle + drop
  <>
    <path d="M10 4h4v3l2 2v11H8V9l2-2z" />
    <path d="M18 8c.9 1.2 1.4 2 1.4 2.7a1.4 1.4 0 1 1-2.8 0c0-.7.5-1.5 1.4-2.7z" />
  </>,
  // stamp pressing down
  <>
    <path d="M9 4h6v4l1.5 4h-9L9 8z" />
    <path d="M5 16h14" />
    <path d="M7 19h10" />
  </>,
]

export function Process() {
  const ref = useRef(null)
  const railRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(railRef.current, { scaleY: 1 })
      return
    }
    gsap.set(railRef.current, { scaleY: 0 })
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 78%',
      end: 'bottom 68%',
      scrub: 0.7,
      onUpdate: (self) => gsap.set(railRef.current, { scaleY: self.progress }),
    })
    return () => st.kill()
  }, [])

  return (
    <section className="section process" id="process" ref={ref}>
      <Label n="04">How it is built</Label>

      <div className="process__wrap">
        <div className="process__track" aria-hidden="true">
          <span ref={railRef} className="process__track-fill" />
        </div>

        <ol className="process__steps">
          {process.map((step, i) => (
            <li key={step.n} className="process__step">
              <span className="process__dot" aria-hidden="true" />
              <span className="mono process__n">{step.n}</span>
              <svg
                className="process__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {glyphs[i]}
              </svg>
              <h3 className="process__title">{step.title}</h3>
              <p className="process__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- 05 · Reviews — giant numeral ---------------- */

export function Reviews() {
  return (
    <section className="section reviews" id="reviews">
      <Label n="05">What people say</Label>

      <div className="reviews__grid">
        <div className="reviews__score">
          <span className="reviews__numeral">{business.rating.value}</span>
          <div className="reviews__meta">
            <span className="mono">out of {business.rating.outOf}</span>
            <span className="mono">{business.rating.count} ratings</span>
            <span className="mono">{business.rating.tips} tips</span>
            <span className="mono">{business.rating.photos} photos</span>
          </div>
        </div>

        <ul className="reviews__list">
          {reviews.map((r) => (
            <li key={r.quote} className="reviews__item">
              <blockquote>“{r.quote}”</blockquote>
              <span className="mono">{r.source}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        className="cta-ticket"
        href={business.rating.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read all {business.rating.tips} tips
      </a>
    </section>
  )
}

/* ---------------- 06 · Contact — colour-blocked diptych ---------------- */

export function Contact() {
  const { address, order, social, phone, hours } = business

  return (
    <section className="section contact" id="order">
      <Label n="06">Order · find us</Label>

      <div className="contact__diptych">
        <div className="contact__block">
          <h2 className="contact__headline">
            Get
            <br />
            stamped
          </h2>
          <p className="contact__sub">
            Delivery runs through HungerStation, Ninja and The Chefz across Riyadh.
          </p>
          <a
            className="cta-press"
            href={order.primary.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {order.primary.label}
          </a>
          <ul className="contact__alts">
            {order.others.map((o) => (
              <li key={o.label}>
                <a className="mono" href={o.url} target="_blank" rel="noopener noreferrer">
                  {o.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="contact__info">
          <div className="contact__row">
            <span className="mono">Address</span>
            <address>
              {address.street}
              <br />
              {address.city} {address.postcode}
              <br />
              {address.country}
            </address>
          </div>

          {hours && (
            <div className="contact__row">
              <span className="mono">Hours</span>
              <ul className="contact__hours">
                {hours.map((h) => (
                  <li key={h.day}>
                    <span className="mono">{h.day}</span>
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {phone && (
            <div className="contact__row">
              <span className="mono">Phone</span>
              <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
            </div>
          )}

          <div className="contact__row">
            <span className="mono">Instagram</span>
            <a href={social.instagram} target="_blank" rel="noopener noreferrer">
              {social.instagramHandle}
            </a>
          </div>

          <div className="contact__row">
            <span className="mono">Branches</span>
            <p className="contact__branches">{business.branches.join(' · ')}</p>
          </div>

          <a
            className="cta-chevron mono"
            href={address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------------- footer ---------------- */

export function Footer() {
  return (
    <footer className="footer">
      {/* Three-line lockup, so it needs more height than a single-line wordmark. */}
      <Logo className="footer__logo" height={56} />
      <span className="mono">
        {business.address.street} · {business.address.city} {business.address.postcode}
      </span>
      <span className="mono ar">{business.nameAr}</span>
    </footer>
  )
}
