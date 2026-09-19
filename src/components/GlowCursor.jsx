import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './GlowCursor.css'

const MAX_POINTS = 48
const VERTEX = `attribute vec2 position; attribute vec2 uv; varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`
const FRAGMENT = `
precision highp float;
#define MAX_POINTS 48
uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTime;
uniform float uFade;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 pixel=vUv*uResolution;
  float denominator=max(uPointCount-1.,1.);
  float strongest=0.; float corePeak=0.; float weight=0.; vec3 colorSum=vec3(0.);
  for(int i=0;i<MAX_POINTS-1;i++){
    float index=float(i); float active=1.-step(uPointCount-1.,index);
    vec2 start=uPoints[i]; vec2 end=uPoints[i+1]; vec2 delta=pixel-start; vec2 segment=end-start;
    float along=clamp(dot(delta,segment)/max(dot(segment,segment),.0001),0.,1.);
    float progress=clamp((index+along)/denominator,0.,1.); float life=pow(max(1.-progress,0.),.82);
    float width=uTrailWidth*mix(1.,.18,pow(progress,1.15));
    float distanceToTrail=length(delta-segment*along);
    float core=exp(-pow(distanceToTrail/max(width,.5),2.)*2.4);
    float halo=min(1.,pow(width*2.2,2.)/(distanceToTrail*distanceToTrail+pow(width*2.2,2.)));
    float pulse=1.+sin(uTime*3.1-progress*10.)*.12;
    float intensity=(core+halo*.9)*life*pulse*active;
    vec3 segmentColor=mix(uColor,uSecondaryColor,progress);
    strongest=max(strongest,intensity); corePeak=max(corePeak,core*life*active);
    colorSum+=segmentColor*intensity; weight+=intensity;
  }
  float grain=(hash(floor(pixel)+floor(uTime*17.))*2.-1.)*.035;
  float alpha=clamp(strongest*.9*uFade,0.,1.); if(alpha<.001) discard;
  vec3 color=colorSum/max(weight,.0001); color=mix(color,vec3(1.),smoothstep(.3,.92,corePeak)*.62);
  color*=clamp(strongest*1.18,0.,1.)*(1.+grain);
  gl_FragColor=vec4(color,alpha);
}`

const rgb = (hex) => {
  let value = hex.replace('#', '')
  if (value.length === 3) value = value.split('').map((char) => char + char).join('')
  const parsed = Number.parseInt(value, 16)
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255]
}

export default function GlowCursor({ color = '#68ffe4', secondaryColor = '#806bff' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const renderer = new Renderer({ canvas, alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 1.35) })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    const data = Array(MAX_POINTS * 2).fill(0)
    const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }))
    const target = { x: 0, y: 0 }
    const head = { x: 0, y: 0 }
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uResolution: { value: [1, 1] }, uPoints: { value: data }, uPointCount: { value: 42 },
        uColor: { value: rgb(color) }, uSecondaryColor: { value: rgb(secondaryColor) },
        uTrailWidth: { value: 7.2 }, uTime: { value: 0 }, uFade: { value: 0 },
      },
      transparent: true, depthTest: false, depthWrite: false,
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    let initialized = false
    let fade = 0
    let lastMove = 0
    let lastFrame = performance.now()
    let frame = 0

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      program.uniforms.uResolution.value = [window.innerWidth, window.innerHeight]
    }
    const move = (event) => {
      const x = event.clientX
      const y = window.innerHeight - event.clientY
      if (!initialized) {
        points.forEach((point) => { point.x = x; point.y = y })
        head.x = x; head.y = y; initialized = true
      }
      target.x = x; target.y = y; lastMove = performance.now()
    }
    const render = (now) => {
      const delta = Math.min((now - lastFrame) / 16.667, 3)
      lastFrame = now
      if (initialized) {
        const headEase = 1 - Math.pow(.84, delta)
        const chainEase = 1 - Math.pow(.62, delta)
        head.x += (target.x - head.x) * headEase
        head.y += (target.y - head.y) * headEase
        points[0].x = head.x; points[0].y = head.y
        for (let index = 1; index < MAX_POINTS; index += 1) {
          points[index].x += (points[index - 1].x - points[index].x) * chainEase
          points[index].y += (points[index - 1].y - points[index].y) * chainEase
        }
        points.forEach((point, index) => { data[index * 2] = point.x; data[index * 2 + 1] = point.y })
      }
      const targetFade = initialized && now - lastMove < 820 ? 1 : 0
      fade += (targetFade - fade) * Math.min(.12 * delta, 1)
      program.uniforms.uTime.value = now * .001
      program.uniforms.uFade.value = fade
      renderer.render({ scene: mesh })
      frame = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move, { passive: true })
    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      mesh.geometry.remove()
      program.remove()
    }
  }, [color, secondaryColor])

  return <canvas ref={canvasRef} className="glow-cursor" aria-hidden="true" />
}
