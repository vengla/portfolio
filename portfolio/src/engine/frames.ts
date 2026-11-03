export type Shot = { from: number; to: number; box: [number, number, number, number]; cx: number }
export type Manifest = { w: number; h: number; count: number; shots: Shot[] }
export const frames = { man: null as Manifest | null, imgs: [] as (HTMLImageElement | undefined)[], loaded: 0 }

export const shotOf = (f: number) => {
  const m = frames.man!
  for (let i = 0; i < m.shots.length; i++) if (f >= m.shots[i].from && f <= m.shots[i].to) return i
  let b = 0, bd = 1e9
  m.shots.forEach((s, i) => { const d = Math.min(Math.abs(f - s.from), Math.abs(f - s.to)); if (d < bd) { bd = d; b = i } })
  return b
}
export function getImg(f: number): HTMLImageElement | undefined {
  const m = frames.man; if (!m) return
  f = Math.max(0, Math.min(m.count - 1, Math.round(f)))
  if (frames.imgs[f]) return frames.imgs[f]
  const sh = m.shots[shotOf(f)]
  for (let d = 1; d <= sh.to - sh.from; d++) {
    const a = frames.imgs[f - d], b = frames.imgs[f + d]
    if (f - d >= sh.from && a) return a
    if (f + d <= sh.to && b) return b
  }
}
export async function loadFrames(onProgress: (p: number) => void): Promise<void> {
  const m: Manifest = await (await fetch('./frames/manifest.json')).json()
  frames.man = m; frames.imgs = new Array(m.count)
  const dir = innerWidth < 820 ? 'sm' : 'lg'
  const order: number[] = [], seen = new Set<number>()
  const push = (i: number) => { if (i >= 0 && i < m.count && !seen.has(i)) { seen.add(i); order.push(i) } }
  const inShot = (i: number) => m.shots.some((s) => i >= s.from && i <= s.to)
  m.shots.forEach((s) => { push(s.from); push(s.to) })
  ;[8, 4, 2, 1].forEach((st) => { for (let i = 0; i < m.count; i += st) if (inShot(i)) push(i) })
  const need = Math.ceil(order.length / 4)
  let done = 0, i = 0
  const one = async () => {
    while (i < order.length) {
      const idx = order[i++]
      const img = new Image(); img.src = `./frames/${dir}/f${String(idx).padStart(3, '0')}.webp`
      try { await img.decode(); frames.imgs[idx] = img; frames.loaded++ } catch { /* falls back to neighbour */ }
      done++
      if (done <= need) onProgress(done / need)
    }
  }
  const workers = Array.from({ length: 6 }, one)
  await new Promise<void>((res) => { const t = setInterval(() => { if (done >= need) { clearInterval(t); res() } }, 30) })
  void workers
}
