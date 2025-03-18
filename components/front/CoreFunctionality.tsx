
"use client"

import { Database, Search, Link, Brain, ArrowRightLeft } from "lucide-react"

export function CoreFunctionality() {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 py-1">
            Highlight of our System's Core Functionality
          </h2>
          <p className="text-2xl font-semibold text-white mb-4">
            At Euroasiann, we've developed an intelligent system designed to<br/> bridge the gap between equipment, spares,
            and vendors. 
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Database Integration */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl">
            <div className="bg-cyan-500/10 p-3 rounded-lg w-fit mb-6">
              <Database className="h-6 w-6 text-cyan-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-4">Integration with your ERP</h4>
            {/* <p className="text-gray-300">
              Our system maintains a vast database of equipment and their corresponding part numbers and dimensions with
              photos and datasheets, ensuring every spare is correctly identified and matched to its equipment.
            </p> */}
          </div>

          {/* Smart Search */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 hover:shadow-2xl rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300">
            <div className="bg-cyan-500/10 p-3 rounded-lg w-fit mb-6">
              <Search className="h-6 w-6 text-cyan-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-4">Smart Search Functionality</h4>
            {/* <p className="text-gray-300">
              Users can easily search by part number, equipment name, or category, instantly accessing detailed
              information and compatibility with equipment and sub equipment details.
            </p> */}
          </div>

          {/* Vendor Connection */}
          {/* <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300">
            <div className="bg-cyan-500/10 p-3 rounded-lg w-fit mb-6">
              <Link className="h-6 w-6 text-cyan-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-4">Vendor Connection</h4>
            <p className="text-gray-300">
              Once the spare is identified, our platform connects it to the vendors who supply it, presenting users with
              options based on availability, pricing, and location.
            </p>
          </div> */}

          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 hover:shadow-2xl rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300">
            <div className="bg-cyan-500/10 p-3 rounded-lg w-fit mb-6">
              <Brain className="h-6 w-6 text-cyan-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-4">Ai driven recommendations combined with our expert analysis.</h4>
            {/* <p className="text-gray-300">
              By analyzing historical data and equipment specifications, our system provides tailored suggestions for
              additional spares or replacements to maintain operational efficiency.
            </p> */}
          </div>

          {/* Streamlined Transactions */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 hover:shadow-2xl rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300">
            <div className="bg-cyan-500/10 p-3 rounded-lg w-fit mb-6">
              <ArrowRightLeft className="h-6 w-6 text-cyan-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-4">Streamlined Transactions</h4>
            {/* <p className="text-gray-300">
              From identifying parts to purchasing, the entire process is seamless, allowing vendors to showcase their
              inventory and ship managers to source with confidence.
            </p> */}
          </div>
        </div>

        {/* Why This Matters Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-white mb-6">Why This Matters</h3>
          <p className="text-gray-300 mb-8">
            By linking parts to equipment and connecting them to trusted vendors, we eliminate confusion, reduce
            downtime, and simplify procurement. Vendors gain exposure to a targeted audience, while ship managers save
            time and resources.
          </p>
          <p className="text-lg font-semibold text-cyan-400">
            Euroasiann ensures the right part is always matched to the right equipment—at the right time, from the right
            vendor.
          </p>
        </div>
      </div>
    </section>
  )
}
