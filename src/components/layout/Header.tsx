import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef, useState } from 'react'
import { navigationItems } from '../../data/navigation'
import { WHATSAPP_URL } from '../../utils/whatsapp'

gsap.registerPlugin(ScrollTrigger)

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useLayoutEffect(() => {
    const shell = shellRef.current

    if (!shell) {
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const media = gsap.matchMedia()

    media.add(
      {
        desktop: '(min-width: 1024px)',
        tablet: '(min-width: 640px) and (max-width: 1023px)',
        mobile: '(max-width: 639px)',
      },
      (context) => {
        const conditions = context.conditions as {
          desktop: boolean
          tablet: boolean
          mobile: boolean
        }

        const horizontalInset = conditions.desktop
          ? 48
          : conditions.tablet
            ? 32
            : 20

        const getFloatingWidth = () =>
          Math.min(
            document.documentElement.clientWidth - horizontalInset * 2,
            1440,
          )

        const animation = gsap.fromTo(
          shell,
          {
            marginTop: 0,
            width: () => document.documentElement.clientWidth,
            borderRadius: '0 0 24px 24px',
            boxShadow: '0 0 0 rgba(20, 45, 28, 0)',
          },
          {
            marginTop: 12,
            width: getFloatingWidth,
            borderRadius: 22,
            boxShadow: '0 16px 42px rgba(20, 45, 28, 0.24)',
            duration: reduceMotion ? 0 : 0.38,
            ease: 'power4.out',
            paused: true,
          },
        )

        const trigger = ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top -64',
          end: 'max',
          onEnter: () => animation.play(),
          onLeaveBack: () => animation.reverse(),
          onRefresh: () => {
            const progress = animation.progress()
            animation.invalidate().progress(progress)
          },
        })

        return () => {
          trigger.kill()
          animation.kill()
        }
      },
    )

    return () => media.revert()
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <div
        ref={shellRef}
        className="header-shell mx-auto h-[90px] w-full overflow-hidden border border-pieta-gold/30 bg-pieta-deep/96 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:px-8">
          <a
            href="#inicio"
            className="justify-self-start rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pieta-gold"
            aria-label="Clínica Veterinária Pietá, voltar ao início"
            onClick={closeMenu}
          >
            <span className="brand-logo">
              <img
                className="brand-logo__image"
                src="/images/brand/pieta-logo-horizontal-light.png"
                alt="Clínica Veterinária Pietá"
              />
            </span>
          </a>

          <nav
            className="hidden items-center justify-center gap-0.5 xl:flex"
            aria-label="Navegação principal"
          >
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative whitespace-nowrap rounded-md px-2.5 py-3 text-[13px] font-medium text-pieta-ivory/78 transition-colors duration-200 hover:text-pieta-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pieta-gold"
              >
                {item.label}
                <span
                  className="absolute inset-x-2.5 bottom-1.5 h-px origin-left scale-x-0 bg-pieta-gold transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center justify-center justify-self-end gap-2.5 whitespace-nowrap rounded-[14px] bg-pieta-ivory px-4 text-[13px] font-semibold text-pieta-deep shadow-[0_8px_22px_rgba(20,45,28,0.2)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-pieta-white-soft hover:shadow-[0_10px_26px_rgba(20,45,28,0.28)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pieta-gold xl:inline-flex"
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="text-lg"
              aria-hidden="true"
            />
            Agendar pelo WhatsApp
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-pieta-gold/45 bg-pieta-ivory text-pieta-deep transition-colors duration-200 hover:border-pieta-gold hover:bg-pieta-white-soft active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pieta-gold xl:hidden"
            aria-label={isMenuOpen ? 'Fechar menu principal' : 'Abrir menu principal'}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            onClick={() => setIsMenuOpen((currentState) => !currentState)}
          >
            <svg
              className={`house-menu-icon ${isMenuOpen ? 'house-menu-icon--open' : ''}`}
              viewBox="0 0 32 30"
              aria-hidden="true"
            >
              <path
                className="house-menu-icon__roof house-menu-icon__roof--left"
                d="M4 13 16 3"
              />
              <path
                className="house-menu-icon__roof house-menu-icon__roof--right"
                d="M16 3 28 13"
              />
              <path
                className="house-menu-icon__body"
                d="M4 13v13h24V13"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        aria-hidden={!isMenuOpen}
        className={`mobile-menu-panel mx-auto mt-2.5 w-[calc(100%_-_24px)] max-w-[1380px] overflow-hidden rounded-[22px] border border-pieta-gold/25 bg-pieta-deep/98 shadow-[0_18px_44px_rgba(20,45,28,0.24)] backdrop-blur-xl transition-[max-height,opacity,transform,visibility] duration-400 ease-out xl:hidden ${
          isMenuOpen
            ? 'visible max-h-[560px] translate-y-0 opacity-100'
            : 'invisible max-h-0 -translate-y-2 opacity-0'
        }`}
      >
        <nav
          className="p-3 sm:p-4"
          aria-label="Navegação principal no menu mobile"
        >
          <ul className="mobile-menu-list grid gap-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  tabIndex={isMenuOpen ? 0 : -1}
                  className="block rounded-[14px] px-4 py-3 text-base font-medium text-pieta-ivory transition-[color,background-color,transform,opacity] duration-300 hover:bg-pieta-white/10 hover:text-pieta-gold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pieta-gold"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isMenuOpen ? 0 : -1}
            className="mobile-menu-cta mt-3 flex min-h-12 items-center justify-center gap-2.5 rounded-[14px] bg-pieta-ivory px-5 py-3 text-center text-sm font-semibold text-pieta-deep transition-[transform,background-color,opacity] duration-300 hover:-translate-y-0.5 hover:bg-pieta-white-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pieta-gold"
            onClick={closeMenu}
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="text-lg"
              aria-hidden="true"
            />
            Agendar pelo WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}
