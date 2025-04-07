import { NextResponse } from "next/server"
import { db } from "../firebase-admin"
import { Timestamp } from "firebase-admin/firestore"

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

export async function GET() {
  try {
    const notesRef = db.collection("loveNotes")
    const snapshot = await notesRef.orderBy("createdAt", "desc").get()

    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Error fetching love notes:", error)
    return NextResponse.json({ error: "Failed to fetch love notes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { message, sender, recipient } = await request.json()

    if (!message || !sender || !recipient) {
      return NextResponse.json({ error: "Message, sender, and recipient are required" }, { status: 400 })
    }

    // Get a random color for the card
    const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)]

    const noteData = {
      message,
      sender,
      recipient,
      createdAt: Timestamp.now(),
      color: randomColor,
    }

    const docRef = await db.collection("loveNotes").add(noteData)

    return NextResponse.json({
      id: docRef.id,
      ...noteData,
    })
  } catch (error) {
    console.error("Error creating love note:", error)
    return NextResponse.json({ error: "Failed to create love note" }, { status: 500 })
  }
}

