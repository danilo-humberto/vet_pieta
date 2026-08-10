import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

type MotionConditions = {
  desktop: boolean
  tablet: boolean
  mobile: boolean
}

const clearEntryStyles = (targets: Element[]) => {
  gsap.set(targets, {
    clearProps:
      'opacity,visibility,transform,transformOrigin,willChange',
  })
}

export function useLandingAnimations(
  pageRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const page = pageRef.current

    if (!page) {
      return
    }

    const initialHash = window.location.hash.slice(1)

    if (initialHash) {
      const hashTarget = document.getElementById(
        decodeURIComponent(initialHash),
      )

      if (hashTarget) {
        const root = document.documentElement
        const previousScrollBehavior = root.style.scrollBehavior

        root.style.scrollBehavior = 'auto'
        hashTarget.scrollIntoView({ block: 'start' })
        root.style.scrollBehavior = previousScrollBehavior
      }
    }

    let isActive = true
    const media = gsap.matchMedia()

    media.add(
      {
        desktop:
          '(min-width: 1280px) and (prefers-reduced-motion: no-preference)',
        tablet:
          '(min-width: 768px) and (max-width: 1279px) and (prefers-reduced-motion: no-preference)',
        mobile:
          '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      },
      (mediaContext) => {
        const conditions = mediaContext.conditions as MotionConditions
        const isMobile = conditions.mobile
        const isDesktop = conditions.desktop
        const context = gsap.context(() => {
          const heroAnimatedElements = gsap.utils.toArray<HTMLElement>(
            '[data-motion^="hero-"], [data-patient-card]',
          )
          const heroTimeline = gsap.timeline({
            defaults: { ease: 'power4.out', overwrite: 'auto' },
            onComplete: () => clearEntryStyles(heroAnimatedElements),
          })
          const heroOrbit = page.querySelector<HTMLElement>(
            '[data-motion="hero-orbit"]',
          )

          heroTimeline
            .from(
              '[data-motion="hero-house"]',
              {
                autoAlpha: 0,
                scale: 0.96,
                duration: isMobile ? 0.52 : 0.72,
              },
              0,
            )
            .from(
              '[data-motion="hero-halo"]',
              {
                autoAlpha: 0,
                scale: 0.9,
                duration: isMobile ? 0.5 : 0.7,
              },
              0.04,
            )
            .from(
              '[data-motion="hero-kicker"]',
              {
                autoAlpha: 0,
                y: isMobile ? 12 : 16,
                duration: isMobile ? 0.48 : 0.55,
              },
              0.08,
            )
            .from(
              '[data-motion="hero-title"]',
              {
                autoAlpha: 0,
                y: isMobile ? 24 : 32,
                duration: isMobile ? 0.6 : 0.78,
              },
              0.12,
            )
            .from(
              '[data-motion="hero-lead"], [data-motion="hero-actions"]',
              {
                autoAlpha: 0,
                y: isMobile ? 18 : 22,
                duration: isMobile ? 0.5 : 0.62,
                stagger: isMobile ? 0.05 : 0.08,
              },
              0.24,
            )

          if (heroOrbit) {
            heroTimeline.from(
              heroOrbit,
              {
                autoAlpha: 0,
                y: isMobile ? 30 : 46,
                scale: isMobile ? 0.97 : 0.96,
                duration: isMobile ? 0.62 : 0.86,
              },
              0.2,
            )
          } else {
            heroTimeline
              .from(
                '.patient-card-entry--golden',
                {
                  autoAlpha: 0,
                  y: isMobile ? 32 : 48,
                  scale: 0.95,
                  duration: isMobile ? 0.65 : 0.88,
                },
                0.18,
              )
              .from(
                '.patient-card-entry--cat, .patient-card-entry--small',
                {
                  autoAlpha: 0,
                  y: isMobile ? 36 : 52,
                  scale: 0.94,
                  duration: isMobile ? 0.58 : 0.86,
                  stagger: isMobile ? 0.06 : 0.1,
                },
                isMobile ? 0.32 : 0.4,
              )
          }

          const headingUpElements = gsap.utils.toArray<HTMLElement>(
            '[data-motion="heading-up"]',
          )
          const headingRightElements = gsap.utils.toArray<HTMLElement>(
            '[data-motion="heading-right"]',
          )

          gsap.set(headingUpElements, {
            autoAlpha: 0,
            y: isMobile ? 24 : 40,
            willChange: 'transform, opacity',
          })
          gsap.set(headingRightElements, {
            autoAlpha: 0,
            x: isMobile ? 0 : 32,
            y: isMobile ? 24 : 0,
            willChange: 'transform, opacity',
          })

          ScrollTrigger.batch(headingUpElements, {
            start: 'top 88%',
            batchMax: 1,
            onEnter: (batch) => {
              const elements = batch as Element[]
              gsap.to(elements, {
                autoAlpha: 1,
                y: 0,
                duration: isMobile ? 0.56 : 0.78,
                ease: 'power4.out',
                overwrite: 'auto',
                onComplete: () => clearEntryStyles(elements),
              })
            },
            onLeaveBack: (batch) => {
              const elements = batch as Element[]
              gsap.killTweensOf(elements)
              gsap.set(elements, {
                autoAlpha: 0,
                y: isMobile ? 24 : 40,
                willChange: 'transform, opacity',
              })
            },
          })

          ScrollTrigger.batch(headingRightElements, {
            start: 'top 88%',
            batchMax: 1,
            onEnter: (batch) => {
              const elements = batch as Element[]
              gsap.to(elements, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: isMobile ? 0.56 : 0.78,
                ease: 'power4.out',
                overwrite: 'auto',
                onComplete: () => clearEntryStyles(elements),
              })
            },
            onLeaveBack: (batch) => {
              const elements = batch as Element[]
              gsap.killTweensOf(elements)
              gsap.set(elements, {
                autoAlpha: 0,
                x: isMobile ? 0 : 32,
                y: isMobile ? 24 : 0,
                willChange: 'transform, opacity',
              })
            },
          })

          const serviceCards = gsap.utils.toArray<HTMLElement>(
            '[data-motion="service-card"]',
          )
          const serviceLineReveals = gsap.utils.toArray<HTMLElement>(
            '[data-motion-part="service-line-reveal"]',
          )

          gsap.set(serviceCards, {
            autoAlpha: 0,
            y: isMobile ? 24 : 42,
            scale: isMobile ? 0.99 : 0.98,
            willChange: 'transform, opacity',
          })
          gsap.set(serviceLineReveals, {
            scaleX: 0,
            transformOrigin: 'left center',
            willChange: 'transform',
          })

          ScrollTrigger.batch(serviceCards, {
            start: 'top 90%',
            interval: 0.06,
            batchMax: isDesktop ? 4 : conditions.tablet ? 2 : 1,
            onEnter: (batch) => {
              const cards = batch as HTMLElement[]
              const lines = cards
                .map((card) =>
                  card.querySelector(
                    '[data-motion-part="service-line-reveal"]',
                  ),
                )
                .filter((line): line is Element => Boolean(line))

              gsap.to(cards, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: isMobile ? 0.56 : 0.72,
                stagger: isMobile ? 0.05 : 0.08,
                ease: 'power4.out',
                overwrite: 'auto',
                onComplete: () => clearEntryStyles(cards),
              })

              gsap.to(lines, {
                scaleX: 1,
                duration: isMobile ? 0.32 : 0.42,
                delay: isMobile ? 0.56 : 0.72,
                stagger: isMobile ? 0.05 : 0.08,
                ease: 'power4.out',
                overwrite: 'auto',
                onComplete: () => clearEntryStyles(lines),
              })
            },
            onLeaveBack: (batch) => {
              const cards = batch as HTMLElement[]
              const lines = cards
                .map((card) =>
                  card.querySelector(
                    '[data-motion-part="service-line-reveal"]',
                  ),
                )
                .filter((line): line is Element => Boolean(line))

              gsap.killTweensOf([...cards, ...lines])
              gsap.set(cards, {
                autoAlpha: 0,
                y: isMobile ? 24 : 42,
                scale: isMobile ? 0.99 : 0.98,
                willChange: 'transform, opacity',
              })
              gsap.set(lines, {
                scaleX: 0,
                transformOrigin: 'left center',
                willChange: 'transform',
              })
            },
          })

          const differentialImage = page.querySelector<HTMLElement>(
            '[data-motion="differential-image"]',
          )

          if (differentialImage) {
            const quote = differentialImage.querySelector<HTMLElement>(
              '[data-motion="differential-quote"]',
            )
            const imageElements = [differentialImage, quote].filter(
              (element): element is HTMLElement => Boolean(element),
            )
            const imageTimeline = gsap.timeline({
              defaults: { overwrite: 'auto' },
              scrollTrigger: {
                trigger: differentialImage,
                start: 'top 88%',
                toggleActions: 'play none none reset',
              },
              onComplete: () => clearEntryStyles(imageElements),
            })

            imageTimeline
              .from(differentialImage, {
                autoAlpha: 0,
                x: isMobile ? 0 : -44,
                y: isMobile ? 24 : 0,
                scale: isMobile ? 1.02 : 1.04,
                duration: isMobile ? 0.6 : 0.9,
                ease: 'power4.out',
              })
              .from(
                quote,
                {
                  autoAlpha: 0,
                  y: isMobile ? 18 : 24,
                  duration: isMobile ? 0.48 : 0.58,
                  ease: 'power4.out',
                },
                isMobile ? '-=0.36' : '-=0.54',
              )
          }

          const differentialRows = gsap.utils.toArray<HTMLElement>(
            '[data-motion="differential-row"]',
          )

          gsap.set(differentialRows, {
            autoAlpha: 0,
            x: isMobile ? 0 : 20,
            y: isMobile ? 20 : 0,
            willChange: 'transform, opacity',
          })

          ScrollTrigger.batch(differentialRows, {
            start: 'top 90%',
            interval: 0.06,
            batchMax: isMobile ? 1 : 4,
            onEnter: (batch) => {
              const rows = batch as Element[]
              gsap.to(rows, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: isMobile ? 0.52 : 0.68,
                stagger: isMobile ? 0.05 : 0.09,
                ease: 'power4.out',
                overwrite: 'auto',
                onComplete: () => clearEntryStyles(rows),
              })
            },
            onLeaveBack: (batch) => {
              const rows = batch as Element[]
              gsap.killTweensOf(rows)
              gsap.set(rows, {
                autoAlpha: 0,
                x: isMobile ? 0 : 20,
                y: isMobile ? 20 : 0,
                willChange: 'transform, opacity',
              })
            },
          })

          const specialtiesIntro = page.querySelector<HTMLElement>(
            '[data-motion="specialties-intro"]',
          )

          if (specialtiesIntro) {
            gsap.from(specialtiesIntro, {
              autoAlpha: 0,
              y: isMobile ? 24 : 36,
              duration: isMobile ? 0.56 : 0.78,
              ease: 'power4.out',
              overwrite: 'auto',
              scrollTrigger: {
                trigger: specialtiesIntro,
                start: 'top 88%',
                toggleActions: 'play none none reset',
              },
              onComplete: () => clearEntryStyles([specialtiesIntro]),
            })
          }

          const specialtyRows = gsap.utils.toArray<HTMLElement>(
            '[data-motion="specialty-row"]',
          )

          gsap.set(specialtyRows, {
            autoAlpha: 0,
            x: isMobile ? 0 : 28,
            y: isMobile ? 20 : 0,
            willChange: 'transform, opacity',
          })

          ScrollTrigger.batch(specialtyRows, {
            start: 'top 90%',
            interval: 0.06,
            batchMax: isMobile ? 1 : 3,
            onEnter: (batch) => {
              const rows = batch as Element[]
              gsap.to(rows, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: isMobile ? 0.52 : 0.68,
                stagger: isMobile ? 0.05 : 0.08,
                ease: 'power4.out',
                overwrite: 'auto',
                onComplete: () => clearEntryStyles(rows),
              })
            },
            onLeaveBack: (batch) => {
              const rows = batch as Element[]
              gsap.killTweensOf(rows)
              gsap.set(rows, {
                autoAlpha: 0,
                x: isMobile ? 0 : 28,
                y: isMobile ? 20 : 0,
                willChange: 'transform, opacity',
              })
            },
          })

          const structureImage = page.querySelector<HTMLElement>(
            '[data-motion="structure-image"]',
          )

          if (structureImage) {
            gsap.from(structureImage, {
              autoAlpha: 0,
              x: isMobile ? 0 : -40,
              y: isMobile ? 24 : 0,
              scale: isMobile ? 1.02 : 1.05,
              duration: isMobile ? 0.6 : 0.9,
              ease: 'power4.out',
              overwrite: 'auto',
              scrollTrigger: {
                trigger: structureImage,
                start: 'top 88%',
                toggleActions: 'play none none reset',
              },
              onComplete: () => clearEntryStyles([structureImage]),
            })
          }

          const structurePoints = gsap.utils.toArray<HTMLElement>(
            '[data-motion="structure-point"]',
          )
          const structureLines = structurePoints
            .map((row) =>
              row.querySelector<HTMLElement>('[data-motion-part="line"]'),
            )
            .filter((line): line is HTMLElement => Boolean(line))
          const structureContents = structurePoints
            .map((row) =>
              row.querySelector<HTMLElement>('[data-motion-part="content"]'),
            )
            .filter((content): content is HTMLElement => Boolean(content))

          gsap.set(structureLines, {
            scaleX: 0,
            transformOrigin: 'left center',
            willChange: 'transform',
          })
          gsap.set(structureContents, {
            autoAlpha: 0,
            x: isMobile ? 0 : 18,
            y: isMobile ? 16 : 0,
            willChange: 'transform, opacity',
          })

          ScrollTrigger.batch(structurePoints, {
            start: 'top 90%',
            interval: 0.06,
            batchMax: isMobile ? 1 : 3,
            onEnter: (batch) => {
              ;(batch as HTMLElement[]).forEach((row, index) => {
                const line = row.querySelector<HTMLElement>(
                  '[data-motion-part="line"]',
                )
                const content = row.querySelector<HTMLElement>(
                  '[data-motion-part="content"]',
                )
                if (!line || !content) {
                  return
                }
                const parts = [line, content].filter(
                  (element): element is HTMLElement => Boolean(element),
                )
                const timeline = gsap.timeline({
                  delay: index * (isMobile ? 0.05 : 0.08),
                  onComplete: () => clearEntryStyles(parts),
                })

                timeline
                  .to(line, {
                    scaleX: 1,
                    duration: isMobile ? 0.3 : 0.38,
                    ease: 'power4.out',
                    overwrite: 'auto',
                  })
                  .to(
                    content,
                    {
                      autoAlpha: 1,
                      x: 0,
                      y: 0,
                      duration: isMobile ? 0.46 : 0.56,
                      ease: 'power4.out',
                      overwrite: 'auto',
                    },
                    '-=0.2',
                  )
              })
            },
            onLeaveBack: (batch) => {
              const rows = batch as HTMLElement[]
              const lines = rows
                .map((row) =>
                  row.querySelector<HTMLElement>(
                    '[data-motion-part="line"]',
                  ),
                )
                .filter((line): line is HTMLElement => Boolean(line))
              const contents = rows
                .map((row) =>
                  row.querySelector<HTMLElement>(
                    '[data-motion-part="content"]',
                  ),
                )
                .filter((content): content is HTMLElement =>
                  Boolean(content),
                )

              gsap.killTweensOf([...lines, ...contents])
              gsap.set(lines, {
                scaleX: 0,
                transformOrigin: 'left center',
                willChange: 'transform',
              })
              gsap.set(contents, {
                autoAlpha: 0,
                x: isMobile ? 0 : 18,
                y: isMobile ? 16 : 0,
                willChange: 'transform, opacity',
              })
            },
          })

          const reviewsIntro = page.querySelector<HTMLElement>(
            '[data-motion="reviews-intro"]',
          )
          const reviewTrack = page.querySelector<HTMLElement>(
            '[data-motion="review-track"]',
          )
          const reviewsSection =
            page.querySelector<HTMLElement>('#avaliacoes')

          if (reviewsSection && reviewsIntro && reviewTrack) {
            const introItems = gsap.utils.toArray<HTMLElement>(
              '[data-motion="reviews-intro-item"]',
              reviewsIntro,
            )
            const reviewCta = reviewsIntro.querySelector<HTMLElement>(
              '[data-motion="reviews-cta"]',
            )
            const reviewCards = gsap.utils.toArray<HTMLElement>(
              '[data-motion="review-card"]',
              reviewTrack,
            )
            const firstCard = reviewCards[0]
            const reviewTargets = [
              ...introItems,
              reviewCta,
              ...(isMobile ? [reviewTrack, firstCard] : reviewCards),
            ].filter(
              (element): element is HTMLElement => Boolean(element),
            )

            gsap.set(introItems, {
              autoAlpha: 0,
              y: isMobile ? 20 : 24,
              willChange: 'transform, opacity',
            })
            if (reviewCta) {
              gsap.set(reviewCta, {
                autoAlpha: 0,
                willChange: 'opacity',
              })
            }

            if (isMobile) {
              gsap.set(reviewTrack, {
                autoAlpha: 0,
                y: 24,
                willChange: 'transform, opacity',
              })
              if (firstCard) {
                gsap.set(firstCard, {
                  scale: 0.98,
                  willChange: 'transform',
                })
              }
            } else {
              gsap.set(reviewCards, {
                autoAlpha: 0,
                y: 36,
                scale: 0.98,
                willChange: 'transform, opacity',
              })
            }

            const reviewTimeline = gsap.timeline({
              defaults: { overwrite: 'auto' },
              scrollTrigger: {
                trigger: reviewsSection,
                start: 'top 88%',
                toggleActions: 'play none none reset',
              },
              onComplete: () => clearEntryStyles(reviewTargets),
            })

            reviewTimeline
              .to(
                introItems,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: isMobile ? 0.52 : 0.58,
                  stagger: isMobile ? 0.05 : 0.06,
                  ease: 'power4.out',
                  overwrite: 'auto',
                },
                0,
              )
              .to(
                reviewCta,
                {
                  autoAlpha: 1,
                  duration: isMobile ? 0.4 : 0.46,
                  ease: 'power4.out',
                  overwrite: 'auto',
                },
                isMobile ? 0.15 : 0.18,
              )

            if (isMobile) {
              reviewTimeline
                .to(
                  reviewTrack,
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.56,
                    ease: 'power4.out',
                    overwrite: 'auto',
                  },
                  0.08,
                )
                .to(
                  firstCard,
                  {
                    scale: 1,
                    duration: 0.46,
                    ease: 'power4.out',
                    overwrite: 'auto',
                  },
                  0.12,
                )
            } else {
              reviewTimeline.to(
                reviewCards,
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.68,
                  stagger: 0.08,
                  ease: 'power4.out',
                  overwrite: 'auto',
                },
                0.08,
              )
            }
          }

          const locationImage = page.querySelector<HTMLElement>(
            '[data-motion="location-image"]',
          )

          if (locationImage) {
            gsap.from(locationImage, {
              autoAlpha: 0,
              x: isMobile ? 0 : -44,
              y: isMobile ? 24 : 0,
              scale: isMobile ? 1.02 : 1.04,
              duration: isMobile ? 0.6 : 0.9,
              ease: 'power4.out',
              overwrite: 'auto',
              scrollTrigger: {
                trigger: locationImage,
                start: 'top 88%',
                toggleActions: 'play none none reset',
              },
              onComplete: () => clearEntryStyles([locationImage]),
            })
          }

          const locationContent = page.querySelector<HTMLElement>(
            '[data-motion="location-content"]',
          )

          if (locationContent) {
            const locationItems = gsap.utils.toArray<HTMLElement>(
              '[data-motion="location-item"]',
              locationContent,
            )
            const statusDot =
              locationContent.querySelector<HTMLElement>('.status-dot')
            const locationTimeline = gsap.timeline({
              defaults: { overwrite: 'auto' },
              scrollTrigger: {
                trigger: locationContent,
                start: 'top 88%',
                toggleActions: 'play none none reset',
              },
              onComplete: () => {
                clearEntryStyles(locationItems)
                if (statusDot) {
                  clearEntryStyles([statusDot])
                }
              },
            })

            locationTimeline
              .from(locationItems, {
                autoAlpha: 0,
                x: isMobile ? 0 : 28,
                y: isMobile ? 20 : 0,
                duration: isMobile ? 0.52 : 0.66,
                stagger: isMobile ? 0.05 : 0.08,
                ease: 'power4.out',
              })
              .from(
                statusDot,
                {
                  scale: 0,
                  duration: isMobile ? 0.28 : 0.34,
                  ease: 'power4.out',
                },
                isMobile ? 0.24 : 0.32,
              )
          }

          const footer = page.querySelector<HTMLElement>(
            '[data-motion="footer"]',
          )

          if (footer) {
            const footerItems = gsap.utils.toArray<HTMLElement>(
              '[data-motion="footer-item"]',
              footer,
            )
            const footerLegal = footer.querySelector<HTMLElement>(
              '[data-motion="footer-legal"]',
            )
            const footerTargets = [...footerItems, footerLegal].filter(
              (element): element is HTMLElement => Boolean(element),
            )
            const footerTimeline = gsap.timeline({
              defaults: { overwrite: 'auto' },
              scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                toggleActions: 'play none none reset',
              },
              onComplete: () => clearEntryStyles(footerTargets),
            })

            footerTimeline
              .from(footerItems, {
                autoAlpha: 0,
                y: isMobile ? 20 : 24,
                duration: isMobile ? 0.5 : 0.62,
                stagger: isMobile ? 0.05 : 0.08,
                ease: 'power4.out',
              })
              .from(
                footerLegal,
                {
                  autoAlpha: 0,
                  duration: isMobile ? 0.36 : 0.44,
                  ease: 'power4.out',
                },
                '-=0.22',
              )
          }

          if (isDesktop) {
            gsap.utils
              .toArray<HTMLElement>('[data-motion-parallax]')
              .forEach((image) => {
                const amount = Number(image.dataset.motionParallax ?? 3)

                gsap.fromTo(
                  image,
                  {
                    yPercent: -amount,
                    scale: 1.06,
                  },
                  {
                    yPercent: amount,
                    scale: 1.06,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: image.parentElement,
                      start: 'top bottom',
                      end: 'bottom top',
                      scrub: 0.8,
                    },
                  },
                )
              })
          }
        }, page)

        return () => context.revert()
      },
    )

    void document.fonts.ready.then(() => {
      if (isActive) {
        window.requestAnimationFrame(() => {
          if (isActive) {
            ScrollTrigger.refresh()
            ScrollTrigger.update()
          }
        })
      }
    })

    return () => {
      isActive = false
      media.revert()
    }
  }, [pageRef])
}
