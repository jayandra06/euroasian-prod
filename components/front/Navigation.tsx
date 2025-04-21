
'use client'

import React, { createContext, useContext, useState } from 'react'

const NavigationContext = createContext<{
  currentPage: string
  navigate: (page: string) => void
}>({
  currentPage: '/',
  navigate: () => {},
})

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState('/')

  const navigate = (page: string) => {
    setCurrentPage(page)
  }

  return (
    <NavigationContext.Provider value={{ currentPage, navigate }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigate() {
  const { navigate } = useContext(NavigationContext)
  return navigate
}

export function NavBar() {
  const { currentPage, navigate } = useContext(NavigationContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
    

    
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      
      <div className="text-2xl font-bold">MyApp</div>
      <div className="flex items-center">
        <ul className="hidden md:flex space-x-4">
          <li
            onClick={() => navigate('/home')}
            className={`cursor-pointer ${currentPage === '/home' ? 'underline' : ''}`}
            >
            
          </li>
          <li
            onClick={() => navigate('/about')}
            className={`cursor-pointer ${currentPage === '/about' ? 'underline' : ''}`}
          >
            About
          </li>
          <li
            onClick={() => navigate('/contact')}
            className={`cursor-pointer ${currentPage === '/contact' ? 'underline' : ''}`}
          >
            Contact
          </li>
        </ul>
        <div
          className="md:hidden text-2xl cursor-pointer text-white z-50"
          onClick={toggleMobileMenu}
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            >
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </div>
      </div>
      {isMobileMenuOpen && (
        <ul className="absolute top-16 right-4 bg-gray-700 rounded-lg shadow-lg flex flex-col space-y-2 p-4 md:hidden z-50">
          <li
            onClick={() => {
              navigate('/home')
              toggleMobileMenu()
            }}
            className={`cursor-pointer ${currentPage === '/home' ? 'underline' : ''}`}
            >
            Home
          </li>
          <li
            onClick={() => {
              navigate('/about')
              toggleMobileMenu()
            }}
            className={`cursor-pointer ${currentPage === '/about' ? 'underline' : ''}`}
          >
            About
          </li>
          <li
            onClick={() => {
              navigate('/contact')
              toggleMobileMenu()
            }}
            className={`cursor-pointer ${currentPage === '/contact' ? 'underline' : ''}`}
          >
            Contact
          </li>
        </ul>
      )}
    </nav>
    
    </>
  )
}
