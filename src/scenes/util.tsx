import { ReactNode } from 'react'
import { SCENES, SState, easeOutCubic, clamp } from '../engine/director'
export const idx = (id: string) => SCENES.findIndex((s) => s.id === id)
export const Sec = ({ id, children }: { id: string; children: ReactNode }) => (
  <section id={id} className="sec" style={{ height: `${SCENES[idx(id)].vh}vh` }}><div className="stick"><div className="inner">{children}</div></div></section>
)
export const fadeA = (s: SState) => clamp(s.enter * 1.6) * Math.max(0, 1 - s.exit * 2.4)
export function fade(el: HTMLElement | null, s: SState, dy = 40) {
  if (!el) return
  el.style.opacity = String(fadeA(s))
  el.style.transform = `translateY(${(1 - easeOutCubic(clamp(s.enter * 1.6))) * dy}px)`
}
export const Label = ({ n, children }: { n: string; children: string }) => <div className="label mono"><b>({n})</b> — {children}</div>
