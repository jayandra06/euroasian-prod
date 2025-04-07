import { Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

import Image from "next/image"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 gap-8 place-items-center">
      <div>
            <div className="flex items-center space-x-2">
              {/* <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design-J0WPGEf7CFqGMh5nyQUWW4o8AyW4i0.png"
                alt="EuroAsian Logo"
                className="h-12 w-auto"
              /> */}
              <Image src='/Screenshot 2025-02-14 220946.png' width={100} height={100} alt="EuroAsian Logo" className="h-16 w-auto" />

            </div>
            {/* <p className="mt-4 text-sm">Your trusted source for quality ship parts and marine equipment.</p> */}
          </div>

          {/* <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-blue-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-500 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-500 transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div> */}

<div>
  <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
  <ul className="space-y-4">
  <li className="flex items-center space-x-2">
      <MapPin className="h-5 w-5 text-blue-500" />
      <span>
        Teerosenweg 46, 22177 Hamburg, Germany
      </span>
    </li>
    <li className="flex items-center space-x-2">
      <MapPin className="h-5 w-5 text-blue-500" />
      <span>
        3rd Floor, A321, Master Mind 4, Royal Palms, Goregaon East, Mumbai-400065, India
      </span>
    </li>
   
    {/* <li className="flex items-center space-x-2">
      <Phone className="h-5 w-5 text-blue-500" />
      <span></span>
    </li> */}
    <li className="flex items-center space-x-2">
      <Mail className="h-5 w-5 text-blue-500" />
      <span>technical@euroasianngroup.com</span>
    </li>
  </ul>
</div>


          {/* <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-sm mb-4">Subscribe to our newsletter for updates and offers.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div> */}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} EuroAsiann. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

