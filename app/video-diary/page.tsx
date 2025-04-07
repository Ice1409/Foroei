"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  X,
  Calendar,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample video data - in a real app, you would have many more videos
const videos = [
  {
    id: 1,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "ทริปเที่ยวทะเลด้วยกันครั้งแรก",
    date: "15 มีนาคม 2568",
    duration: "2:15",
  },
  {
    id: 2,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "งานวันเกิดของ Ice",
    date: "22 เมษายน 2568",
    duration: "3:42",
  },
  {
    id: 3,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "ดินเนอร์มื้อพิเศษที่ร้านอาหารริมแม่น้ำ",
    date: "10 พฤษภาคม 2568",
    duration: "1:58",
  },
  {
    id: 4,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "เที่ยวสวนสนุกด้วยกัน",
    date: "18 มิถุนายน 2568",
    duration: "4:10",
  },
  {
    id: 5,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "ปิกนิกในสวนสาธารณะ",
    date: "2 กรกฎาคม 2568",
    duration: "2:33",
  },
  {
    id: 6,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "คอนเสิร์ตครั้งแรกที่ไปด้วยกัน",
    date: "15 กรกฎาคม 2568",
    duration: "5:21",
  },
  {
    id: 7,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "ทำอาหารด้วยกันที่บ้าน",
    date: "30 กรกฎาคม 2568",
    duration: "3:15",
  },
  {
    id: 8,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "เที่ยวต่างจังหวัดครั้งแรก",
    date: "5 สิงหาคม 2568",
    duration: "6:42",
  },
  {
    id: 9,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "ปาร์ตี้วันเกิดของ Oei",
    date: "20 สิงหาคม 2568",
    duration: "4:18",
  },
  {
    id: 10,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "ดูหนังกลางแปลงด้วยกัน",
    date: "3 กันยายน 2568",
    duration: "2:05",
  },
  {
    id: 11,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "เที่ยวตลาดกลางคืน",
    date: "10 กันยายน 2568",
    duration: "3:27",
  },
  {
    id: 12,
    thumbnail: "/placeholder.svg?height=600&width=800",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video URL
    title: "ไปดูพระอาทิตย์ตกด้วยกัน",
    date: "17 กันยายน 2568",
    duration: "1:48",
  },
]

// Number of videos per page
const VIDEOS_PER_PAGE = 8

export default function VideoDiary() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  // Calculate total pages
  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE)

  // Get current videos
  const indexOfLastVideo = currentPage * VIDEOS_PER_PAGE
  const indexOfFirstVideo = indexOfLastVideo - VIDEOS_PER_PAGE
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo)

  // Change page
  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage(pageNumber)
      setIsTransitioning(false)
    }, 300)
  }

  // Open video in full view
  const openVideo = (id: number) => {
    setSelectedVideo(id)
    setIsPlaying(false)
    setProgress(0)

    // Reset video when opening a new one
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
      }
    }, 100)
  }

  // Close full view
  const closeVideo = () => {
    setSelectedVideo(null)
    setIsPlaying(false)
    setIsFullscreen(false)
  }

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!isFullscreen) {
        if (videoContainerRef.current.requestFullscreen) {
          videoContainerRef.current.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  // Update progress bar
  const updateProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  // Seek in video
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget
      const clickPosition = e.nativeEvent.offsetX
      const progressBarWidth = progressBar.clientWidth
      const seekTime = (clickPosition / progressBarWidth) * videoRef.current.duration

      videoRef.current.currentTime = seekTime
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  // Navigate between videos in full view
  const navigateVideo = (direction: "prev" | "next") => {
    if (selectedVideo === null) return

    const currentIndex = videos.findIndex((video) => video.id === selectedVideo)
    let newIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : videos.length - 1
    } else {
      newIndex = currentIndex < videos.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedVideo(videos[newIndex].id)
    setIsPlaying(false)
    setProgress(0)

    // Reset video when navigating
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
      }
    }, 100)
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
          <h1 className="text-3xl font-bold text-purple-600 font-script">วิดีโอความทรงจำ</h1>
          <div className="text-sm text-purple-500">
            หน้า {currentPage} จาก {totalPages}
          </div>
        </div>

        {/* Video Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          {currentVideos.map((video) => (
            <div
              key={video.id}
              className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => openVideo(video.id)}
            >
              <div className="aspect-video relative">
                <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-6 w-6 text-purple-600 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-3 bg-white">
                <h3 className="font-medium text-gray-800 line-clamp-1">{video.title}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {video.date}
                </div>
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
            className="border-purple-300 text-purple-600 hover:bg-purple-100 disabled:opacity-50"
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
                        ? "bg-purple-500 hover:bg-purple-600"
                        : "border-purple-300 text-purple-600 hover:bg-purple-100"
                    }
                  >
                    {page}
                  </Button>
                )
              } else if ((page === 2 && currentPage > 3) || (page === totalPages - 1 && currentPage < totalPages - 2)) {
                return (
                  <span key={page} className="text-purple-500">
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
            className="border-purple-300 text-purple-600 hover:bg-purple-100 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Full Video View */}
        {selectedVideo !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeVideo}
              className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateVideo("prev")}
              className="absolute left-4 text-white hover:bg-white/10 h-12 w-12 rounded-full"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <div ref={videoContainerRef} className="max-w-4xl w-full relative">
              {selectedVideo && (
                <>
                  <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      src={videos.find((v) => v.id === selectedVideo)?.videoUrl}
                      className="w-full h-full"
                      onClick={togglePlay}
                      onTimeUpdate={updateProgress}
                      onEnded={() => setIsPlaying(false)}
                      muted={isMuted}
                    />

                    {/* Video controls overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      {/* Top bar with title */}
                      <div className="text-white text-lg font-medium">
                        {videos.find((v) => v.id === selectedVideo)?.title}
                      </div>

                      {/* Center play/pause button */}
                      {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={togglePlay}
                            className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition-colors"
                          >
                            <Play className="h-8 w-8 text-white ml-1" />
                          </button>
                        </div>
                      )}

                      {/* Bottom controls */}
                      <div className="space-y-2">
                        {/* Progress bar */}
                        <div className="h-1 bg-white/30 rounded-full cursor-pointer" onClick={seek}>
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <button onClick={togglePlay} className="text-white hover:text-purple-300">
                              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </button>

                            <button onClick={toggleMute} className="text-white hover:text-purple-300">
                              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </button>

                            <div className="text-white text-sm">
                              {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"} /
                              {videoRef.current ? formatTime(videoRef.current.duration || 0) : "0:00"}
                            </div>
                          </div>

                          <button onClick={toggleFullscreen} className="text-white hover:text-purple-300">
                            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-white/10 p-4 rounded-lg">
                    <h3 className="text-white text-xl font-medium">
                      {videos.find((v) => v.id === selectedVideo)?.title}
                    </h3>
                    <div className="flex items-center text-white/80 mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {videos.find((v) => v.id === selectedVideo)?.date}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateVideo("next")}
              className="absolute right-4 text-white hover:bg-white/10 h-12 w-12 rounded-full"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        )}

        <footer className="text-center text-gray-500 text-sm mb-4">
        <p>Made with ❤️ for our story</p>
        <p className="mt-1">© {new Date().getFullYear()} From ICE</p>
        </footer>
      </div>
    </div>
    
  )
}

