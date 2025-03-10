"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "./Navigation"

export function Hero() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    setIsVisible(true)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative h-[700px] flex items-center overflow-hidden">
     <div
  className="absolute inset-0 bg-cover bg-[position:80%] md:bg-center lg:bg-[position:50%]"
  style={{
    backgroundImage: `url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Optimizing%20Fleet%20Efficiency%20Through%20Smart%20Procurement%20(3)-To9EUcE2VIEohMwiNu5yffjbuds7Yw.png")`,
    transform: `translateY(${scrollY * 0.5}px)`,
    transition: "transform 0.1s ease-out",
  }}
/>
      <div
        className={`relative container mx-auto px-6 transition-all duration-1000 transform ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        {/* <div className="max-w-2xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-lg">
            POWER YOUR MARITIME SUCCESS
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-cyan-400">
            Join a Global Network of Vessels for Seamless Ship Spare Supply!
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/request-demo")}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              Request Demo
            </button>
          </div>
          <p className="text-xl md:text-2xl text-gray-300">
            Streamline your marine procurement process with precision, innovation, and global reach.
          </p>
        </div> */}
         <div className="max-w-2xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-lg">
            POWER YOUR MARITIME SUCCESS
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-cyan-400">
            Join a Global Network of Vessel Managers / Owners and Vendors!
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/request-demo")}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              Request Demo
            </button>
          </div>
          <p className="text-xl md:text-2xl text-gray-300">
          Streamline your marine procurement process with precision & innovation.
          </p>
        </div>

      </div>
    </div>
  )
}

