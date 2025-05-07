'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { FiDownload, FiFilter, FiBell, FiFileText, FiCpu } from 'react-icons/fi';

const FleetOverview = () => {
  return (
    <div className="p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center border-2 p-4 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold">Fleet Overview</h1>
        <div className="flex gap-2">
          <Button variant="outline"><FiDownload className="mr-2" /> Export</Button>
          <Button variant="outline"><FiFilter className="mr-2" /> Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Fleet Summary */}
          <Card>
            <CardHeader>
              <CardTitle><FiCpu className="inline-block mr-2" />Fleet Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Vessels', value: '0' },
                { label: 'Active Vessels', value: '0' },
                { label: 'In Dry Dock', value: '0' },
                { label: 'Fleet Hours', value: '00,000 h' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 border rounded text-center bg-muted">
                  <div className="text-xl font-bold">{item.value}</div>
                  <div className="text-sm">{item.label}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Equipment Status */}
          <Card>
            <CardHeader>
              <CardTitle><FiCpu className="inline-block mr-2" />Equipment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {['All Vessels', 'All Equipment', 'All Brands', 'All Statuses'].map((item, idx) => (
                  <Select key={idx}>
                    <SelectTrigger>{item}</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{item}</SelectItem>
                    </SelectContent>
                  </Select>
                ))}
              </div>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Equipment</th>
                    <th className="border px-2 py-1 text-left">Online</th>
                    <th className="border px-2 py-1 text-left">Maintenance Due</th>
                    <th className="border px-2 py-1 text-left">Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Main Engines', '0', '0', '28-Apr-2025'],
                    ['Bilge Pumps', '0', '0', '27-Apr-2025'],
                    ['Purifiers', '0', '—', '28-Apr-2025']
                  ].map((row, idx) => (
                    <tr key={idx}>
                      {row.map((cell, i) => (
                        <td key={i} className="border px-2 py-1">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card><CardContent className="p-4">Analytics (Coming Soon)</CardContent></Card>
            <Card><CardContent className="p-4">Analytics (Coming Soon)</CardContent></Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle><FiBell className="inline-block mr-2" />Critical Alerts / Maintenance Due</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Overdue maintenance components</li>
                <li>Lube oil replacement due</li>
                <li>Separator bowl cleaning</li>
                <li>Running hour exceedances</li>
                <li>Ballast pump inspections</li>
              </ul>
            </CardContent>
          </Card>

          {/* Document Trackers */}
          {/* Document & Certification Tracker - Card 1 */}
<Card>
  <CardHeader>
    <CardTitle><FiFileText className="inline-block mr-2" />Document & Certification Tracker</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
      <Select>
        <SelectTrigger>All Vessels</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Vessels</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger>All</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <ul className="list-disc list-inside text-sm space-y-1">
      <li>Next Class survey due</li>
      <li>Purifier / OWS certificates</li>
      <li>Service records upload</li>
    </ul>
  </CardContent>
</Card>

{/* Document & Certification Tracker - Card 2 */}
<Card>
  <CardHeader>
    <CardTitle><FiFileText className="inline-block mr-2" />Document & Certification Tracker</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-3">
      <Select>
        <SelectTrigger>All Vessels</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Vessels</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <ul className="list-disc list-inside text-sm space-y-1">
      <li>COC renewals due</li>
      <li>Flag state certificates</li>
      <li>Class endorsements pending</li>
    </ul>
  </CardContent>
</Card>

        </div>
      </div>
    </div>
  );
};

export default FleetOverview;
