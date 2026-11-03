import { ReactNode, useRef } from 'react'
export default function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const el = useRef<HTMLDivElement>(null)
  const mv = (e: React.MouseEvent) => {
    const n = el.current!, r = n.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    n.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 28}deg) rotateX(${(0.5 - y) * 28}deg)`
    n.style.setProperty('--gx', x * 100 + '%'); n.style.setProperty('--gy', y * 100 + '%')
  }
  const lv = () => { el.current!.style.transform = '' }
  return <div ref={el} className={'tilt ' + className} onMouseMove={mv} onMouseLeave={lv}>{children}</div>
}
