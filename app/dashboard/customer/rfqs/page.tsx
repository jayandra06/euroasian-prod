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
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface RFQ {
  id: number;
  created_at: string;
  supply_port: string | null;
  vessel_name: string | null;
  brand: string | null;
  category: string | null;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // Default '' or a specific status
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / pageSize);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "bg-blue-500";
      case "quoted":
        return "bg-purple-500";
      case "ordered":
        return "bg-green-500";
      case "delivered":
        return "bg-teal-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const fetchRfqs = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) {
        console.error("User not authenticated.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_role") // <-- Adjust field name if needed
        .eq("id", user.id) // Assuming 'id' is the primary key in 'profile'
        .single(); // Only one record expected
      if (profileError) {
        console.error("Error fetching user role:", profileError.message);
        return;
      }
      if (!profile?.user_role) {
        console.error("User role not found.");
        return;
      }
      setUserRole(profile.user_role); // Set user role in state

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("rfq")
        .select("*", { count: "exact" }) // Include count
        .eq("requested_by", user.id)
        .order("created_at", { ascending: false }) // Sort by date, new to old
        .range(from, to);

      // Apply status filter if selected
      if (selectedStatus) {
        query = query.eq("status", selectedStatus);
      }

      // Apply search filter
      if (searchTerm) {
        query = query.or(
          `vessel_name.ilike.%${searchTerm}%,supply_port.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
        );
      }

      const { data: rfqsData, error: rfqsError, count } = await query;

      if (rfqsError) {
        console.error("Error fetching RFQs:", rfqsError);
        return;
      }

      setRfqs(rfqsData as RFQ[]);
      setTotalCount(count || 0);
    } catch (e) {
      console.error("Unable to fetch RFQs:", e);
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedStatus, searchTerm, currentPage, pageSize]);

  useEffect(() => {
    fetchRfqs();
  }, [fetchRfqs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchTerm]);

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
        .from("profiles")
        .select("user_role") // <-- Adjust field name if needed
        .eq("id", user.id) // Assuming 'id' is the primary key in 'profile'
        .single(); // Only one record expected

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
          userRole: userRole, // <- Now correct
          customerId: user.id, // <- From supabase user
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
          {userRole !== "manager" && (
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
          )}
        </div>
      </div>

      {activeTab === "yourRfqs" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Your RFQs
            </h1>


            <div className="flex justify-between ml-4">
            <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition duration-200 flex items-center"
                >
                {showFilters ? (
                  <>
                   <ChevronDownIcon className="ml-2 h-4 w-4 rotate-180 transform" />
                  </>
                ) : (
                  <>
                 <ChevronDownIcon className="ml-2 h-4 w-4 transform" />
                  </>
                )}
                </button>
            <Button   className="ml-4"asChild>
              <Link
                href={"/dashboard/customer/create-enquiry"}
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition duration-200 px-4 py-2"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Enquiry
              </Link>
            </Button>
            </div>
          </div>
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
               
              {showFilters && (
              <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-4">
                <label
                  htmlFor="statusFilter"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Filter by Status:
                </label>
                <select
                  id="statusFilter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="ordered">Ordered</option>
                  <option value="quoted">Quoted</option>
                  <option value="delivered">Delivered</option>
                </select>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                <label
                  htmlFor="searchInput"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Search RFQs:
                </label>
                <input
                  id="searchInput"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Vessel Name, Supply Port, Brand, or Category"
                  className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm w-full md:w-96 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-300"
                />
                </div>
              </div>
              )}
            </div>

          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <TableHeader className="bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Lead Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vessel Name
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Supply Port
                  </TableHead>
                
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Brand
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
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
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                    >
                      <div className="flex justify-center items-center">
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        Loading RFQs...
                      </div>
                    </td>
                  </tr>
                ) : (
                  rfqs.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {new Date(rfq.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {new Date(rfq.created_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.vessel_name || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.supply_port || "-"}
                      </TableCell>
                    
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.brand || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.category || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge
                          className={`${getStatusColor(
                            rfq.status || ""
                          )} text-white rounded-full px-3 py-1 text-xs font-semibold`}
                        >
                          {rfq.status || "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="relative px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer">
                              &#x2026;
                            </span>
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
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/customer/edit-rfq/${rfq.id}`}
                                className="w-full"
                              >
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to delete this RFQ?"
                                    )
                                  ) {
                                    // Add delete logic here
                                    console.log(
                                      `Deleting RFQ with ID: ${rfq.id}`
                                    );
                                  }
                                }}
                                className="w-full text-left"
                              >
                                Delete
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === "waitingApproval" && (
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
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
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          rfq.status === "ordered"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : rfq.status === "sent"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            : rfq.status === "quoted"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                            : rfq.status === "delivered"
                            ? "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100"
                            : rfq.status === "cancelled"
                            ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                        }`}
                      >
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
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md font-semibold ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md font-semibold ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
