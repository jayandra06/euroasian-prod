"use client"

import { useState, useEffect } from "react"
import { User, Menu, X, ChevronDown } from "lucide-react"
import { useNavigate } from "./Navigation"
import Link from "next/link"
// import {AboutUs} from "./AboutUs.tsx"
// import {ContactForm} from "./ContactForm.tsx"


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const navigate = useNavigate()

  // Sample categories data - replace with your actual categories
  const categories = [
    {
      name: "Engine Parts",
      subcategories: ["Pistons", "Crankshafts", "Cylinders", "Valves", "Fuel Injectors"],
    },
    {
      name: "Navigation Equipment",
      subcategories: ["Radar Systems", "GPS Devices", "Compasses", "Charts", "Sonar Equipment"],
    },
    {
      name: "Deck Equipment",
      subcategories: ["Winches", "Anchors", "Chains", "Ropes", "Fenders"],
    },
    {
      name: "Safety Equipment",
      subcategories: ["Life Rafts", "Fire Extinguishers", "Life Jackets", "Emergency Signals"],
    },
    {
      name: "Electrical Systems",
      subcategories: ["Batteries", "Generators", "Lighting", "Wiring", "Control Panels"],
    },
    {
      name: "Hull Equipment",
      subcategories: ["Propellers", "Rudders", "Hull Plates", "Anodes", "Shaft Systems"],
    },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLoginOpen && !(event.target as Element).closest(".login-dropdown")) {
        setIsLoginOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isLoginOpen])

  return (
<header className="bg-black shadow-md fixed w-full top-0 z-50">
<div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 ml-2" onClick={() => navigate("/")} role="button">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design-J0WPGEf7CFqGMh5nyQUWW4o8AyW4i0.png"
              alt="Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Mobile menu button and login dropdown */}
          <div className="md:hidden flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                className="flex items-center space-x-2 text-cyan-100 hover:text-cyan-400"
              >
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4" />
              </button>

              {isLoginOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <Link href="/sign-up"
                    className="block px-4 py-2 text-sm text-cyan-100 hover:bg-gray-700 w-full text-left"
                  >
                    Buy With Us
                  </Link>
                  <Link href="/dashboard/become-a-seller/"
                    className="block px-4 py-2 text-sm text-cyan-100 hover:bg-gray-700 w-full text-left"
                  >
                    Sell With Us
                  </Link>
                  <Link
                    href={"/sign-in-admin"}
                    className="block px-4 py-2 text-sm text-cyan-100 hover:bg-gray-700 w-full text-left"
                  >
                    Admin Login
                  </Link>
                </div>
              )}
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <button onClick={() => navigate("/maintenance")} className="text-cyan-100 hover:text-cyan-400">
              For Buyers
            </button>
            <button onClick={() => navigate("/maintenance")} className="text-cyan-100 hover:text-cyan-400">
              For Vendors
            </button>
            <Link
              
              href="/about"
              className="text-cyan-100 hover:text-cyan-400"
            >
              About
            </Link>
            <Link href="/contact" className="text-cyan-100 hover:text-cyan-400">
              Contact Us
            </Link>
            <button onClick={() => navigate("/maintenance")} className="text-cyan-100 hover:text-cyan-400">
              News and Insights
            </button>
          </nav>

          {/* Desktop login dropdown */}
          <div className="hidden md:relative md:flex">
            <Link href="/sign-in"
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              className="flex items-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 login-dropdown"
            >
              <User className="h-4 w-4" />
              <span>Login</span>
              <ChevronDown className="h-4 w-4" />
            </Link>

            {isLoginOpen && (
              <div className="absolute right-0 mt-12 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 login-dropdown">
                <Link href="/sign-up"
                    className="block px-4 py-2 text-sm text-cyan-100 hover:bg-gray-700 w-full text-left"
                  >
                    Buy With Us
                  </Link>
                  <Link href="/dashboard/become-a-seller/"
                    className="block px-4 py-2 text-sm text-cyan-100 hover:bg-gray-700 w-full text-left"
                  >
                    Sell With Us
                  </Link>
                  <Link
                    href={"/sign-in-admin"}
                    className="block px-4 py-2 text-sm text-cyan-100 hover:bg-gray-700 w-full text-left"
                  >
                    Admin Login
                  </Link>
              </div>
            )}
          </div>
        </div>

        {/* Categories Mega Menu */}
        {isCategoriesOpen && (
          <div className="hidden md:block absolute left-0 w-full bg-white shadow-lg" style={{ height: "63vh" }}>
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-3 gap-8">
                {categories.map((category) => (
                  <div key={category.name} className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-900">{category.name}</h3>
                    <ul className="space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory}>
                          <button
                            onClick={() => navigate("/maintenance")}
                            className="text-gray-600 hover:text-blue-600"
                          >
                            {subcategory}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <button onClick={() => navigate("/maintenance")} className="text-cyan-100 hover:text-cyan-400 py-2">
                For Buyers
              </button>
              <button onClick={() => navigate("/maintenance")} className="text-cyan-100 hover:text-cyan-400 py-2">
                For Vendors
              </button>
              <button onClick={() => navigate("/maintenance")} className="text-cyan-100 hover:text-cyan-400 py-2">
                Customers
              </button>
              <Link href="/about" className="text-cyan-100 hover:text-cyan-400 py-2 text-center">
                About
              </Link>
              <Link href="/contact" className="text-cyan-100 hover:text-cyan-400 py-2 text-center">
                Contact Us
              </Link>
              <button onClick={() => navigate("/maintenance")} className="text-cyan-100 hover:text-cyan-400 py-2">
                News and Insights
              </button>
              <Link
                href="/sign-in"
                className="flex items-center justify-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

