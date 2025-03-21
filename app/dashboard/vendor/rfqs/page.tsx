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

const tabs = [
  { id: "all", label: "All", color: "bg-white", text: "text-black" },
  { id: "received", label: "RFQ Received", color: "bg-blue-500" },
  { id: "sent", label: "RFQ Sent", color: "bg-green-400" },
  { id: "confirmed", label: "Order Confirmed", color: "bg-green-700" },
  { id: "cancelled", label: "Order Cancelled", color: "bg-red-600" },
];

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [rfqItems, setRfqItems] = useState<{ [key: number]: any[] }>({}); // Store items for each RFQ
  const [filterRfqs, setFilterRfq] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const supabase = createClient();

  const toggleRow = async (index: number, rfqId: number) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      return;
    }

    // Fetch items if not already fetched
    if (!rfqItems[rfqId]) {
      try {
        const { data: items, error } = await supabase
          .from("rfq_items")
          .select("*")
          .eq("rfq_id", rfqId);

        if (error) throw error;
        setRfqItems((prev) => ({ ...prev, [rfqId]: items || [] }));
      } catch (err) {
        console.error("Error fetching RFQ items:", err);
      }
    }

    setExpandedRow(index);
  };

  async function fetchRfqs() {
    const supabase = createClient();

    const rfqs = await supabase.from("rfq").select();
    console.log("rfq", rfqs);

    setRfqs([...rfqs.data!]);
    setFilterRfq([...rfqs.data!]);
  }

  useEffect(() => {
    fetchRfqs();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    let filteredData = [...rfqs];

    switch (tab) {
      case "received":
        filteredData = rfqs.filter((rfqs) => rfqs.supply_port === "Tamil Nadu");
        break;
      case "sent":
        filteredData = rfqs.filter((rfqs) => rfqs.supply_port === "Goa");
        break;
      case "cancelled":
        filteredData = rfqs.filter((rfqs) => rfqs.supply_port === "Kerala");
        break;
      case "confirmed":
        filteredData = rfqs.filter((rfqs) => rfqs.supply_port === "Mumbai");
        break;
      default:
        filteredData = rfqs;
    }

    setFilterRfq(filteredData);
  };

  const handleData = (rfqs: any) => {
    if (rfqs.supply_port === "Goa") {
      return "Sent";
    } else if (rfqs.supply_port === "Tamil Nadu") {
      return "Received";
    } else if (rfqs.supply_port === "Kerala") {
      return "Cancelled";
    } else if (rfqs.supply_port === "Mumbai") {
      return "Confirmed";
    }
  };

  return (
    <>
      <div className="pt-4">
        <h1 className="text-3xl text-center font-bold">
          RFQs (Request for Quotes)
        </h1>
      </div>
      <div className="relative flex justify-center max-w-5xl mx-auto mt-4  bg-gray-100 rounded-full p-2 shadow-xl mb-4">
        <div className="relative flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative z-10 px-4 py-2 text-sm font-medium transition ${tab.text} ${
                activeTab === tab.id ? "text-black" : "text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className={`absolute inset-0 ${tab.color} ${tab.text} shadow-2xl rounded-full z-[-1]`}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <table className="mt-4 w-full max-w-7xl border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Ref ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Lead Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Supply Port</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Vessel Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Brand</th>
            <th className="border border-gray-300 px-4 py-2 text-left">RFQ Status</th>
          </tr>
        </thead>
        <tbody>
          {filterRfqs.map((rfq, i) => (
            <React.Fragment key={i}>
              <tr
                key={i}
                className="border border-gray-300 cursor-pointer"
                onClick={() => toggleRow(i, rfq.id)}
              >
                <td className="border border-gray-300 px-4 py-2">{rfq.id}</td>
                <td className="border border-gray-300 px-4 py-2">{rfq.created_at}</td>
                <td className="border border-gray-300 px-4 py-2">{rfq.supply_port || "-"}</td>
                <td className="border border-gray-300 px-4 py-2">{rfq.vessel_name || "-"}</td>
                <td className="border border-gray-300 px-4 py-2">{rfq.brand || "-"}</td>
                <td className="text-center border border-gray-300">
                  <Badge
                    className={`inline-flex items-center justify-center px-2 py-1 text-white b rounded ${
                      rfq.supply_port === "Goa"
                        ? "bg-green-600"
                        : rfq.supply_port === "Kerala"
                        ? "bg-red-600"
                        : rfq.supply_port === "Mumbai"
                        ? "bg-green-700"
                        : rfq.supply_port === "Tamil Nadu"
                        ? "bg-blue-500"
                        : "bg-none"
                    }`}
                  >
                    {handleData(rfq)}
                  </Badge>
                </td>
              </tr>
              {expandedRow === i && (
                <tr className="bg-gray-50">
                  <td colSpan={6} className="px-4 py-2">
                    <div className="p-2">
                      <strong>Items:</strong>
                      {rfqItems[rfq.id] ? (
                        rfqItems[rfq.id].length > 0 ? (
                          <ul className="list-disc pl-4">
                            {rfqItems[rfq.id].map((item) => (
                              <li key={item.id}>
                                <strong>Description:</strong>{" "}
                                {item.description || "N/A"} <br />
                                <strong>Req. Qty.:</strong>{" "}
                                {item.quantity || "N/A"} <br />
                                <strong>UOM:</strong> {item.uom || "N/A"}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No items found</p>
                        )
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}