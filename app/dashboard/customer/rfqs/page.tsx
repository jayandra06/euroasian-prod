"use client";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

interface RFQ {
  id: number;
  created_at: string;
  supply_port: string | null;
  vessel_name: string | null;
  brand: string | null;
  status: string | null;
}

interface RFQItem {
  id: number;
  description: string | null;
  quantity: number | null;
  uom: string | null;
}

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [rfqItems, setRfqItems] = useState<{ [key: number]: RFQItem[] }>({});
  const supabase = createClient();

  const toggleRow = useCallback(
    async (index: number, rfqId: number) => {
      if (expandedRow === index) {
        setExpandedRow(null);
        return;
      }

      if (!rfqItems[rfqId]) {
        try {
          const { data: items, error } = await supabase
            .from("rfq_items")
            .select("*")
            .eq("rfq_id", rfqId);

          if (error) throw error;
          setRfqItems((prev) => ({ ...prev, [rfqId]: (items as RFQItem[]) || [] }));
        } catch (err) {
          console.error("Error fetching RFQ items:", err);
        }
      }

      setExpandedRow(index);
    },
    [expandedRow, rfqItems, supabase]
  );

  const fetchRfqs = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .select("branch, member_role")
        .eq("member_profile", user!.id);

      if (memberError || !memberData?.length)
        throw new Error("User is not a member.");

      let allRfqs: RFQ[] = [];

      for (const member of memberData) {
        const { data: rfqsAll, error: rfqError } = await supabase
          .from("rfq")
          .select("*")
          .eq("branch", member.branch);

        if (rfqError) throw rfqError;

        allRfqs = [...allRfqs, ...(rfqsAll as RFQ[])];
      }

      setRfqs(allRfqs);
    } catch (e) {
      console.error("Unable to fetch RFQs:", e);
    }
  }, [supabase]);

  useEffect(() => {
    fetchRfqs();
  }, [fetchRfqs]);

  return (
    <div className="p-6">
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
                <span className="sr-only">View Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {rfqs.map((rfq, index) => (
              <React.Fragment key={rfq.id}>
                <TableRow
                  onClick={() => toggleRow(index, rfq.id)}
                  className={`cursor-pointer ${
                    expandedRow === index ? "bg-gray-100 dark:bg-gray-800" : ""
                  }`}
                >
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
                    {expandedRow === index ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </TableCell>
                </TableRow>
                {expandedRow === index && (
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableCell colSpan={6} className="px-6 py-4">
                      <div className="py-2">
                        <strong className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                          RFQ Items:
                        </strong>
                        {rfqItems[rfq.id] && rfqItems[rfq.id].length > 0 ? (
                          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                            {rfqItems[rfq.id].map((item) => (
                              <li key={item.id} className="mb-1">
                                <strong className="font-semibold">Description:</strong>{" "}
                                {item.description || "N/A"}
                                {item.quantity && (
                                  <>
                                    , <strong className="font-semibold">Req. Qty.:</strong>{" "}
                                    {item.quantity}
                                  </>
                                )}
                                {item.uom && (
                                  <>
                                    , <strong className="font-semibold">UOM:</strong> {item.uom}
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">
                            {rfqItems[rfq.id]?.length === 0
                              ? "No items found for this RFQ."
                              : "Loading items..."}
                          </p>
                        )}
                        <div className="mt-4">
                          <Button asChild>
                            <Link
                              href={`/dashboard/customer/view-rfq/${rfq.id}`}
                              className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition duration-200 px-4 py-2 text-sm"
                            >
                              View Full RFQ Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}