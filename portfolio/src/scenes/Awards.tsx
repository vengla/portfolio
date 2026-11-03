import { useRef } from 'react'
import { COUNTERS, CERTS } from '../data'
import { clamp, easeOutCubic } from '../engine/director'
import { useScroll } from '../engine/hooks'
import Odometer from '../components/Odometer'
import { Sec, idx, fade, Label } from './util'
const I = idx('awards'), N = CERTS.length, R = 360
export function AwardsFront() {
  const col = useRef<HTMLDivElement>(null), cs = useRef<(HTMLDivElement | null)[]>([]), nums = useRef<(HTMLSpanElement | null)[]>([]), cyl = useRef<HTMLDivElement>(null)
  useScroll((st) => {
    const s = st.s[I]; fade(col.current, s, 20)
    cs.current.forEach((c, i) => { if (!c) return; const r = easeOutCubic(clamp((s.p - 0.03 - i * 0.07) / 0.2)); c.style.opacity = String(r); c.style.transform = `perspective(800px) rotateX(${-100 * (1 - r)}deg)` })
    nums.current.forEach((n, i) => { if (!n) return; const t = easeOutCubic(clamp((s.p - 0.08 - i * 0.07) / 0.3)), c = COUNTERS[i]; n.textContent = (c.to * t).toFixed(c.dec || 0) })
    if (cyl.current) cyl.current.style.transform = `translateZ(${-R}px) rotateX(-14deg) rotateY(${-s.p * (360 - 360 / N)}deg)`
  })
  return (
    <Sec id="awards"><div ref={col} className="aw-col">
      <Label n="05">Awards</Label>
      <div className="counters">{COUNTERS.map((c, i) => (<div key={c.label} ref={(e) => { cs.current[i] = e }} className={'cc ' + (i % 2 ? 'dark' : 'redc')}><div className="cn"><span ref={(e) => { nums.current[i] = e }}>0</span><em>{c.suffix}</em></div><div className="mono cl">{c.label}</div></div>))}</div>
      <div className="cyl-wrap"><div ref={cyl} className="cyl">{CERTS.map((c, i) => (
        <div key={c.t} className="cert" style={{ transform: `rotateY(${(360 / N) * i}deg) translateZ(${R}px)` }}>
          <div className={'face front' + (i % 3 === 2 ? ' redf' : '')}><div className="seal">✓</div><h4>{c.t}</h4><div className="mono">{c.by}</div></div>
          <div className="face back"><div className="mono">Certification</div></div>
        </div>))}</div></div>
    </div></Sec>
  )
}
export const _o = Odometer
