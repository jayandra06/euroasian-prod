"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Page = () => {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [rfqItems, setRfqItems] = useState<{ [key: number]: any[] }>({});
  const [filterRfqs, setFilterRfq] = useState<any[]>([]);
  const [progress, setProgress] = useState(0); // 0% → A, 50% → Midway, 100% → B

  const supabase = createClient();

  const toggleRow = async (index: number, rfqId: number) => {
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
        setRfqItems((prev) => ({ ...prev, [rfqId]: items || [] }));
      } catch (err) {
        console.error("Error fetching RFQ items:", err);
      }
    }

    setExpandedRow(index);
  };

  async function fetchRfqs() {
    const { data: rfqs, error } = await supabase.from("rfq").select();
    if (error) {
      console.error("Error fetching RFQs:", error);
      return;
    }

    setRfqs(rfqs || []);
    setFilterRfq(rfqs || []);

    const tamilNaduIndex = rfqs.findIndex((rfq) => rfq.supply_port === "Tamil Nadu");
    if (tamilNaduIndex !== -1) {
      setExpandedRow(tamilNaduIndex);
    }
  }

  useEffect(() => {
    fetchRfqs();
  }, []);

  useEffect(() => {
    const startTransition = async () => {
      setProgress(0);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Start with a small delay
      setProgress(50);
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait at 50%
      setProgress(100);
    };

    startTransition();
  }, []);

  const handleData = (rfq: any) => {
    switch (rfq.supply_port) {
      case "Goa":
        return "In-transit";
      case "Tamil Nadu":
        return "Confirmed";
      case "Kerala":
        return "Cancelled";
      case "Mumbai":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <div className="text-center text-3xl text-black font-bold mt-3 mb-4">
        <h1>Orders</h1>
      </div>
      <table className="mt-4 w-full max-w-7xl border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Ref ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Lead Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Supply Port</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Vessel Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Brand</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Order Status</th>
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
                    className={`inline-flex items-center justify-center px-2 py-1 text-white rounded ${
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
                      {rfq.supply_port === "Goa" && (
                        <div className="p-2">
                          <ol className="flex items-center w-full">
                            <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-4">
                            <motion.div
                            className="absolute top-1/2 left-0 h-2 bg-gray-900"
                            initial={{ width: "0%" }}
                            animate={{ width: progress >= 50 ? "50%" : "0%" }}
                            transition={{ duration: 4 }}
                          >

                          </motion.div>
                                A
                              
                            </li>
                            <li className="flex w-full items-center relative">
                          <motion.div
                            className="absolute top-1/2 left-0 h-2 bg-gray-900"
                            initial={{ width: "0%" }}
                            animate={{ width: progress >= 50 ? "50%" : "0%" }}
                            transition={{ duration: 4 }}
                          />
                          <motion.div
                            className="absolute top-1/2 left-1/2 h-2 bg-gray-900"
                            initial={{ width: "0%" }}
                            animate={{ width: progress === 100 ? "50%" : "0%" }}
                            transition={{ duration: 4, delay: 10 }}
                          />
                        </li>
                            <li className="flex w-full items-center">
                              <motion.span
                                className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                                  progress >= 100
                                    ? "bg-blue-100 dark:bg-blue-800"
                                    : "bg-blue-900 dark:bg-blue-700"
                                }`}
                                initial={{ scale: 1 }}
                                animate={{ scale: progress === 100 ? 1.2 : 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                B
                              </motion.span>
                            </li>
                          </ol>
                        </div>
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
};

export default Page;