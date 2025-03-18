"use client"

import type React from "react"
import { useEffect } from "react"
import { animateScroll as scroll } from "react-scroll"

interface AOSWrapperProps {
  children: React.ReactNode
}

const AOSWrapper: React.FC<AOSWrapperProps> = ({ children }) => {
  useEffect(() => {
    //This is a simple alternative to AOS.  It uses react-scroll to smoothly scroll to an element.  You will need to adjust selectors to match your needs.
    scroll.scrollTo(0)
  }, [])

  return <>{children}</>
}

export default AOSWrapper

