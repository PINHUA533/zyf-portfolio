import { useEffect, useMemo, useRef, useState } from 'react'
import Matter from 'matter-js'
import './FallingText.css'

export default function FallingText({ items, trigger = 'scroll', gravity = 0.62 }) {
  const containerRef = useRef(null)
  const wordRefs = useRef([])
  const [started, setStarted] = useState(false)
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    if (reducedMotion) return undefined
    const container = containerRef.current
    if (!container) return undefined
    if (trigger === 'auto') {
      setStarted(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.28 },
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [reducedMotion, trigger])

  useEffect(() => {
    if (!started || reducedMotion) return undefined
    const container = containerRef.current
    if (!container) return undefined

    const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter
    const engine = Engine.create({ gravity: { x: 0, y: gravity, scale: 0.001 } })
    const runner = Runner.create()
    const bounds = container.getBoundingClientRect()
    const width = bounds.width
    const height = bounds.height
    const wall = 80
    const walls = [
      Bodies.rectangle(width / 2, height + wall / 2, width + wall * 2, wall, { isStatic: true }),
      Bodies.rectangle(-wall / 2, height / 2, wall, height * 2, { isStatic: true }),
      Bodies.rectangle(width + wall / 2, height / 2, wall, height * 2, { isStatic: true }),
    ]

    const bodies = wordRefs.current.filter(Boolean).map((node, index) => {
      const rect = node.getBoundingClientRect()
      const x = width * (0.14 + ((index * 0.137) % 0.72))
      const y = -50 - index * 58
      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        restitution: 0.58,
        friction: 0.18,
        frictionAir: 0.012,
        chamfer: { radius: Math.min(rect.height / 2, 20) },
      })
      Body.setAngle(body, (index % 2 ? -1 : 1) * (0.04 + index * 0.006))
      return { body, node }
    })

    const mouse = Mouse.create(container)
    container.removeEventListener('mousewheel', mouse.mousewheel)
    container.removeEventListener('DOMMouseScroll', mouse.mousewheel)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.22, damping: 0.12, render: { visible: false } },
    })
    Composite.add(engine.world, [...walls, ...bodies.map(({ body }) => body), mouseConstraint])
    Runner.run(runner, engine)

    let animationFrame = 0
    const renderDom = () => {
      bodies.forEach(({ body, node }) => {
        node.style.transform = `translate(${body.position.x}px, ${body.position.y}px) translate(-50%, -50%) rotate(${body.angle}rad)`
      })
      animationFrame = window.requestAnimationFrame(renderDom)
    }
    renderDom()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      Runner.stop(runner)
      Mouse.clearSourceEvents(mouse)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [gravity, reducedMotion, started])

  return (
    <div
      className={`falling-text ${started ? 'is-started' : ''} ${reducedMotion ? 'is-static' : ''}`}
      ref={containerRef}
      aria-label="兴趣与个性标签"
    >
      <div className="falling-text__status">
        <span>PHYSICS TYPE CLOUD</span>
        <span>滚动触发 / 可拖动 · SCROLL &amp; DRAG</span>
      </div>
      <div className="falling-text__words">
        {items.map((item, index) => (
          <span
            className={`falling-text__word falling-text__word--${(index % 4) + 1}`}
            key={`${item.zh}-${item.en}`}
            ref={(node) => { wordRefs.current[index] = node }}
          >
            <strong>{item.zh}</strong><small>{item.en}</small>
          </span>
        ))}
      </div>
    </div>
  )
}
