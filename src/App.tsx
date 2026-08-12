import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { lazy, Suspense, useMemo, useRef } from 'react'
import { AmbientPointerGradient } from './components/AmbientPointerGradient'
import { BackToTopButton } from './components/BackToTopButton'
import { Header } from './components/layout/Header'
import {
  clinicLinks,
  differentials,
  reviews,
  services,
  specialties,
} from './data/content'
import { useClinicStatus } from './hooks/useClinicStatus'
import { useLandingAnimations } from './hooks/useLandingAnimations'
import { usePointerGradient } from './hooks/usePointerGradient'
import { WHATSAPP_URL } from './utils/whatsapp'

const OrbitPatientComposition = lazy(() =>
  import('./components/OrbitPatientComposition').then((module) => ({
    default: module.OrbitPatientComposition,
  })),
)

function App() {
  const pageRef = useRef<HTMLDivElement>(null)
  const heroDesign =
    new URLSearchParams(window.location.search).get('design') === 'orbit'
      ? 'orbit'
      : 'stacked'

  useLandingAnimations(pageRef)
  usePointerGradient(pageRef)

  return (
    <div ref={pageRef} className="site-shell">
      <Header />
      <BackToTopButton />

      <main id="inicio">
        <Hero design={heroDesign} />
        <Services />
        <Differentials />
        <Specialties />
        <Structure />
        <Reviews />
        <Location />
      </main>

      <Footer />
    </div>
  )
}

function WhatsAppLink({
  label = 'Agendar pelo WhatsApp',
  className = '',
}: Readonly<{ label?: string; className?: string }>) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`button-primary ${className}`}
    >
      <FontAwesomeIcon icon={faWhatsapp} aria-hidden="true" />
      <span>{label}</span>
    </a>
  )
}

function Hero({
  design,
}: Readonly<{ design: 'stacked' | 'orbit' }>) {
  return (
    <section
      className="hero-section ambient-gradient-section relative flex min-h-[100dvh] items-center overflow-hidden pt-[72px]"
      aria-labelledby="hero-title"
      data-pointer-gradient
    >
      <AmbientPointerGradient />
      <div
        className="hero-house-line"
        data-motion="hero-house"
        aria-hidden="true"
      />
      <div className="hero-inner mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-14">
        <div className="hero-copy relative">
          <p className="section-kicker" data-motion="hero-kicker">
            Clínica veterinária em Piedade
          </p>
          <h1
            id="hero-title"
            data-motion="hero-title"
            className="max-w-[16ch] font-display text-[clamp(3.15rem,5.4vw,5.5rem)] font-medium leading-[0.9] tracking-[-0.045em]"
          >
            Cuidado completo para cada fase.
          </h1>
          <p
            className="hero-lead mt-6 max-w-[36rem] text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed"
            data-motion="hero-lead"
          >
            Consultas, especialistas, exames e bem-estar em um só lugar, com
            atenção e estrutura em cada atendimento.
          </p>
          <div
            className="mt-8 flex flex-wrap items-center gap-3"
            data-motion="hero-actions"
          >
            <WhatsAppLink />
            <a className="button-secondary" href="#servicos">
              Conhecer os serviços
            </a>
          </div>
        </div>

        {design === 'orbit' ? (
          <div
            className="patient-orbit-entry w-full"
            data-motion="hero-orbit"
          >
            <Suspense
              fallback={
                <div
                  className="patient-orbit-composition mx-auto w-full max-w-[720px]"
                  aria-hidden="true"
                />
              }
            >
              <OrbitPatientComposition patients={heroPatients} />
            </Suspense>
          </div>
        ) : (
          <PatientComposition />
        )}
      </div>
    </section>
  )
}

const heroPatients = [
  {
    src: '/images/content/hero-dog3.webp',
    alt: 'Cachorro caramelo sentado após o banho e cuidado',
    variant: 'cat',
  },
  {
    src: '/images/content/hero-golden.webp',
    alt: 'Golden retriever sentado durante o atendimento',
    variant: 'golden',
  },
  {
    src: '/images/content/hero-shitzu.webp',
    alt: 'Cachorro pequeno e peludo após os cuidados',
    variant: 'small',
  },
]

function PatientComposition() {
  return (
    <div className="patient-composition relative mx-auto w-full max-w-[720px]">
      <div className="patient-halo" data-motion="hero-halo" aria-hidden="true" />
      {heroPatients.map((patient) => (
        <div
          key={patient.src}
          data-patient-card
          className={`motion-entry patient-card-entry patient-card-entry--${patient.variant}`}
        >
          <figure className={`patient-card patient-card--${patient.variant}`}>
            <img src={patient.src} alt={patient.alt} />
          </figure>
        </div>
      ))}
    </div>
  )
}

function SectionHeading({
  kicker,
  title,
  description,
  id,
  align = 'left',
  motion = 'heading-up',
}: Readonly<{
  kicker?: string
  title: string
  description?: string
  id: string
  align?: 'left' | 'center'
  motion?: 'heading-up' | 'heading-right' | 'location-item' | null
}>) {
  return (
    <header
      data-motion={motion ?? undefined}
      className={`section-heading ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
      <h2
        id={id}
        className="font-display text-[clamp(2.55rem,5vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.035em]"
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 max-w-[62ch] text-base leading-relaxed sm:text-lg ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {description}
        </p>
      ) : null}
    </header>
  )
}

function Services() {
  return (
    <section
      id="servicos"
      className="services-section ambient-gradient-section scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-36"
      aria-labelledby="services-title"
      data-pointer-gradient
    >
      <AmbientPointerGradient />
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          kicker="Nossos serviços"
          id="services-title"
          title="Cuidado completo em um só lugar."
          description="Da prevenção aos cuidados especializados, a Pietá acompanha a saúde e o bem-estar do seu pet com atenção e praticidade."
        />

        <div className="services-grid mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="motion-entry service-card-entry"
              data-motion="service-card"
            >
              <article className="service-card group relative h-full overflow-hidden">
                <span className="service-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[1.65rem] font-semibold leading-tight text-pieta-deep">
                  {service.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-pieta-graphite/78">
                  {service.description}
                </p>
                <span
                  className="service-line-reveal"
                  data-motion-part="service-line-reveal"
                  aria-hidden="true"
                >
                  <span className="service-line" />
                </span>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Differentials() {
  return (
    <section
      id="diferenciais"
      className="differentials-section scroll-mt-24 px-3 py-8 sm:px-5 lg:px-8 lg:py-12"
      aria-labelledby="differentials-title"
    >
      <div className="differentials-panel mx-auto grid max-w-[1440px] gap-10 overflow-hidden rounded-[28px] px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-14 lg:py-20">
        <div
          className="differentials-visual relative min-h-[420px]"
          data-motion="differential-image"
        >
          <img
            data-motion-parallax="3"
            src="/images/content/diferenciais-dog.webp"
            alt="Cachorro branco passeando no jardim da Clínica Veterinária Pietá"
            className="absolute inset-0 size-full object-cover object-center"
          />
          <p
            className="differentials-quote absolute inset-x-5 bottom-5 rounded-[18px] px-5 py-4 font-display text-2xl leading-tight sm:text-3xl"
            data-motion="differential-quote"
          >
            Cuidar também é ouvir, orientar e acompanhar.
          </p>
        </div>

        <div>
          <SectionHeading
            id="differentials-title"
            title="Cuidado que une estrutura e confiança."
            description="Cada atendimento combina atenção ao paciente, orientação ao tutor e uma estrutura preparada para diferentes necessidades."
            motion="heading-right"
          />
          <div className="mt-10">
            {differentials.map((item, index) => (
              <article
                key={item.title}
                className="differential-row grid grid-cols-[auto_1fr] gap-4 py-5"
                data-motion="differential-row"
              >
                <span className="font-display text-2xl text-pieta-gold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-1.5 max-w-[54ch] text-sm leading-relaxed opacity-72">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Specialties() {
  return (
    <section
      id="especialidades"
      className="specialties-section ambient-gradient-section scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-36"
      aria-labelledby="specialties-title"
      data-pointer-gradient
    >
      <AmbientPointerGradient />
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div
          className="specialties-intro lg:sticky lg:top-32 lg:self-start"
          data-motion="specialties-intro"
        >
          <SectionHeading
            id="specialties-title"
            title="Especialistas em cada detalhe do cuidado."
            description="Atendimentos especializados ampliam as possibilidades de cuidado, sempre mediante agendamento."
            motion={null}
          />
          <WhatsAppLink
            label="Consultar especialistas"
            className="mt-8 inline-flex"
          />
        </div>

        <div className="specialty-list">
          {specialties.map((specialty, index) => (
            <div
              key={specialty.title}
              className="motion-entry specialty-row-entry"
              data-motion="specialty-row"
            >
              <article className="specialty-row group grid grid-cols-[auto_1fr_auto] items-start gap-4 py-7 sm:gap-7">
                <span className="font-display text-2xl text-pieta-gold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-[clamp(1.8rem,3vw,2.7rem)] font-semibold leading-none">
                    {specialty.title}
                  </h3>
                  <p className="mt-3 max-w-[54ch] text-sm leading-relaxed opacity-72 sm:text-base">
                    {specialty.description}
                  </p>
                </div>
                <span
                  className="mt-1 text-xl transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Structure() {
  return (
    <section
      id="estrutura"
      className="structure-section ambient-gradient-section scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-36"
      aria-labelledby="structure-title"
      data-pointer-gradient
    >
      <AmbientPointerGradient />
      <div className="mx-auto max-w-[1440px]">
        <div className="structure-grid grid items-center gap-10 lg:grid-cols-[1.16fr_0.84fr] lg:gap-16">
          <figure
            className="structure-image relative overflow-hidden rounded-[26px]"
            data-motion="structure-image"
          >
            <img
              data-motion-parallax="4"
              src="/images/content/estrutura-pieta.webp"
              alt="Consultório organizado da Clínica Veterinária Pietá"
              className="size-full object-cover"
            />
          </figure>

          <div>
            <SectionHeading
              id="structure-title"
              title="Um espaço preparado para cuidar."
              description="Ambientes organizados para consultas, avaliações e procedimentos, com mais conforto para pacientes e tutores."
              motion="heading-right"
            />

            <div className="structure-points mt-9 grid gap-5">
              {[
                ['Ambiente organizado', 'Atendimento mais tranquilo e funcional.'],
                ['Consultório equipado', 'Estrutura adequada para avaliações clínicas.'],
                ['Acesso facilitado', 'Entrada com rampa para facilitar a chegada.'],
              ].map(([title, description]) => (
                <article
                  key={title}
                  className="structure-point grid grid-cols-[18px_1fr] gap-4"
                  data-motion="structure-point"
                >
                  <span
                    className="mt-2 h-px w-[18px] bg-pieta-gold"
                    data-motion-part="line"
                    aria-hidden="true"
                  />
                  <div data-motion-part="content">
                    <h3 className="font-semibold text-pieta-deep">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-pieta-graphite/72">
                      {description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section
      id="avaliacoes"
      className="reviews-section scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
      aria-labelledby="reviews-title"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
        <div data-motion="reviews-intro">
          <h2
            id="reviews-title"
            data-motion="reviews-intro-item"
            className="max-w-[11ch] font-display text-[clamp(2.7rem,5vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.035em]"
          >
            A confiança de quem já conhece nosso cuidado.
          </h2>
          <div
            className="mt-8 flex items-end gap-3 text-pieta-gold"
            data-motion="reviews-intro-item"
          >
            <strong className="font-display text-7xl font-semibold leading-none">
              5,0
            </strong>
            <span className="pb-2 text-sm font-semibold">de 5</span>
          </div>
          <p
            className="mt-3 text-lg tracking-[0.18em] text-pieta-gold"
            data-motion="reviews-intro-item"
            aria-label="5 estrelas"
          >
            ★★★★★
          </p>
          <p
            className="mt-4 max-w-[26rem] text-sm leading-relaxed text-pieta-ivory/72"
            data-motion="reviews-intro-item"
          >
            Com base em 77 avaliações públicas na Petlove.
          </p>
          <div
            className="motion-entry mt-7"
            data-motion="reviews-cta"
          >
            <a
              className="button-on-dark inline-flex"
              href={clinicLinks.petlove}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver avaliações na Petlove
            </a>
          </div>
        </div>

        <div
          className="review-track -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
          data-motion="review-track"
        >
          {reviews.map((review) => (
            <div
              key={review.author}
              className="motion-entry review-card-entry min-w-[82vw] snap-center sm:min-w-[360px] lg:min-w-0"
              data-motion="review-card"
            >
              <article className="review-card h-full rounded-[24px] p-6">
                <span
                  className="font-display text-5xl leading-none text-pieta-gold"
                  aria-hidden="true"
                >
                  “
                </span>
                <p className="mt-4 text-base leading-relaxed text-pieta-graphite">
                  {review.quote}
                </p>
                <footer className="mt-8 border-t border-pieta-gold/35 pt-4">
                  <strong className="text-sm text-pieta-deep">{review.author}</strong>
                  <p className="mt-1 text-xs text-pieta-graphite/62">Petlove</p>
                </footer>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Location() {
  const status = useClinicStatus()
  const statusText = useMemo(
    () => `${status.label}. ${status.detail}`,
    [status],
  )
  return (
    <section
      id="localizacao"
      className="location-section ambient-gradient-section scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-36"
      aria-labelledby="location-title"
      data-pointer-gradient
    >
      <AmbientPointerGradient />
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <figure
          className="location-image relative overflow-hidden rounded-[26px]"
          data-motion="location-image"
        >
          <img
            data-motion-parallax="3"
            src="/images/content/fachada-pieta.webp"
            alt="Fachada verde da Clínica Veterinária Pietá, número 42"
            className="size-full object-cover"
          />
          <figcaption className="absolute inset-x-4 bottom-4 rounded-[14px] bg-pieta-ivory/94 px-4 py-3 text-sm font-medium text-pieta-deep shadow-sm backdrop-blur-md">
            Procure pela fachada verde da Pietá.
          </figcaption>
        </figure>

        <div data-motion="location-content">
          <SectionHeading
            kicker="Onde estamos"
            id="location-title"
            title="Cuidado perto de você, em Piedade."
            description="Visite a Pietá ou fale com a equipe pelo WhatsApp para agendar o atendimento do seu pet."
            motion="location-item"
          />

          <div
            className={`clinic-status mt-7 rounded-[18px] px-5 py-4 ${
              status.isOpen ? 'is-open' : 'is-closed'
            }`}
            role="status"
            aria-label={statusText}
            data-motion="location-item"
          >
            <div className="flex items-center gap-3">
              <span className="status-dot size-2.5 rounded-full" aria-hidden="true" />
              <strong className="text-sm">{status.label}</strong>
            </div>
            <p className="mt-1 pl-[22px] text-sm opacity-72">{status.detail}</p>
          </div>

          <dl
            className="location-data mt-8 grid gap-6 sm:grid-cols-2"
            data-motion="location-item"
          >
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-pieta-green">
                Endereço
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-pieta-graphite/82">
                Rua Maestro Nelson Ferreira, 42
                <br />
                Piedade, Jaboatão dos Guararapes - PE
                <br />
                CEP 54410-220
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-pieta-green">
                Horários
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-pieta-graphite/82">
                Segunda a sexta: 8h às 17h
                <br />
                Sábado: 8h às 12h
              </dd>
            </div>
          </dl>

          <div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            data-motion="location-item"
          >
            <a
              className="button-secondary justify-center"
              href={clinicLinks.maps}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir no Google Maps
            </a>
            <WhatsAppLink />
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer
      className="site-footer bg-pieta-deep px-5 pb-28 pt-16 text-pieta-ivory sm:px-8 lg:px-12 lg:pb-24 lg:pt-20"
      data-motion="footer"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.8fr_1.05fr]">
          <div data-motion="footer-item">
            <span className="brand-logo brand-logo--footer">
              <img
                className="brand-logo__image"
                src="/images/brand/pieta-logo-horizontal-light.png"
                alt="Clínica Veterinária Pietá"
              />
            </span>
            <p className="mt-5 max-w-[30rem] text-sm leading-relaxed text-pieta-ivory/68">
              Cuidado veterinário completo, com atenção, estrutura e carinho em
              cada atendimento.
            </p>
            <a
              className="mt-4 inline-block text-sm text-pieta-gold hover:text-pieta-ivory"
              href={clinicLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              @vet_pieta
            </a>
          </div>

          <nav data-motion="footer-item" aria-label="Navegação do rodapé">
            <h2 className="text-sm font-semibold text-pieta-gold">Explore</h2>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-pieta-ivory/68">
              <a href="#servicos">Serviços</a>
              <a href="#diferenciais">Diferenciais</a>
              <a href="#especialidades">Especialidades</a>
              <a href="#estrutura">Estrutura</a>
              <a href="#avaliacoes">Avaliações</a>
              <a href="#localizacao">Localização</a>
            </div>
          </nav>

          <div data-motion="footer-item">
            <h2 className="text-sm font-semibold text-pieta-gold">
              Fale com a Pietá
            </h2>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-display text-3xl text-pieta-ivory hover:text-pieta-gold"
            >
              (81) 99963-3735
            </a>
            <p className="mt-4 text-sm leading-relaxed text-pieta-ivory/68">
              Rua Maestro Nelson Ferreira, 42
              <br />
              Piedade, Jaboatão dos Guararapes - PE
              <br />
              Segunda a sexta, 8h às 17h
              <br />
              Sábado, 8h às 12h
            </p>
          </div>
        </div>

        <div
          className="mt-14 border-t border-pieta-gold/28 pt-6 text-xs text-pieta-ivory/48"
          data-motion="footer-legal"
        >
          <p>© 2026 Clínica Veterinária Pietá. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default App
