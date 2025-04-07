"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Home, X, Calendar, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample photo data - in a real app, you would have many more photos
const photos = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ทริปเที่ยวทะเลด้วยกันครั้งแรก",
    date: "15 มีนาคม 2568",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=800",
    caption: "งานวันเกิดของ Ice",
    date: "22 เมษายน 2568",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ดินเนอร์มื้อพิเศษที่ร้านอาหารริมแม่น้ำ",
    date: "10 พฤษภาคม 2568",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=600&width=800",
    caption: "เที่ยวสวนสนุกด้วยกัน",
    date: "18 มิถุนายน 2568",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ปิกนิกในสวนสาธารณะ",
    date: "2 กรกฎาคม 2568",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=600&width=800",
    caption: "คอนเสิร์ตครั้งแรกที่ไปด้วยกัน",
    date: "15 กรกฎาคม 2568",
  },
  {
    id: 7,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ทำอาหารด้วยกันที่บ้าน",
    date: "30 กรกฎาคม 2568",
  },
  {
    id: 8,
    src: "/placeholder.svg?height=600&width=800",
    caption: "เที่ยวต่างจังหวัดครั้งแรก",
    date: "5 สิงหาคม 2568",
  },
  {
    id: 9,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ปาร์ตี้วันเกิดของ Oei",
    date: "20 สิงหาคม 2568",
  },
  {
    id: 10,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ดูหนังกลางแปลงด้วยกัน",
    date: "3 กันยายน 2568",
  },
  {
    id: 11,
    src: "/placeholder.svg?height=600&width=800",
    caption: "เที่ยวตลาดกลางคืน",
    date: "10 กันยายน 2568",
  },
  {
    id: 12,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ไปดูพระอาทิตย์ตกด้วยกัน",
    date: "17 กันยายน 2568",
  },
  {
    id: 13,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ทริปเขาใหญ่",
    date: "24 กันยายน 2568",
  },
  {
    id: 14,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ปาร์ตี้ฮาโลวีนด้วยกัน",
    date: "31 ตุลาคม 2568",
  },
  {
    id: 15,
    src: "/placeholder.svg?height=600&width=800",
    caption: "เที่ยวงานลอยกระทง",
    date: "15 พฤศจิกายน 2568",
  },
  {
    id: 16,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ช้อปปิ้งของขวัญคริสต์มาส",
    date: "20 ธันวาคม 2568",
  },
  {
    id: 17,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ฉลองปีใหม่ด้วยกัน",
    date: "31 ธันวาคม 2568",
  },
  {
    id: 18,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ทริปเที่ยวเชียงใหม่",
    date: "15 มกราคม 2569",
  },
  {
    id: 19,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ฉลองวันวาเลนไทน์แรกของเรา",
    date: "14 กุมภาพันธ์ 2569",
  },
  {
    id: 20,
    src: "/placeholder.svg?height=600&width=800",
    caption: "ครบรอบ 1 ปีของเรา",
    date: "22 กุมภาพันธ์ 2569",
  },
  // You can add many more photos here
]

// Number of photos per page
const PHOTOS_PER_PAGE = 12

export default function Gallery() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Calculate total pages
  const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE)

  // Get current photos
  const indexOfLastPhoto = currentPage * PHOTOS_PER_PAGE
  const indexOfFirstPhoto = indexOfLastPhoto - PHOTOS_PER_PAGE
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto)

  // Change page
  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage(pageNumber)
      setIsTransitioning(false)
    }, 300)
  }

  // Open photo in full view
  const openPhoto = (id: number) => {
    setSelectedPhoto(id)
  }

  // Close full view
  const closePhoto = () => {
    setSelectedPhoto(null)
  }

  // Navigate between photos in full view
  const navigatePhoto = (direction: "prev" | "next") => {
    if (selectedPhoto === null) return

    const currentIndex = photos.findIndex((photo) => photo.id === selectedPhoto)
    let newIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
    } else {
      newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedPhoto(photos[newIndex].id)
  }

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
          <h1 className="text-3xl font-bold text-pink-600 font-script">ภาพความทรงจำ</h1>
          <div className="text-sm text-pink-500">
            หน้า {currentPage} จาก {totalPages}
          </div>
        </div>

        {/* Photo Grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          {currentPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => openPhoto(photo.id)}
            >
              <div className="aspect-square relative">
                <Image src={photo.src || "/placeholder.svg"} alt={photo.caption} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-medium truncate">{photo.caption}</p>
                  <div className="flex items-center text-xs text-white/80 mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {photo.date}
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="h-5 w-5 text-white drop-shadow-md" />
              </div>
            </div>
          ))}

          {/* Empty placeholders to maintain grid layout */}
          {currentPhotos.length < PHOTOS_PER_PAGE &&
            Array(PHOTOS_PER_PAGE - currentPhotos.length)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="aspect-square bg-pink-100/50 rounded-lg border-2 border-dashed border-pink-200 flex items-center justify-center"
                >
                  <p className="text-pink-300 text-sm">รูปภาพในอนาคต</p>
                </div>
              ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-8 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-pink-300 text-pink-600 hover:bg-pink-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show limited page numbers with ellipsis for many pages
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className={
                      currentPage === page
                        ? "bg-pink-500 hover:bg-pink-600"
                        : "border-pink-300 text-pink-600 hover:bg-pink-100"
                    }
                  >
                    {page}
                  </Button>
                )
              } else if ((page === 2 && currentPage > 3) || (page === totalPages - 1 && currentPage < totalPages - 2)) {
                return (
                  <span key={page} className="text-pink-500">
                    ...
                  </span>
                )
              }
              return null
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-pink-300 text-pink-600 hover:bg-pink-100 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Full Photo View */}
        {selectedPhoto !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={closePhoto}
              className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigatePhoto("prev")}
              className="absolute left-4 text-white hover:bg-white/10 h-12 w-12 rounded-full"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <div className="max-w-4xl w-full max-h-[80vh] relative">
              {selectedPhoto && (
                <>
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={photos.find((p) => p.id === selectedPhoto)?.src || ""}
                      alt={photos.find((p) => p.id === selectedPhoto)?.caption || ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white text-xl font-medium">
                      {photos.find((p) => p.id === selectedPhoto)?.caption}
                    </h3>
                    <div className="flex items-center text-white/80 mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {photos.find((p) => p.id === selectedPhoto)?.date}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigatePhoto("next")}
              className="absolute right-4 text-white hover:bg-white/10 h-12 w-12 rounded-full"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        )}
      </div>
      <footer className="text-center text-gray-500 text-sm mb-4">
        <p>Made with ❤️ for our story</p>
        <p className="mt-1">© {new Date().getFullYear()} From ICE</p>
        </footer>
    </div>
  )
}

