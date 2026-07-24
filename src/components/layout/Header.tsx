import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { navigationItems } from '../../data/navigation'
import { WHATSAPP_URL } from '../../utils/whatsapp'

const SCROLL_THRESHOLD = 64
const DESKTOP_MEDIA_QUERY = '(min-width: 1280px)'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })

    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    const desktopMediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    desktopMediaQuery.addEventListener('change', handleDesktopChange)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      desktopMediaQuery.removeEventListener('change', handleDesktopChange)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-400 ease-out ${
        isScrolled ? 'px-3 pt-3.5 sm:px-5' : 'px-0 pt-0'
      }`}
    >
      <div
        className={`mx-auto w-full border transition-[height,max-width,border-radius,background-color,border-color,box-shadow] duration-400 ease-out ${
          isScrolled
            ? 'h-[70px] max-w-[1380px] rounded-[22px] border-pieta-gold/25 bg-pieta-deep/95 shadow-[0_12px_36px_rgba(20,45,28,0.24)] backdrop-blur-xl'
            : 'h-20 max-w-none rounded-none border-pieta-gold/40 bg-pieta-deep'
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-3 min-[375px]:px-4 sm:px-6 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:px-8">
          <a
            href="#inicio"
            className="group justify-self-start rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pieta-gold"
            aria-label="Clínica Veterinária Pietá — voltar ao início"
            onClick={closeMenu}
          >
            <span
              className={`brand-logo ${isScrolled ? 'brand-logo--compact' : ''}`}
            >
              <img
                className="brand-logo__image"
                src="/images/brand/pieta-logo-horizontal-light.png"
                alt="Clínica Veterinária Pietá"
              />
            </span>
          </a>

          <nav
            className="hidden items-center justify-center gap-1 xl:flex"
            aria-label="Navegação principal"
          >
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative rounded-md px-3 py-3 text-sm font-medium text-pieta-ivory transition-colors duration-200 hover:text-pieta-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pieta-gold"
              >
                {item.label}
                <span
                  className="absolute inset-x-3 bottom-1.5 h-px origin-left scale-x-0 bg-pieta-gold transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center justify-center justify-self-end gap-2.5 rounded-xl bg-pieta-ivory px-5 text-sm font-semibold text-pieta-deep shadow-[0_8px_22px_rgba(20,45,28,0.2)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-pieta-white hover:shadow-[0_10px_26px_rgba(20,45,28,0.28)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pieta-gold xl:inline-flex"
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
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-pieta-gold/45 bg-pieta-ivory text-pieta-deep transition-colors duration-200 hover:border-pieta-gold hover:bg-pieta-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pieta-gold xl:hidden"
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
        className={`mobile-menu-panel mx-auto mt-2.5 w-full max-w-[1380px] overflow-hidden rounded-[22px] border border-pieta-gold/25 bg-pieta-deep/95 shadow-[0_18px_44px_rgba(20,45,28,0.24)] backdrop-blur-xl transition-[max-height,opacity,transform,visibility] duration-400 ease-out xl:hidden ${
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
                  className="block rounded-xl px-4 py-3 text-base font-medium text-pieta-ivory transition-[color,background-color,transform,opacity] duration-300 hover:bg-pieta-white/10 hover:text-pieta-gold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pieta-gold"
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
            className="mobile-menu-cta mt-3 flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-pieta-ivory px-5 py-3 text-center text-sm font-semibold text-pieta-deep shadow-[0_8px_22px_rgba(20,45,28,0.2)] transition-[transform,background-color,opacity] duration-300 hover:-translate-y-0.5 hover:bg-pieta-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pieta-gold"
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
