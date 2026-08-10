import {
  animate,
  motion,
  type MotionValue,
  type PanInfo,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

// Adaptado do Orbit Carousel do GodUI (licença MIT).
export type OrbitCarouselProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> & {
  children?: ReactNode
  radius?: number
  angleStep?: number
  itemWidth?: number
  itemHeight?: number
  defaultIndex?: number
  ariaLabel?: string
  previousLabel?: string
  nextLabel?: string
  onChange?: (index: number) => void
}

const SWIPE_DISTANCE = 56
const SWIPE_VELOCITY = 450
const DRAG_DISTANCE_PER_INDEX = 180
const EDGE_RESISTANCE = 0.12
const SETTLE_TRANSITION = {
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1],
} as const

const clampIndex = (value: number, count: number) =>
  Math.max(0, Math.min(count - 1, value))

const applyEdgeResistance = (value: number, count: number) => {
  const lastIndex = Math.max(0, count - 1)

  if (value < 0) {
    return value * EDGE_RESISTANCE
  }

  if (value > lastIndex) {
    return lastIndex + (value - lastIndex) * EDGE_RESISTANCE
  }

  return value
}

type OrbitItemProps = {
  index: number
  orbitPosition: MotionValue<number>
  angleStep: number
  radius: number
  width: number
  height: number
  reduce: boolean
  isActive: boolean
  label: string
  onSelect: () => void
  children: ReactNode
}

function OrbitItem({
  index,
  orbitPosition,
  angleStep,
  radius,
  width,
  height,
  reduce,
  isActive,
  label,
  onSelect,
  children,
}: Readonly<OrbitItemProps>) {
  const angle = useTransform(
    orbitPosition,
    (position) => (index - position) * angleStep,
  )
  const x = useTransform(angle, (value) => {
    const radians = (value * Math.PI) / 180

    return radius * Math.sin(radians)
  })
  const y = useTransform(angle, (value) => {
    const radians = (value * Math.PI) / 180

    return radius * (1 - Math.cos(radians))
  })
  const rotate = useTransform(
    angle,
    (value) => (reduce ? 0 : value * 0.5),
  )
  const scale = useTransform(angle, (value) => {
    const absoluteAngle = Math.abs(value)

    return 1 - Math.min(absoluteAngle / 70, 1) * 0.42
  })
  const zIndex = useTransform(
    angle,
    (value) => Math.round(300 - Math.abs(value)),
  )

  return (
    <motion.div
      className="orbit-carousel-item absolute left-1/2 top-0 cursor-grab active:cursor-grabbing"
      style={{
        width,
        height,
        marginLeft: -width / 2,
        zIndex,
        x,
        y,
        rotate,
        scale,
      }}
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      aria-hidden={!isActive}
      onTap={onSelect}
    >
      <div className="orbit-carousel-card size-full overflow-hidden">
        {children}
      </div>
    </motion.div>
  )
}

const OrbitCarousel = forwardRef<HTMLDivElement, OrbitCarouselProps>(
  function OrbitCarousel(
    {
      children,
      radius = 240,
      angleStep = 26,
      itemWidth = 160,
      itemHeight = 200,
      defaultIndex = 0,
      ariaLabel = 'Carrossel',
      previousLabel = 'Anterior',
      nextLabel = 'Próximo',
      onChange,
      className,
      ...props
    },
    forwardedRef,
  ) {
    const reduce = useReducedMotion() ?? false
    const items = Children.toArray(children)
    const count = items.length
    const initialIndex = clampIndex(defaultIndex, count)
    const [active, setActive] = useState(initialIndex)
    const activeRef = useRef(initialIndex)
    const gestureOriginRef = useRef(initialIndex)
    const gestureStartPositionRef = useRef(initialIndex)
    const settleAnimationRef =
      useRef<ReturnType<typeof animate> | null>(null)
    const orbitPosition = useMotionValue(initialIndex)

    const commitActive = useCallback(
      (next: number) => {
        if (activeRef.current === next) {
          return
        }

        activeRef.current = next
        setActive(next)
        onChange?.(next)
      },
      [onChange],
    )

    const goTo = useCallback(
      (index: number) => {
        const next = clampIndex(index, count)

        settleAnimationRef.current?.stop()

        if (reduce) {
          orbitPosition.set(next)
          commitActive(next)
          return
        }

        settleAnimationRef.current = animate(
          orbitPosition,
          next,
          {
            ...SETTLE_TRANSITION,
            onComplete: () => {
              commitActive(next)
              settleAnimationRef.current = null
            },
          },
        )
      },
      [commitActive, count, orbitPosition, reduce],
    )

    useEffect(
      () => () => settleAnimationRef.current?.stop(),
      [],
    )

    const handlePanStart = () => {
      settleAnimationRef.current?.stop()
      gestureStartPositionRef.current = orbitPosition.get()
      gestureOriginRef.current = clampIndex(
        Math.round(gestureStartPositionRef.current),
        count,
      )
    }

    const handlePan = (_event: unknown, info: PanInfo) => {
      const nextPosition =
        gestureStartPositionRef.current -
        info.offset.x / DRAG_DISTANCE_PER_INDEX

      orbitPosition.set(applyEdgeResistance(nextPosition, count))
    }

    const handlePanEnd = (_event: unknown, info: PanInfo) => {
      const hasEnoughDistance = Math.abs(info.offset.x) >= SWIPE_DISTANCE
      const hasEnoughVelocity = Math.abs(info.velocity.x) >= SWIPE_VELOCITY
      let next = gestureOriginRef.current

      if (hasEnoughDistance || hasEnoughVelocity) {
        const directionSource = hasEnoughDistance
          ? info.offset.x
          : info.velocity.x

        next += directionSource < 0 ? 1 : -1
      }

      goTo(next)
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goTo(active - 1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goTo(active + 1)
      }
    }

    return (
      <div
        ref={forwardedRef}
        data-slot="orbit-carousel"
        className={`orbit-carousel flex flex-col items-center gap-5 ${className ?? ''}`}
        {...props}
      >
        <motion.div
          role="group"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          tabIndex={0}
          className="orbit-carousel-stage relative touch-pan-y overflow-hidden"
          style={{
            width: itemWidth + radius * 1.7,
            maxWidth: '100%',
            height: itemHeight + radius * 0.5,
          }}
          onKeyDown={handleKey}
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
        >
          {items.map((child, index) => (
            <OrbitItem
              key={index}
              index={index}
              orbitPosition={orbitPosition}
              angleStep={angleStep}
              radius={radius}
              width={itemWidth}
              height={itemHeight}
              reduce={reduce}
              isActive={index === active}
              label={`${index + 1} de ${count}`}
              onSelect={() => goTo(index)}
            >
              {child}
            </OrbitItem>
          ))}
        </motion.div>

        <div
          className="orbit-carousel-controls flex items-center gap-4"
          aria-label="Controles do carrossel"
        >
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            onKeyDown={handleKey}
            disabled={active === 0}
            aria-label={previousLabel}
            className="orbit-carousel-button grid size-10 place-items-center rounded-full"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <span
            className="orbit-carousel-counter text-sm tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {active + 1} / {count}
          </span>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            onKeyDown={handleKey}
            disabled={active === count - 1}
            aria-label={nextLabel}
            className="orbit-carousel-button grid size-10 place-items-center rounded-full"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    )
  },
)

export { OrbitCarousel }
