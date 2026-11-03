import Lenis from 'lenis'
import gsap from 'gsap'

export type Scene = { id: string; from: number; to: number; x: number; k: number; label: string; vh: number }
// shots (frames): S1 0-59, S2 60-111, S3 112-179 (laptop + desk), S4 180-238 — S4 split 60/25/15
export const SCENES: Scene[] = [
  { id: 'hero', from: 0, to: 59, x: 0.7, k: 1.0, label: 'Hello', vh: 230 },
  { id: 'about', from: 60, to: 111, x: 0.27, k: 1.0, label: 'About', vh: 280 },
  { id: 'work', from: 112, to: 179, x: 0.8, k: 0.8, label: 'Work', vh: 460 },
  { id: 'journey', from: 180, to: 215, x: 0.26, k: 1.0, label: 'Journey', vh: 240 },
  { id: 'skills', from: 215, to: 229, x: 0.5, k: 0.98, label: 'Toolkit', vh: 280 },
  { id: 'awards', from: 229, to: 238, x: 0.75, k: 1.0, label: 'Awards', vh: 320 },
  { id: 'contact', from: 59, to: 0, x: 0.5, k: 1.0, label: 'Contact', vh: 240 },
]
export type SState = { enter: number; p: number; exit: number; vis: number; top: number; h: number }
export type DState = {
  y: number; vw: number; vh: number; mobile: boolean; max: number
  s: SState[]; active: number; prev: number; t: number; frame: number
}
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
export const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }
export { clamp }

type Sub = (s: DState) => void
const subs = new Set<Sub>()
let lenis: Lenis | null = null
export const state: DState = { y: 0, vw: 1, vh: 1, mobile: false, max: 1, s: SCENES.map(() => ({ enter: 0, p: 0, exit: 0, vis: 0, top: 0, h: 0 })), active: 0, prev: -1, t: 1, frame: 0 }

export function subscribe(fn: Sub) { subs.add(fn); fn(state); return () => { subs.delete(fn) } }

function measure() {
  state.vw = innerWidth; state.vh = innerHeight; state.mobile = innerWidth < 820
  SCENES.forEach((sc, i) => {
    const el = document.getElementById(sc.id)
    if (el) { state.s[i].top = el.offsetTop; state.s[i].h = el.offsetHeight }
  })
  state.max = Math.max(1, document.documentElement.scrollHeight - state.vh)
}

function compute() {
  const { y, vh } = state
  state.s.forEach((s) => {
    s.enter = clamp((y - (s.top - vh)) / vh)
    s.p = clamp((y - s.top) / Math.max(1, s.h - vh))
    s.exit = clamp((y - (s.top + s.h - vh)) / vh)
    s.vis = clamp(Math.min(s.enter * 1.6, 1 - s.exit * 2.2))
  })
  const lead = 0.78 * vh, span = 0.62 * vh
  let a = 0
  state.s.forEach((s, i) => { if (y >= s.top - lead) a = i })
  state.active = a; state.prev = a > 0 ? a - 1 : -1
  const sc = SCENES[a], s = state.s[a]
  state.frame = sc.from + (sc.to - sc.from) * s.p
  state.t = a > 0 ? easeInOutSine(clamp((y - (s.top - lead)) / span)) : 1
}

export function scrollToScene(id: string) {
  const i = SCENES.findIndex((s) => s.id === id)
  if (i < 0 || !lenis) return
  lenis.scrollTo(state.s[i].top + 2, { duration: 2.2, easing: easeOutQuart })
}
export function scrollTop() { lenis?.scrollTo(0, { duration: 2.2, easing: easeOutQuart }) }
export function startScroll() { lenis?.start() }

export function initDirector() {
  history.scrollRestoration = 'manual'
  scrollTo(0, 0)
  lenis = new Lenis({ lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
  lenis.stop()
  gsap.ticker.lagSmoothing(0)
  const tick = (time: number) => lenis!.raf(time * 1000)
  gsap.ticker.add(tick)
  const ro = new ResizeObserver(() => { measure(); compute(); subs.forEach((f) => f(state)) })
  ro.observe(document.body)
  addEventListener('resize', () => { measure(); compute(); subs.forEach((f) => f(state)) })
  measure()
  let last = -1
  const run = () => {
    const y = lenis!.scroll
    if (y !== last) { last = y; state.y = y; compute(); subs.forEach((f) => f(state)) }
  }
  gsap.ticker.add(run)
  state.y = 0; compute(); subs.forEach((f) => f(state))
  return () => { gsap.ticker.remove(tick); gsap.ticker.remove(run); ro.disconnect(); lenis?.destroy() }
}
