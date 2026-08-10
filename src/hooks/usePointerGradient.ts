import { gsap } from 'gsap'
import { useLayoutEffect, type RefObject } from 'react'

type GradientController = {
  section: HTMLElement
  xTo: ReturnType<typeof gsap.quickTo>
  yTo: ReturnType<typeof gsap.quickTo>
  opacityTo: ReturnType<typeof gsap.quickTo>
}

export function usePointerGradient(
  pageRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const page = pageRef.current

    if (!page) {
      return
    }

    const media = gsap.matchMedia()

    media.add(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        const sections = gsap.utils.toArray<HTMLElement>(
          '[data-pointer-gradient]',
          page,
        )
        const controllers = new Map<HTMLElement, GradientController>()

        sections.forEach((section) => {
          const glow = section.querySelector<HTMLElement>(
            '[data-pointer-gradient-glow]',
          )

          if (!glow) {
            return
          }

          gsap.set(glow, {
            x: section.offsetWidth / 2,
            y: Math.min(section.offsetHeight / 2, 420),
            xPercent: -50,
            yPercent: -50,
            opacity: 0,
            force3D: true,
          })

          controllers.set(section, {
            section,
            xTo: gsap.quickTo(glow, 'x', {
              duration: 0.56,
              ease: 'power3.out',
            }),
            yTo: gsap.quickTo(glow, 'y', {
              duration: 0.56,
              ease: 'power3.out',
            }),
            opacityTo: gsap.quickTo(glow, 'opacity', {
              duration: 0.24,
              ease: 'power2.out',
            }),
          })
        })

        let activeController: GradientController | null = null
        let activeBounds: DOMRect | null = null

        const setActiveController = (
          nextController: GradientController | null,
        ) => {
          if (activeController === nextController) {
            return
          }

          activeController?.opacityTo(0)
          activeController = nextController
          activeBounds = nextController
            ? nextController.section.getBoundingClientRect()
            : null
          activeController?.opacityTo(1)
        }

        const handlePointerMove = (event: PointerEvent) => {
          const target =
            event.target instanceof Element
              ? event.target.closest<HTMLElement>(
                  '[data-pointer-gradient]',
                )
              : null
          const nextController = target
            ? (controllers.get(target) ?? null)
            : null

          setActiveController(nextController)

          if (!activeController || !activeBounds) {
            return
          }

          activeController.xTo(event.clientX - activeBounds.left)
          activeController.yTo(event.clientY - activeBounds.top)
        }

        const refreshActiveBounds = () => {
          activeBounds =
            activeController?.section.getBoundingClientRect() ?? null
        }

        const hideGradient = () => setActiveController(null)

        page.addEventListener('pointermove', handlePointerMove)
        page.addEventListener('pointerleave', hideGradient)
        window.addEventListener('resize', refreshActiveBounds)
        window.addEventListener('scroll', refreshActiveBounds, {
          passive: true,
        })

        return () => {
          page.removeEventListener('pointermove', handlePointerMove)
          page.removeEventListener('pointerleave', hideGradient)
          window.removeEventListener('resize', refreshActiveBounds)
          window.removeEventListener('scroll', refreshActiveBounds)
        }
      },
    )

    return () => media.revert()
  }, [pageRef])
}
