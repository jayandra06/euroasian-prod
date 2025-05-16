"use client";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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
import { Loader2 } from "lucide-react";

type OrderedRfq = {
  order_id: string;
  rfq_id: string;
  shipping_company_name: string;
  rfq_item_count: number;
  model: string;
  category: string;
  vessel_name: string;
  brand: string;
  createdAt: Date;
  status: string;
  claim_id: string;
};

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<OrderedRfq[]>([]);
  const [waitingForApprovalRfqs, setWaitingForApprovalRfqs] = useState<
    OrderedRfq[]
  >([]);
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
      case "pending":
        return "bg-blue-500";
      case "appoved":
        return "bg-purple-500";
      case "rejected":
        return "bg-green-500";
      case "in_progress":
        return "bg-teal-500";
      case "completed":
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
        .select("user_role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user role:", profileError.message);
        return;
      }

      if (!profile?.user_role) {
        console.error("User role not found.");
        return;
      }

      setUserRole(profile.user_role);

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("claim")
        .select(
          `
        id,
        status,
        created_at,
        rfq:rfq_id (
          rfq_id:id,
          vessel_name,
          category,
          brand,
          model
        ),
       customer_details:customer_id(
      *
        )
          `,
          { count: "exact" }
        )

        .order("created_at", { ascending: false })
        .range(from, to);

      const { data: rfqsData, error: rfqsError, count } = await query;

      console.log("rfqsData", rfqsData);

      if (rfqsError) {
        console.error("Error fetching RFQs:", rfqsError);
        return;
      }

      // Extract rfq_ids
      const rfqIds = rfqsData
        .map((item: any) => item.rfq?.rfq_id)
        .filter(Boolean);

      // Get counts for rfq_items by rfq_id
      const itemCountsMap: Record<string, number> = {};
      await Promise.all(
        rfqIds.map(async (rfqId) => {
          const { count, error } = await supabase
            .from("rfq_items")
            .select("*", { count: "exact", head: true })
            .eq("rfq_id", rfqId);

          if (!error) {
            itemCountsMap[rfqId] = count ?? 0;
          } else {
            console.error(
              `Error fetching item count for rfq_id ${rfqId}:`,
              error.message
            );
            itemCountsMap[rfqId] = 0;
          }
        })
      );

      // Flatten and format the data
      const flattenedData = rfqsData.map((item: any) => ({
        order_id: item.id,
        rfq_id: item.rfq?.rfq_id,
        shipping_company_name:
          item.customer_details?.shipping_company_name || "Company A",
        vessel_name: item.rfq?.vessel_name || "Unknown Vessel",
        category: item.rfq?.category || "Unknown Category",
        brand: item.rfq?.brand || "Unknown Brand",
        model: item.rfq?.model || "Unknown Model",
        rfq_item_count: itemCountsMap[item.rfq?.rfq_id] || 0,
        createdAt: item.created_at,
        status: item.status,
        claim_id: item.claim_id,
      }));

      console.log("This is the flattend data", flattenedData);
      setRfqs(flattenedData);
      setTotalCount(count || 0);
    } catch (e) {
      console.error("Unable to fetch RFQs:", e);
    } finally {
      setLoading(false);
    }
  }, [supabase, currentPage, pageSize]);

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
      <div className="mb-6"></div>

      {activeTab === "yourRfqs" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Claim Requests
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
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            {showFilters && (
              <div className="flex flex-wrap items-center justify-between gap-4 w-full">
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
                    Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </TableHead>

                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vessel Name
                  </TableHead>

                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Brand
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Model
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Company Name
                  </TableHead>

                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    status
                  </TableHead>

                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                    >
                      <div className="flex justify-center items-center">
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        Loading claim requests
                      </div>
                    </td>
                  </tr>
                ) : (
                  rfqs.map((rfq) => (
                    <TableRow key={rfq.order_id}>
                      {/* <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {rfq.rfq_id || "-"}
                      </TableCell> */}

                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.createdAt
                          ? new Date(rfq.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </TableCell>

                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.createdAt
                          ? new Date(rfq.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.vessel_name || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.category || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.brand || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.model || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        {rfq.shipping_company_name || "-"}
                      </TableCell>

                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            rfq.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : rfq.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : rfq.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : rfq.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : rfq.status === "completed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {rfq.status === "pending"
                            ? "Pending"
                            : rfq.status === "approved"
                            ? "Approved"
                            : rfq.status === "rejected"
                            ? "Rejected"
                            : rfq.status === "in_progress"
                            ? "In Progress"
                            : rfq.status === "completed"
                            ? "Completed"
                            : rfq.status || "N/A"}
                        </span>
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
                                href={`/dashboard/vendor/claim/claimDetails/${rfq.order_id}`}
                                className="w-full"
                              >
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/customer/edit-rfq/${rfq.order_id}`}
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
                                      `Deleting RFQ with ID: ${rfq.order_id}`
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
