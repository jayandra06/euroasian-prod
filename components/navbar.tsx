// components/Navbar.tsx
import AdminNotifications from './AdminNotifications'

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <AdminNotifications />
    </nav>
  )
}
