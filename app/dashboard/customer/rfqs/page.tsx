"use client";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import { PlusIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RFQ {
  id: number;
  created_at: string;
  supply_port: string | null;
  vessel_name: string | null;
  brand: string | null;
  status: string | null;
}

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [waitingForApprovalRfqs, setWaitingForApprovalRfqs] = useState<RFQ[]>(
    []
  );
  const [activeTab, setActiveTab] = useState("yourRfqs");
  const [user, setUser] = useState(null); // State to hold user data
  const [userRole, setUserRole] = useState(null); // State to hold user role 
  const supabase = createClient();

  const fetchRfqs = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) {
        console.error("User not authenticated.");
        return;
      }

      const { data: rfqsData, error: rfqsError } = await supabase
        .from("rfq")
        .select("*")
        .eq("requested_by", user.id); // <- search where requested_by = user.id

      if (rfqsError) {
        console.error("Error fetching RFQs:", rfqsError);
        return;
      }

      setRfqs(rfqsData as RFQ[]);
    } catch (e) {
      console.error("Unable to fetch RFQs:", e);
    }
  }, [supabase]);

  const fetchRfqRequests = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      console.error("User not authenticated.");
      return;
    }

    try {
      // 🛠 Step 1: Fetch user role from `profile` table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_role') // <-- Adjust field name if needed
        .eq('id', user.id)     // Assuming 'id' is the primary key in 'profile'
        .single();             // Only one record expected

      if (profileError) {
        console.error("Error fetching user role:", profileError.message);
        return;
      }

      if (!profile?.user_role) {
        console.error("User role not found.");
        return;
      }

      const userRole = profile.user_role;

      // 🛠 Step 2: Now make API call with userRole and customerId
      const res = await fetch("/api/fetch-rfq-by-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userRole: userRole,     // <- Now correct
          customerId: user.id,   // <- From supabase user
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error fetching RFQs:", text);
        return;
      }

      const result = await res.json();

      console.log("Fetched RFQs:", result.data);
      setWaitingForApprovalRfqs(result.data); // Update your state
    } catch (e) {
      console.error("Unable to fetch RFQs:", e);
    }
  }, [supabase]);


  useEffect(() => {
    const fetchInitialData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        await fetchRfqs();
        await fetchRfqRequests();
      }
    };

    fetchInitialData();
  }, [fetchRfqs, fetchRfqRequests, supabase]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Manage RFQs
        </h2>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("yourRfqs")}
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "yourRfqs"
                ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            Your RFQs
          </button>
          <button
            onClick={() => setActiveTab("waitingApproval")}
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "waitingApproval"
                ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            Waiting for Approval
          </button>
        </div>
      </div>

      {activeTab === "yourRfqs" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Your RFQs
            </h1>
            <Button asChild>
              <Link
                href={"/dashboard/customer/create-enquiry"}
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition duration-200 px-4 py-2"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Enquiry
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <TableHeader className="bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Lead Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Supply Port
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vessel Name
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Brand
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {rfqs.map((rfq) => (
                  <TableRow key={rfq.id}>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(rfq.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {rfq.supply_port || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {rfq.vessel_name || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {rfq.brand || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        {rfq.status || "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="relative px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions <ChevronDownIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/customer/view-rfq/${rfq.id}`}
                              className="w-full"
                            >
                              View
                            </Link>
                          </DropdownMenuItem>
                          {/* You can add more actions here if needed */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === "waitingApproval" && (
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            RFQs Waiting for Your Approval
          </h1>
          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <TableHeader className="bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Lead Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Supply Port
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vessel Name
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Brand
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {waitingForApprovalRfqs.map((rfq) => (
                  <TableRow key={rfq.id}>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(rfq.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {rfq.supply_port || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {rfq.vessel_name || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {rfq.brand || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                        {rfq.status || "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="relative px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions <ChevronDownIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/customer/view-rfq/${rfq.id}`}
                              className="w-full"
                            >
                              View
                            </Link>
                          </DropdownMenuItem>
                          {/* You can add more actions here (e.g., Approve, Reject) */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}