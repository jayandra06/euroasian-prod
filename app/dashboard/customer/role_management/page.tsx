"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import ManageRoleOne from "./ManageRoleOne/page";
import ManageRoleTwo from "./ManageRoleTwo/page";


interface Vendor {
  id: string;
  name: string;
  business_email: string;
  is_active: boolean;
  
}

export default function RoleManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [activeComponent, setActiveComponent] = useState<number | null>(null);

  const supabase = createClient();

  const getUsers = async () => {
    const res = await fetch("/api/fetch-all-user-role");
    const json = await res.json();

    if (json.success) {
      const users = json.users;
      const formatted = users.map((user: any) => ({
        id: user.id,
        name: user.user_metadata?.full_name || user.email,
        business_email: user.email,
        is_active: !!user.confirmed_at,

      }));

      setVendors(formatted);
    } else {
      console.error("Failed to fetch users:", json.error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="p-6">
      {/* IF no button clicked -> Show Users Table */}
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Manage Your Role
        </h1>
        <div className="flex items-center space-x-2">
          <Button className="ml-4" onClick={() => setActiveComponent(1)}>
            Manage Roles
          </Button>
          <Button onClick={() => setActiveComponent(2)}>Manage Permission</Button>
          {/* <Button onClick={() => setActiveComponent(3)}>Manage Role 3</Button> */}
        </div>
      </div>
      {activeComponent === null && (
        <>
          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <TableHeader className="bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email ID
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {vendor.business_email}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No Record Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* IF button clicked -> Show Selected ManageRole Page */}
      {activeComponent === 1 && <ManageRoleOne />}
      {activeComponent === 2 && <ManageRoleTwo />}
      
    </div>
  );
}
