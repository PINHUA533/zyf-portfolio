import { useEffect, useRef } from 'react'
import './GlowCursor.css'

const POINTS = 16

export default function GlowCursor({ color = '#68ffe4', secondaryColor = '#806bff' }) {
  const rootRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const nodes = [...(rootRef.current?.children ?? [])]
    if (!nodes.length) return undefined

    const points = Array.from({ length: POINTS }, () => ({ x: 0, y: 0 }))
    const target = { x: 0, y: 0 }
    let initialized = false
    let lastMove = 0
    let lastFrame = performance.now()
    let fade = 0
    let frame = 0
    let pageVisible = !document.hidden

    const render = (now) => {
      frame = 0
      if (!pageVisible) return
      const delta = Math.min((now - lastFrame) / 16.667, 3)
      lastFrame = now
      const headEase = 1 - Math.pow(.76, delta)
      const chainEase = 1 - Math.pow(.55, delta)
      points[0].x += (target.x - points[0].x) * headEase
      points[0].y += (target.y - points[0].y) * headEase
      for (let index = 1; index < POINTS; index += 1) {
        points[index].x += (points[index - 1].x - points[index].x) * chainEase
        points[index].y += (points[index - 1].y - points[index].y) * chainEase
      }
      const active = now - lastMove < 620
      fade += ((active ? 1 : 0) - fade) * Math.min(.14 * delta, 1)
      if (!active && fade < .008) fade = 0
      nodes.forEach((node, index) => {
        const progress = index / (POINTS - 1)
        const scale = 1 - progress * .72
        node.style.transform = `translate3d(${points[index].x}px, ${points[index].y}px, 0) translate(-50%, -50%) scale(${scale})`
        node.style.opacity = fade * Math.pow(1 - progress, .72)
      })
      if (active || fade > 0) frame = requestAnimationFrame(render)
    }

    const move = (event) => {
      target.x = event.clientX
      target.y = event.clientY
      if (!initialized) {
        points.forEach((point) => { point.x = target.x; point.y = target.y })
        initialized = true
      }
      lastMove = performance.now()
      if (!frame && pageVisible) {
        lastFrame = lastMove
        frame = requestAnimationFrame(render)
      }
    }

    const onVisibility = () => {
      pageVisible = !document.hidden
      if (!pageVisible) {
        if (frame) cancelAnimationFrame(frame)
        frame = 0
        nodes.forEach((node) => { node.style.opacity = 0 })
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="glow-cursor"
      style={{ '--cursor-primary': color, '--cursor-secondary': secondaryColor }}
      aria-hidden="true"
    >
      {Array.from({ length: POINTS }, (_, index) => {
        const primaryWeight = Math.round((1 - index / (POINTS - 1)) * 100)
        return (
          <i
            key={index}
            style={{ '--cursor-color': `color-mix(in srgb, ${color} ${primaryWeight}%, ${secondaryColor})` }}
          />
        )
      })}
    </div>
  )
}
