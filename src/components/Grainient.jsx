import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './Grainient.css'

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
    : [1, 1, 1]
}

const vertex = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.,1.);}`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float n=mix(mix(dot(-1.+2.*hash(i),f),dot(-1.+2.*hash(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(-1.+2.*hash(i+vec2(0,1)),f-vec2(0,1)),dot(-1.+2.*hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);return .5+.5*n;}
void main(){
  float t=iTime*uTimeSpeed;
  vec2 uv=gl_FragCoord.xy/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=(uv-.5+uCenterOffset)/max(uZoom,.001);
  float degree=noise(vec2(t*.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y/=ratio;
  tuv*=Rot(radians((degree-.5)*uRotationAmount+180.));
  tuv.y*=ratio;
  float amp=uWarpAmplitude/max(uWarpStrength,.001);
  float wt=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*uWarpFrequency+wt)/amp;
  tuv.y+=sin(tuv.x*(uWarpFrequency*1.5)+wt)/(amp*.5);
  float b=uColorBalance,s=max(uBlendSoftness,0.);
  float blendX=(tuv*Rot(radians(uBlendAngle))).x;
  float e0=-.3-b-s,e1=.2-b+s;
  vec3 l1=mix(uColor3,uColor2,S(e0,e1,blendX));
  vec3 l2=mix(uColor2,uColor1,S(e0,e1,blendX));
  vec3 col=mix(l1,l2,S(.5-b+s,-.3-b-s,tuv.y));
  vec2 guv=uv*max(uGrainScale,.001);
  if(uGrainAnimated>.5)guv+=vec2(iTime*.05);
  float grain=fract(sin(dot(guv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-.5)*uGrainAmount;
  col=(col-.5)*uContrast+.5;
  float luma=dot(col,vec3(.2126,.7152,.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.),vec3(1./max(uGamma,.001)));
  fragColor=vec4(clamp(col,0.,1.),1.);
}`

export default function Grainient({
  color1 = '#68ffe4',
  color2 = '#6f5cff',
  color3 = '#05060b',
  timeSpeed = 0.18,
  colorBalance = -0.08,
  warpStrength = 0.82,
  warpFrequency = 4.2,
  warpSpeed = 1.15,
  warpAmplitude = 58,
  blendAngle = -14,
  blendSoftness = 0.12,
  rotationAmount = 360,
  noiseScale = 1.7,
  grainAmount = 0.13,
  grainScale = 2.4,
  grainAnimated = false,
  contrast = 1.55,
  gamma = 1.08,
  saturation = 1.12,
  centerX = 0,
  centerY = 0,
  zoom = 0.9,
  className = '',
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new Renderer({ webgl: 2, alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5) })
    const gl = renderer.gl
    const canvas = gl.canvas
    Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block' })
    container.appendChild(canvas)
    const geometry = new Triangle(gl)
    const uniforms = {
      iResolution: { value: new Float32Array([1, 1]) }, iTime: { value: 0 },
      uTimeSpeed: { value: timeSpeed }, uColorBalance: { value: colorBalance },
      uWarpStrength: { value: warpStrength }, uWarpFrequency: { value: warpFrequency },
      uWarpSpeed: { value: warpSpeed }, uWarpAmplitude: { value: warpAmplitude },
      uBlendAngle: { value: blendAngle }, uBlendSoftness: { value: blendSoftness },
      uRotationAmount: { value: rotationAmount }, uNoiseScale: { value: noiseScale },
      uGrainAmount: { value: grainAmount }, uGrainScale: { value: grainScale },
      uGrainAnimated: { value: grainAnimated ? 1 : 0 }, uContrast: { value: contrast },
      uGamma: { value: gamma }, uSaturation: { value: saturation },
      uCenterOffset: { value: new Float32Array([centerX, centerY]) }, uZoom: { value: zoom },
      uColor1: { value: new Float32Array(hexToRgb(color1)) },
      uColor2: { value: new Float32Array(hexToRgb(color2)) },
      uColor3: { value: new Float32Array(hexToRgb(color3)) },
    }
    const program = new Program(gl, { vertex, fragment, uniforms })
    const mesh = new Mesh(gl, { geometry, program })
    const resize = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height))
      uniforms.iResolution.value[0] = gl.drawingBufferWidth
      uniforms.iResolution.value[1] = gl.drawingBufferHeight
      renderer.render({ scene: mesh })
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()
    let frame = 0
    let visible = true
    const start = performance.now()
    const loop = (now) => {
      uniforms.iTime.value = reduceMotion ? 0 : (now - start) * 0.001
      renderer.render({ scene: mesh })
      if (!reduceMotion && visible && !document.hidden) frame = requestAnimationFrame(loop)
    }
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame && !document.hidden) frame = requestAnimationFrame(loop)
      if (!visible && frame) { cancelAnimationFrame(frame); frame = 0 }
    })
    visibilityObserver.observe(container)
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      visibilityObserver.disconnect()
      container.removeChild(canvas)
    }
  }, [blendAngle, blendSoftness, centerX, centerY, color1, color2, color3, colorBalance, contrast, gamma, grainAmount, grainAnimated, grainScale, noiseScale, rotationAmount, saturation, timeSpeed, warpAmplitude, warpFrequency, warpSpeed, warpStrength, zoom])

  return <div ref={containerRef} className={`grainient-container ${className}`.trim()} />
}
