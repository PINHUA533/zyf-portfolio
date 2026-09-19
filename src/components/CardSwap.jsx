import { Children, cloneElement, forwardRef, isValidElement, useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import './CardSwap.css'

export const Card = forwardRef(function Card({ customClass = '', ...rest }, ref) {
  return <article ref={ref} {...rest} className={`swap-card ${customClass}`.trim()} />
})

const slotFor = (slot, total, distanceX, distanceY) => ({
  x: slot * distanceX,
  y: -slot * distanceY,
  z: -slot * distanceX * 1.3,
  zIndex: total - slot,
})

export default function CardSwap({
  width = 560,
  height = 440,
  cardDistance = 54,
  verticalDistance = 48,
  activeIndex = 0,
  onCardClick,
  skewAmount = 5,
  children,
}) {
  const cardsRef = useRef([])
  const cards = useMemo(() => Children.toArray(children), [children])

  useLayoutEffect(() => {
    const elements = cardsRef.current.filter(Boolean)
    const total = elements.length
    if (!total) return undefined
    const order = Array.from({ length: total }, (_, offset) => (activeIndex + offset) % total)

    order.forEach((cardIndex, slot) => {
      gsap.to(elements[cardIndex], {
        ...slotFor(slot, total, cardDistance, verticalDistance),
        rotateZ: slot === 0 ? 0 : slot % 2 ? skewAmount * 0.22 : -skewAmount * 0.16,
        scale: slot === 0 ? 1 : 1 - Math.min(slot * 0.012, 0.045),
        duration: 1.05,
        ease: 'power4.inOut',
        overwrite: true,
      })
    })

    return () => gsap.killTweensOf(elements)
  }, [activeIndex, cardDistance, cards.length, skewAmount, verticalDistance])

  return (
    <div
      className="card-swap-container"
      style={{ '--swap-width': `${width}px`, '--swap-height': `${height}px` }}
    >
      {cards.map((child, index) => isValidElement(child) ? cloneElement(child, {
        ref: (node) => { cardsRef.current[index] = node },
        customClass: `${child.props.customClass ?? ''} ${index === activeIndex ? 'is-active' : ''}`.trim(),
        'aria-current': index === activeIndex ? 'true' : undefined,
        onClick: (event) => {
          child.props.onClick?.(event)
          onCardClick?.(index, event)
        },
      }) : child)}
    </div>
  )
}
