import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this standardized function to calculate time together
export function calculateTimeTogether(startDate: Date) {
  const now = new Date()
  const diff = now.getTime() - startDate.getTime()

  // Calculate full years
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))

  // Calculate remaining months after subtracting years
  const remainingAfterYears = diff - years * 1000 * 60 * 60 * 24 * 365
  const months = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24 * 30.436875)) // Average month length

  // Calculate remaining days after subtracting years and months
  const remainingAfterMonths = remainingAfterYears - months * 1000 * 60 * 60 * 24 * 30.436875
  const days = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24))

  // Calculate hours, minutes, seconds
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { years, months, days, hours, minutes, seconds }
}
