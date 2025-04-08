"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Book, Calendar, Gift, Heart, ImageIcon, MessageSquareHeart, Video } from "lucide-react"
import { calculateTimeTogether } from "@/lib/utils"

export default function Home() {
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Anniversary date: February 22, 2025 at 23:32
  const anniversaryDate = new Date("2025-02-22T23:32:00")

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTogether(calculateTimeTogether(anniversaryDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-pink-50">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-6 text-center">
        <div className="text-center mb-2">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-1 font-script">❤️ Ice & Oei ❤️</h1>
          <p className="text-pink-500 italic">Our love story</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 w-full">
          <h2 className="text-xl font-medium text-pink-600 mb-4">❤️ We've been in a relationship for ❤️</h2>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-pink-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-pink-600">{timeTogether.years}</div>
              <div className="text-sm text-pink-500">Years</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-pink-600">{timeTogether.months}</div>
              <div className="text-sm text-pink-500">Months</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-pink-600">{timeTogether.days}</div>
              <div className="text-sm text-pink-500">Days</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-pink-600">{timeTogether.hours}</div>
              <div className="text-sm text-pink-500">Hours</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-pink-600">{timeTogether.minutes}</div>
              <div className="text-sm text-pink-500">Minutes</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-pink-600">{timeTogether.seconds}</div>
              <div className="text-sm text-pink-500">Seconds</div>
            </div>
          </div>

          <div className="text-sm text-pink-400">Started our relationship on February 22, 2025 at 23:32.</div>
        </div>

        <div className="w-full space-y-3">
          <Link href="/relationship-book" className="block">
            <div className="flex items-center justify-between bg-pink-200 hover:bg-pink-300 transition-colors rounded-xl p-4 text-left">
              <div className="flex items-center">
                <Book className="h-5 w-5 text-pink-600 mr-2" />
                <div>
                  <div className="font-medium text-pink-700">Relationship Book</div>
                  <div className="text-xs text-pink-600">หนังสือความสัมพันธ์</div>
                </div>
              </div>
              <Heart className="h-4 w-4 text-pink-500" />
            </div>
          </Link>

          <Link href="/" className="block">
            <div className="flex items-center justify-between bg-blue-100 hover:bg-blue-200 transition-colors rounded-xl p-4 text-left">
              <div className="flex items-center">
                <ImageIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-medium text-blue-700">Photo Gallery</div>
                  <div className="text-xs text-blue-600">คลังรูปของเรา</div>
                </div>
              </div>
              <Heart className="h-4 w-4 text-blue-500" />
            </div>
          </Link>

          <Link href="/" className="block">
            <div className="flex items-center justify-between bg-purple-100 hover:bg-purple-200 transition-colors rounded-xl p-4 text-left">
              <div className="flex items-center">
                <Video className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <div className="font-medium text-purple-700">Video Diary</div>
                  <div className="text-xs text-purple-600">คลังวิดีโอของเรา</div>
                </div>
              </div>
              <Heart className="h-4 w-4 text-purple-500" />
            </div>
          </Link>

          <Link href="/special-dates" className="block">
            <div className="flex items-center justify-between bg-green-100 hover:bg-green-200 transition-colors rounded-xl p-4 text-left">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <div className="font-medium text-green-700">Special Dates</div>
                  <div className="text-xs text-green-600">วันสำคัญของเรา</div>
                </div>
              </div>
              <Heart className="h-4 w-4 text-green-500" />
            </div>
          </Link>

          <Link href="/love-notes" className="block">
            <div className="flex items-center justify-between bg-pink-100 hover:bg-pink-200 transition-colors rounded-xl p-4 text-left mb-10">
              <div className="flex items-center">
                <MessageSquareHeart className="h-5 w-5 text-pink-600 mr-2" />
                <div>
                  <div className="font-medium text-pink-700">Love Letters</div>
                  <div className="text-xs text-pink-600">จดหมายรักระหว่างเรา</div>
                </div>
              </div>
              <Heart className="h-4 w-4 text-pink-500" />
            </div>
          </Link>
        </div>
      </div>
      <footer className="text-center text-gray-500 text-sm mb-4">
        <p>Made with ❤️ for our story</p>
        <p className="mt-1">© {new Date().getFullYear()} From ICE</p>
      </footer>
    </main>
    
  )
}

