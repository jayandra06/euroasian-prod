'use client'

import React from 'react'
import { Building2, Ship, DollarSign, Users } from 'lucide-react'
import { useNavigate } from './Navigation'

export function Features() {
  const navigate = useNavigate()

  return (
    <div className="pb-20 bg-gray">
      <div className="container mx-auto px-4">
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <Users className="h-12 w-12 mx-auto text-blue-600" />
            <div className="text-3xl font-bold text-gray-900">1000+</div>
            <div className="text-gray-600">Vendors</div>
          </div>

          <div className="text-center space-y-4">
            <Ship className="h-12 w-12 mx-auto text-blue-600" />
            <div className="text-3xl font-bold text-gray-900">5000+</div>
            <div className="text-gray-600">Aiming vessels in 2025</div>
          </div>

          <div className="text-center space-y-4">
            <DollarSign className="h-12 w-12 mx-auto text-blue-600" />
            <div className="text-3xl font-bold text-gray-900">$1 Billion+</div>
            <div className="text-gray-600">Trade Facilitated</div>
          </div>
        </div>
      </div>
    </div>
  )
}

