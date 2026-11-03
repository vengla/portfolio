import { useEffect, useRef } from 'react'
import { SCENES, state, DState } from '../engine/director'
import { frames, getImg, shotOf } from '../engine/frames'
import { useScroll } from '../engine/hooks'

export default function Stage() {
  const cv = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0, cx: 0, cy: 0 })
  const lastKey = useRef('')
  const dirty = useRef(true)

  const drawFrame = (ctx: CanvasRenderingContext2D, f: number, sc: number, dx: number, alpha: number) => {
    const m = frames.man!, { vw, vh, mobile } = state
    const S = SCENES[sc]
    const fl = Math.floor(f), fr = f - fl
    const shot = m.shots[shotOf(fl)]
    const [bx, by, bw, bh] = shot.box
    let scale = vh * S.k / 900, x = S.x
    if (mobile) { x = 0.5; scale = Math.min(vh * 0.74 / 900, vw * 1.05 / bw) }
    const offY = vh - 900 * scale, offX = x * vw - shot.cx * 1600 * scale
    const px = offX + bx * scale + dx + mouse.current.cx, py = offY + by * scale + mouse.current.cy
    const a = getImg(fl)
    ctx.globalAlpha = alpha
    if (a) ctx.drawImage(a, px, py, bw * scale, bh * scale)
    if (fr > 0.001 && fl + 1 <= shot.to) {
      const b = getImg(fl + 1)
      if (b) { ctx.globalAlpha = alpha * fr; ctx.drawImage(b, px, py, bw * scale, bh * scale) }
    }
    ctx.globalAlpha = 1
  }

  const render = (s: DState) => {
    const c = cv.current; if (!c || !frames.man) return
    const mx = mouse.current
    mx.cx += (mx.x * 14 - mx.cx) * 0.06; mx.cy += (mx.y * 14 - mx.cy) * 0.06
    const key = [s.active, s.frame.toFixed(2), s.t.toFixed(3), frames.loaded, s.vw, s.vh, mx.cx.toFixed(1), mx.cy.toFixed(1)].join('|')
    if (key === lastKey.current && !dirty.current) return
    lastKey.current = key; dirty.current = false
    const dpr = Math.min(2, devicePixelRatio || 1)
    if (c.width !== Math.round(s.vw * dpr) || c.height !== Math.round(s.vh * dpr)) { c.width = Math.round(s.vw * dpr); c.height = Math.round(s.vh * dpr) }
    const ctx = c.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, s.vw, s.vh)
    const { t, active, prev, vw, vh } = s
    if (prev < 0 || t >= 0.999) { drawFrame(ctx, s.frame, active, 0, 1); return }
    const skew = 0.2 * vh, e = -skew + (vw + 2 * skew) * t
    const inFrame = SCENES[active].from
    // outgoing: right of blade
    ctx.save(); ctx.beginPath(); ctx.moveTo(e + skew, 0); ctx.lineTo(vw + 200, 0); ctx.lineTo(vw + 200, vh); ctx.lineTo(e - skew, vh); ctx.closePath(); ctx.clip()
    drawFrame(ctx, SCENES[prev].to, prev, 60 * t, 1 - 0.35 * t); ctx.restore()
    // incoming: left of blade
    ctx.save(); ctx.beginPath(); ctx.moveTo(-200, 0); ctx.lineTo(e + skew, 0); ctx.lineTo(e - skew, vh); ctx.lineTo(-200, vh); ctx.closePath(); ctx.clip()
    drawFrame(ctx, inFrame, active, -60 * (1 - t), 1); ctx.restore()
    // blade
    const col = SCENES[active].id === 'contact' ? '255,255,255' : '255,31,31'
    const g = ctx.createLinearGradient(e - 90, 0, e + skew, 0)
    g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},.18)`)
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(e + skew - 90, 0); ctx.lineTo(e + skew, 0); ctx.lineTo(e - skew, vh); ctx.lineTo(e - skew - 90, vh); ctx.fill()
    ctx.save(); ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = 3; ctx.shadowColor = `rgb(${col})`; ctx.shadowBlur = 24
    ctx.beginPath(); ctx.moveTo(e + skew, 0); ctx.lineTo(e - skew, vh); ctx.stroke(); ctx.restore()
  }

  useScroll(render)
  useEffect(() => {
    const mm = (e: MouseEvent) => { mouse.current.x = e.clientX / innerWidth - 0.5; mouse.current.y = e.clientY / innerHeight - 0.5 }
    addEventListener('mousemove', mm)
    let raf = 0
    const loop = () => { render(state); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { removeEventListener('mousemove', mm); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={cv} className="stage" />
}
