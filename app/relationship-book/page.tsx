"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample data for the book pages
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
      { title: "เดทแรกของเรา", page: 5 },
      { title: "ช่วงเวลาพิเศษ", page: 7 },
      { title: "ทริปด้วยกัน", page: 9 },
    ],
  },
  {
    type: "toc",
    title: "สารบัญ (ต่อ)",
    items: [
      { title: "ความทรงจำที่ชอบ", page: 11 },
      { title: "เพลงของเรา", page: 13 },
      { title: "แผนในอนาคต", page: 15 },
      { title: "การฉลองครบรอบ", page: 17 },
      { title: "จดหมายรัก", page: 19 },
      { title: "มุขตลกส่วนตัว", page: 21 },
      { title: "ความฝันร่วมกัน", page: 23 },
    ],
  },
  {
    type: "content",
    title: "การพบกันครั้งแรก",
    date: "15 มกราคม 2568",
    image: "/placeholder.svg?height=400&width=600",
    text: "นี่คือที่ที่เราได้พบกันครั้งแรก เป็นวันที่อากาศดีและแดดสวย เราเชื่อมต่อกันได้ทันที การสนทนาเป็นไปอย่างราบรื่นและเวลาดูเหมือนจะหยุดนิ่ง",
  },
  {
    type: "content",
    title: "เดทแรกของเรา",
    date: "1 กุมภาพันธ์ 2568",
    image: "/placeholder.svg?height=400&width=600",
    text: "เดทแรกอย่างเป็นทางการของเราคือที่ร้านอาหารที่อบอุ่นในตัวเมือง เราคุยกันหลายชั่วโมงและไม่อยากให้ค่ำคืนนั้นจบลง นี่คือช่วงเวลาที่ฉันรู้ว่ามีบางสิ่งที่พิเศษระหว่างเรา",
  },
  {
    type: "content",
    title: "ช่วงเวลาพิเศษ",
    date: "14 กุมภาพันธ์ 2568",
    image: "/placeholder.svg?height=400&width=600",
    text: "วันวาเลนไทน์เป็นวันที่น่าจดจำ การปิกนิกเซอร์ไพรส์ในสวนสาธารณะพร้อมอาหารโปรดของเราและเพลงที่เปิดอยู่เบาๆ สร้างความทรงจำที่จะอยู่ตลอดไป",
  },
  {
    type: "content",
    title: "ทริปด้วยกัน",
    date: "10 มีนาคม 2568",
    image: "/placeholder.svg?height=400&width=600",
    text: "ทริปวันหยุดสุดสัปดาห์แรกของเราที่ชายหาด เราดูพระอาทิตย์ตก สร้างปราสาททราย และสัญญาว่าจะสร้างการผจญภัยอีกมากมายด้วยกัน",
  },
  {
    type: "content",
    title: "การฉลอง",
    date: "22 เมษายน 2568",
    image: "/placeholder.svg?height=400&width=600",
    text: "ฉลองครบรอบสองเดือนของเราด้วยอาหารค่ำที่ทำเองและแลกของขวัญเล็กๆ น้อยๆ การฉลองเล็กๆ เหล่านี้ทำให้ความสัมพันธ์ของเราพิเศษ",
  },
]

export default function RelationshipBook() {
  const [currentPage, setCurrentPage] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState("right")
  const bookRef = useRef<HTMLDivElement>(null)

  const totalPages = bookPages.length

  const goToNextPage = () => {
    if (currentPage < totalPages - 1 && !flipping) {
      setFlipDirection("right")
      setFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
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
        setFlipping(false)
      }, 600)
    }
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
    <div className="min-h-screen bg-[#f8e8e8] py-8 px-4 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-fixed bg-center">
      <div className="max-w-6xl mx-auto">
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
          {/* Book wrapper */}
          <div className="book-wrapper">
            {/* Book spine */}
            <div className="book-spine"></div>

            {/* Book */}
            <div
              ref={bookRef}
              className={`book ${flipping ? "flipping" : ""} ${flipDirection === "right" ? "flip-right" : "flip-left"}`}
            >
              {/* Left page (visible when book is open) */}
              <div className="book-page left-page">
                {currentPage > 0 && (
                  <div className="page-content">
                    {currentPage === 1 && (
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
                      </div>
                    )}

                    {currentPage === 2 && (
                      <div className="toc-page">
                        <h2 className="page-title">{bookPages[2].title}</h2>
                        <ul className="toc-list">
                        {bookPages[2]?.items?.map((item, index) => (
                            <li key={index} className="toc-item">
                              <span className="toc-title">{item.title}</span>
                              <div className="toc-dots"></div>
                              <button onClick={() => goToPage(item.page - 1)} className="toc-page-number">
                                {item.page}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentPage > 2 && (
                      <div className="content-page">
                        <h2 className="page-title">{bookPages[currentPage].title}</h2>
                        <p className="page-date">{bookPages[currentPage].date}</p>

                        <div className="page-image-container">
                          <Image
                            src={bookPages[currentPage].image || "/placeholder.svg"}
                            alt={bookPages[currentPage].title}
                            width={400}
                            height={250}
                            className="page-image"
                          />
                        </div>

                        <p className="page-text">{bookPages[currentPage].text}</p>

                        <div className="page-number">{currentPage * 2 - 1}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right page */}
              <div className="book-page right-page">
                {currentPage === 0 ? (
                  <div className="cover-page">
                    <h1 className="cover-title">{bookPages[0].title}</h1>
                    <div className="cover-heart">❤️</div>
                    <h2 className="cover-subtitle">{bookPages[0].subtitle}</h2>
                    <p className="cover-date">เริ่มต้นเมื่อ 22 กุมภาพันธ์ 2568</p>
                  </div>
                ) : (
                  <div className="page-content">
                    {currentPage < totalPages - 1 ? (
                      <div className="content-page next-page">
                        <h2 className="page-title">{bookPages[currentPage + 1]?.title}</h2>
                        {bookPages[currentPage + 1]?.type === "content" && (
                          <>
                            <p className="page-date">{bookPages[currentPage + 1]?.date}</p>

                            <div className="page-image-container">
                              <Image
                                src={bookPages[currentPage + 1]?.image || "/placeholder.svg"}
                                alt={bookPages[currentPage + 1]?.title || ""}
                                width={400}
                                height={250}
                                className="page-image"
                              />
                            </div>

                            <p className="page-text">{bookPages[currentPage + 1]?.text}</p>
                          </>
                        )}

                        {bookPages[currentPage + 1]?.type === "toc" && (
                          <ul className="toc-list">
                            {bookPages[currentPage + 1]?.items?.map((item, index) => (
                              <li key={index} className="toc-item">
                                <span className="toc-title">{item.title}</span>
                                <div className="toc-dots"></div>
                                <button onClick={() => goToPage(item.page - 1)} className="toc-page-number">
                                  {item.page}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="page-number">{(currentPage + 1) * 2}</div>
                      </div>
                    ) : (
                      <div className="last-page">
                        <h2 className="last-page-title">The End</h2>
                        <p className="last-page-text">ความรักของเรายังคงดำเนินต่อไป...</p>
                        <div className="last-page-heart">❤️</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Page turning effect */}
              <div
                className={`page-turn-effect ${flipping ? "active" : ""} ${flipDirection === "right" ? "right" : "left"}`}
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

