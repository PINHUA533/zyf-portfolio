import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { gsap } from 'gsap'
import './CardSwap.css'

export const Card = forwardRef(function Card({ customClass = '', ...rest }, ref) {
  return <article ref={ref} {...rest} className={`swap-card ${customClass}`.trim()} />
})

const slotFor = (index, total, distanceX, distanceY) => ({
  x: index * distanceX,
  y: -index * distanceY,
  z: -index * distanceX * 1.35,
  zIndex: total - index,
})

export default function CardSwap({
  width = 560,
  height = 440,
  cardDistance = 54,
  verticalDistance = 48,
  delay = 4800,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 5,
  children,
}) {
  const containerRef = useRef(null)
  const cardsRef = useRef([])
  const orderRef = useRef([])
  const timerRef = useRef(null)
  const busyRef = useRef(false)
  const cards = useMemo(() => Children.toArray(children), [children])

  useEffect(() => {
    const elements = cardsRef.current.filter(Boolean)
    const total = elements.length
    if (!total) return undefined

    orderRef.current = Array.from({ length: total }, (_, index) => index)
    elements.forEach((element, index) => {
      gsap.set(element, {
        ...slotFor(index, total, cardDistance, verticalDistance),
        rotateZ: index % 2 ? skewAmount * 0.28 : -skewAmount * 0.2,
        transformOrigin: '50% 100%',
      })
    })

    const swap = () => {
      if (busyRef.current || total < 2) return
      busyRef.current = true
      const order = orderRef.current
      const frontIndex = order[0]
      const front = elements[frontIndex]
      const nextOrder = [...order.slice(1), frontIndex]
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => { busyRef.current = false },
      })

      timeline.to(front, { y: height * 0.75, x: -cardDistance * 0.55, rotateZ: -skewAmount, duration: 0.62 })
      nextOrder.slice(0, -1).forEach((cardIndex, slotIndex) => {
        timeline.to(elements[cardIndex], {
          ...slotFor(slotIndex, total, cardDistance, verticalDistance),
          rotateZ: slotIndex % 2 ? skewAmount * 0.28 : -skewAmount * 0.2,
          duration: 0.92,
        }, 0.16 + slotIndex * 0.055)
      })
      timeline.set(front, { zIndex: 0 })
      timeline.to(front, {
        ...slotFor(total - 1, total, cardDistance, verticalDistance),
        rotateZ: (total - 1) % 2 ? skewAmount * 0.28 : -skewAmount * 0.2,
        duration: 0.92,
      }, 0.56)
      orderRef.current = nextOrder
    }

    const start = () => {
      window.clearInterval(timerRef.current)
      timerRef.current = window.setInterval(swap, delay)
    }
    const stop = () => window.clearInterval(timerRef.current)
    start()

    const container = containerRef.current
    if (pauseOnHover && container) {
      container.addEventListener('mouseenter', stop)
      container.addEventListener('mouseleave', start)
    }

    return () => {
      stop()
      if (pauseOnHover && container) {
        container.removeEventListener('mouseenter', stop)
        container.removeEventListener('mouseleave', start)
      }
      gsap.killTweensOf(elements)
    }
  }, [cards.length, cardDistance, delay, height, pauseOnHover, skewAmount, verticalDistance])

  return (
    <div
      ref={containerRef}
      className="card-swap-container"
      style={{ '--swap-width': `${width}px`, '--swap-height': `${height}px` }}
    >
      {cards.map((child, index) => isValidElement(child) ? cloneElement(child, {
        ref: (node) => { cardsRef.current[index] = node },
        onClick: (event) => {
          child.props.onClick?.(event)
          onCardClick?.(index)
        },
      }) : child)}
    </div>
  )
}
