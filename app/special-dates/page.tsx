"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  format,
  addMonths,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isSameDay,
  isAfter,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameMonth,
} from "date-fns"
import { th } from "date-fns/locale"
import { Home, ChevronLeft, ChevronRight, Heart, Gift, Calendar, Cake, Music, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define special dates
const startDate = new Date("2025-02-22T23:32:00")

// Function to generate special dates
const generateSpecialDates = () => {
  const dates = []
  const today = new Date()
  const currentYear = today.getFullYear()

  // Generate monthly anniversaries for 3 years
  for (let i = 1; i <= 36; i++) {
    const date = addMonths(startDate, i)
    dates.push({
      date,
      type: "monthly",
      title: `ครบรอบ ${i} เดือน`,
      icon: <Heart className="h-4 w-4 text-pink-500" />,
      color: "bg-pink-100 text-pink-800 border-pink-200",
    })
  }

  // Generate yearly anniversaries for 10 years
  for (let i = 1; i <= 10; i++) {
    const date = addYears(startDate, i)
    dates.push({
      date,
      type: "yearly",
      title: `ครบรอบ ${i} ปี`,
      icon: <Gift className="h-4 w-4 text-red-500" />,
      color: "bg-red-100 text-red-800 border-red-200",
    })
  }
  
  for (let i = currentYear; i <= currentYear + 10; i++) {
    dates.push({
      date: new Date(`${i}-01-17`),
      type: "special",
      title: "วันเกิด Ice",
      icon: <Cake className="h-4 w-4 text-blue-500" />,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    })
  }

  for (let i = currentYear; i <= currentYear + 10; i++) {
    dates.push({
      date: new Date(`${i}-11-12`),
      type: "special",
      title: "วันเกิด Oei",
      icon: <Cake className="h-4 w-4 text-yellow-500" />,
      color: "bg-yellow-100 text-pink-800 border-yellow-200",
    })
  }

  // Add other special dates
  dates.push({
    date: new Date("2025-4-11"),
    type: "special",
    title: "จะได้เจอกันน",
    icon: <Gift className="h-4 w-4 text-green-500" />,
    color: "bg-green-100 text-green-800 border-green-200",
  })

  return dates
}

const specialDates = generateSpecialDates()

// Function to get the next special date
const getNextSpecialDate = () => {
  const today = new Date()
  const upcomingDates = specialDates
    .filter((date) => isAfter(date.date, today))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  return upcomingDates[0]
}

export default function SpecialDates() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [nextSpecialDate, setNextSpecialDate] = useState<any>(null)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Set next special date on component mount
  useEffect(() => {
    setNextSpecialDate(getNextSpecialDate())
  }, [])

  // Update countdown timer
  useEffect(() => {
    if (!nextSpecialDate) return

    const timer = setInterval(() => {
      const now = new Date()
      const diff = nextSpecialDate.date.getTime() - now.getTime()

      if (diff <= 0) {
        clearInterval(timer)
        setNextSpecialDate(getNextSpecialDate())
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [nextSpecialDate])

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, -1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }

  // Navigate to current month
  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDay = getDay(monthStart)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get special dates for current month
  const currentMonthSpecialDates = specialDates.filter((specialDate) => isSameMonth(specialDate.date, currentMonth))

  // Calculate relationship duration
  const today = new Date()
  const years = differenceInYears(today, startDate)
  const months = differenceInMonths(today, startDate) % 12
  const days_passed = differenceInDays(today, addMonths(addYears(startDate, years), months))

  // Format date in Thai
  const formatThaiDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: th })
  }

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-pink-300 text-pink-600 hover:bg-pink-100"
            >
              <Home className="h-4 w-4" />
              กลับหน้าหลัก
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-pink-600 font-script">วันสำคัญของเรา</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Countdown to next special date */}
        {nextSpecialDate && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-center text-pink-600 mb-4">
              <span className="inline-block animate-pulse mr-2">❤️</span>
              {nextSpecialDate.title}
              <span className="inline-block animate-pulse ml-2">❤️</span>
            </h2>
            <p className="text-center text-gray-600 mb-4">{formatThaiDate(nextSpecialDate.date)}</p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-pink-100 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-pink-600">{countdown.days}</div>
                <div className="text-sm text-pink-500">วัน</div>
              </div>
              <div className="bg-pink-100 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-pink-600">{countdown.hours}</div>
                <div className="text-sm text-pink-500">ชั่วโมง</div>
              </div>
              <div className="bg-pink-100 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-pink-600">{countdown.minutes}</div>
                <div className="text-sm text-pink-500">นาที</div>
              </div>
              <div className="bg-pink-100 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-pink-600">{countdown.seconds}</div>
                <div className="text-sm text-pink-500">วินาที</div>
              </div>
            </div>
          </div>
        )}

        {/* Relationship duration */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-center text-pink-600 mb-4">We've been in a relationship for</h2>

          <div className="flex justify-center items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{years}</div>
              <div className="text-sm text-pink-500">Years</div>
            </div>
            <div className="text-pink-300 text-2xl">•</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{months}</div>
              <div className="text-sm text-pink-500">Months</div>
            </div>
            <div className="text-pink-300 text-2xl">•</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{days_passed}</div>
              <div className="text-sm text-pink-500">Days</div>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-4">Started our relationship on February 22, 2025 at 23:32.</p>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Calendar header */}
          <div className="flex justify-between items-center p-4 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={prevMonth}
              className="border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h2 className="text-lg font-medium text-gray-700">{format(currentMonth, "MMMM yyyy", { locale: th })}</h2>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                วันนี้
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextMonth}
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="p-4">
            {/* Day names */}
            <div className="grid grid-cols-7 mb-2">
              {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day, i) => (
                <div key={i} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first day of month */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-start-${i}`} className="h-24 p-1 bg-gray-50 rounded-md"></div>
              ))}

              {/* Actual days of the month */}
              {days.map((day, i) => {
                // Find special dates for this day
                const daySpecialDates = currentMonthSpecialDates.filter((specialDate) =>
                  isSameDay(specialDate.date, day),
                )

                const isToday = isSameDay(day, new Date())

                return (
                  <div
                    key={i}
                    className={`h-24 p-1 rounded-md relative ${
                      isToday ? "bg-pink-50 ring-2 ring-pink-300" : "bg-white hover:bg-pink-50"
                    }`}
                  >
                    <div className={`text-right text-sm mb-1 ${isToday ? "font-bold text-pink-600" : "text-gray-700"}`}>
                      {format(day, "d")}
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
                      {daySpecialDates.map((specialDate, j) => (
                        <div key={j} className={`text-xs p-1 rounded flex items-center gap-1 ${specialDate.color}`}>
                          {specialDate.icon}
                          <span className="truncate">{specialDate.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Empty cells for days after the last day of month */}
              {Array.from({ length: 6 - ((days.length + startDay - 1) % 7) }).map((_, i) => (
                <div key={`empty-end-${i}`} className="h-24 p-1 bg-gray-50 rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 border-t bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">คำอธิบาย</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 text-xs bg-pink-100 text-pink-800 border border-pink-200 rounded px-2 py-1">
                <Heart className="h-3 w-3 text-pink-500" />
                <span>วันครบรอบรายเดือน</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-red-100 text-red-800 border border-red-200 rounded px-2 py-1">
                <Gift className="h-3 w-3 text-red-500" />
                <span>วันครบรอบรายปี</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 border border-blue-200 rounded px-2 py-1">
                <Cake className="h-3 w-3 text-blue-500" />
                <span>วันเกิด</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-green-100 text-green-800 border border-green-200 rounded px-2 py-1">
                <Calendar className="h-3 w-3 text-green-500" />
                <span>วันสำคัญอื่นๆ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming special dates */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-pink-600 mb-4">วันสำคัญที่กำลังจะมาถึงง</h2>

          <div className="space-y-3">
            {specialDates
              .filter((date) => isAfter(date.date, new Date()))
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((specialDate, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${specialDate.color.split(" ")[0]}`}
                    >
                      {specialDate.icon}
                    </div>
                    <div>
                      <div className="font-medium">{specialDate.title}</div>
                      <div className="text-sm text-gray-500">{formatThaiDate(specialDate.date)}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-pink-600">
                    อีก {differenceInDays(specialDate.date, new Date())} วัน
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <footer className="text-center text-gray-500 text-sm mb-4">
        <p>Made with ❤️ for our story</p>
        <p className="mt-1">© {new Date().getFullYear()} From ICE</p>
        </footer>
    </div>
  )
}

