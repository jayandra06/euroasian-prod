// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "./Navigation"
// import { Button } from "../ui/button"
// import { ArrowRightFromLine } from "lucide-react"
// import { OptimizedWavyBackground } from "./optimized-wavy-background"
// import { OptimizedShipAnimation } from "./optimized-ship-animation"

// export function Hero() {
//   const navigate = useNavigate()
//   const [scrollY, setScrollY] = useState(0)
//   const [isVisible, setIsVisible] = useState(false)

//   // useEffect(() => {
//   //   const handleScroll = () => {
//   //     setScrollY(window.scrollY)
//   //   }

//   //   setIsVisible(true)
//   //   window.addEventListener("scroll", handleScroll)
//   //   return () => window.removeEventListener("scroll", handleScroll)
//   // }, [])

//   return (
//    <div className="relative h-[700px] flex items-center overflow-hidden">

//      {/* <div
//   className="absolute inset-0 bg-cover bg-[position:80%] md:bg-center lg:bg-[position:50%]"
//   style={{
//     backgroundImage: `url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Optimizing%20Fleet%20Efficiency%20Through%20Smart%20Procurement%20(3)-To9EUcE2VIEohMwiNu5yffjbuds7Yw.png")`,
//     transform: `translateY(${scrollY * 0.5}px)`,
//     transition: "transform 0.1s ease-out",
//   }}
// /> */}
//       <div
//         className={`relative container mx-auto px-6 transition-all duration-1000 transform ${
//           isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
//         }`}
//       >
//         {/* <div className="max-w-2xl space-y-8">
//           <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-lg">
//             POWER YOUR MARITIME SUCCESS
//           </h1>
//           <h2 className="text-3xl md:text-4xl font-bold leading-tight text-cyan-400">
//             Join a Global Network of Vessels for Seamless Ship Spare Supply!
//           </h2>
//           <div className="flex space-x-4">
//             <button
//               onClick={() => navigate("/request-demo")}
//               className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1"
//             >
//               Request Demo
//             </button>
//           </div>
//           <p className="text-xl md:text-2xl text-gray-300">
//             Streamline your marine procurement process with precision, innovation, and global reach.
//           </p>
//         </div> */}
          

//       </div>
//     </div>
//   )
// }

import React from 'react'
import { OptimizedWavyBackground } from './optimized-wavy-background'

import { ArrowRight } from 'lucide-react'
import { OptimizedShipAnimation } from './optimized-ship-animation'
import { Button } from '../ui/button'

const Hero = () => {
  return (
    <div>
      <section className="relative overflow-hidden py-20 md:py-32">
          <OptimizedWavyBackground className="absolute inset-0 z-0" />
          <div className="container relative z-10 flex flex-col items-center text-center">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
              Maritime ERP Solution
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:max-w-4xl">
              The Future of Maritime Operations – All in One ERP Platform
            </h1>
            <p className="mt-6 max-w-[42rem] text-muted-foreground sm:text-xl">
              Streamline your maritime operations with our comprehensive cloud-based ship management solution.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="group">
                Request a Demo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Explore Features
              </Button>
            </div>

            {/* Optimized Ship Animation */}
            <div className="mt-16 w-full max-w-5xl relative h-[400px] rounded-lg border bg-background/50 shadow-lg backdrop-blur overflow-hidden">
              <OptimizedShipAnimation />
            </div>
          </div>
        </section>
    </div>
  )
}

export default Hero

