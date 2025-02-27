'use client'
import React, { useEffect, useState } from 'react'
import { Globe, Upload, Settings, Headphones } from 'lucide-react'
import { Building2,Laptop2, Ship, DollarSign, Users } from 'lucide-react'
import { useNavigate } from './Navigation'
import { User2,ShoppingCart  } from 'lucide-react'


const steps = [
  {
    icon: <Upload className="h-8 w-8" />,
    title: "Upload Your Catalogue",
    description: "Share a detailed catalogue of your products, including specifications and pricing."
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Get Matched",
    description: "Our platform connects you with customers based on their specific needs and requirements."
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Expand Your Business",
    description: "Enjoy increased visibility and sales by partnering with us."
  }
]

export function PopularServices() {
  const navigate = useNavigate()
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Parallax background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/api/placeholder/1920/1080')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          transform: `translateY(${offset * 0.5}px)`,
          opacity: 0.15
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          As a Vendor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-cyan-500/10 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{
                backgroundImage: "url('/api/placeholder/800/600')",
                backgroundSize: 'cover',
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="text-cyan-400 mb-4 transform transition-transform duration-300 hover:scale-110">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-10 pt-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="text-center md:text-left space-y-6 pl-10">
            <div className="inline-block p-10 bg-cyan-900/20 rounded-full border border-cyan-500/10 transform transition-transform duration-300 hover:scale-105">
            <ShoppingCart  className="h-8 w-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">For Buyers</h2>
            <p className="text-gray-300 max-w-lg">
              Access our global network of verified maritime Vendors. Streamline your procurement
              process and find the best deals for your fleet.
            </p>
            {/* <button
              onClick={() => navigate('/maintenance')}
              className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 transition-colors duration-300"
            >
              Learn More
            </button> */}
          </div>
          <div className="text-center md:text-left space-y-6 pl-10">
            <div className="inline-block p-10 bg-cyan-900/20 rounded-full border border-cyan-500/10 transform transition-transform duration-300 hover:scale-105">
              <Settings  className="h-8 w-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">For Vendors</h2>
            <p className="text-gray-300 max-w-lg">
              Expand your reach in the maritime industry. Connect with shipowners and managers
              worldwide and grow your business.
            </p>
            {/* <button
              onClick={() => navigate('/maintenance')}
              className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 transition-colors duration-300"
            >
              Learn More
            </button> */}
          </div>
        </div>
      </div>
    </section>
  )
}

