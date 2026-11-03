import { createRef, useRef } from 'react'
import { PROFILE, STATS } from '../data'
import { clamp, easeOutCubic, smooth } from '../engine/director'
import { useScroll } from '../engine/hooks'
import Odometer, { OdoHandle } from '../components/Odometer'
import TiltCard from '../components/TiltCard'
import { Sec, idx, fade, Label } from './util'
const I = idx('about')
const words = PROFILE.manifesto.split(' ')
export function AboutBack() {
  const el = useRef<HTMLDivElement>(null)
  useScroll((st) => { const s = st.s[I]; if (!el.current) return; const a = clamp(s.enter * 1.6) * Math.max(0, 1 - s.exit * 2.4); el.current.style.opacity = String(a); el.current.style.transform = `translateX(${(1 - easeOutCubic(clamp(s.enter * 1.6))) * -8}vw)` })
  return <div ref={el} className="about-shade" />
}
export function AboutFront() {
  const col = useRef<HTMLDivElement>(null), ws = useRef<(HTMLSpanElement | null)[]>([]), cards = useRef<(HTMLDivElement | null)[]>([])
  const odos = useRef(STATS.map(() => createRef<OdoHandle>())).current
  useScroll((st) => {
    const s = st.s[I]; fade(col.current, s, 30)
    const n = words.length
    ws.current.forEach((w, i) => { if (!w) return; const r = clamp(((s.p - 0.04) / 0.62) * n - i + 1); w.style.opacity = String(0.1 + 0.9 * r); w.style.transform = `translateY(${(1 - r) * 0.25}em)`; w.style.filter = `blur(${(1 - r) * 4}px)` })
    odos.forEach((o, i) => o.current?.set(smooth(0, 1, clamp((s.p - 0.12 - i * 0.07) / 0.35))))
    cards.current.forEach((c, i) => { if (!c) return; const r = clamp((s.p - 0.08 - i * 0.07) / 0.2); c.style.opacity = String(r); c.style.transform = `translateY(${(1 - r) * 40}px)` })
  })
  return (
    <Sec id="about"><div ref={col} className="about-col">
      <Label n="01">About me</Label>
      <p className="manifesto">{words.map((w, i) => <span key={i} ref={(el) => { ws.current[i] = el }} className={'w' + (PROFILE.manifestoKeys.includes(w) ? ' k' : '')}>{w} </span>)}</p>
      <div className="stats">{STATS.map((st, i) => (
        <div key={i} ref={(el) => { cards.current[i] = el }}><TiltCard className="glass"><div className="stat-n"><Odometer ref={odos[i]} value={st.value} suffix={st.suffix} /></div><div className="stat-l mono">{st.label}</div><i className="glare" /></TiltCard></div>
      ))}</div>
    </div></Sec>
  )
}
