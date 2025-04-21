// NotificationBell.tsx
import { FaBell } from 'react-icons/fa'

export default function NotificationBell() {
  return (
    <div className="relative">
      <FaBell className="text-gray-700 w-6 h-6" />
      <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
        3
      </span>
    </div>
  )
}
