import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function BackToTopButton() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useLayoutEffect(() => {
    const button = buttonRef.current

    if (!button) {
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    gsap.set(button, {
      autoAlpha: 0,
      y: 12,
      pointerEvents: 'none',
    })

    const animation = gsap.to(button, {
      autoAlpha: 1,
      y: 0,
      duration: reduceMotion ? 0 : 0.28,
      ease: 'power4.out',
      paused: true,
      onStart: () => {
        button.style.pointerEvents = 'auto'
      },
      onReverseComplete: () => {
        button.style.pointerEvents = 'none'
      },
    })

    const trigger = ScrollTrigger.create({
      trigger: '.hero-section',
      start: 'bottom top',
      onEnter: () => animation.play(),
      onLeaveBack: () => animation.reverse(),
    })

    return () => {
      trigger.kill()
      animation.kill()
    }
  }, [])

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className="back-to-top-button fixed z-[60] inline-grid size-12 place-items-center rounded-full border border-pieta-gold/55 bg-pieta-deep text-pieta-ivory shadow-[0_14px_34px_rgba(20,45,28,0.28)] transition-[background-color,border-color,box-shadow,scale] duration-200 hover:border-pieta-gold hover:bg-[#3a5a40] hover:shadow-[0_18px_40px_rgba(20,45,28,0.34)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pieta-gold sm:size-[52px]"
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
      onClick={scrollToTop}
    >
      <span className="text-[1.35rem] font-medium leading-none" aria-hidden="true">
        ↑
      </span>
    </button>
  )
}
