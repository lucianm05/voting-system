import { toUTC } from '#shared/functions/dates'
import { DayjsCompatibleDate } from '#shared/types/index'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  isFinished: boolean
}

export function useCountdown(endDate: DayjsCompatibleDate): Countdown {
  const calculateTimeLeft = () => {
    const now = toUTC(undefined)
    const target = toUTC(endDate)
    const diffMs = target.diff(now)
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))

    const d = dayjs.duration(diffMs > 0 ? diffMs : 0)

    return {
      days: d.days(),
      hours: d.hours(),
      minutes: d.minutes(),
      seconds: d.seconds(),
      totalSeconds,
      isFinished: totalSeconds === 0,
    }
  }

  const [timeLeft, setTimeLeft] = useState<Countdown>(calculateTimeLeft())

  useEffect(() => {
    if (timeLeft.isFinished) return

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft.isFinished, endDate])

  return timeLeft
}
