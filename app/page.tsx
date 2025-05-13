"use client"




import { BlurFade } from "@/components/magicui/blur-fade";
import { useEffect, useState } from "react";
import { NavigationProvider } from "@/components/front/Navigation";
import Header from "@/components/front/Header";
// import { Hero } from "@/components/front/Hero";
import { PopularServices } from "@/components/front/PopularServices";
import { Brands } from "@/components/front/Brands";
import { SellerCTA } from "@/components/front/SellerCTA";
import AboutUs from "@/components/front/AboutUs";
import Footer from "@/components/front/Footer";
import AOSWrapper from "@/components/front/AOSWrapper";
import { ShortCarousel } from "@/components/front/ShortCarousel";
import { BuyersCTA } from "@/components/front/BuyersCTA";
import { CoreFunctionality } from "@/components/front/CoreFunctionality";
import { LoggingProvider } from "@/components/front/LoggingProvider";
import { Toaster } from 'react-hot-toast';
import Hero from "@/components/front/Hero";
import AboutFront from "@/components/front/AboutFront";
import Modules from "@/components/front/Modules";
import ShipTracking from "@/components/front/ShipTracking";
import StakeHolder from "@/components/front/StakeHolder";
import RequestDemo from "@/components/front/RequestDemo";
import OurTeam from "@/components/front/OurTeam";
import FooterFront from "@/components/front/FooterFront";
// import  About  from "@/components/front/";

const preloadImages = ["/maritime-control-room.webp", "/maritime-map.webp", "/wave-pattern.webp"]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Animation on scroll with Intersection Observer
  useEffect(() => {
    setMounted(true)

    // Preload critical images
    const imagePromises = preloadImages.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = src
        img.onload = resolve
        img.onerror = reject
      })
    })

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true)) // Still set to true even if some fail

    // Use IntersectionObserver for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    // Delay observer attachment for better initial load performance
    const timer = setTimeout(() => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.observe(el)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  // Smooth scroll for navigation links
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Adjust for header height
        behavior: "smooth",
      })
    }
    // Close mobile menu if open
    setMobileMenuOpen(false)
  }

  if (!mounted) return null
  return (
    <>
 
      <LoggingProvider>
        <NavigationProvider>
          <AOSWrapper>
            <div className="flex flex-col min-h-screen">
           

              <Header />
            
              <main className="flex-1">
                <Hero />
                <Toaster position="top-right" />
                {/* <ShortCarousel /> */}
                {/* <PopularServices /> */}
                {/* <About/> */}
                <AboutFront/>
                <Modules/>
                <ShipTracking/>
                <StakeHolder/>
                <RequestDemo/>
                <OurTeam/>
                <FooterFront/>
                {/* <CoreFunctionality /> */}
                {/* <SellerCTA /> */}
                {/* <AboutUs /> */}
              </main>
              {/* <Footer /> */}
            </div>
          </AOSWrapper>
        </NavigationProvider>
      </LoggingProvider>
    
    </>
  );
}
