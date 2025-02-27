import React from 'react'

const brands = [
  "Siemens", "ABB", "Volvo Penta", "Mitsubishi", "Wartsila", 
  "Cummins", "Alfa Laval", "Raytheon", "Danfoss", "Atlas Copco"
]

export function Brands() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Trusted by Top Brands</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {brands.map((brand, index) => (
            <div 
              key={index}
              className="h-20 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-xl font-semibold text-gray-600">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

