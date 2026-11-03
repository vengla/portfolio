import { useRef } from 'react'
import { JOURNEY, YEAR_FROM, YEAR_TO } from '../data'
import { clamp, easeOutCubic } from '../engine/director'
import { useScroll } from '../engine/hooks'
import { Sec, idx, fade, Label } from './util'
const I = idx('journey')
export function JourneyBack() {
  const el = useRef<HTMLDivElement>(null), cols = useRef<(HTMLSpanElement | null)[]>([])
  useScroll((st) => {
    const s = st.s[I]; if (!el.current) return
    el.current.style.opacity = String(clamp(s.enter * 1.6) * Math.max(0, 1 - s.exit * 2.4))
    const cur = YEAR_FROM + (YEAR_TO - YEAR_FROM) * clamp(s.p * 1.15)
    const digs = String(Math.floor(cur)).split('').map(Number), fracv = cur - Math.floor(cur)
    cols.current.forEach((c, i) => { if (!c) return; const v = i === 3 ? digs[3] + fracv : digs[i]; c.style.transform = `translateY(${-v * 10}%)` })
  })
  return <div ref={el} className="year">{[0, 1, 2, 3].map((i) => <span key={i} className="yw"><span ref={(e) => { cols.current[i] = e }} className="yc">{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <i key={n}>{n}</i>)}</span></span>)}</div>
}
export function JourneyFront() {
  const col = useRef<HTMLDivElement>(null), line = useRef<SVGPathElement>(null), items = useRef<(HTMLDivElement | null)[]>([])
  useScroll((st) => {
    const s = st.s[I]; fade(col.current, s, 30)
    if (line.current) line.current.style.strokeDashoffset = String(1 - clamp(s.p * 1.25))
    items.current.forEach((it, i) => {
      if (!it) return; const r = easeOutCubic(clamp((s.p * 1.3 - (JOURNEY.length - 1 - i) * 0.26 - 0.05) / 0.3))
      it.style.opacity = String(r); it.style.transform = `translateY(${(1 - r) * 50}px) rotateY(${-55 * (1 - r)}deg)`; it.classList.toggle('on', r > 0.95)
    })
  })
  return (
    <Sec id="journey"><div ref={col} className="j-col">
      <Label n="03">Journey</Label>
      <h2 className="big">LEARNING /<br /><em>OUT LOUD.</em></h2>
      <div className="tl"><div className="track" /><svg className="draw" viewBox="0 0 2 100" preserveAspectRatio="none"><path ref={line} d="M1 100 L1 0" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} /></svg>
        {JOURNEY.map((j, i) => (<div key={j.year} ref={(e) => { items.current[i] = e }} className="ti"><i className="node" /><div className="mono ty"><b>{j.year}</b></div><h3>{j.title}</h3><p>{j.meta}</p></div>))}
      </div>
    </div></Sec>
  )
}
