'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import ReactTagInput from '@pathofdev/react-tag-input'
import '@pathofdev/react-tag-input/build/index.css' // Required CSS
import { BarCharts } from './bar-chart'
import { PieCharts } from './pie-chart'

const PortManagement = () => {
  const [emails, setEmails] = useState<string[]>([]) // Just store strings (emails)

  const [portMembers, setPortMembers] = useState([
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Alice Smith', email: 'alice@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' },
    { name: 'Eve Davis', email: 'eve@example.com' },
    { name: 'Charlie Brown', email: 'charlie@example.com' },
  ])

  // Handle sending invites
  const handleInvite = () => {
    const newMembers = emails.map(email => ({
      name: 'Invited User',
      email,
    }))
    setPortMembers([...portMembers, ...newMembers])
    setEmails([]) // Clear input
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Port Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Invite Port Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Port Members</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <ReactTagInput
                tags={emails}
                onChange={(newTags) => setEmails(newTags)}
                placeholder="Enter email addresses and press enter"
              />
              <Button className="w-full mt-2" onClick={handleInvite}>
                Send Invites
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-x-auto shadow-md">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {portMembers.map((member, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{member.name}</td>
                <td className="p-3">{member.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
        <BarCharts/>
        <PieCharts/>

      </div>
    </div>
  )
}

export default PortManagement
