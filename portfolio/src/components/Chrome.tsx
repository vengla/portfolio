import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { PROFILE } from '../data'
import { SCENES, scrollToScene, startScroll, state } from '../engine/director'
import { loadFrames } from '../engine/frames'
import { useScroll, isTouch } from '../engine/hooks'

export function Preloader() {
  const top = useRef<HTMLDivElement>(null), bot = useRef<HTMLDivElement>(null), num = useRef<HTMLDivElement>(null), root = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const v = { n: 0 }; let target = 0, ready = false
    const upd = () => { if (num.current) num.current.textContent = String(Math.round(v.n)).padStart(3, '0') }
    const tw = () => gsap.to(v, { n: target * 100, duration: 0.6, ease: 'power2.out', onUpdate: upd, onComplete: () => { if (ready && v.n >= 99.5) finish() } })
    let done = false
    const finish = () => {
      if (done) return; done = true
      const tl = gsap.timeline({ onComplete: () => setGone(true) })
      tl.to('.pre-line', { yPercent: -150, opacity: 0, duration: 0.5, ease: 'power3.in' })
        .to(num.current, { opacity: 0, duration: 0.3 }, '<')
        .to(top.current, { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '>-0.1')
        .to(bot.current, { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, '<')
        .add(() => { dispatchEvent(new Event('intro')); startScroll() }, '-=0.7')
    }
    loadFrames((p) => { target = p; tw() }).then(() => { target = 1; ready = true; tw() })
    return () => { gsap.killTweensOf(v) }
  }, [])
  if (gone) return null
  return (
    <div ref={root} className="pre">
      <div ref={top} className="pre-half top" /><div ref={bot} className="pre-half bot" />
      <div className="pre-mid">
        <div className="pre-line mono">Hari Haran V — Portfolio</div>
        <div ref={num} className="pre-num">000</div>
        <div className="pre-line mono">Loading experience</div>
      </div>
    </div>
  )
}

export function HUD() {
  const root = useRef<HTMLDivElement>(null), pct = useRef<HTMLSpanElement>(null), rail = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  useScroll((s) => {
    if (!root.current) return
    const pr = Math.round((s.y / s.max) * 100)
    if (pct.current) pct.current.textContent = String(pr).padStart(2, '0') + '%'
    if (rail.current) rail.current.style.transform = `scaleY(${s.y / s.max})`
    items.current.forEach((el, i) => el?.classList.toggle('on', i === s.active))
    const white = s.active === 6 && s.t > 0.6
    root.current.classList.toggle('white', white)
  })
  return (
    <div ref={root} className="hud">
      <a className="logo" onClick={() => scrollToScene('hero')}>{PROFILE.first}<span>®</span></a>
      <nav className="nav">{SCENES.map((s, i) => <button key={s.id} ref={(el) => { items.current[i] = el }} onClick={() => scrollToScene(s.id)} data-i={i}>{s.label}</button>)}</nav>
      <div className="prog"><span ref={pct} className="mono">00%</span><div className="rail"><div ref={rail} /></div></div>
    </div>
  )
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null), lab = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (isTouch()) return
    const p = { x: -100, y: -100, rx: -100, ry: -100 }
    const mv = (e: MouseEvent) => {
      p.x = e.clientX; p.y = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${p.x}px,${p.y}px)`
      const t = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null
      ring.current?.classList.toggle('big', !!t)
      if (lab.current) lab.current.textContent = t?.dataset.cursor || ''
    }
    addEventListener('mousemove', mv)
    const tick = () => { p.rx += (p.x - p.rx) * 0.16; p.ry += (p.y - p.ry) * 0.16; if (ring.current) ring.current.style.transform = `translate(${p.rx}px,${p.ry}px)` }
    gsap.ticker.add(tick)
    return () => { removeEventListener('mousemove', mv); gsap.ticker.remove(tick) }
  }, [])
  if (isTouch()) return null
  return (<><div ref={ring} className="c-ring"><span ref={lab} className="mono" /></div><div ref={dot} className="c-dot" /></>)
}

export function Btn({ children, red, href, onClick, cur, dl }: { children: string; red?: boolean; href?: string; onClick?: () => void; cur?: string; dl?: boolean }) {
  const el = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (isTouch() || !el.current) return
    const qx = gsap.quickTo(el.current, 'x', { duration: 1, ease: 'elastic.out(1,0.4)' }), qy = gsap.quickTo(el.current, 'y', { duration: 1, ease: 'elastic.out(1,0.4)' })
    const mv = (e: MouseEvent) => { const r = el.current!.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.35); qy((e.clientY - r.top - r.height / 2) * 0.35) }
    const lv = () => { qx(0); qy(0) }
    const n = el.current; n.addEventListener('mousemove', mv); n.addEventListener('mouseleave', lv)
    return () => { n.removeEventListener('mousemove', mv); n.removeEventListener('mouseleave', lv) }
  }, [])
  return (
    <a ref={el} className={'btn ' + (red ? 'red' : 'line')} href={href || '#'} data-cursor={cur} {...(dl ? { download: 'Hari-Haran-V-Resume.pdf' } : {})}
      {...(href?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
      onClick={(e) => { if (onClick) { e.preventDefault(); onClick() } }}>
      <i className="fill" /><span className="roll"><b>{children}</b><b>{children}</b></span>
    </a>
  )
}
export const _s = state
