import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SKILLS } from '../data'
import { clamp, state } from '../engine/director'
import { useScroll } from '../engine/hooks'
import { Sec, idx, fade, Label } from './util'
const I = idx('skills'), N = SKILLS.length
const pts = SKILLS.map((_, i) => { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i; return [Math.cos(th) * r, y, Math.sin(th) * r] })
const els = { back: [] as (HTMLSpanElement | null)[], front: [] as (HTMLSpanElement | null)[] }
const mouse = { x: 0, y: 0, sx: 0, sy: 0 }
export function Orbit() {
  useEffect(() => {
    const mm = (e: MouseEvent) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5 }
    addEventListener('mousemove', mm)
    const tick = (time: number) => {
      const s = state.s[I], vis = clamp(s.enter * 1.6) * Math.max(0, 1 - s.exit * 2.4)
      mouse.sx += (mouse.x - mouse.sx) * 0.05; mouse.sy += (mouse.y - mouse.sy) * 0.05
      const show = vis > 0.01
      for (let i = 0; i < N; i++) { const b = els.back[i], f = els.front[i]; if (!show) { if (b) b.style.display = 'none'; if (f) f.style.display = 'none'; continue } }
      if (!show) return
      const { vw, vh } = state, R = Math.min(0.27 * vw, 0.46 * vh), cx = vw * 0.5, cy = vh * (state.mobile ? 0.48 : 0.52)
      const ang = time * 0.12 + s.p * 5 * Math.PI * 2 * 0.5 + mouse.sx * 2, tilt = -0.28 + mouse.sy * 0.4
      const ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(tilt), st = Math.sin(tilt)
      pts.forEach((p, i) => {
        let x = p[0] * ca + p[2] * sa, z = -p[0] * sa + p[2] * ca, y = p[1]
        const y2 = y * ct - z * st, z2 = y * st + z * ct
        const X = cx + x * R * 1.25, Y = cy + y2 * R * 0.78, sc = 0.8 + 0.3 * (z2 + 1) / 2
        const front = z2 >= 0, a = els.front[i], b = els.back[i], e = front ? a : b, o = front ? b : a
        if (o) o.style.display = 'none'
        if (e) { e.style.display = 'block'; e.style.opacity = String(front ? vis : vis * 0.55); e.style.transform = `translate(${X}px,${Y}px) translate(-50%,-50%) scale(${sc})` }
      })
    }
    gsap.ticker.add(tick)
    return () => { removeEventListener('mousemove', mm); gsap.ticker.remove(tick) }
  }, [])
  return null
}
export const SkillsBack = () => <div className="orbit back">{SKILLS.map((s, i) => <span key={s} ref={(e) => { els.back[i] = e }} className="chip b">{s}</span>)}</div>
export const SkillsFront = () => <div className="orbit front">{SKILLS.map((s, i) => <span key={s} ref={(e) => { els.front[i] = e }} className="chip f">{s}</span>)}</div>
export function SkillsMain() {
  const t = useRef<HTMLDivElement>(null), tape = useRef<HTMLDivElement>(null), run = useRef<HTMLDivElement>(null)
  useScroll((st) => { const s = st.s[I]; fade(t.current, s, 30); if (tape.current) { tape.current.style.opacity = String(clamp(s.enter * 1.6) * Math.max(0, 1 - s.exit * 2.4)) } if (run.current) run.current.style.transform = `translateX(${-(s.p * 40 + st.y * 0.02) % 50}%)` })
  const line = SKILLS.map((s) => s + ' ✦ ').join('')
  return (
    <Sec id="skills"><div ref={t} className="sk-title"><Label n="04">Toolkit</Label><h2 className="big">EVERYTHING /<br /><em>IN ORBIT.</em></h2></div>
      <div ref={tape} className="tape"><div ref={run} className="tape-run"><span>{line}</span><span>{line}</span><span>{line}</span><span>{line}</span></div></div></Sec>
  )
}
