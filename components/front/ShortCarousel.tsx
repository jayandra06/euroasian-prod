"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Modal } from "./Modal"

const carouselItems = [
  //   {
  //   title: "Quality Assurance",
  //   description: "We ensure all ship parts meet the highest industry standards, providing reliability and safety for your vessels.",
  //   bgImage: "https://www.mastercontrol.com/images/default-source/gxp-lifeline/20222/march/2020-bl-2020-qa-vs-qc_715x320.jpg?sfvrsn=c94e72cc_4"
  // },
  // {
  //   title: "Global Reach",
  //   description: "Our extensive network allows us to deliver parts to any port worldwide, minimizing downtime for your fleet.",
  //   bgImage: "https://www.shutterstock.com/image-photo/hand-reaching-out-touch-button-260nw-108771491.jpg"
  // },
  // // {
  // //   title: "Comprehensive Inventory",
  // //   description: "From engines to navigation equipment, we stock a wide range of parts to meet all your maritime needs.",
  // //   bgImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWGXWfTPFfVTp5ga8rnYRGBsgAzK-SQhwGg&s"
  // // },
  // {
  //   title: "Expert Support",
  //   description: "Our team of experienced professionals provides technical assistance and guidance for all your inquiries.",
  //   bgImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLksK7BiYyooFp3yHyFuTBNqNXOcgdGw6QVw&s"
  // },
  // {
  //   title: "24/7 Service",
  //   description: "We're always available to handle urgent requests, ensuring your operations run smoothly around the clock.",
  //   bgImage: "data:image/jpeg;base64,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"
  // }

  {
    title: "Quality Assurance",
    description: "We ensure all vendors meet the highest industry standards, providing reliability and safety for your vessels.",
    bgImage: "https://www.mastercontrol.com/images/default-source/gxp-lifeline/20222/march/2020-bl-2020-qa-vs-qc_715x320.jpg?sfvrsn=c94e72cc_4"
  },
  {
    title: "Global Reach",
    description: "Our extensive network of agents allows us to connect shipments at any port worldwide, minimizing downtime.",
    bgImage: "https://www.shutterstock.com/image-photo/hand-reaching-out-touch-button-260nw-108771491.jpg"
  },
  {
    title: "Expert Support",
    description: "Our team of experienced professionals provide technical assistance in real time and guidance for all your inquiries.",
    bgImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLksK7BiYyooFp3yHyFuTBNqNXOcgdGw6QVw&s"
  },
  {
    title: "24/7 Service",
    description: "We're always available to handle urgent requests, ensuring your operations run smoothly around the clock.",
    bgImage: "data:image/jpeg;base64,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"
  }
]

export function ShortCarousel() {
  const [currentIndex, setCurrentIndex] = useState(2)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
  }

  const nextModalSlide = () => {
    setModalIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
  }

  const prevModalSlide = () => {
    setModalIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isModalOpen) {
        nextSlide()
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [isModalOpen]) // Removed nextSlide from dependencies

  const handleCardClick = (index: number) => {
    setModalIndex(index)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="relative bg-black py-12 overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <button
            onClick={prevSlide}
            className="absolute left-4 z-30 p-2 rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700 focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 z-30 p-2 rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700 focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        <div className="flex items-center justify-center h-80">
          {carouselItems.map((item, index) => {
            const isCenter = index === currentIndex
            const isPrev = index === (currentIndex - 1 + carouselItems.length) % carouselItems.length
            const isNext = index === (currentIndex + 1) % carouselItems.length
            const isFarPrev = index === (currentIndex - 2 + carouselItems.length) % carouselItems.length
            const isFarNext = index === (currentIndex + 2) % carouselItems.length

            let xPosition = "0%"
            let zIndex = 0
            let opacity = 0

            if (isCenter) {
              xPosition = "0%"
              zIndex = 20
              opacity = 1
            } else if (isPrev) {
              xPosition = "-100%"
              zIndex = 10
              opacity = 0.6
            } else if (isNext) {
              xPosition = "100%"
              zIndex = 10
              opacity = 0.6
            } else if (isFarPrev) {
              xPosition = "-200%"
              zIndex = 5
              opacity = 0.3
            } else if (isFarNext) {
              xPosition = "200%"
              zIndex = 5
              opacity = 0.3
            }

            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className="absolute transition-all duration-700 ease-in-out flex flex-col items-center justify-center rounded-lg shadow-xl text-center w-72 cursor-pointer"
                style={{
                  width: "30rem",
                  transform: `translateX(${xPosition}) scale(${
                    isCenter ? 1.1 : isPrev || isNext ? 0.85 : isFarPrev || isFarNext ? 0.7 : 0.5
                  })`,
                  zIndex,
                  opacity,
                }}
                role="button"
                tabIndex={isCenter ? 0 : -1}
                aria-label={`View details for ${item.title}`}
              >
                <div
                  className="relative w-full h-64 rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: `url(${item.bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/70" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <h3
                      className={`text-2xl font-bold mb-3 transition-colors duration-500 ${
                        isCenter ? "text-white" : "text-gray-300"
                      } drop-shadow-lg`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-500 ${
                        isCenter ? "text-gray-200" : "text-gray-400"
                      } drop-shadow-lg`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="relative">
          <div
            className="relative h-[60vh] bg-cover bg-center rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${carouselItems[modalIndex].bgImage})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">{carouselItems[modalIndex].title}</h2>
              <p className="text-xl text-gray-200 max-w-2xl text-center drop-shadow-lg">
                {carouselItems[modalIndex].description}
              </p>
            </div>
            <div className="absolute inset-x-0 top-1/2 flex justify-between transform -translate-y-1/2 px-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevModalSlide()
                }}
                className="p-2 rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700 focus:outline-none"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextModalSlide()
                }}
                className="p-2 rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700 focus:outline-none"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

