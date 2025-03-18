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
import { Checkbox } from "@/components/ui/checkbox";
import { CornerRightDown } from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [rfqItems, setRfqItems] = useState<{ [key: number]: any[] }>({}); // Store items for each RFQ

  const [filterRfqs, setFilterRfq] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("All");

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

  const handleTabChange = (tabkey: string) => {
    setSelectedTab(tabkey);

    if (tabkey === "All") {
      setFilterRfq(rfqs);
    } else if (tabkey === "received") {
      setFilterRfq(rfqs.filter((rfq) => rfq.status === "receive"));
    } else if (tabkey === "sent") {
      setFilterRfq(rfqs.filter((rfq) => rfq.status === "sent"));
    } else if (tabkey === "confirmed") {
      setFilterRfq(rfqs.filter((rfq) => new Date(rfq.due_date) > new Date()));
    } else if (tabkey === "cancelled") {
      setFilterRfq(rfqs.filter((rfq) => new Date(rfq.due_date) < new Date()));
    }
  };

  const activeTab = (key: string) => {
    switch (key) {
      case "All":
        return "primary";
      case "received":
        return "success";

      case "sent":
        return "primary";
      case "cancelled":
        return "danger";
      case "confirmed":
        return "success";
    }
  };

  return (
    <>
      <div className="pt-4">
        <h1 className="text-3xl text-center font-bold">
          RFQs (Request for Quotes)
        </h1>
      </div>
      <div className="mx-auto">
        <Tabs
          aria-label="Tabs colors"
          color={activeTab(selectedTab)}
          radius="full"
          selectedKey={selectedTab}
          onSelectionChange={(key) => handleTabChange(key as string)}
        >
          <Tab key="All" title="All" />
          <Tab key="received" title="RFQ Received" />
          <Tab key="sent" title="RFQ Sent" />
          <Tab key="cancelled" title="Order Cancelled" />
          <Tab key="confirmed" title="Order Confirmed" />
        </Tabs>
      </div>

      <table className="mt-4 w-full max-w-7xl border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Ref ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Lead Date
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Supply Port
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Vessel Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Brand
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              RFQ Status
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Order Status
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {filterRfqs.map((rfq, i) => (
            <React.Fragment key={rfq.id}>
              <tr key={i} className={`border border-gray-300 ${rfq.status === "sent" && new Date(rfq.due_date) > new Date()
                        ? "bg-red-700"
                        : "bg-green-400"
                    } `}>
                <td className="border border-gray-300 px-4 py-2">{rfq.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {rfq.created_at}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {rfq.supply_port || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {rfq.vessel_name || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {rfq.brand || "-"}
                </td>
                <td className="text-center border border-gray-300">
                  <Badge
                    className={`inline-flex items-center justify-center px-2 py-1 text-white rounded ${
                      rfq.status === "sent"
                        ? "bg-blue-600 hover:bg-blue-600"
                        : "bg-red-700 hover:bg-red-600"
                    }`}
                  >
                    {rfq.status || "-"}
                  </Badge>
                </td>
                <td className="text-center">
                  <Badge
                    className={`inline-flex items-center justify-center px-2 py-1 text-white rounded ${
                      new Date(rfq.due_date) > new Date()
                        ? "bg-blue-600 hover:bg-blue-600"
                        : "bg-red-700 hover:bg-red-700"
                    }`}
                  >
                    {new Date(rfq.due_date) > new Date() ? (
                      <p>Confirmed</p>
                    ) : (
                      <p>Cancelled</p>
                    )}
                  </Badge>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => toggleRow(i, rfq.id)}
                    className="text-white px-4 py-1 text-xs font-semibold rounded bg-black dark:text-black dark:bg-white"
                  >
                    {expandedRow === i ? "Hide Details" : "View Details"}
                  </button>
                </td>
              </tr>
              {expandedRow === i && (
                <tr className="bg-gray-50">
                  <td colSpan={5} className="px-4 py-2">
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
