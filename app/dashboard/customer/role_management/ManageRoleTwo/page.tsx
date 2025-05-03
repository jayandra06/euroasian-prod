import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";

const roles = [
  "View",
  "Create",
  "Edit",
  "Delete",
  
];

const permissions = [
  {
    category: "Financial & Procurrent",
    items: [
      "Rfq",
      "Vendor Management",
    ]
  },
  {
    category: "Fleet Performance & Manintance",
    items:[]
    
  },
  {
    category: "Vessels Finder & Route Optimization",
    items:[]
    
  },
  {
    category: "Complaince & Certification",
    items:[]
    
  },
  {
    category: "Crew Management",
    items:[]
    
  },
  {
    category: "Risk & Incident Management",
    items:[]
    
  },
  {
    category: "Sustanability & ESG Report",
    items:[]
    
  },
  {
    category: "Vessel Managment",
    items:[]
    
  },
  {
    category: "Role Managment",
    items:[]
    
  },
  {
    category: "Branch",
    items:[]
    
  },
];

const ManageRoleTwo = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (category:any) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <>
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      

      <Card className="overflow-auto border p-4">
        <ScrollArea className="w-full">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-2 py-1">Permission</th>
                {roles.map((role, i) => (
                  <th key={i} className="px-2 py-1 text-sm font-medium border-l">
                    <div className="flex items-center justify-between">
                      <span>{role}</span>
                      {/* <Button variant="ghost" size="sm">⋮</Button> */}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {permissions.map((section, index) => (
                <React.Fragment key={index}>
                  <tr className="cursor-pointer" onClick={() => toggleSection(section.category)}>
                    <td className="font-semibold py-2 px-2  flex items-center space-x-2" colSpan={roles.length + 1}>
                      {openSections[section.category] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span>{section.category}</span>
                    </td>
                  </tr>
                  {openSections[section.category] && (
                    section.items.length > 0 ? (
                      section.items.map((perm, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="text-sm px-2 py-2">{perm}</td>
                          {roles.map((_, rIndex) => (
                            <td key={rIndex} className="text-center">
                              <Checkbox />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr className="border-t">
                        <td className="text-sm px-2 py-2 italic text-gray-500">No items available</td>
                        {roles.map((_, rIndex) => (
                          <td key={rIndex} className="text-center">
                            <Checkbox />
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </Card>
      <div className="flex justify-end  mb-4 mt-4">
        <Button variant="outline">Save Changes</Button>
        
      </div>
    </div>
    
  </>
  );
};

export default ManageRoleTwo;