import { useEffect, useRef } from 'react'

const hexToRgb = (hex) => {
  const value = hex.replace('#', '')
  const normalized = value.length === 3 ? value.split('').map((char) => char + char).join('') : value
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  }
}

export default function SplashCursor({ COLOR = '#68ffe4', SECONDARY_COLOR = '#806bff' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (coarse || reduceMotion) return undefined

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined
    const primary = hexToRgb(COLOR)
    const secondary = hexToRgb(SECONDARY_COLOR)
    let width = 0
    let height = 0
    let frame = 0
    let active = true
    let pointer = { x: -100, y: -100, px: -100, py: -100 }
    const particles = []

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const addSplash = (x, y, dx, dy) => {
      const speed = Math.min(42, Math.hypot(dx, dy))
      const count = Math.max(2, Math.floor(speed / 4))
      for (let index = 0; index < count; index += 1) {
        const mix = Math.random()
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: -dx * (0.025 + Math.random() * 0.035) + (Math.random() - 0.5) * 1.2,
          vy: -dy * (0.025 + Math.random() * 0.035) + (Math.random() - 0.5) * 1.2,
          life: 1,
          decay: 0.012 + Math.random() * 0.012,
          radius: 18 + speed * 0.72 + Math.random() * 22,
          r: Math.round(primary.r * (1 - mix) + secondary.r * mix),
          g: Math.round(primary.g * (1 - mix) + secondary.g * mix),
          b: Math.round(primary.b * (1 - mix) + secondary.b * mix),
        })
      }
      if (particles.length > 180) particles.splice(0, particles.length - 180)
    }

    const move = (event) => {
      const x = event.clientX
      const y = event.clientY
      const dx = x - pointer.x
      const dy = y - pointer.y
      pointer = { x, y, px: pointer.x, py: pointer.y }
      if (Math.abs(dx) + Math.abs(dy) > 1 && pointer.px > -50) addSplash(x, y, dx, dy)
    }
    const click = (event) => {
      for (let index = 0; index < 18; index += 1) {
        addSplash(event.clientX, event.clientY, (Math.random() - 0.5) * 90, (Math.random() - 0.5) * 90)
      }
    }

    const draw = () => {
      if (!active) return
      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = 'lighter'
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.986
        particle.vy *= 0.986
        particle.life -= particle.decay
        particle.radius *= 0.997
        const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius)
        gradient.addColorStop(0, `rgba(${particle.r}, ${particle.g}, ${particle.b}, ${Math.max(0, particle.life) * 0.16})`)
        gradient.addColorStop(0.35, `rgba(${particle.r}, ${particle.g}, ${particle.b}, ${Math.max(0, particle.life) * 0.08})`)
        gradient.addColorStop(1, `rgba(${particle.r}, ${particle.g}, ${particle.b}, 0)`)
        context.fillStyle = gradient
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      })
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        if (particles[index].life <= 0) particles.splice(index, 1)
      }
      context.globalCompositeOperation = 'source-over'
      frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', click, { passive: true })
    frame = requestAnimationFrame(draw)
    return () => {
      active = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', click)
    }
  }, [COLOR, SECONDARY_COLOR])

  return <canvas ref={canvasRef} className="splash-cursor" aria-hidden="true" />
}
