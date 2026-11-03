import { useRef } from 'react'
import { PROJECTS, PROFILE } from '../data'
import { clamp, easeInOutSine, easeOutCubic } from '../engine/director'
import { useScroll } from '../engine/hooks'
import { Sec, idx, fade, Label } from './util'
const I = idx('work'), N = PROJECTS.length
export function WorkBack() {
  const el = useRef<HTMLDivElement>(null), g = useRef<HTMLDivElement>(null)
  useScroll((st) => { const s = st.s[I]; if (!el.current) return; el.current.style.opacity = String(clamp(s.enter * 1.6) * Math.max(0, 1 - s.exit * 2.4)); if (g.current) g.current.style.backgroundPosition = `0 ${s.p * 900}px, 0 0` })
  return <div ref={el} className="grid-back"><div ref={g} className="grid-floor" /></div>
}
const Mock = ({ k }: { k: string }) => (
  <div className={'mock ' + k}>
    {k === 'grid' && <><div className="gauge" /><div className="bars">{[40, 70, 55, 90, 62, 80].map((h, i) => <i key={i} style={{ height: h + '%', animationDelay: i * 0.15 + 's' }} />)}</div></>}
    {k === 'heat' && <div className="heat">{Array.from({ length: 48 }, (_, i) => <i key={i} style={{ opacity: [0.15, 0.35, 0.6, 0.9, 0.25, 0.75][(i * 7 + (i >> 2)) % 6], animationDelay: (i % 9) * 0.12 + 's' }} />)}</div>}
    {k === 'shield' && <><div className="ring r1" /><div className="ring r2" /><div className="ring r3" /><div className="scan" /></>}
  </div>
)
export function WorkFront() {
  const head = useRef<HTMLDivElement>(null), deck = useRef<HTMLDivElement>(null), cards = useRef<(HTMLDivElement | null)[]>([])
  const cnt = useRef<HTMLSpanElement>(null), bar = useRef<HTMLDivElement>(null)
  useScroll((st) => {
    const s = st.s[I]; fade(head.current, s, 20)
    const e = easeOutCubic(clamp(s.enter * 1.4)), ex = Math.max(0, 1 - s.exit * 2.4)
    if (deck.current) { deck.current.style.opacity = String(clamp(s.enter * 1.6) * ex); deck.current.style.transform = `translateY(${(1 - e) * 60}vh) rotateY(${-25 * (1 - e)}deg)` }
    const u = clamp(s.p * N, 0, N - 0.0001), i0 = Math.floor(u), fr = u - i0
    const q = Math.min(N - 1, i0 + easeInOutSine(clamp((fr - 0.35) / 0.65)))
    cards.current.forEach((c, j) => {
      if (!c) return; const d = q - j, vh = st.vh / 100
      let z: number, y: number, rx = 0, o: number
      if (d <= 0) { z = d * 300; y = d * 3.2 * vh; o = clamp(1 + d * 0.9) } else { z = d * 900; y = -12 * d * vh; rx = 28 * d; o = clamp(1 - 1.8 * d) }
      c.style.opacity = String(o); c.style.transform = `translate3d(0,${y}px,${z}px) rotateX(${rx}deg)`; c.style.pointerEvents = o > 0.6 ? 'auto' : 'none'; c.style.zIndex = String(10 - Math.round(Math.abs(d) * 2))
    })
    if (cnt.current) cnt.current.textContent = `${String(Math.round(q) + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`
    if (bar.current) bar.current.style.transform = `scaleX(${clamp(s.p)})`
  })
  return (
    <Sec id="work">
      <div ref={head} className="work-head"><Label n="02">Selected work</Label><span ref={cnt} className="work-cnt">01 / 03</span><div className="work-bar"><div ref={bar} /></div></div>
      <div ref={deck} className="deck">{PROJECTS.map((p, i) => (
        <div key={p.n} ref={(el) => { cards.current[i] = el }} className="pcard">
          <div className="pl"><div className="mono pn"><b>{p.n}</b> — {p.cat}</div><h2>{p.name}</h2><div className="psub">{p.sub}</div><p>{p.desc}</p>
            <div className="chips">{p.chips.map((c) => <span key={c}>{c}</span>)}</div>
            {PROFILE.github && <a className="glink" href={PROFILE.github} target="_blank" rel="noreferrer" data-cursor="Open">View on GitHub ↗</a>}</div>
          <div className="pr"><Mock k={p.kind} /></div>
        </div>))}</div>
    </Sec>
  )
}
