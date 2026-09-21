import { lazy, Suspense, useEffect, useRef } from 'react'
import './ScrollExpand.css'

const Aurora = lazy(() => import('./Aurora'))

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
  const mediaRef = useRef(null)
  const contentRef = useRef(null)
  const openingTitleRef = useRef(null)
  const scrimRef = useRef(null)
  const titleRef = useRef(null)
  const hintRef = useRef(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const rootTopRef = useRef(0)
  const travelRef = useRef(1)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const renderProgress = (progress) => {
      const eased = 1 - Math.pow(1 - progress, 3)
      const contentProgress = clamp((progress - (1 - holdDistance)) / Math.max(holdDistance, 0.01))
      const width = startWidth + (100 - startWidth) * eased
      const height = startHeight + (100 - startHeight) * eased
      const radius = startRadius + (endRadius - startRadius) * eased
      const zoom = mediaZoom - (mediaZoom - 1) * eased
      const media = mediaRef.current
      if (media) {
        media.style.width = `${width}vw`
        media.style.height = `${height}vh`
        media.style.borderRadius = `${radius}px`
        media.style.setProperty('--scroll-expand-zoom', zoom)
      }
      if (openingTitleRef.current) {
        openingTitleRef.current.style.opacity = 1 - contentProgress
        openingTitleRef.current.style.transform = 'translate(-50%, -50%)'
      }
      if (scrimRef.current) scrimRef.current.style.opacity = overlayScrim + contentProgress * 0.18
      if (titleRef.current) titleRef.current.style.opacity = 1 - clamp(progress * 2.4)
      if (hintRef.current) hintRef.current.style.opacity = 1 - clamp(progress * 2.8)
      if (contentRef.current) {
        contentRef.current.style.opacity = contentProgress
        contentRef.current.style.transform = `translateY(${(1 - contentProgress) * 28}px)`
      }
    }

    const tick = () => {
      frame = 0
      currentRef.current += (targetRef.current - currentRef.current) * smoothing
      if (Math.abs(targetRef.current - currentRef.current) < 0.001) currentRef.current = targetRef.current
      renderProgress(currentRef.current)
      if (currentRef.current !== targetRef.current) frame = window.requestAnimationFrame(tick)
    }

    const requestTick = () => {
      if (!frame) frame = window.requestAnimationFrame(tick)
    }

    const updateTarget = () => {
      targetRef.current = clamp((window.scrollY - rootTopRef.current) / travelRef.current)
      requestTick()
    }

    const measure = () => {
      const root = rootRef.current
      if (!root) return
      rootTopRef.current = root.offsetTop
      travelRef.current = Math.max(1, window.innerHeight * scrollDistance)
      updateTarget()
    }

    if (!enabled || mediaQuery.matches) {
      targetRef.current = 1
      currentRef.current = 1
      renderProgress(1)
      return undefined
    }

    renderProgress(currentRef.current)
    measure()
    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', measure)
    }
  }, [enabled, endRadius, holdDistance, mediaZoom, overlayScrim, scrollDistance, smoothing, startHeight, startRadius, startWidth])

  return (
    <div
      className="scroll-expand"
      ref={rootRef}
      style={{ '--scroll-expand-track': `${(scrollDistance + holdDistance + 1) * 100}vh` }}
    >
      <div className="scroll-expand__sticky">
        <div
          ref={mediaRef}
          className={`scroll-expand__media ${mediaType === 'color' ? 'scroll-expand__media--color' : ''}`}
          style={{ width: `${startWidth}vw`, height: `${startHeight}vh`, borderRadius: `${startRadius}px`, '--scroll-expand-zoom': mediaZoom }}
        >
          {mediaType === 'video' ? (
            <video src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-label={alt} />
          ) : mediaType === 'color' ? (
            <div className="scroll-expand__color-art" role="img" aria-label={alt}>
              <Suspense fallback={<span className="scroll-expand__aurora-fallback" aria-hidden="true" />}>
                <Aurora
                  colorStops={['#68ffe4', '#806bff', '#ff86df']}
                  blend={0.42}
                  amplitude={1.08}
                  speed={0.72}
                />
              </Suspense>
              <span className="scroll-expand__aurora-shade" aria-hidden="true" />
              <div
                ref={openingTitleRef}
                className="scroll-expand__opening-title"
              >
                <span>ZHU YI FEI</span>
                <strong><b>PORT</b><i>FOLIO</i></strong>
                <em>2026 · VISUAL DESIGN</em>
              </div>
            </div>
          ) : (
            <img src={src} alt={alt} decoding="async" />
          )}
          <span ref={scrimRef} className="scroll-expand__scrim" style={{ opacity: overlayScrim }} />
          <span ref={titleRef} className="scroll-expand__title">{title}</span>
          <span ref={hintRef} className="scroll-expand__hint">{scrollHint}</span>
        </div>
        <div
          ref={contentRef}
          className="scroll-expand__content"
          style={{ opacity: 0, transform: 'translateY(28px)' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
