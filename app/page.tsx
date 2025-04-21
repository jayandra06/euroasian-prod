"use client"




import { BlurFade } from "@/components/magicui/blur-fade";
import { useEffect, useState } from "react";
import { NavigationProvider } from "@/components/front/Navigation";
import Header from "@/components/front/Header";
import { Hero } from "@/components/front/Hero";
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

export default function Home() {
  return (
    <>
 
      <LoggingProvider>
        <NavigationProvider>
          <AOSWrapper>
            <div className="flex flex-col min-h-screen dark relative">
           

              <Header />
            
              <main className="flex-grow">
                <Hero />
                <Toaster position="top-right" />
                <ShortCarousel />
                <PopularServices />
                <CoreFunctionality />
                <SellerCTA />
                <AboutUs />
              </main>
              <Footer />
            </div>
          </AOSWrapper>
        </NavigationProvider>
      </LoggingProvider>
    
    </>
  );
}
