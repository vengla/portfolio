import { useRef } from 'react'
import { PROFILE, LINKS } from '../data'
import { clamp, easeOutCubic, scrollTop } from '../engine/director'
import { useScroll } from '../engine/hooks'
import { Sec, idx } from './util'
const I = idx('contact')
export function ContactBack() {
  const bg = useRef<HTMLDivElement>(null), big = useRef<HTMLDivElement>(null)
  useScroll((st) => {
    if (!bg.current || !big.current) return
    if (st.active !== I) { bg.current.style.display = 'none'; big.current.style.opacity = '0'; return }
    const { vw, vh, t } = st, skew = 0.2 * vh, e = -skew + (vw + 2 * skew) * t
    bg.current.style.display = 'block'
    bg.current.style.clipPath = t >= 0.999 ? 'none' : `polygon(0 0, ${e + skew}px 0, ${e - skew}px ${vh}px, 0 ${vh}px)`
    const s = st.s[I], a = clamp((t - 0.55) / 0.45) * Math.max(0, 1 - s.exit * 2.4)
    big.current.style.opacity = String(a); big.current.style.transform = `translateY(${(1 - easeOutCubic(clamp((t - 0.55) / 0.45))) * 8}vh)`
  })
  return <><div ref={bg} className="c-bg" /><div ref={big} className="c-big"><span>LET'S</span><span>TALK</span></div></>
}
export function ContactFront() {
  const el = useRef<HTMLDivElement>(null)
  useScroll((st) => { const s = st.s[I]; if (el.current) { const a = clamp((st.active === I ? st.t - 0.4 : 0) / 0.5) * Math.max(0, 1 - s.exit * 2.4); el.current.style.opacity = String(a) } })
  const [u, d] = PROFILE.email.split('@')
  return (
    <Sec id="contact"><div ref={el} className="c-front">
      <a className="mail" href={`mailto:${PROFILE.email}`} data-cursor="Write"><span>{u}</span><span className="dom">@{d}<i /></span></a>
      <ul className="links">{LINKS().map((l) => (<li key={l.label}><a href={l.href} data-cursor={l.cur} {...(l.dl ? { download: 'Hari-Haran-V-Resume.pdf' } : { target: '_blank', rel: 'noreferrer' })}>{l.label}<span>↗</span></a></li>))}</ul>
      <div className="foot mono"><span>© 2026 {PROFILE.name}</span><a onClick={scrollTop} data-cursor="Go">Back to top ↑</a></div>
    </div></Sec>
  )
}
