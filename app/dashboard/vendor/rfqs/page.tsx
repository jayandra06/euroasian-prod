"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";


const tabs = [
  { id: "all", label: "All", color: "bg-white", text: "text-black" },
  { id: "received", label: "RFQ Received", color: "bg-blue-300" },
  { id: "sent", label: "Quote Sent", color: "bg-green-400" },
  { id: "confirmed", label: "Order Confirmed", color: "bg-green-700" },
  { id: "cancelled", label: "Order Cancelled", color: "bg-red-600" },
  {
    id: "completed",
    label: "Order Completed",
    color: "bg-blue-600",
    text: "text-black",
  },
];

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [filterRfqs, setFilterRfq] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const supabase = createClient();

  async function fetchRfqs() {
    setLoading(true);
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      console.log("Logged-in User:", user);
      console.log("🔍 Checking Merchant for Email:", user.user?.email || "No email found");

      const { data: merchant, error: merchantError } = await supabase
        .from("merchant")
        .select("id")
        .ilike("business_email", user.user?.email || "")
        .maybeSingle();

      if (merchantError) throw merchantError;
      console.log("Merchant Data:", merchant);
      if (!merchant?.id) {
        setRfqs([]);
        setFilterRfq([]);
        return;
      }

      const { data: rfqSupplierData, error: rfqSupplierError } = await supabase
        .from("rfq_supplier")
        .select("rfq_id")
        .eq("vendor_id", merchant.id);

      if (rfqSupplierError) throw rfqSupplierError;
      const rfqIds = rfqSupplierData?.map((rfq) => rfq.rfq_id) ?? [];
      console.log("RFQ IDs for Vendor:", rfqIds);

      const { data: rfqDetails, error: rfqDetailsError } = await supabase
        .from("rfq")
        .select("*")
        .in("id", rfqIds)
        .order("created_at", { ascending: true }); // Sort by created_at ascending

      if (rfqDetailsError) throw rfqDetailsError;
      console.log("RFQ Details:", rfqDetails);

      setRfqs(rfqDetails);
      setFilterRfq(rfqDetails);
    } catch (error: any) {
      console.error("Error fetching RFQs:", error);
      toast({
        variant: "destructive",
        title: "Error fetching RFQs",
        description: error.message,
      });
      setRfqs([]);
      setFilterRfq([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRfqs();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    let filteredData = [...rfqs];

    switch (tab) {
      case "received":
        filteredData = rfqs.filter((rfq) => rfq.supply_port === "Tamil Nadu");
        break;
      case "sent":
        filteredData = rfqs.filter((rfq) => rfq.supply_port === "Goa");
        break;
      case "cancelled":
        filteredData = rfqs.filter((rfq) => rfq.supply_port === "Kerala");
        break;
      case "confirmed":
        filteredData = rfqs.filter((rfq) => rfq.supply_port === "Mumbai");
        break;
      default:
        filteredData = rfqs;
    }
    setFilterRfq(filteredData);
  };

  const formatStatus = (supplyPort: string | null | undefined): string => {
    if (supplyPort === "Goa") {
      return "Quote Sent";
    } else if (supplyPort === "Tamil Nadu") {
      return "RFQ Received";
    } else if (supplyPort === "Kerala") {
      return "Order Cancelled";
    } else if (supplyPort === "Mumbai") {
      return "Order Confirmed";
    }
    return "Unknown";
  };

  const getStatusColor = (supplyPort: string | null | undefined): string => {
    if (supplyPort === "Goa") {
      return "bg-green-400";
    } else if (supplyPort === "Tamil Nadu") {
      return "bg-blue-300";
    } else if (supplyPort === "Kerala") {
      return "bg-red-600";
    } else if (supplyPort === "Mumbai") {
      return "bg-green-700";
    }
    return "bg-gray-400"; // Default color
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="ml-2">Loading RFQs...</span>
      </div>
    );
  }

  return (
    <>
      <div className="pt-8 pb-4">
        <h1 className="text-3xl font-semibold text-center text-gray-800">
          Request for Quotes
        </h1>
      </div>
      <div className="relative flex justify-center max-w-md mx-auto mt-4 bg-gray-100 rounded-full p-2 shadow-md mb-6">
        <div className="relative flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative z-10 px-3 py-1.5 text-sm font-medium transition rounded-full ${
                tab.text
              } ${
                activeTab === tab.id ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className={`absolute inset-0 ${tab.color} shadow-inner rounded-full z-[-1]`}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-500">
                #
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-500">
                Lead Date
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-500">
                Supply Port
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-500">
                Vessel Name
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-500">
                Brand
              </th>
              <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filterRfqs.map((rfq, index) => (
              <tr
                key={rfq.id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer`}
                onClick={() =>
                  (window.location.href = `/dashboard/vendor/vendorRfq/${rfq.id}`)
                }
              >
                <td className="px-4 py-2 text-sm text-gray-700">{index + 1}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {new Date(rfq.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {rfq.supply_port || "-"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {rfq.vessel_name || "-"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {rfq.brand || "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  <Badge className={`${getStatusColor(rfq.supply_port)} text-white rounded-md`}>
                    {formatStatus(rfq.supply_port)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filterRfqs.length === 0 && !loading && (
          <div className="py-6 text-center text-gray-500">No RFQs found for the current filter.</div>
        )}
      </div>
    </>
  );
}