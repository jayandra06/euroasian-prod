// "use client"
// import Link from "next/link"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { Ship, Anchor, CheckCircle, ArrowRight, ShieldCheck, Clock, DollarSign, Users, Menu } from "lucide-react"
// import { ModeToggle } from "@/components/ModeToggle"

// export default function LandingPage() {
//   const [isOpen, setIsOpen] = useState(false)

//   const NavItems = () => (
//     <>
//       <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
//         Home
//       </Link>
//       <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
//         About
//       </Link>
//       <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
//         Services
//       </Link>
//       <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
//         Contact
//       </Link>
//     </>
//   )

//   return (
//     <div className="flex flex-col min-h-screen">
//       <header className="px-4 lg:px-6 h-14 flex items-center">
//         <Link className="flex items-center justify-center" href="#">
//           <span className="ml-2 text-2xl font-black text-gray-900 dark:text-zinc-50">EUROASIANN</span>
//         </Link>
//         <div className="ml-auto flex items-center gap-4">
//           <nav className="hidden md:flex gap-4 sm:gap-6">
//             <NavItems />
//           </nav>
//           <div className="hidden md:flex gap-2">
//             <Link href={"/sign-in"}>
//               <Button variant="outline" size="sm">
//                 Log in
//               </Button>
//             </Link>
//             <Link href={"/sign-up"}>
//               <Button size="sm">Sign up</Button>
//             </Link>
//           </div>
//           <ModeToggle />
//           <Sheet open={isOpen} onOpenChange={setIsOpen}>
//             <SheetTrigger asChild>
//               <Button variant="outline" size="icon" className="md:hidden">
//                 <Menu className="h-6 w-6" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left">
//               <nav className="flex flex-col gap-4">
//                 <NavItems />
//                 <Link href={"/sign-in"}>
//                   <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
//                     Log in
//                   </Button>
//                 </Link>
//                 <Link href={"/sign-in"}>
//                   <Button className="w-full" onClick={() => setIsOpen(false)}>
//                     Sign up
//                   </Button>
//                 </Link>
//               </nav>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </header>
//       <main className="flex-1">
//         <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-50 dark:bg-zinc-900">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
//                   Your Gateway to Ship & Port Parts
//                 </h1>
//                 <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-300">
//                   EUROASIANN connects you with top vendors for all your maritime equipment needs. Fast, efficient, and
//                   reliable.
//                 </p>
//               </div>
//               <div className="w-full max-w-sm space-y-2">
//                 <Button className="w-full text-lg" size="lg">
//                   Get Started
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-zinc-950">
//           <div className="container px-4 md:px-6">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose Us</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//               <div className="flex flex-col items-center text-center">
//                 <div className="rounded-full bg-blue-100 p-3 mb-4">
//                   <ShieldCheck className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
//                 <p className="text-gray-500">We ensure all parts meet the highest industry standards.</p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="rounded-full bg-blue-100 p-3 mb-4">
//                   <Clock className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">Fast Turnaround</h3>
//                 <p className="text-gray-500">Quick processing and delivery to minimize downtime.</p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="rounded-full bg-blue-100 p-3 mb-4">
//                   <DollarSign className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">Competitive Pricing</h3>
//                 <p className="text-gray-500">Access to a wide network of vendors for the best prices.</p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="rounded-full bg-blue-100 p-3 mb-4">
//                   <Users className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">Expert Support</h3>
//                 <p className="text-gray-500">Our team of maritime experts is always ready to assist you.</p>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-zinc-900">
//           <div className="container px-4 md:px-6">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="flex flex-col items-center text-center">
//                 <div className="rounded-full bg-blue-100 p-3 mb-4">
//                   <Ship className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">Request Parts</h3>
//                 <p className="text-gray-500">Easily request the ship or port parts you need through our platform.</p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="rounded-full bg-blue-100 p-3 mb-4">
//                   <Anchor className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">Admin Processing</h3>
//                 <p className="text-gray-500">
//                   Our admin team quickly processes your request and reaches out to our network of vendors.
//                 </p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="rounded-full bg-blue-100 p-3 mb-4">
//                   <CheckCircle className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">Vendor Matching</h3>
//                 <p className="text-gray-500">
//                   We match you with the best vendors, ensuring competitive prices and quality parts.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
//                 <p className="mx-auto max-w-[600px] text-blue-100 md:text-xl">
//                   Join EUROASIANN today and experience seamless procurement of ship and port parts.
//                 </p>
//               </div>
//               <div className="w-full max-w-sm space-y-2">
//                 <Button className="w-full bg-white text-blue-600 hover:bg-blue-50" size="lg">
//                   Get Started Now
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-zinc-900">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sell With Us</h2>
//                 <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
//                   Are you a vendor of ship or port parts? Join our network and expand your reach.
//                 </p>
//               </div>
//               <div className="w-full max-w-sm space-y-2">
//                 <Button className="w-full" variant="outline" size="lg">
//                   Become a Vendor
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
//         <p className="text-xs text-gray-500">© 2024 EUROASIANN. All rights reserved.</p>
//         <nav className="sm:ml-auto flex gap-4 sm:gap-6">
//           <Link className="text-xs hover:underline underline-offset-4" href="#">
//             Terms of Service
//           </Link>
//           <Link className="text-xs hover:underline underline-offset-4" href="#">
//             Privacy
//           </Link>
//         </nav>
//       </footer>
//     </div>
//   )
// }



"use client";
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
