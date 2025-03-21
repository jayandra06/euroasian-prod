'use client'

import React from 'react';
<<<<<<< HEAD
import { TrendingUp, Users, Globe, FileText, PieChart, DollarSign } from 'lucide-react';
=======
import { TrendingUp, Users, Globe, FileText, PieChart, DollarSign, BellRing } from 'lucide-react';
>>>>>>> 1d4d186 (Updated code)
import { useNavigate } from './Navigation';

export function SellerCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Why EUROASIANN?</h2>
          {/* <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Unlock unparalleled opportunities to grow your business in the maritime industry with our innovative platform.
          </p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {/* <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Direct Access to Vessel Managers and Owners</h3>
            <p className="text-gray-600">
              Showcase your products to a vast network of vessels in need of reliable spares, supplies, and equipment.
            </p>
          </div> */}

<<<<<<< HEAD
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
=======
          <div className="bg-white shadow-md rounded-lg p-8 text-center hover:shadow-2xl">
>>>>>>> 1d4d186 (Updated code)
            <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Simplified Transactions</h3>
            <p className="text-gray-600">
              Benefit from a user-friendly platform that handles requests, orders, logistics, and vessel tracking seamlessly.
            </p>
          </div>

<<<<<<< HEAD
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
=======
          <div className="bg-white shadow-md rounded-lg p-8 text-center hover:shadow-2xl">
>>>>>>> 1d4d186 (Updated code)
            <PieChart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">AI-Driven Insights</h3>
            <p className="text-gray-600">
            To allign your purchasing needs.
            </p>
          </div>

<<<<<<< HEAD
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
=======
          <div className="bg-white shadow-md rounded-lg p-8 text-center hover:shadow-2xl">
>>>>>>> 1d4d186 (Updated code)
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Verified Vendors</h3>
            <p className="text-gray-600">
            connect with certified vendors / manufacturers / avoid middlemen.
            </p>
          </div>

<<<<<<< HEAD
          <div className="bg-white shadow-md rounded-lg p-8 text-center" style={{position:"relative", left:"200px"}}>
=======
          <div className="bg-white shadow-md rounded-lg p-8 text-center hover:shadow-2xl" style={{position:"relative", left:"200px"}}>
>>>>>>> 1d4d186 (Updated code)
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Business Growth</h3>
            <p className="text-gray-600">
            Increase your output by automating daily workload with euroasiann.
            </p>
          </div>

<<<<<<< HEAD
          <div className="bg-white shadow-md rounded-lg p-8 text-center" style={{position:"relative", left:"200px"}}>
=======
          <div className="bg-white shadow-md rounded-lg p-8 text-center hover:shadow-2xl" style={{position:"relative", left:"200px"}}>
>>>>>>> 1d4d186 (Updated code)
            <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Transparent Pricing</h3>
            <p className="text-gray-600">
            A straightforward subscription or onboarding fee ensures access to a thriving marketplace, with no hidden costs.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/maintenance')}
<<<<<<< HEAD
            className="bg-blue-600 text-white px-10 py-4 rounded-md text-lg font-semibold shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Subscribe
=======
            className="bg-blue-600 flex mx-auto gap-3 text-white px-10 py-4 rounded-md text-lg font-semibold shadow-lg hover:bg-blue-700  transform transition-all hover:scale-105"
          >
           <BellRing className='mt-0.5' /> Subscribe
>>>>>>> 1d4d186 (Updated code)
          </button>
        </div>
      </div>
    </section>
  );
}

