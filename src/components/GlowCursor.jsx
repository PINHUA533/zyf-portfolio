import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './GlowCursor.css'

const MAX_POINTS = 72

const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;

#define MAX_POINTS 72

uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uHotspot;
uniform float uBrightness;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uNoiseStrength;
uniform float uTime;
uniform float uFade;

varying vec2 vUv;

float sRGB(float x) {
  if (x <= 0.00031308) return 12.92 * x;
  return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float strongestCore = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.8);
    float haloRadius = max(width * (1.9 + uGlowSpread * 2.8), 0.75);
    float halo = exp(-pow(distanceToTrail / haloRadius, 2.0) * 1.35);
    float pulseAmount = min(abs(uPulseSpeed), 1.0);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 2.4 - progress * 9.0) * 0.055 * pulseAmount;
    float intensity = (core * 1.18 + halo * uGlowIntensity * 0.34) * life * pulse * active;
    vec3 segmentColor = mix(uColor, uSecondaryColor, progress);

    strongest = max(strongest, intensity);
    strongestCore = max(strongestCore, core * life * active);
    colorSum += segmentColor * intensity;
    colorWeight += intensity;
  }

  float headDistance = length(pixel - uPoints[0]);
  float headCore = exp(-pow(headDistance / max(uTrailWidth * 1.18, 0.75), 2.0) * 2.2);
  float headHalo = exp(-pow(headDistance / max(uTrailWidth * (3.2 + uGlowSpread), 1.0), 2.0) * 1.25);
  strongest = max(strongest, headCore * 1.22 + headHalo * uGlowIntensity * 0.28);
  strongestCore = max(strongestCore, headCore);

  float grain = hash(floor(pixel) + floor(uTime * 14.0)) * 2.0 - 1.0;
  float noiseAmount = (1.0 - exp(-uNoiseStrength * 2.2)) * 0.2;
  float alpha = clamp(strongest * uOpacity * uFade, 0.0, 1.0);
  if (alpha < 0.0005) discard;

  vec3 color = colorSum / max(colorWeight, 0.0001);
  color = mix(color, vec3(1.0), smoothstep(0.25, 0.95, strongestCore) * uHotspot);
  float luminance = sRGB(clamp(strongest * uBrightness, 0.0, 1.0));
  luminance *= 1.0 + grain * noiseAmount;
  gl_FragColor = vec4(color * luminance, alpha);
}
`

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const hexToRgb = (hex) => {
  let value = (hex || '').replace('#', '').trim()
  if (value.length === 3) value = value.split('').map((char) => char + char).join('')
  const parsed = Number.parseInt(value || '000000', 16)
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255]
}

export default function GlowCursor({
  color = '#a8f4ff',
  secondaryColor = '#72a8ff',
  trailLength = 68,
  trailWidth = 4.2,
  trailTaper = 0.88,
  glowIntensity = 1.55,
  glowSpread = 1.25,
  hotspot = 0.72,
  brightness = 1.22,
  opacity = 0.96,
  pulseSpeed = 0.32,
  noiseStrength = 0.008,
  idleTimeout = 620,
  fadeDuration = 820,
  blendMode = 'screen',
  enabled = true,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    let renderer
    try {
      renderer = new Renderer({ canvas, alpha: true, dpr: 1 })
    } catch {
      return undefined
    }

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    // OGL resolves uniform arrays through Array.isArray before uploading them.
    const pointData = Array(MAX_POINTS * 2).fill(0)
    const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }))
    let pathHistory = []
    const target = { x: 0, y: 0 }
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uResolution: { value: [1, 1] },
        uPoints: { value: pointData },
        uPointCount: { value: clamp(Math.round(trailLength), 2, MAX_POINTS) },
        uColor: { value: hexToRgb(color) },
        uSecondaryColor: { value: hexToRgb(secondaryColor) },
        uTrailWidth: { value: trailWidth },
        uTaper: { value: trailTaper },
        uGlowIntensity: { value: glowIntensity },
        uGlowSpread: { value: glowSpread },
        uHotspot: { value: hotspot },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uPulseSpeed: { value: pulseSpeed },
        uNoiseStrength: { value: noiseStrength },
        uTime: { value: 0 },
        uFade: { value: 0 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    let renderScale = 0.88
    let viewportHeight = 1
    let initialized = false
    let fade = 0
    let frame = 0
    let lastInput = 0
    let lastFrame = performance.now()
    let pageVisible = !document.hidden

    const resize = () => {
      const viewportWidth = Math.max(window.innerWidth, 1)
      viewportHeight = Math.max(window.innerHeight, 1)
      renderScale = viewportWidth >= 1600 ? 0.82 : viewportWidth >= 900 ? 0.88 : 0.96
      renderer.setSize(Math.ceil(viewportWidth * renderScale), Math.ceil(viewportHeight * renderScale))
      canvas.style.width = `${viewportWidth}px`
      canvas.style.height = `${viewportHeight}px`
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height]
      program.uniforms.uTrailWidth.value = Math.max(trailWidth * renderScale, 0.1)
    }

    const initializeTrail = (x, y) => {
      target.x = x
      target.y = y
      pathHistory = [{ x, y }]
      points.forEach((point) => {
        point.x = x
        point.y = y
      })
      initialized = true
    }

    const appendPathPoint = (x, y) => {
      if (!initialized) {
        initializeTrail(x, y)
        return
      }

      const startX = target.x
      const startY = target.y
      const distance = Math.hypot(x - startX, y - startY)
      if (distance < 0.15) return

      // Resample every pointer segment at a fixed spatial interval. This keeps
      // fast swipes continuous even when the browser batches pointer events.
      const sampleGap = 5
      const steps = Math.max(1, Math.ceil(distance / sampleGap))
      const additions = []
      for (let step = steps; step >= 1; step -= 1) {
        const progress = step / steps
        additions.push({
          x: startX + (x - startX) * progress,
          y: startY + (y - startY) * progress,
        })
      }
      pathHistory = additions.concat(pathHistory).slice(0, MAX_POINTS * 5)
      target.x = x
      target.y = y
    }

    const render = (now) => {
      frame = 0
      if (!pageVisible) return

      const delta = Math.min((now - lastFrame) / 16.667, 3)
      lastFrame = now
      const pointCount = clamp(Math.round(trailLength), 2, MAX_POINTS)
      for (let index = 0; index < MAX_POINTS; index += 1) {
        const lastIndex = Math.max(pathHistory.length - 1, 0)
        const sourceIndex = Math.min(index, lastIndex)
        const source = pathHistory[sourceIndex] || target
        if (index === 0) {
          points[index].x = source.x
          points[index].y = source.y
        } else {
          const previous = pathHistory[Math.max(sourceIndex - 1, 0)] || source
          const next = pathHistory[Math.min(sourceIndex + 1, lastIndex)] || source
          points[index].x = previous.x * 0.2 + source.x * 0.6 + next.x * 0.2
          points[index].y = previous.y * 0.2 + source.y * 0.6 + next.y * 0.2
        }
      }
      for (let index = 0; index < MAX_POINTS; index += 1) {
        pointData[index * 2] = points[index].x * renderScale
        pointData[index * 2 + 1] = points[index].y * renderScale
      }

      const active = now - lastInput <= idleTimeout
      const fadeTarget = active ? 1 : 0
      const fadeStep = Math.min(1, ((16.667 * delta) / Math.max(fadeDuration, 16)) * 7)
      fade += (fadeTarget - fade) * fadeStep
      if (!active && fade < 0.003) fade = 0

      program.uniforms.uTime.value = now * 0.001
      program.uniforms.uFade.value = fade
      program.uniforms.uPointCount.value = pointCount
      renderer.render({ scene: mesh })
      if (active || fade > 0) frame = window.requestAnimationFrame(render)
    }

    const startFrame = () => {
      if (!frame && pageVisible) {
        lastFrame = performance.now()
        frame = window.requestAnimationFrame(render)
      }
    }

    const onPointerMove = (event) => {
      const coalesced = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : []
      const events = coalesced.length ? coalesced : [event]
      events.forEach((sample) => {
        const x = clamp(sample.clientX, 0, window.innerWidth)
        const y = clamp(viewportHeight - sample.clientY, 0, viewportHeight)
        appendPathPoint(x, y)
      })
      lastInput = performance.now()
      startFrame()
    }

    const onVisibility = () => {
      pageVisible = !document.hidden
      if (!pageVisible && frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
    }

    resize()
    const hasRawPointer = 'onpointerrawupdate' in window
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    if (hasRawPointer) window.addEventListener('pointerrawupdate', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      if (hasRawPointer) window.removeEventListener('pointerrawupdate', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      mesh.geometry.remove()
      program.remove()
    }
  }, [brightness, color, enabled, fadeDuration, glowIntensity, glowSpread, hotspot, idleTimeout, noiseStrength, opacity, pulseSpeed, secondaryColor, trailLength, trailTaper, trailWidth])

  return (
    <div className="glow-cursor" aria-hidden="true">
      <canvas ref={canvasRef} className="glow-cursor__canvas" style={{ mixBlendMode: blendMode }} />
    </div>
  )
}
