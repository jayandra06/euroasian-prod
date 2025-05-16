"use client"

import { useEffect, useRef, useState } from "react"
import { Ship } from "lucide-react"

export function OptimizedShipAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const shipRef = useRef<HTMLDivElement>(null)
  const isDarkMode = useRef<boolean>(false)
  const animationFrameId = useRef<number>(0)
  const lastTime = useRef<number>(0)
  const frameRate = useRef<number>(30) // Limit to 30fps for better performance

  useEffect(() => {
    // Use IntersectionObserver to only animate when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          } else {
            setIsVisible(false)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    // Check for dark mode
    const updateDarkMode = () => {
      isDarkMode.current = document.documentElement.classList.contains("dark")
    }

    updateDarkMode()
    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateDarkMode()
        }
      })
    })

    themeObserver.observe(document.documentElement, { attributes: true })

    return () => {
      observer.disconnect()
      themeObserver.disconnect()
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  // Only run animation when component is visible
  useEffect(() => {
    if (isVisible) {
      lastTime.current = performance.now()
      animationFrameId.current = requestAnimationFrame(animateShip)
    } else {
      cancelAnimationFrame(animationFrameId.current)
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [isVisible])

  const animateShip = (time: number) => {
    if (!shipRef.current || !containerRef.current) return

    // Throttle frame rate
    const elapsed = time - lastTime.current
    const fpsInterval = 1000 / frameRate.current

    if (elapsed < fpsInterval) {
      animationFrameId.current = requestAnimationFrame(animateShip)
      return
    }

    lastTime.current = time - (elapsed % fpsInterval)

    const container = containerRef.current
    const ship = shipRef.current

    // Calculate ship position based on container size
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    // Simple sine wave motion for ship
    const shipX = (Math.sin(time * 0.0005) + 1) * (containerWidth * 0.4) + containerWidth * 0.1
    const shipY = containerHeight * 0.55 + Math.sin(time * 0.001) * 5

    // Use transform for better performance
    ship.style.transform = `translate(${shipX}px, ${shipY}px) rotate(${Math.sin(time * 0.0005) * 5}deg)`

    animationFrameId.current = requestAnimationFrame(animateShip)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-b from-sky-100 to-sky-200 dark:from-slate-900 dark:to-slate-800 overflow-hidden"
    >
      {/* Static water background with CSS */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-sky-300/30 dark:bg-sky-900/30"></div>

      {/* CSS-based waves for better performance */}
      <div className="absolute inset-x-0 bottom-0 h-20">
        <div className="absolute inset-0 bg-sky-300/40 dark:bg-sky-900/40 animate-[wave_7s_ease-in-out_infinite]"></div>
        <div
          className="absolute inset-0 bg-sky-300/30 dark:bg-sky-900/30 animate-[wave_9s_ease-in-out_infinite_reverse]"
          style={{ animationDelay: "-3s" }}
        ></div>
      </div>

      {/* Interactive ship */}
      <div
        ref={shipRef}
        className="absolute top-0 left-0 transition-transform"
        style={{ transform: "translate(50%, 50%)" }}
      >
        <div className="relative">
          <Ship className="h-16 w-16 text-primary" />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-primary/10 rounded-full blur-md"></div>
        </div>
      </div>

      {/* Clouds - static for better performance */}
      <div className="absolute top-[10%] left-[10%] w-20 h-8 bg-white dark:bg-white/10 rounded-full"></div>
      <div className="absolute top-[15%] left-[15%] w-32 h-10 bg-white dark:bg-white/10 rounded-full"></div>
      <div className="absolute top-[8%] left-[60%] w-24 h-6 bg-white dark:bg-white/10 rounded-full"></div>
      <div className="absolute top-[20%] left-[80%] w-16 h-8 bg-white dark:bg-white/10 rounded-full"></div>

      {/* Sun/Moon */}
      <div className="absolute top-[15%] right-[15%] w-16 h-16 rounded-full bg-amber-300 dark:bg-slate-300 opacity-80 dark:opacity-30 blur-sm"></div>
    </div>
  )
}
