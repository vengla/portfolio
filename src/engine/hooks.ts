import { useEffect, useRef } from 'react'
import { subscribe, DState } from './director'
export function useScroll(fn: (s: DState) => void) {
  const ref = useRef(fn); ref.current = fn
  useEffect(() => subscribe((s) => ref.current(s)), [])
}
export function useIntro(fn: () => void) {
  const ref = useRef(fn); ref.current = fn
  useEffect(() => { const h = () => ref.current(); addEventListener('intro', h); return () => removeEventListener('intro', h) }, [])
}
export const isTouch = () => matchMedia('(hover: none)').matches
