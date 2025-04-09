"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Home, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample data for the book pages with multiple images
const bookPages = [
  {
    type: "cover",
    title: "Our Love Story",
    subtitle: "Ice & Oei",
  },
  {
    type: "toc",
    title: "สารบัญ",
    items: [
      { title: "รักแฟน", page: 2 },
      { title: "คิดถึงแฟน", page: 3 },
    ],
  },
  {
    type: "content",
    title: "แฟนตัวใย่",
    date: "22 กุมภาพันธ์ 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "แฟน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "แฟนอีก",
      },
    ],
    text: "รักแฟนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนน",
  },
  {
    type: "content",
    title: "แฟนตัวใย่",
    date: "22 กุมภาพันธ์ 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "แฟน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "แฟน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ละก้แฟน",
      },
    ],
    text: "รักแฟนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนนน",
  },
  {
    type: "last",
    title: "The End",
    text: "Ice & Oei",
  },
]

export default function RelationshipBook() {
  const [currentPage, setCurrentPage] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState("right")
  const [currentImageSlide, setCurrentImageSlide] = useState(0)
  const bookRef = useRef<HTMLDivElement>(null)

  const totalPages = bookPages.length

  const goToNextPage = () => {
    if (currentPage < totalPages - 1 && !flipping) {
      setFlipDirection("right")
      setFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setCurrentImageSlide(0) // Reset image slide when changing page
        setFlipping(false)
      }, 600)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0 && !flipping) {
      setFlipDirection("left")
      setFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setCurrentImageSlide(0) // Reset image slide when changing page
        setFlipping(false)
      }, 600)
    }
  }

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 0 && pageNumber < totalPages && !flipping) {
      setFlipDirection(pageNumber > currentPage ? "right" : "left")
      setFlipping(true)
      setTimeout(() => {
        setCurrentPage(pageNumber)
        setCurrentImageSlide(0) // Reset image slide when changing page
        setFlipping(false)
      }, 600)
    }
  }

  // Image carousel navigation
  const nextImageSlide = () => {
    if (currentPage < 2 || currentPage >= totalPages - 1) return // Skip for cover, toc and last page

    const images = bookPages[currentPage].images || []
    const totalSlides = Math.ceil(images.length / 2)

    if (currentImageSlide < totalSlides - 1) {
      setCurrentImageSlide(currentImageSlide + 1)
    } else {
      setCurrentImageSlide(0) // Loop back to the first slide
    }
  }

  const prevImageSlide = () => {
    if (currentPage < 2 || currentPage >= totalPages - 1) return // Skip for cover, toc and last page

    const images = bookPages[currentPage].images || []
    const totalSlides = Math.ceil(images.length / 2)

    if (currentImageSlide > 0) {
      setCurrentImageSlide(currentImageSlide - 1)
    } else {
      setCurrentImageSlide(totalSlides - 1) // Loop to the last slide
    }
  }

  // Get current images to display (2 at a time)
  const getCurrentImages = () => {
    if (currentPage < 2 || currentPage >= totalPages - 1) return [] // Skip for cover, toc and last page

    const images = bookPages[currentPage].images || []
    const startIdx = currentImageSlide * 2
    return images.slice(startIdx, startIdx + 2)
  }

  // Calculate total slides for current page
  const getTotalImageSlides = () => {
    if (currentPage < 2 || currentPage >= totalPages - 1) return 0 // Skip for cover, toc and last page

    const images = bookPages[currentPage].images || []
    return Math.ceil(images.length / 2)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNextPage()
      } else if (e.key === "ArrowLeft") {
        goToPrevPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentPage])

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-pink-300 text-pink-600 hover:bg-pink-100 bg-white/80"
            >
              <Home className="h-4 w-4" />
              กลับหน้าหลัก
            </Button>
          </Link>
          <div className="text-sm text-pink-600 bg-white/80 px-3 py-1 rounded-full">
            หน้า {currentPage + 1} จาก {totalPages}
          </div>
        </div>

        <div className="relative book-container">
          {/* Book wrapper with 3D effect */}
          <div className="book-wrapper">
            {/* Book spine */}
            <div className="book-spine">
              <div className="spine-title">Our Love Story</div>
            </div>

            {/* Book cover shadow (left side) */}
            <div className="book-cover-shadow"></div>

            {/* Book pages edge */}
            <div className="book-pages-edge"></div>

            {/* Book */}
            <div
              ref={bookRef}
              className={`book ${flipping ? "flipping" : ""} ${flipDirection === "right" ? "flip-right" : "flip-left"}`}
            >
              {/* Current page */}
              <div className="book-page">
                {currentPage === 0 ? (
                  <div className="cover-page">
                    <h1 className="cover-title">{bookPages[0].title}</h1>
                    <div className="cover-heart">❤️</div>
                    <h2 className="cover-subtitle">{bookPages[0].subtitle}</h2>
                    <p className="cover-date">เริ่มต้นเมื่อ 22 กุมภาพันธ์ 2568</p>
                  </div>
                ) : currentPage === 1 ? (
                  <div className="toc-page">
                    <h2 className="page-title">{bookPages[1].title}</h2>
                    <ul className="toc-list">
                    {bookPages[1]?.items?.map((item, index) => (
                        <li key={index} className="toc-item">
                          <span className="toc-title">{item.title}</span>
                          <div className="toc-dots"></div>
                          <button onClick={() => goToPage(item.page - 1)} className="toc-page-number">
                            {item.page}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="page-number">{currentPage}</div>
                  </div>
                ) : currentPage === totalPages - 1 ? (
                  <div className="last-page">
                    <h2 className="last-page-title">{bookPages[currentPage].title}</h2>
                    <p className="last-page-text">{bookPages[currentPage].text}</p>
                    <div className="last-page-heart">❤️</div>
                  </div>
                ) : (
                  <div className="content-page">
                    <h2 className="page-title">{bookPages[currentPage].title}</h2>
                    <p className="page-date">{bookPages[currentPage].date}</p>

                    {/* Image carousel */}
                    <div className="image-carousel">
                      <div className="image-carousel-inner">
                        {getCurrentImages().map((image, index) => (
                          <div key={index} className="carousel-image-item">
                            <div className="carousel-image-container">
                              <Image
                                src={image.src || "/placeholder.svg"}
                                alt={image.caption || bookPages[currentPage].title}
                                width={300}
                                height={200}
                                className="carousel-image"
                              />
                            </div>
                            {image.caption && <p className="carousel-image-caption">{image.caption}</p>}
                          </div>
                        ))}
                      </div>

                      {/* Carousel navigation */}
                      {getTotalImageSlides() > 1 && (
                        <div className="carousel-navigation">
                          <button
                            onClick={prevImageSlide}
                            className="carousel-nav-button prev"
                            aria-label="Previous images"
                          >
                            <ArrowLeft className="carousel-nav-icon" />
                          </button>

                          <div className="carousel-indicators">
                            {Array.from({ length: getTotalImageSlides() }).map((_, idx) => (
                              <span
                                key={idx}
                                className={`carousel-indicator ${currentImageSlide === idx ? "active" : ""}`}
                                onClick={() => setCurrentImageSlide(idx)}
                              />
                            ))}
                          </div>

                          <button
                            onClick={nextImageSlide}
                            className="carousel-nav-button next"
                            aria-label="Next images"
                          >
                            <ArrowRight className="carousel-nav-icon" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Text content with proper overflow handling */}
                    <div className="page-text-container max-h-48 overflow-y-auto">
                      <p className="page-text break-words">{bookPages[currentPage].text}</p>
                    </div>

                    <div className="page-number">{currentPage}</div>
                  </div>
                )}
              </div>

              {/* Page turning effect */}
              <div
                className={`page-turn-effect ${flipping ? "active" : ""} ${
                  flipDirection === "right" ? "right" : "left"
                }`}
              ></div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className={`nav-button prev ${currentPage === 0 ? "disabled" : ""}`}
            aria-label="Previous page"
          >
            <ChevronLeft className="nav-icon" />
          </button>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`nav-button next ${currentPage === totalPages - 1 ? "disabled" : ""}`}
            aria-label="Next page"
          >
            <ChevronRight className="nav-icon" />
          </button>
        </div>

        {/* Page indicators */}
        <div className="page-indicators">
          {bookPages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`page-indicator ${currentPage === index ? "active" : ""}`}
              aria-label={`Go to page ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  )
}