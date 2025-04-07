"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Home, Send, Heart, Loader2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, query, orderBy, Timestamp, onSnapshot } from "firebase/firestore"

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

// Love note type
interface LoveNote {
  id: string
  message: string
  sender: string
  recipient: string
  createdAt: Timestamp
  color: string
}

// Random pastel colors for cards
const cardColors = [
  "bg-pink-50 border-pink-200",
  "bg-purple-50 border-purple-200",
  "bg-blue-50 border-blue-200",
  "bg-green-50 border-green-200",
  "bg-yellow-50 border-yellow-200",
  "bg-orange-50 border-orange-200",
  "bg-red-50 border-red-200",
  "bg-indigo-50 border-indigo-200",
]

// Name options for sender
const nameOptions = ["Ice", "Oei"]

// Components for user avatars
const OeiHead = () => (
  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
    <span className="text-xs font-semibold text-purple-700">Oei</span>
  </div>
)

const IceHead = () => (
  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
    <span className="text-xs font-semibold text-blue-700">Ice</span>
  </div>
)

export default function LoveNotes() {
  const [notes, setNotes] = useState<LoveNote[]>([])
  const [message, setMessage] = useState("")
  const [sender, setSender] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const latestNoteRef = useRef<HTMLDivElement>(null)

  // Get recipient automatically based on sender
  const recipient = sender === "Ice" ? "Oei" : sender === "Oei" ? "Ice" : ""

  // Fetch love notes from Firestore
  useEffect(() => {
    if (!db) return

    setIsLoading(true)

    // Changed ordering to "asc" so newest notes will be at the bottom
    const q = query(collection(db, "loveNotes"), orderBy("createdAt", "asc"))

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedNotes: LoveNote[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          fetchedNotes.push({
            id: doc.id,
            message: data.message,
            sender: data.sender,
            recipient: data.recipient,
            createdAt: data.createdAt,
            color: data.color,
          })
        })
        setNotes(fetchedNotes)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error fetching love notes:", error)
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  // Scroll to the latest message
  useEffect(() => {
    if (notes.length > 0) {
      latestNoteRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [notes])

  // Send a new love note
  const sendLoveNote = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !sender || !recipient || !db) return

    setIsSending(true)

    try {
      // Get a random color for the card
      const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)]

      // Add a new document to Firestore
      await addDoc(collection(db, "loveNotes"), {
        message,
        sender,
        recipient,
        createdAt: Timestamp.now(),
        color: randomColor,
      })

      // Clear the form
      setMessage("")

      // Scroll to the latest message
      setTimeout(() => {
        latestNoteRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (error) {
      console.error("Error sending love note:", error)
    } finally {
      setIsSending(false)
    }
  }

  // Format date
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate()
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Generate a random tilt angle between -5 and 5 degrees
  const getRandomTilt = () => {
    return Math.floor(Math.random() * 10) - 5
  }

  // Render the appropriate avatar based on sender
  const renderSenderAvatar = (senderName: string) => {
    if (senderName === "Oei") {
      return <OeiHead />
    } else if (senderName === "Ice") {
      return <IceHead />
    } else {
      return <Heart className="h-5 w-5 text-pink-500" />
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      {/* Fixed header */}
      <div className="bg-pink-50 pt-4 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-pink-300 text-pink-600 hover:bg-pink-100"
                size="sm"
              >
                <Home className="h-3 w-3" />
                กลับหน้าหลัก
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-pink-600 font-script">จดหมายรักระหว่างเรา</h1>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-4xl mx-auto">
          {/* Love notes container */}
          <div className="relative min-h-[calc(100vh-250px)]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
              </div>
            ) : notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
                <Heart className="h-16 w-16 text-pink-300 mb-4" />
                <h3 className="text-xl font-medium text-pink-600 mb-2">ยังไม่มีจดหมายรักระหว่างเรา</h3>
                <p className="text-pink-500">ส่งจดหมายรักฉบับแรกให้กันและกันสิ</p>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                {notes.map((note, index) => {
                  // Generate a random tilt angle for each card
                  const tiltAngle = getRandomTilt()
                  const isLastNote = index === notes.length - 1

                  return (
                    <div
                      key={note.id}
                      ref={isLastNote ? latestNoteRef : null}
                      className={`max-w-lg mx-auto p-4 rounded-lg shadow-md border ${note.color} transform hover:scale-105 transition-transform duration-300`}
                      style={{ transform: `rotate(${tiltAngle}deg)` }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-gray-500">
                            จาก: <span className="font-medium text-pink-600">{note.sender}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            ถึง: <span className="font-medium text-pink-600">{note.recipient}</span>
                          </p>
                        </div>
                        {renderSenderAvatar(note.sender)}
                      </div>

                      <div className="mb-3 whitespace-pre-wrap text-gray-700">{note.message}</div>

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-pink-400" />
                          {formatDate(note.createdAt)}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                          <Heart className="h-3 w-3 text-pink-500" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed form at the bottom - Now more compact */}
      <div className="bg-pink-50 px-4 pb-4 pt-2 sticky bottom-0 z-10 shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
        <div className="max-w-4xl mx-auto">
          {/* Form to send a new love note - More compact */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <form onSubmit={sendLoveNote} className="space-y-3">
              <div>
                <Textarea
                  id="message"
                  placeholder="พิมพ์ข้อความหวานๆ ที่นี่ๆ พิมพ์ๆๆ"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[60px] text-sm resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select 
                    value={sender} 
                    onValueChange={setSender}
                  >
                    <SelectTrigger className="w-full h-8 text-sm">
                      <SelectValue placeholder="ใครเป็นคนส่งงงงงง" />
                    </SelectTrigger>
                    <SelectContent>
                      {nameOptions.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {sender && (
                  <div className="text-sm text-gray-600 flex-1">
                    ถึง: <span className="font-medium text-pink-600">{recipient}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="bg-pink-500 hover:bg-pink-600" 
                  disabled={isSending || !sender}
                  size="sm"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ส่ง...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      ส่ง
                    </>
                  )}
                </Button>
              </div>
            </form>
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