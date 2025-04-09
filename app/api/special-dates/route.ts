import { NextResponse } from "next/server"
import { db } from "../firebase-admin"
import { Timestamp } from "firebase-admin/firestore"

export async function GET() {
  try {
    if (!db) {
      throw new Error("Firebase Admin SDK not initialized")
    }

    const datesRef = db.collection("specialDates")
    const snapshot = await datesRef.orderBy("createdAt", "desc").get()

    const dates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toISOString(), // Convert Timestamp to ISO string
    }))

    return NextResponse.json({ dates })
  } catch (error) {
    console.error("Error fetching special dates:", error)
    return NextResponse.json({ error: "Failed to fetch special dates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!db) {
      console.error("Firebase Admin SDK not initialized")
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
    }

    let data
    try {
      data = await request.json()
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const { title, date, icon, iconColor, color } = data

    if (!title || !date || !icon || !iconColor || !color) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Convert date string to Timestamp
    // Make sure we're handling the date correctly regardless of format
    let dateObj
    try {
      dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date")
      }
    } catch (e) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    const dateTimestamp = Timestamp.fromDate(dateObj)

    const dateData = {
      title,
      date: dateTimestamp,
      icon,
      iconColor,
      color,
      createdAt: Timestamp.now(),
    }

    try {
      const docRef = await db.collection("specialDates").add(dateData)

      return NextResponse.json({
        id: docRef.id,
        ...dateData,
        date: dateData.date.toDate().toISOString(), // Convert back to ISO string for response
      })
    } catch (firestoreError) {
      console.error("Firestore write error:", firestoreError)
      return NextResponse.json({ error: "Database write failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating special date:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    if (!db) {
      throw new Error("Firebase Admin SDK not initialized")
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Date ID is required" }, { status: 400 })
    }

    await db.collection("specialDates").doc(id).delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting special date:", error)
    return NextResponse.json({ error: "Failed to delete special date" }, { status: 500 })
  }
}
