import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { PROFILE } from '../data'
import { scrollToScene, clamp } from '../engine/director'
import { useScroll, useIntro } from '../engine/hooks'
import { Btn } from '../components/Chrome'
import { Sec, idx, fadeA } from './util'
const I = idx('hero')

export function HeroBack() {
  const root = useRef<HTMLDivElement>(null)
  useIntro(() => gsap.fromTo('.hero-l', { yPercent: 115, rotateX: -80, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, stagger: 0.07, duration: 1.6, ease: 'expo.out' }))
  useScroll((st) => {
    const s = st.s[I]; if (!root.current) return
    root.current.style.opacity = String(Math.max(0, 1 - s.exit * 2.4) * (1 - st.s[I + 1].enter * 1.5 > 0 ? 1 : 0))
    root.current.querySelectorAll<HTMLElement>('.hero-w').forEach((l, i) => { l.style.marginTop = `${(i % 2 ? 1 : -1) * s.p * 14}px` })
  })
  return (
    <div ref={root} className="hero-name"><span className="hero-wrap">
      {PROFILE.first.split('').map((c, i) => <span key={i} className="hero-w"><span className="hero-l">{c}</span></span>)}
    </span></div>
  )
}
export function HeroFront() {
  const txt = useRef<HTMLDivElement>(null)
  useEffect(() => { gsap.set('.hero-line > span', { yPercent: 110 }) }, [])
  useIntro(() => {
    gsap.fromTo('.hero-line > span', { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: 0.25 })
    gsap.fromTo('.hero-fade', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.7 })
  })
  useScroll((st) => {
    const s = st.s[I]; if (!txt.current) return
    txt.current.style.opacity = String(Math.max(0, 1 - s.exit * 2.4))
    txt.current.querySelectorAll<HTMLElement>('.hl').forEach((h, i) => { h.style.backgroundSize = `${clamp(s.p * 3.2 - i * 0.8 - 0.15) * 100}% 38%` })
  })
  return (
    <Sec id="hero"><div ref={txt} className="hero-front">
      <div className="hero-hi hero-fade">Hi, I'm <b>{PROFILE.name}</b> —</div>
      <h1 className="hero-title"><span className="hero-line"><span>AI &amp; DATA SCIENCE</span></span><span className="hero-line red"><span>ENGINEER.</span></span></h1>
      <p className="hero-desc hero-fade">{PROFILE.tagline.map((l, i) => <span key={i} className="hl">{l} </span>)}</p>
      <div className="btns hero-fade"><Btn red cur="Go" onClick={() => scrollToScene('work')}>See my work ↘</Btn><Btn href={PROFILE.resume} cur="PDF" dl>Download résumé</Btn></div>
    </div></Sec>
  )
}
export const _f = fadeA
