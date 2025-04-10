"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  format,
  addMonths,
  addYears,
  differenceInDays,
  isSameDay,
  isAfter,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameMonth,
} from "date-fns"
import { th } from "date-fns/locale"
import {
  Home,
  ChevronLeft,
  ChevronRight,
  Heart,
  Gift,
  Calendar,
  Cake,
  Music,
  Camera,
  Plus,
  Star,
  Sparkles,
  Plane,
  Utensils,
  Film,
  Smile,
  Zap,
  Award,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore"

// Replace the relationship duration calculation with the standardized version
import { calculateTimeTogether } from "@/lib/utils"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDQnxJpDTmkc0JXtcBVOLlXpBgKPCq-Uxs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "iceoei.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "iceoei",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "iceoei.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1015184046254",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1015184046254:web:a9e9e9f9f9f9f9f9f9f9f9",
}

// Initialize Firebase
let app
import type { Firestore } from "firebase/firestore"
let db: Firestore | null = null

// Only initialize Firebase on the client side
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

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
      id: `monthly-${i}`,
      date,
      type: "monthly",
      title: `ครบรอบ ${i} เดือน`,
      icon: "Heart",
      iconColor: "text-pink-500",
      color: "bg-pink-100 text-pink-800 border-pink-200",
      isSystem: true,
    })
  }

  // Generate yearly anniversaries for 10 years
  for (let i = 1; i <= 10; i++) {
    const date = addYears(startDate, i)
    dates.push({
      id: `yearly-${i}`,
      date,
      type: "yearly",
      title: `ครบรอบ ${i} ปี`,
      icon: "Gift",
      iconColor: "text-red-500",
      color: "bg-red-100 text-red-800 border-red-200",
      isSystem: true,
    })
  }

  for (let i = currentYear; i <= currentYear + 10; i++) {
    dates.push({
      id: `birthday-ice-${i}`,
      date: new Date(`${i}-01-17T00:00:00`),
      type: "special",
      title: "วันเกิด Ice",
      icon: "Cake",
      iconColor: "text-blue-500",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      isSystem: true,
    })
  }

  for (let i = currentYear; i <= currentYear + 10; i++) {
    dates.push({
      id: `birthday-oei-${i}`,
      date: new Date(`${i}-11-12T00:00:00`),
      type: "special",
      title: "วันเกิด Oei",
      icon: "Cake",
      iconColor: "text-yellow-500",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      isSystem: true,
    })
  }

  // Add other special dates

  return dates
}

// Available icons for custom dates
const availableIcons = [
  { name: "Heart", component: Heart, label: "หัวใจ" },
  { name: "Gift", component: Gift, label: "ของขวัญ" },
  { name: "Cake", component: Cake, label: "เค้ก" },
  { name: "Music", component: Music, label: "ดนตรี" },
  { name: "Camera", component: Camera, label: "กล้อง" },
  { name: "Star", component: Star, label: "ดาว" },
  { name: "Sparkles", component: Sparkles, label: "ประกาย" },
  { name: "Plane", component: Plane, label: "เครื่องบิน" },
  { name: "Utensils", component: Utensils, label: "อาหาร" },
  { name: "Film", component: Film, label: "ภาพยนตร์" },
  { name: "Smile", component: Smile, label: "รอยยิ้ม" },
  { name: "Zap", component: Zap, label: "สายฟ้า" },
  { name: "Award", component: Award, label: "รางวัล" },
]

// Available colors for custom dates
const availableColors = [
  {
    name: "pink",
    bg: "bg-pink-100",
    text: "text-pink-800",
    border: "border-pink-200",
    icon: "text-pink-500",
    label: "ชมพู",
  },
  { name: "red", bg: "bg-red-100", text: "text-red-800", border: "border-red-200", icon: "text-red-500", label: "แดง" },
  {
    name: "orange",
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
    icon: "text-orange-500",
    label: "ส้ม",
  },
  {
    name: "amber",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: "text-amber-500",
    label: "เหลืองอำพัน",
  },
  {
    name: "yellow",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
    icon: "text-yellow-500",
    label: "เหลือง",
  },
  {
    name: "lime",
    bg: "bg-lime-100",
    text: "text-lime-800",
    border: "border-lime-200",
    icon: "text-lime-500",
    label: "เขียวมะนาว",
  },
  {
    name: "green",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    icon: "text-green-500",
    label: "เขียว",
  },
  {
    name: "emerald",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: "text-emerald-500",
    label: "เขียวมรกต",
  },
  {
    name: "teal",
    bg: "bg-teal-100",
    text: "text-teal-800",
    border: "border-teal-200",
    icon: "text-teal-500",
    label: "เขียวน้ำทะเล",
  },
  {
    name: "cyan",
    bg: "bg-cyan-100",
    text: "text-cyan-800",
    border: "border-cyan-200",
    icon: "text-cyan-500",
    label: "ฟ้าอมเขียว",
  },
  { name: "sky", bg: "bg-sky-100", text: "text-sky-800", border: "border-sky-200", icon: "text-sky-500", label: "ฟ้า" },
  {
    name: "blue",
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: "text-blue-500",
    label: "น้ำเงิน",
  },
  {
    name: "indigo",
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    border: "border-indigo-200",
    icon: "text-indigo-500",
    label: "คราม",
  },
  {
    name: "violet",
    bg: "bg-violet-100",
    text: "text-violet-800",
    border: "border-violet-200",
    icon: "text-violet-500",
    label: "ม่วงอ่อน",
  },
  {
    name: "purple",
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
    icon: "text-purple-500",
    label: "ม่วง",
  },
  {
    name: "fuchsia",
    bg: "bg-fuchsia-100",
    text: "text-fuchsia-800",
    border: "border-fuchsia-200",
    icon: "text-fuchsia-500",
    label: "ชมพูม่วง",
  },
]

// Custom date type
interface CustomDate {
  id: string
  date: Date
  title: string
  icon: string
  iconColor: string
  color: string
  type: string
  isSystem?: boolean
  createdAt?: Timestamp
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
  const [specialDates, setSpecialDates] = useState<CustomDate[]>(generateSpecialDates())
  const [customDates, setCustomDates] = useState<CustomDate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // State for selected date and dialog
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedDayEvents, setSelectedDayEvents] = useState<CustomDate[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [newDateTitle, setNewDateTitle] = useState("")
  const [newDateDate, setNewDateDate] = useState<Date | undefined>(new Date())
  const [selectedIcon, setSelectedIcon] = useState(availableIcons[0].name)
  const [selectedColor, setSelectedColor] = useState(availableColors[0].name)
  const [formError, setFormError] = useState("")

  // Relationship duration state
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
  })

  // Fetch custom dates from Firestore
  useEffect(() => {
    if (!db) return

    setIsLoading(true)

    const q = query(collection(db, "specialDates"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedDates: CustomDate[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          fetchedDates.push({
            id: doc.id,
            date: data.date.toDate(),
            title: data.title,
            icon: data.icon,
            iconColor: data.iconColor,
            color: data.color,
            type: "custom",
            createdAt: data.createdAt,
          })
        })
        setCustomDates(fetchedDates)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error fetching custom dates:", error)
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  // Combine system and custom dates
  useEffect(() => {
    const allDates = [...specialDates, ...customDates]
    setNextSpecialDate(getNextSpecialDate(allDates))
  }, [specialDates, customDates])

  // Set next special date on component mount
  useEffect(() => {
    const allDates = [...specialDates, ...customDates]
    setNextSpecialDate(getNextSpecialDate(allDates))
  }, [])

  // Update countdown timer
  useEffect(() => {
    if (!nextSpecialDate) return

    const timer = setInterval(() => {
      const now = new Date()
      const diff = nextSpecialDate.date.getTime() - now.getTime()

      if (diff <= 0) {
        clearInterval(timer)
        const allDates = [...specialDates, ...customDates]
        setNextSpecialDate(getNextSpecialDate(allDates))
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

  // Replace the existing calculateTimeTogether function in the useEffect with:
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTogether(calculateTimeTogether(startDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Function to get the next special date
  const getNextSpecialDate = (dates: CustomDate[]) => {
    const today = new Date()
    const upcomingDates = dates
      .filter((date) => isAfter(date.date, today))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    return upcomingDates[0]
  }

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

  // Add a new custom date directly to Firestore
  const addCustomDate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newDateTitle.trim() || !newDateDate || !db) {
      setFormError("กรอกข้อมูลให้ครบดิวะ")
      return
    }

    setIsSaving(true)
    setFormError("")

    try {
      // Get selected icon and color details
      const iconObj = availableIcons.find((icon) => icon.name === selectedIcon)
      const colorObj = availableColors.find((color) => color.name === selectedColor)

      if (!iconObj || !colorObj) {
        setFormError("เลือกไอคอนหรือสียัง")
        setIsSaving(false)
        return
      }

      // Create color string
      const colorString = `${colorObj.bg} ${colorObj.text} ${colorObj.border}`

      // Add directly to Firestore using client SDK
      await addDoc(collection(db, "specialDates"), {
        title: newDateTitle,
        date: newDateDate,
        icon: selectedIcon,
        iconColor: colorObj.icon,
        color: colorString,
        createdAt: serverTimestamp(),
      })

      // Clear the form
      setNewDateTitle("")
      setNewDateDate(new Date())
      setSelectedIcon(availableIcons[0].name)
      setSelectedColor(availableColors[0].name)
    } catch (error) {
      console.error("Error adding custom date:", error)
      setFormError(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการบันทึกข้อมูล")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle day click to show special dates
  const handleDayClick = (day: Date, events: CustomDate[]) => {
    setSelectedDay(day)
    setSelectedDayEvents(events)
    setIsDialogOpen(true)
  }

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDay = getDay(monthStart)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get special dates for current month
  const allDates = [...specialDates, ...customDates]
  const currentMonthSpecialDates = allDates.filter((specialDate) => isSameMonth(specialDate.date, currentMonth))

  // Format date in Thai
  const formatThaiDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: th })
  }

  // Render icon component by name
  const renderIcon = (iconName: string, className: string) => {
    const icon = availableIcons.find((i) => i.name === iconName)
    if (!icon) return <Calendar className={className} />

    const IconComponent = icon.component
    return <IconComponent className={className} />
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
              <div className="text-3xl font-bold text-pink-600">{timeTogether.years}</div>
              <div className="text-sm text-pink-500">Years</div>
            </div>
            <div className="text-pink-300 text-2xl">•</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{timeTogether.months}</div>
              <div className="text-sm text-pink-500">Months</div>
            </div>
            <div className="text-pink-300 text-2xl">•</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{timeTogether.days}</div>
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
                const hasEvents = daySpecialDates.length > 0

                return (
                  <div
                    key={i}
                    className={`h-24 p-1 rounded-md relative ${
                      isToday ? "bg-pink-50 ring-2 ring-pink-300" : "bg-white hover:bg-pink-50"
                    } ${hasEvents ? "cursor-pointer" : ""}`}
                    onClick={hasEvents ? () => handleDayClick(day, daySpecialDates) : undefined}
                  >
                    <div className={`text-right text-sm mb-1 ${isToday ? "font-bold text-pink-600" : "text-gray-700"}`}>
                      {format(day, "d")}
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
                      {daySpecialDates.map((specialDate, j) => (
                        <div key={j} className={`text-xs p-1 rounded flex items-center gap-1 ${specialDate.color}`}>
                          {renderIcon(specialDate.icon, `h-3 w-3 ${specialDate.iconColor}`)}
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
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-pink-600 mb-4">วันสำคัญที่กำลังจะมาถึงง</h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {allDates
                .filter((date) => isAfter(date.date, new Date()))
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map((specialDate, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${specialDate.color.split(" ")[0]}`}
                      >
                        {renderIcon(specialDate.icon, `h-4 w-4 ${specialDate.iconColor}`)}
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
          )}
        </div>

        {/* Add custom special date form */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-pink-600 mb-4">เพิ่มวันสำคัญของเราา</h2>

          <form onSubmit={addCustomDate} className="space-y-4">
            <div>
              <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                ตั้งชื่อให้วันสำคัญ
              </Label>
              <Input
                id="title"
                placeholder="เขียนชื่อวันตรงนี้นะจ๊ะ"
                value={newDateTitle}
                onChange={(e) => setNewDateTitle(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                วันที่อะไร
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-300 text-gray-700"
                  >
                    {newDateDate ? formatThaiDate(newDateDate) : "เลือกวันที่"}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={newDateDate} onSelect={setNewDateDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  ไอคอนเอาอันไหน
                </Label>
                <div className="grid grid-cols-5 gap-2 p-2 border rounded-md bg-gray-50">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => setSelectedIcon(icon.name)}
                      className={`p-2 rounded-md flex items-center justify-center ${
                        selectedIcon === icon.name ? "bg-pink-100 ring-2 ring-pink-300" : "hover:bg-gray-100"
                      }`}
                      title={icon.label}
                    >
                      {React.createElement(icon.component, { className: "h-5 w-5" })}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  สีหละ สีอะไรดีน้าา
                </Label>
                <div className="grid grid-cols-8 gap-2 p-2 border rounded-md bg-gray-50">
                  {availableColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-6 h-6 rounded-full ${color.bg} ${
                        selectedColor === color.name ? "ring-2 ring-gray-600 ring-offset-2" : ""
                      }`}
                      title={color.label}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            {formError && <p className="text-sm text-red-500">{formError}</p>}

            <div className="flex justify-end">
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มวันสำคัญ
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Special Date Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-pink-600">
              {selectedDay && formatThaiDate(selectedDay)}
            </DialogTitle>
            <DialogDescription className="text-center">วันสำคัญในวันนี้</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedDayEvents.map((event, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${event.color} border animate-fadeIn transition-all duration-300`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full bg-white/80 ${event.iconColor}`}>
                    {renderIcon(event.icon, "h-6 w-6")}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{event.title}</h3>
                    <p className="text-sm opacity-80">{formatThaiDate(event.date)}</p>
                  </div>
                </div>
                {event.type === "monthly" && <p className="mt-3 text-sm">ครบรอบกี่เดือนเนี่ยย ขอให้อยู่รักกันไปเรื่อยๆ เลยนะะ ❤️</p>}
                {event.type === "yearly" && (
                  <p className="mt-3 text-sm">ครบรอบรายปีหวะ ขอบคุณที่อยู่รักกันมาตลอดนะ เค้าดีใจนะตลอดเวลาที่มีแฟนเลย 💝</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <DialogClose asChild>
              <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                ปิด
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="text-center text-gray-500 text-sm mb-4">
        <p>Made with ❤️ for our story</p>
        <p className="mt-1">© {new Date().getFullYear()} From ICE</p>
      </footer>
    </div>
  )
}
