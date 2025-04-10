"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Home, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

// ส่วนนี้สำหรับเพิ่มรูปใหม่ๆ - เพิ่มรูปใหม่ตรงนี้เพื่อให้แสดงในหน้าแรกๆ
// รูปแบบ: { id: [ตัวเลข], src: "/photogallery/[ชื่อไฟล์].[นามสกุลไฟล์]?height=600&width=800" }
const newPhotos = [
  // ตัวอย่างการเพิ่มรูปใหม่ที่มีนามสกุลไฟล์ต่างๆ
  // { id: 1, src: "/photogallery/NewPhoto1.webp?height=600&width=800" },
  // { id: 2, src: "/photogallery/NewPhoto2.gif?height=600&width=800" },
  // เพิ่มรูปใหม่ๆ ตรงนี้...
  
  
  { id: 1, src: "/photogallery/Oei (1).jpg?height=600&width=800" },
]

// รูป PNG ที่มีอยู่เดิม
const pngPhotos = Array.from({ length: 24 }, (_, i) => ({
  // เริ่ม ID ต่อจาก newPhotos
  id: newPhotos.length + i + 1,
  src: `/photogallery/Oei (${i + 1}).png?height=600&width=800`,
}))

// รูป JPG ที่มีอยู่เดิม
const jpgPhotos = Array.from({ length: 236 }, (_, i) => ({
  // เริ่ม ID ต่อจาก pngPhotos
  id: newPhotos.length + pngPhotos.length + i + 1,
  src: `/photogallery/Oei (${i + 1}).jpg?height=600&width=800`,
}))

// รวมรูปทั้งหมด โดยให้รูปใหม่อยู่ด้านบนสุด (แสดงในหน้าแรกๆ)
const photos = [
  ...newPhotos, // รูปใหม่จะแสดงก่อน
  ...jpgPhotos, // ตามด้วยรูป JPG
  ...pngPhotos, // ตามด้วยรูป PNG
]

// Number of photos per page
const PHOTOS_PER_PAGE = 12

export default function Gallery() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [likedPhotos, setLikedPhotos] = useState<number[]>([])

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

  // Toggle like on a photo
  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (likedPhotos.includes(id)) {
      setLikedPhotos(likedPhotos.filter((photoId) => photoId !== id))
    } else {
      setLikedPhotos([...likedPhotos, id])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-pink-300 text-pink-600 hover:bg-pink-100 rounded-full"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">กลับหน้าหลัก</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-pink-600 font-script">ภาพความทรงจำ</h1>
          <div className="text-sm text-pink-500 bg-white/50 px-3 py-1 rounded-full shadow-sm">
            {currentPage}/{totalPages}
          </div>
        </div>

        {/* Photo Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          {currentPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => openPhoto(photo.id)}
            >
              <div className="aspect-square relative">
                <Image src={photo.src || "/placeholder.svg"} alt="Memory photo" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <button
                className={`absolute top-2 right-2 p-2 rounded-full ${likedPhotos.includes(photo.id) ? "bg-pink-500 text-white" : "bg-white/70 text-pink-500"} transition-all duration-300 transform hover:scale-110 z-10`}
                onClick={(e) => toggleLike(photo.id, e)}
              >
                <Heart className={`h-4 w-4 ${likedPhotos.includes(photo.id) ? "fill-white" : ""}`} />
              </button>
            </div>
          ))}

          {/* Empty placeholders to maintain grid layout */}
          {currentPhotos.length < PHOTOS_PER_PAGE &&
            Array(PHOTOS_PER_PAGE - currentPhotos.length)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="aspect-square bg-white/30 rounded-2xl border-2 border-dashed border-pink-200 flex items-center justify-center"
                >
                  <div className="text-pink-300 text-center p-4">
                    <Heart className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">ความทรงจำใหม่</p>
                  </div>
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
            className="border-pink-300 text-pink-600 hover:bg-pink-100 disabled:opacity-50 rounded-full"
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
                        ? "bg-pink-500 hover:bg-pink-600 rounded-full w-8 h-8 p-0"
                        : "border-pink-300 text-pink-600 hover:bg-pink-100 rounded-full w-8 h-8 p-0"
                    }
                  >
                    {page}
                  </Button>
                )
              } else if ((page === 2 && currentPage > 3) || (page === totalPages - 1 && currentPage < totalPages - 2)) {
                return (
                  <span key={page} className="text-pink-500 flex items-center">
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
            className="border-pink-300 text-pink-600 hover:bg-pink-100 disabled:opacity-50 rounded-full"
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
              className="absolute top-4 right-4 text-white hover:bg-white/10 z-10 rounded-full"
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
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={photos.find((p) => p.id === selectedPhoto)?.src || ""}
                    alt="Memory photo"
                    fill
                    className="object-contain"
                  />
                  <button
                    className={`absolute top-4 right-16 p-3 rounded-full ${likedPhotos.includes(selectedPhoto) ? "bg-pink-500 text-white" : "bg-white/20 text-white"} transition-all duration-300 transform hover:scale-110`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(selectedPhoto, e as any)
                    }}
                  >
                    <Heart className={`h-5 w-5 ${likedPhotos.includes(selectedPhoto) ? "fill-white" : ""}`} />
                  </button>
                </div>
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
      <footer className="text-center text-pink-600/70 text-sm mt-12 mb-4">
        <div className="flex justify-center items-center gap-1 mb-1">
          Made with <Heart className="h-4 w-4 fill-pink-500 text-pink-500" /> for our story
        </div>
        <p>© {new Date().getFullYear()} From ICE</p>
      </footer>
    </div>
  )
}
