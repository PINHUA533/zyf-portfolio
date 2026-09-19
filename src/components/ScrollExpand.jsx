import { useEffect, useRef, useState } from 'react'
import Aurora from './Aurora'
import './ScrollExpand.css'

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export default function ScrollExpand({
  src,
  poster,
  mediaType = 'image',
  alt = '',
  title = '',
  scrollHint = 'SCROLL TO OPEN',
  startWidth = 36,
  startHeight = 58,
  startRadius = 180,
  endRadius = 0,
  mediaZoom = 1.12,
  scrollDistance = 1.15,
  holdDistance = 0.2,
  smoothing = 0.09,
  overlayScrim = 0.12,
  enabled = true,
  children,
}) {
  const rootRef = useRef(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setProgress(1)
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setProgress(1)
      return undefined
    }

    let frame = 0
    const updateTarget = () => {
      const root = rootRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      const travel = Math.max(1, window.innerHeight * scrollDistance)
      targetRef.current = clamp(-rect.top / travel)
    }

    const tick = () => {
      currentRef.current += (targetRef.current - currentRef.current) * smoothing
      if (Math.abs(targetRef.current - currentRef.current) < 0.001) currentRef.current = targetRef.current
      setProgress(currentRef.current)
      frame = window.requestAnimationFrame(tick)
    }

    updateTarget()
    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', updateTarget)
    frame = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', updateTarget)
    }
  }, [enabled, scrollDistance, smoothing])

  const eased = 1 - Math.pow(1 - progress, 3)
  const contentProgress = clamp((progress - (1 - holdDistance)) / Math.max(holdDistance, 0.01))
  const width = startWidth + (100 - startWidth) * eased
  const height = startHeight + (100 - startHeight) * eased
  const radius = startRadius + (endRadius - startRadius) * eased
  const zoom = mediaZoom - (mediaZoom - 1) * eased

  return (
    <div
      className="scroll-expand"
      ref={rootRef}
      style={{ '--scroll-expand-track': `${(scrollDistance + holdDistance + 1) * 100}vh` }}
    >
      <div className="scroll-expand__sticky">
        <div
          className={`scroll-expand__media ${mediaType === 'color' ? 'scroll-expand__media--color' : ''}`}
          style={{ width: `${width}vw`, height: `${height}vh`, borderRadius: `${radius}px`, '--scroll-expand-zoom': zoom }}
        >
          {mediaType === 'video' ? (
            <video src={src} poster={poster} autoPlay muted loop playsInline aria-label={alt} />
          ) : mediaType === 'color' ? (
            <div className="scroll-expand__color-art" role="img" aria-label={alt}>
              <Aurora
                colorStops={['#68ffe4', '#806bff', '#ff86df']}
                blend={0.42}
                amplitude={1.08}
                speed={0.72}
              />
              <span className="scroll-expand__aurora-shade" aria-hidden="true" />
              <div
                className="scroll-expand__opening-title"
                style={{ opacity: 1 - clamp((progress - 0.3) * 2.4), transform: `translate(-50%, -50%) scale(${1 + eased * 0.16})` }}
              >
                <span>ZHU YI FEI</span>
                <strong><b>PORT</b><i>FOLIO</i></strong>
                <em>2026 · VISUAL DESIGN</em>
              </div>
            </div>
          ) : (
            <img src={src} alt={alt} />
          )}
          <span className="scroll-expand__scrim" style={{ opacity: overlayScrim + contentProgress * 0.18 }} />
          <span className="scroll-expand__title" style={{ opacity: 1 - clamp(progress * 2.4) }}>{title}</span>
          <span className="scroll-expand__hint" style={{ opacity: 1 - clamp(progress * 2.8) }}>{scrollHint}</span>
        </div>
        <div
          className="scroll-expand__content"
          style={{ opacity: contentProgress, transform: `translateY(${(1 - contentProgress) * 28}px)` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
