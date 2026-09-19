import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'
import { useEffect, useRef } from 'react'
import './Aurora.css'

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(.2113248654, .3660254038, -.5773502692, .0243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m * m;
  m = m * m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - .5;
  vec3 ox = floor(x + .5);
  vec3 a0 = x - ox;
  m *= 1.792842914 - .8537347209 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 first = uColorStops[0];
  vec3 middle = uColorStops[1];
  vec3 last = uColorStops[2];
  vec3 rampColor = uv.x < .5
    ? mix(first, middle, smoothstep(0., .5, uv.x))
    : mix(middle, last, smoothstep(.5, 1., uv.x));
  float wave = snoise(vec2(uv.x * 2.15 + uTime * .1, uTime * .25)) * .5 * uAmplitude;
  float height = exp(wave);
  height = uv.y * 2. - height + .2;
  float intensity = .6 * height;
  float alpha = smoothstep(.2 - uBlend * .5, .2 + uBlend * .5, intensity);
  vec3 color = intensity * rampColor;
  fragColor = vec4(color * alpha, alpha);
}
`

const toColor = (value) => {
  const color = new Color(value)
  return [color.r, color.g, color.b]
}

export default function Aurora({
  colorStops = ['#68ffe4', '#806bff', '#ff86df'],
  amplitude = 1.05,
  blend = 0.42,
  speed = 0.72,
}) {
  const containerRef = useRef(null)
  const propsRef = useRef({ colorStops, amplitude, blend, speed })
  propsRef.current = { colorStops, amplitude, blend, speed }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.35),
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStops.map(toColor) },
        uResolution: { value: [1, 1] },
        uBlend: { value: blend },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new Mesh(gl, { geometry, program })
    container.appendChild(gl.canvas)

    let frame = 0
    let visible = true
    let last = performance.now()
    let elapsed = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const width = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)
      renderer.setSize(width, height)
      program.uniforms.uResolution.value = [width, height]
    }

    const render = (now) => {
      const delta = Math.min(now - last, 40)
      last = now
      if (visible) {
        elapsed += reduceMotion ? 0 : delta
        const current = propsRef.current
        program.uniforms.uTime.value = elapsed * 0.001 * current.speed
        program.uniforms.uAmplitude.value = current.amplitude
        program.uniforms.uBlend.value = current.blend
        program.uniforms.uColorStops.value = current.colorStops.map(toColor)
        renderer.render({ scene: mesh })
      }
      frame = requestAnimationFrame(render)
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    resizeObserver.observe(container)
    visibilityObserver.observe(container)
    resize()
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas)
      geometry.remove()
      program.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <div ref={containerRef} className="aurora-container" aria-hidden="true" />
}
