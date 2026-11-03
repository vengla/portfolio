import { forwardRef, useImperativeHandle, useRef } from 'react'
import { smooth } from '../engine/director'
export type OdoHandle = { set: (p: number) => void }
// Mechanical odometer: each digit is a column 0–9,0. Lowest digit snaps with smoothstep .55–1.
const Odometer = forwardRef<OdoHandle, { value: string; suffix?: string }>(({ value, suffix }, ref) => {
  const cols = useRef<(HTMLSpanElement | null)[]>([])
  const chars = value.split('')
  const digitIdx = chars.map((c, i) => (/\d/.test(c) ? i : -1)).filter((i) => i >= 0)
  const lowest = digitIdx[digitIdx.length - 1]
  useImperativeHandle(ref, () => ({
    set(p) {
      chars.forEach((c, i) => {
        const el = cols.current[i]; if (!el || !/\d/.test(c)) return
        const d = +c, v = i === lowest ? d * smooth(0.55, 1, p) : d * Math.min(1, p / 0.55)
        el.style.transform = `translateY(${-(v) * (100 / 11)}%)`
      })
    },
  }))
  return (
    <span className="odo">
      {chars.map((c, i) => /\d/.test(c)
        ? <span key={i} className="odo-w"><span ref={(el) => { cols.current[i] = el }} className="odo-c">{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, k) => <i key={k}>{n}</i>)}</span></span>
        : <span key={i}>{c}</span>)}
      {suffix && <span className="odo-s">{suffix}</span>}
    </span>
  )
})
export default Odometer
