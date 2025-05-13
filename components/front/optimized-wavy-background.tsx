"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function OptimizedWavyBackground({
  children,
  className,
  containerClassName,
  colors = ["#0ea5e9", "#0284c7", "#0369a1"],
  backgroundFill = "transparent",
  blur = 10,
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  colors?: string[]
  backgroundFill?: string
  blur?: number
  waveOpacity?: number
  [key: string]: any
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const animationRef = useRef<number>(0)
  const isDarkMode = useRef<boolean>(false)
  const lastTime = useRef<number>(0)
  const frameRate = useRef<number>(30) // Limit to 30fps for better performance

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d", { alpha: true })
    if (!context) return

    contextRef.current = context

    // Setup initial canvas
    setupCanvas()

    // Throttled resize handler
    let resizeTimer: NodeJS.Timeout
    const throttledResize = () => {
      if (resizeTimer) return

      resizeTimer = setTimeout(() => {
        setupCanvas()
        resizeTimer = undefined as unknown as NodeJS.Timeout
      }, 200)
    }

    window.addEventListener("resize", throttledResize)

    // Check for dark mode
    const updateDarkMode = () => {
      isDarkMode.current = document.documentElement.classList.contains("dark")
    }

    updateDarkMode()
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateDarkMode()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => {
      window.removeEventListener("resize", throttledResize)
      clearTimeout(resizeTimer)
      observer.disconnect()
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const setupCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return

    const canvas = canvasRef.current
    const context = contextRef.current

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect()

    // Only resize if dimensions actually changed
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width
      canvas.height = rect.height

      // Start animation if not already running
      if (!animationRef.current) {
        lastTime.current = performance.now()
        animationRef.current = requestAnimationFrame(animate)
      }
    }
  }

  const animate = (time: number) => {
    if (!contextRef.current || !canvasRef.current) return

    // Throttle frame rate
    const elapsed = time - lastTime.current
    const fpsInterval = 1000 / frameRate.current

    if (elapsed < fpsInterval) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }

    lastTime.current = time - (elapsed % fpsInterval)

    const context = contextRef.current
    const canvas = canvasRef.current

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Fill background if specified
    if (backgroundFill !== "transparent") {
      context.fillStyle = backgroundFill
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Draw waves - simplified for better performance
    const speedFactor = 0.0005
    const baseColors = isDarkMode.current ? colors.map((c) => adjustColorBrightness(c, -30)) : colors

    baseColors.forEach((color, i) => {
      const waveHeight = canvas.height * 0.1
      const frequency = 0.005
      const phase = time * speedFactor + i * Math.PI * 0.5

      context.beginPath()
      context.moveTo(0, canvas.height * 0.5)

      // Use fewer points for better performance
      const step = Math.max(5, Math.floor(canvas.width / 100))
      for (let x = 0; x <= canvas.width; x += step) {
        const y = Math.sin(x * frequency + phase) * waveHeight + canvas.height * 0.5
        context.lineTo(x, y)
      }

      context.lineTo(canvas.width, canvas.height)
      context.lineTo(0, canvas.height)
      context.closePath()

      context.fillStyle = `${color}${Math.floor(waveOpacity * 255)
        .toString(16)
        .padStart(2, "0")}`
      context.fill()
    })

    // Apply blur if specified - but only once for performance
    if (blur > 0 && !context.filter) {
      context.filter = `blur(${blur}px)`
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  const adjustColorBrightness = (hex: string, percent: number) => {
    // Convert hex to RGB
    let r = Number.parseInt(hex.substring(1, 3), 16)
    let g = Number.parseInt(hex.substring(3, 5), 16)
    let b = Number.parseInt(hex.substring(5, 7), 16)

    // Adjust brightness
    r = Math.max(0, Math.min(255, r + percent))
    g = Math.max(0, Math.min(255, g + percent))
    b = Math.max(0, Math.min(255, b + percent))

    // Convert back to hex
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  return (
    <div className={cn("relative flex flex-col items-center justify-center overflow-hidden", containerClassName)}>
      <canvas ref={canvasRef} className={cn("absolute inset-0 z-0", className)} {...props} />
      {children}
    </div>
  )
}
