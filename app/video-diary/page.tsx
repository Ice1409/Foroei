"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Heart,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample video data - in a real app, you would have many more videos
const videos = [
  {
    id: 1,
    videoUrl: "/iceoei.mp4", // Sample video URL
    duration: "2:15",
  },
  {
    id: 2,
    videoUrl: "/iceoei.mp4", // Sample video URL
    duration: "3:42",
  },
  {
    id: 3,
    videoUrl: "/iceoei.mp4", // Sample video URL
    duration: "1:58",
  },
  {
    id: 4,
    videoUrl: "/iceoei.mp4", // Sample video URL
    duration: "4:10",
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
  const [likedVideos, setLikedVideos] = useState<number[]>([])
  const [loadedThumbnails, setLoadedThumbnails] = useState<Record<number, boolean>>({})
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<Record<number, HTMLVideoElement | null>>({})

  // Calculate total pages
  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE)

  // Get current videos
  const indexOfLastVideo = currentPage * VIDEOS_PER_PAGE
  const indexOfFirstVideo = indexOfLastVideo - VIDEOS_PER_PAGE
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo)

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Load video thumbnails
  useEffect(() => {
    // Create a ref to track which videos we've already set up listeners for
    const processedVideos = new Set()

    // For each video on the current page, set up the thumbnail
    currentVideos.forEach((video) => {
      // Skip if we've already processed this video in this render cycle
      if (processedVideos.has(video.id)) return
      processedVideos.add(video.id)

      const videoElement = thumbnailRefs.current[video.id]
      if (!videoElement) return

      // Set the time once
      if (videoElement.readyState >= 2) {
        // If already loaded, just update the state
        setLoadedThumbnails((prev) => ({
          ...prev,
          [video.id]: true,
        }))
      } else {
        // Set the time to 1 second
        videoElement.currentTime = 1

        // One-time event listener
        const handleLoaded = () => {
          setLoadedThumbnails((prev) => ({
            ...prev,
            [video.id]: true,
          }))
          videoElement.removeEventListener("loadeddata", handleLoaded)
        }

        videoElement.addEventListener("loadeddata", handleLoaded)
      }
    })

    // Clean up function
    return () => {
      currentVideos.forEach((video) => {
        const videoElement = thumbnailRefs.current[video.id]
        if (videoElement) {
          // Need to use a named function for proper cleanup
          videoElement.removeEventListener("loadeddata", () => {})
        }
      })
    }
  }, [currentPage]) // Only depend on currentPage, not currentVideos or loadedThumbnails

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
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error)
        })
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
          videoContainerRef.current.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable fullscreen:", err)
          })
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch((err) => {
            console.error("Error attempting to exit fullscreen:", err)
          })
        }
      }
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

  // Toggle like on a video
  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (likedVideos.includes(id)) {
      setLikedVideos(likedVideos.filter((videoId) => videoId !== id))
    } else {
      setLikedVideos([...likedVideos, id])
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
          <h1 className="text-3xl font-bold text-pink-600 font-script">วิดีโอความทรงจำ</h1>
          <div className="text-sm text-pink-500 bg-white/50 px-3 py-1 rounded-full shadow-sm">
            {currentPage}/{totalPages}
          </div>
        </div>

        {/* Video Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          {currentVideos.map((video) => (
            <div
              key={video.id}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => openVideo(video.id)}
            >
              <div className="aspect-video relative bg-gray-100">
                {/* Video thumbnail */}
                <video
                  ref={(el) => (thumbnailRefs.current[video.id] = el)}
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                  // Remove the onLoadedMetadata handler that was setting currentTime
                />

                {/* Loading indicator */}
                {!loadedThumbnails[video.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50">
                    <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Play className="h-7 w-7 text-pink-600 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {video.duration}
                </div>
              </div>
              <button
                className={`absolute top-2 right-2 p-2 rounded-full ${likedVideos.includes(video.id) ? "bg-pink-500 text-white" : "bg-white/70 text-pink-500"} transition-all duration-300 transform hover:scale-110 z-10`}
                onClick={(e) => toggleLike(video.id, e)}
              >
                <Heart className={`h-4 w-4 ${likedVideos.includes(video.id) ? "fill-white" : ""}`} />
              </button>
            </div>
          ))}

          {/* Empty placeholders to maintain grid layout */}
          {currentVideos.length < VIDEOS_PER_PAGE &&
            Array(VIDEOS_PER_PAGE - currentVideos.length)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="aspect-video bg-white/30 rounded-2xl border-2 border-dashed border-pink-200 flex items-center justify-center"
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

        {/* Full Video View */}
        {selectedVideo !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeVideo}
              className="absolute top-4 right-4 text-white hover:bg-white/10 z-10 rounded-full"
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
                <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-xl">
                  <video
                    ref={videoRef}
                    src={videos.find((v) => v.id === selectedVideo)?.videoUrl}
                    className="w-full h-full"
                    onClick={togglePlay}
                    onTimeUpdate={updateProgress}
                    onEnded={() => setIsPlaying(false)}
                    muted={isMuted}
                    playsInline
                  />

                  {/* Video controls overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
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
                    <div className="mt-auto space-y-2">
                      {/* Progress bar */}
                      <div className="h-1.5 bg-white/30 rounded-full cursor-pointer" onClick={seek}>
                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlay}
                            className="text-white hover:text-pink-300 p-2 rounded-full hover:bg-white/10"
                          >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          </button>

                          <button
                            onClick={toggleMute}
                            className="text-white hover:text-pink-300 p-2 rounded-full hover:bg-white/10"
                          >
                            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                          </button>

                          <div className="text-white text-sm">
                            {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"} /
                            {videoRef.current ? formatTime(videoRef.current.duration || 0) : "0:00"}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            className={`p-2 rounded-full ${likedVideos.includes(selectedVideo) ? "bg-pink-500 text-white" : "text-white hover:bg-white/10"}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLike(selectedVideo, e)
                            }}
                          >
                            <Heart className={`h-5 w-5 ${likedVideos.includes(selectedVideo) ? "fill-white" : ""}`} />
                          </button>

                          <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-pink-300 p-2 rounded-full hover:bg-white/10"
                          >
                            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
