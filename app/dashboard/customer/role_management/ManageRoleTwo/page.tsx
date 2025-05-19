"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

const permissions = [
  {
    category: "Financial & Procurement",
    items: ["Rfq", "Vendor Management"]
  },
  { category: "Fleet Performance & Maintenance", items: [] },
  { category: "Vessels Finder & Route Optimization", items: [] },
  { category: "Compliance & Certification", items: [] },
  { category: "Crew Management", items: [] },
  { category: "Risk & Incident Management", items: [] },
  { category: "Sustainability & ESG Report", items: [] },
  { category: "Vessel Management", items: [] },
  { category: "Role Management", items: [] },
  { category: "Branch", items: [] },
];

const ManageRoleTwo = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const toggleSection = (category: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fetch-all-user-role");
      if (!res.ok) throw new Error("Failed to fetch roles");

      const data = await res.json();

      if (data.allRoles && Array.isArray(data.allRoles)) {
        setRoles(data.allRoles);
        setSelectedRole(data.allRoles[0] || "");
      } else {
        toast.error("No roles found");
      }
    } catch (err) {
      console.error("Error fetching roles", err);
      toast.error("Error fetching roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading roles...</p>
      </div>
    );
  }

  if (!roles.length && !loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No roles available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      {/* Dropdown to select a role */}
      <div className="mb-4 w-60">
        <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role, idx) => (
              <SelectItem key={idx} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-auto border p-4">
        <ScrollArea className="w-full">
          {/* Permission Sections will go here */}
          {permissions.map((perm) => (
            <div key={perm.category} className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection(perm.category)}
              >
                <h3 className="font-semibold">{perm.category}</h3>
                {openSections[perm.category] ? <ChevronUp /> : <ChevronDown />}
              </div>
              {openSections[perm.category] && perm.items.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {perm.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Checkbox id={`${selectedRole}-${item}`} />
                      <label htmlFor={`${selectedRole}-${item}`}>{item}</label>
                    </div>
                  ))}
                </div>
              )}
              {openSections[perm.category] && perm.items.length === 0 && (
                <p className="ml-4 text-sm text-muted-foreground">No items available</p>
              )}
            </div>
          ))}
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ManageRoleTwo;
