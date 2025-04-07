import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateTimeTogether(anniversaryDate: Date) {
  const now = new Date()
  const diff = now.getTime() - anniversaryDate.getTime()

  // Handle case where anniversary is in the future
  if (diff < 0) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  // Calculate time units
  const seconds = Math.floor(diff / 1000) % 60
  const minutes = Math.floor(diff / (1000 * 60)) % 60
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24

  // Calculate days, months, years
  let tempDate = new Date(anniversaryDate)
  let years = 0
  let months = 0
  let days = 0

  // Count years
  while (true) {
    const nextYear = new Date(tempDate)
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    if (nextYear <= now) {
      years++
      tempDate = nextYear
    } else {
      break
    }
  }

  // Count months
  while (true) {
    const nextMonth = new Date(tempDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    if (nextMonth <= now) {
      months++
      tempDate = nextMonth
    } else {
      break
    }
  }

  // Count days
  while (true) {
    const nextDay = new Date(tempDate)
    nextDay.setDate(nextDay.getDate() + 1)
    if (nextDay <= now) {
      days++
      tempDate = nextDay
    } else {
      break
    }
  }

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  }
}

