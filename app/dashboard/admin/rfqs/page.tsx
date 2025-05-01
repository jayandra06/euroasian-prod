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
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const tabs = [
    { id: "all", label: "All", color: "bg-white text-gray-800" },
    { id: "received", label: "RFQ Received", color: "bg-blue-500 text-white" },
    { id: "sent", label: "Quote Sent", color: "bg-green-500 text-white" },
    { id: "confirmed", label: "Order Confirmed", color: "bg-emerald-500 text-white" },
    { id: "cancelled", label: "Order Cancelled", color: "bg-red-500 text-white" },
    { id: "completed", label: "Order Completed", color: "bg-gray-500 text-white" },
];

interface Rfq {
    id: string;
    created_at: string;
    supply_port: string | null;
    vessel_name: string | null;
    brand: string | null;
    status: string; // supplier_status
    rfq_status: string; // original rfq status
}

interface RfqSupplier {
    rfq: Rfq;
    status: string; // Supplier's status
}

export default function RFQsPage() {
    const [rfqs, setRfqs] = useState<Rfq[]>([])
    const [activeTab, setActiveTab] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const supabase = createClient();

    async function fetchRfqs(tabFilter: string = "all", searchTerm: string = "") {
        setLoading(true);
        try {
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();
      
          const userId = user?.id;
          if (!userId) {
            setLoading(false);
            return;
          }
      
          let query = supabase
            .from("merchant")
            .select(
              `
                id,
                merchant_profile,
                rfq_supplier (
                  status,
                  rfq (
                    id,
                    created_at,
                    supply_port,
                    vessel_name,
                    brand,
                    status
                  )
                )
              `
            )
            .eq("merchant_profile", userId);
      
          if (tabFilter !== "all") {
            const supabaseStatus = getSupabaseStatus(tabFilter);
            console.log(`Supabase status for ${tabFilter}:`, supabaseStatus);
            if (supabaseStatus) {
              query = query.filter("rfq_supplier.status", "eq", supabaseStatus);
            }
          }
      
          const { data: merchants, error: merchantError } = await query;
      
          if (merchantError) {
            console.error("Error fetching merchant:", merchantError);
            toast({
              title: "Error fetching data",
              description: "Unable to retrieve merchant information.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
      
          if (!merchants) {
            setRfqs([]);
            setLoading(false);
            return;
          }
      
          let fetchedRfqs: Rfq[] = merchants.flatMap((merchant) =>
            merchant.rfq_supplier.map((rs: any) => ({
              id: rs.rfq.id,
              created_at: rs.rfq.created_at,
              supply_port: rs.rfq.supply_port,
              vessel_name: rs.rfq.vessel_name,
              brand: rs.rfq.brand,
              rfq_status: rs.rfq.status, // RFQ's status
              status: rs.status, // Supplier's status
            }))
          );
      
          // 🔍 Search filtering (client-side)
          if (searchTerm.trim() !== "") {
            const lowerSearch = searchTerm.toLowerCase();
            fetchedRfqs = fetchedRfqs.filter(
              (rfq) =>
                rfq.vessel_name?.toLowerCase().includes(lowerSearch) ||
                rfq.brand?.toLowerCase().includes(lowerSearch) ||
                rfq.supply_port?.toLowerCase().includes(lowerSearch)
            );
          }
      
          console.log(`Fetched RFQs (tab: ${tabFilter}, search: ${searchTerm}):`, fetchedRfqs);
          setRfqs(fetchedRfqs);
        } catch (error: any) {
          console.error("Unable to fetch RFQs:", error);
          toast({
            title: "Error fetching RFQs",
            description: error.message || "An unexpected error occurred while fetching RFQs.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
      

    


    useEffect(() => {
        fetchRfqs(activeTab,searchTerm);
    }, [activeTab,searchTerm]);

    const getSupabaseStatus = (frontendStatus: string): string | null => {
        switch (frontendStatus) {
            case "received":
                return "received";
            case "sent":
                return "quoted";
            case "confirmed":
                return "order_confirm";
            case "cancelled":
                return "cancelled";
            case "completed":
                return "completed";
            default:
                return null; // For "all" or unknown tabs
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "RFQ Received":
                return "bg-blue-500";
            case "Quote Sent":
                return "bg-green-500";
            case "Order Confirmed":
                return "bg-emerald-500";
            case "Order Cancelled":
                return "bg-red-500";
            case "Order Completed":
                return "bg-gray-500";
            default:
                return "bg-gray-300";
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };


    return (
        <div className="container mx-auto py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-gray-800 text-center">
                    Request for Quotes
                </h1>
            </div>
            <div className="flex justify-end my-4">
            <input
      type="text"
      placeholder="Search by vessel name, brand, or supply port"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border px-3 py-2 rounded w-full max-w-md"
    />

            </div>
    
            {/* Styled Tab Navigation */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-6">
                <nav className="relative flex space-x-1 bg-gray-100 p-2 rounded-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`relative z-10 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === tab.id ? tab.color : "text-gray-600 hover:bg-gray-200"
                            }`}
                            aria-label={`View ${tab.label} RFQs`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute inset-0 bg-indigo-500 rounded-md z-[-1]"
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Styled Table (No Shadow) */}
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RFQ Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Supply Port
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vessel Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Brand
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                        Loading RFQs...
                                    </div>
                                </td>
                            </tr>
                        ) : rfqs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                    No RFQs available for the selected filter.
                                </td>
                            </tr>
                        ) : (
                            rfqs.map((rfq, index) => (
                                <tr
                                    key={rfq.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                    onClick={() =>
                                        (window.location.href = `/dashboard/vendor/vendorRfq/${rfq.id}`)
                                    }
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {rfq.created_at ? new Date(rfq.created_at).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {rfq.supply_port || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {rfq.vessel_name || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {rfq.brand || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Badge className={`${getStatusColor(rfq.status)} text-white rounded-full px-3 py-1 text-xs font-semibold`}>
                                            {rfq.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}