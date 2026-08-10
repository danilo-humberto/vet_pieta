import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { OrbitCarousel } from './godui/OrbitCarousel'

type Patient = {
  src: string
  alt: string
  variant: string
}

type OrbitDimensions = {
  radius: number
  angleStep: number
  itemWidth: number
  itemHeight: number
}

const DESKTOP_DIMENSIONS: OrbitDimensions = {
  radius: 280,
  angleStep: 30,
  itemWidth: 300,
  itemHeight: 440,
}

const getOrbitDimensions = (width: number): OrbitDimensions => {
  if (width <= 480) {
    const itemWidth = Math.min(220, Math.round(width * 0.58))

    return {
      radius: Math.round(width * 0.48),
      angleStep: 25,
      itemWidth,
      itemHeight: Math.round(itemWidth * 1.42),
    }
  }

  const itemWidth = Math.min(300, Math.round(width * 0.46))

  return {
    radius: Math.min(280, Math.round(width * 0.43)),
    angleStep: 30,
    itemWidth,
    itemHeight: Math.round(itemWidth * 1.46),
  }
}

export function OrbitPatientComposition({
  patients,
}: Readonly<{ patients: Patient[] }>) {
  const compositionRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] =
    useState<OrbitDimensions>(DESKTOP_DIMENSIONS)

  useLayoutEffect(() => {
    const composition = compositionRef.current

    if (!composition) {
      return
    }

    const updateDimensions = () => {
      setDimensions(getOrbitDimensions(composition.clientWidth))
    }
    const observer = new ResizeObserver(updateDimensions)

    updateDimensions()
    observer.observe(composition)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={compositionRef}
      className="patient-orbit-composition relative mx-auto w-full max-w-[720px]"
    >
      <div
        className="patient-halo"
        data-motion="hero-halo"
        aria-hidden="true"
      />
      <OrbitCarousel
        defaultIndex={1}
        radius={dimensions.radius}
        angleStep={dimensions.angleStep}
        itemWidth={dimensions.itemWidth}
        itemHeight={dimensions.itemHeight}
        ariaLabel="Pacientes da Clínica Veterinária Pietà"
        previousLabel="Ver paciente anterior"
        nextLabel="Ver próximo paciente"
      >
        {patients.map((patient) => (
          <figure
            key={patient.src}
            className={`orbit-patient-card orbit-patient-card--${patient.variant}`}
          >
            <img src={patient.src} alt={patient.alt} draggable={false} />
          </figure>
        ))}
      </OrbitCarousel>
    </div>
  )
}
