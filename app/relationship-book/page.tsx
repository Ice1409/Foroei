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
      { title: "การพบกันครั้งแรก", page: 3 },
      { title: "เดทแรกของเรา", page: 4 },
      { title: "ช่วงเวลาพิเศษ", page: 5 },
      { title: "ทริปด้วยกัน", page: 6 },
      { title: "ความทรงจำที่ชอบ", page: 7 },
      { title: "เพลงของเรา", page: 8 },
      { title: "แผนในอนาคต", page: 9 },
      { title: "การฉลองครบรอบ", page: 10 },
      { title: "จดหมายรัก", page: 11 },
      { title: "มุขตลกส่วนตัว", page: 12 },
      { title: "ความฝันร่วมกัน", page: 13 },
    ],
  },
  {
    type: "content",
    title: "การพบกันครั้งแรก",
    date: "15 มกราคม 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "วันแรกที่เราได้พบกัน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ร้านกาแฟที่เราคุยกันเป็นครั้งแรก",
      },
    ],
    text: "นี่คือที่ที่เราได้พบกันครั้งแรก เป็นวันที่อากาศดีและแดดสวย เราเชื่อมต่อกันได้ทันที การสนทนาเป็นไปอย่างราบรื่นและเวลาดูเหมือนจะหยุดนิ่ง เราคุยกันหลายชั่วโมงที่ร้านกาแฟเล็กๆ แห่งนี้ และรู้สึกเหมือนเรารู้จักกันมานาน",
  },
  {
    type: "content",
    title: "เดทแรกของเรา",
    date: "1 กุมภาพันธ์ 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ร้านอาหารที่เราไปเดทกันครั้งแรก",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "เดินเล่นในสวนหลังอาหารเย็น",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ถ่ายรูปคู่กันครั้งแรก",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ของขวัญชิ้นเล็กๆ ที่ให้กัน",
      },
    ],
    text: "เดทแรกอย่างเป็นทางการของเราคือที่ร้านอาหารที่อบอุ่นในตัวเมือง เราคุยกันหลายชั่วโมงและไม่อยากให้ค่ำคืนนั้นจบลง หลังอาหารเย็น เราเดินเล่นในสวนสาธารณะใกล้ๆ และถ่ายรูปคู่กันเป็นครั้งแรก นี่คือช่วงเวลาที่ฉันรู้ว่ามีบางสิ่งที่พิเศษระหว่างเรา",
  },
  {
    type: "content",
    title: "ช่วงเวลาพิเศษ",
    date: "14 กุมภาพันธ์ 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ปิกนิกวันวาเลนไทน์ของเรา",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ของขวัญที่เราให้กันและกัน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ดอกไม้ที่ฉันให้เธอ",
      },
    ],
    text: "วันวาเลนไทน์เป็นวันที่น่าจดจำ การปิกนิกเซอร์ไพรส์ในสวนสาธารณะพร้อมอาหารโปรดของเราและเพลงที่เปิดอยู่เบาๆ สร้างความทรงจำที่จะอยู่ตลอดไป เราแลกของขวัญกันและใช้เวลาทั้งวันด้วยกัน เป็นวันวาเลนไทน์ที่พิเศษที่สุดเท่าที่เคยมีมา",
  },
  {
    type: "content",
    title: "ทริปด้วยกัน",
    date: "10 มีนาคม 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ชายหาดที่เราไปด้วยกันครั้งแรก",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ปราสาททรายที่เราสร้างด้วยกัน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "พระอาทิตย์ตกที่สวยงาม",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "อาหารทะเลมื้อพิเศษ",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "เปลือกหอยที่เก็บเป็นที่ระลึก",
      },
    ],
    text: "ทริปวันหยุดสุดสัปดาห์แรกของเราที่ชายหาด เราดูพระอาทิตย์ตก สร้างปราสาททราย และสัญญาว่าจะสร้างการผจญภัยอีกมากมายด้วยกัน เราเดินเล่นริมชายหาดในยามเย็น และนั่งคุยกันจนดึก เป็นช่วงเวลาที่เราได้รู้จักกันมากขึ้นและรู้สึกใกล้ชิดกันมากขึ้น",
  },
  {
    type: "content",
    title: "ความทรงจำที่ชอบ",
    date: "22 เมษายน 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "อาหารค่ำที่เราทำด้วยกัน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ของขวัญครบรอบสองเดือน",
      },
    ],
    text: "ฉลองครบรอบสองเดือนของเราด้วยอาหารค่ำที่ทำเองและแลกของขวัญเล็กๆ น้อยๆ การฉลองเล็กๆ เหล่านี้ทำให้ความสัมพันธ์ของเราพิเศษ เราใช้เวลาทั้งวันในการทำอาหารด้วยกัน และแม้จะมีความผิดพลาดเล็กน้อยในครัว แต่เราก็หัวเราะและสนุกไปด้วยกัน",
  },
  {
    type: "content",
    title: "เพลงของเรา",
    date: "15 พฤษภาคม 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ร้านกาแฟที่เราได้ยินเพลงของเราครั้งแรก",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "คอนเสิร์ตเล็กๆ ที่เราไปด้วยกัน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "เพลย์ลิสต์ที่เราสร้างร่วมกัน",
      },
    ],
    text: "เพลงที่เราได้ยินในร้านกาแฟวันนั้นกลายเป็นเพลงของเรา ทุกครั้งที่ได้ยินเพลงนี้ ทำให้นึกถึงช่วงเวลาพิเศษที่เราได้ใช้ร่วมกัน เราไปดูคอนเสิร์ตเล็กๆ ด้วยกันและได้ยินเพลงนี้อีกครั้ง เป็นช่วงเวลาที่มีเสน่ห์และน่าจดจำ",
  },
  {
    type: "content",
    title: "แผนในอนาคต",
    date: "10 มิถุนายน 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "แผนที่โลกที่เราวางแผนจะเที่ยวด้วยกัน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "สมุดบันทึกแผนอนาคตของเรา",
      },
    ],
    text: "เราวางแผนสำหรับอนาคตของเรา ทั้งการเดินทาง การศึกษา และความฝันที่เราอยากทำให้เป็นจริงด้วยกัน เป็นความรู้สึกที่วิเศษที่ได้มีใครสักคนที่มีเป้าหมายเดียวกัน เราเขียนแผนการเดินทางและความฝันลงในสมุดบันทึกเล่มพิเศษ และสัญญาว่าจะทำให้มันเป็นจริงทีละอย่าง",
  },
  {
    type: "content",
    title: "การฉลองครบรอบ",
    date: "22 มิถุนายน 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "สวนสนุกที่เราไปฉลองครบรอบ",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ไอศกรีมที่เรากินด้วยกัน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ของที่ระลึกจากสวนสนุก",
      },
    ],
    text: "ครบรอบสี่เดือนของเรา เราฉลองด้วยการไปเที่ยวสวนสนุกและกินไอศกรีมด้วยกัน บางครั้งความสุขก็มาจากช่วงเวลาเรียบง่ายที่เราได้ใช้ด้วยกัน เราเล่นเครื่องเล่นหลายอย่าง ถ่ายรูปตลกๆ และซื้อของที่ระลึกเล็กๆ น้อยๆ กลับบ้าน เป็นวันที่เต็มไปด้วยเสียงหัวเราะและความสุข",
  },
  {
    type: "content",
    title: "จดหมายรัก",
    date: "15 กรกฎาคม 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "จดหมายรักฉบับแรกของเรา",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "สถานที่ที่เราแลกจดหมายกัน",
      },
    ],
    text: "จดหมายรักฉบับแรกที่เราเขียนให้กัน เต็มไปด้วยความรู้สึกและความหวังสำหรับอนาคต เป็นสิ่งที่เราจะเก็บไว้ตลอดไป เราแลกจดหมายกันในสวนที่สงบและสวยงาม และอ่านจดหมายของกันและกันพร้อมกับความรู้สึกอบอุ่นในหัวใจ",
  },
  {
    type: "content",
    title: "มุขตลกส่วนตัว",
    date: "5 สิงหาคม 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ช่วงเวลาตลกๆ ของเรา",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ของเล่นตลกที่เราซื้อให้กัน",
      },
    ],
    text: "มุขตลกเฉพาะของเราที่คนอื่นอาจไม่เข้าใจ แต่ทำให้เราหัวเราะทุกครั้ง เป็นภาษาเฉพาะที่เราสร้างขึ้นมาด้วยกัน เรามีคำเฉพาะและท่าทางตลกๆ ที่มีความหมายพิเศษสำหรับเราสองคน และทุกครั้งที่เราใช้มัน เราจะหัวเราะจนท้องปวด",
  },
  {
    type: "content",
    title: "ความฝันร่วมกัน",
    date: "20 สิงหาคม 2568",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "ภาพวาดบ้านในฝันของเรา",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "สถานที่ที่เราอยากไปเที่ยวด้วยกัน",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        caption: "รายการความฝันที่เราเขียนร่วมกัน",
      },
    ],
    text: "ความฝันที่เราแบ่งปันกัน ทั้งเรื่องการเดินทาง บ้านในฝัน และชีวิตที่เราอยากสร้างด้วยกัน เป็นสิ่งที่ทำให้เรามีแรงบันดาลใจทุกวัน เราวาดภาพบ้านในฝันของเรา เขียนรายการสถานที่ที่อยากไปเที่ยวด้วยกัน และสร้างรายการความฝันที่เราจะทำให้เป็นจริงด้วยกัน",
  },
  {
    type: "last",
    title: "The End",
    text: "ความรักของเรายังคงดำเนินต่อไป...",
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

                    <p className="page-text">{bookPages[currentPage].text}</p>

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