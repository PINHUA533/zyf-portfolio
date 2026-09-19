import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollMotion({ routeKey = 'home' }) {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

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
          })
        }
        if (cards.length) {
          timeline.from(cards, {
            y: 128,
            scale: 0.94,
            opacity: 0,
            duration: 1.28,
            stagger: 0.16,
            ease: 'power4.out',
          }, title.length ? '-=.58' : 0)
        }
        if (images.length) {
          timeline.fromTo(images, {
            clipPath: 'inset(0 0 100% 0)',
            scale: 1.09,
          }, {
            clipPath: 'inset(0 0 0% 0)',
            scale: 1,
            duration: 1.65,
            stagger: 0.16,
            ease: 'power3.inOut',
          }, '-=.85')

          images.forEach((image) => {
            gsap.to(image, {
              yPercent: -5,
              ease: 'none',
              scrollTrigger: {
                trigger: image,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.9,
              },
            })
          })
        }
      })
    })

    ScrollTrigger.refresh()
    return () => context.revert()
  }, [routeKey])

  return null
}
