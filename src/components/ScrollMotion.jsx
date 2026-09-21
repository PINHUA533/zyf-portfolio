import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollMotion({ routeKey = 'home' }) {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined
    const allowParallax = window.matchMedia('(min-width: 900px) and (pointer: fine)').matches
    let refreshFrame = 0

    const context = gsap.context(() => {
      document.querySelectorAll('[data-motion-section]').forEach((section, sectionIndex) => {
        const title = section.querySelectorAll('[data-motion-title]')
        const cards = section.querySelectorAll('[data-motion-card]')
        const images = section.querySelectorAll('[data-motion-image]')
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true,
          },
        })

        if (title.length) {
          timeline.from(title, {
            xPercent: sectionIndex % 2 ? 18 : -18,
            yPercent: 135,
            rotateX: 18,
            rotateZ: sectionIndex % 2 ? 1.2 : -1.2,
            opacity: 0,
            duration: 1.7,
            ease: 'power4.out',
            stagger: 0.12,
            willChange: 'transform,opacity',
            clearProps: 'transform,opacity,willChange',
          })
        }
        if (cards.length) {
          timeline.from(cards, {
            y: 68,
            scale: 0.97,
            opacity: 0,
            duration: 1.12,
            stagger: 0.13,
            ease: 'power4.out',
            willChange: 'transform,opacity',
            clearProps: 'transform,opacity,willChange',
          }, title.length ? '-=.58' : 0)
        }
        if (images.length) {
          timeline.fromTo(images, {
            clipPath: 'inset(0 0 100% 0)',
            scale: 1.09,
            willChange: 'transform,clip-path',
          }, {
            clipPath: 'inset(0 0 0% 0)',
            scale: 1,
            duration: 1.65,
            stagger: 0.16,
            ease: 'power3.inOut',
            onComplete: () => {
              images.forEach((image) => {
                image.style.clipPath = ''
                image.style.willChange = allowParallax ? 'transform' : ''
                if (!allowParallax) image.style.transform = ''
              })
            },
          }, '-=.85')

          if (allowParallax) {
            images.forEach((image) => {
              gsap.to(image, {
                yPercent: -4,
                ease: 'none',
                scrollTrigger: {
                  trigger: image,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.1,
                  invalidateOnRefresh: true,
                },
              })
            })
          }
        }
      })
    })

    refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame)
      context.revert()
    }
  }, [routeKey])

  return null
}
