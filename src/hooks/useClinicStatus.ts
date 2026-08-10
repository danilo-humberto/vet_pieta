import { useEffect, useState } from 'react'

type ClinicStatus = Readonly<{
  isOpen: boolean
  label: string
  detail: string
}>

const getRecifeTime = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Recife',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    weekday: value.weekday,
    hour: Number(value.hour),
    minute: Number(value.minute),
  }
}

const calculateStatus = (): ClinicStatus => {
  const { weekday, hour, minute } = getRecifeTime()
  const currentMinutes = hour * 60 + minute
  const openingMinutes = 8 * 60
  const isSaturday = weekday === 'Sat'
  const isSunday = weekday === 'Sun'
  const closingMinutes = isSaturday ? 12 * 60 : 17 * 60
  const isWeekday = !isSaturday && !isSunday
  const isOpen =
    (isWeekday || isSaturday) &&
    currentMinutes >= openingMinutes &&
    currentMinutes < closingMinutes

  if (isOpen) {
    const closesSoon = closingMinutes - currentMinutes <= 30

    return {
      isOpen: true,
      label: closesSoon ? 'Aberto agora, fechamos em breve' : 'Aberto agora',
      detail: `Atendimento até às ${isSaturday ? '12h' : '17h'}.`,
    }
  }

  if (isSunday) {
    return {
      isOpen: false,
      label: 'Fechado hoje',
      detail: 'Abrimos segunda-feira às 8h.',
    }
  }

  if (currentMinutes < openingMinutes) {
    return {
      isOpen: false,
      label: 'Fechado agora',
      detail: 'Abrimos hoje às 8h.',
    }
  }

  if (weekday === 'Fri') {
    return {
      isOpen: false,
      label: 'Fechado agora',
      detail: 'Abrimos sábado às 8h.',
    }
  }

  if (isSaturday) {
    return {
      isOpen: false,
      label: 'Fechado agora',
      detail: 'Abrimos segunda-feira às 8h.',
    }
  }

  return {
    isOpen: false,
    label: 'Fechado agora',
    detail: 'Abrimos amanhã às 8h.',
  }
}

export function useClinicStatus() {
  const [status, setStatus] = useState<ClinicStatus>(calculateStatus)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatus(calculateStatus())
    }, 60_000)

    return () => window.clearInterval(interval)
  }, [])

  return status
}
