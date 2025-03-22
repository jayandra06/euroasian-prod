"use client";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {Button} from "@/components/ui/button"
import React from "react";


export default function RFQsPage() {
 
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [rfqItems, setRfqItems] = useState<{ [key: number]: any[] }>({}); // Store items for each RFQ

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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: memberData } = await supabase
        .from("member")
        .select("*")
        .eq("member_profile", user!.id);

      let allRfqs: any[] = [];

      for (const member of memberData!) {
        const { data: rfqsAll } = await supabase
          .from("rfq")
          .select("*")
          .eq("branch", member.branch);

        allRfqs = [...allRfqs, ...rfqsAll!];
      }

      setRfqs(allRfqs);
    } catch (e) {
      console.error("Unable to fetch RFQs:", e);
    }
  }

  useEffect(() => {
    fetchRfqs();
  }, []);

  

  return (
    <>
      <div className="pt-4" style={{display:"flex", justifyContent:"space-between"}}>
        <h1 className="text-3xl font-bold">Your RFQs</h1>
        <Button className="ml-9">
              <Link
                href={"/dashboard/customer/create-enquiry"}
                className="text-center text-white py-2 text-xs font-semibold grid w-full rounded-lg bg-black dark:text-black dark:bg-white "
              >
                Create Enquiry
              </Link>
              </Button>
 
      </div>
      <table className="mt-4 w-full max-w-7xl border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Ref ID</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Lead Date</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Supply Port</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Vessel Name</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Brand</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
          
        </tr>
      </thead>
      <tbody>
        {rfqs.map((rfq, i) => (
          <React.Fragment key={rfq.id}>
         
            <tr  onClick={() => toggleRow(i, rfq.id)} key={i} className="border cursor-pointer border-gray-300">
              <td className="border border-gray-300 px-4 py-2">{` EA${new Date().getFullYear()}${rfq.id}`.slice(1, 15)}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(rfq.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day:"2-digit", hour: '2-digit', minute: '2-digit' })}</td>
              <td className="border border-gray-300 px-4 py-2">{rfq.supply_port || "-"}</td>
              <td className="border border-gray-300 px-4 py-2">{rfq.vessel_name || "-"}</td>
              <td className="border border-gray-300 px-4 py-2">{rfq.brand || "-"}</td>
              <td className="border border-gray-300 px-4 py-2">{rfq.status || "-"}</td>
              
             
              
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
                                <strong>Description:</strong> {item.description || "N/A"} <br />
                                <strong>Req. Qty.:</strong> {item.quantity || "N/A"} <br />
                                <strong>UOM:</strong> {item.uom || "N/A"}
                              </li>
                            ))}
                          </ul>
                        ): (
                          <p>No items found</p>
                        )
                      ) : (
                        <p>Loading...</p>
                      )}
                      
                    {/* <Link
                      href={`/dashboard/customer/rfqs/${rfq.id}`}
                      className="text-blue-500 underline mt-2 inline-block"
                    >
                      Go to Full Details
                    </Link> */}
                  </div>
                </td>
                <td><Button><Link
                href={"/dashboard/customer/view-rfq"}
                className="text-center text-white py-2 text-xs font-semibold grid w-full rounded-lg bg-black dark:text-black dark:bg-white "
              >
                View Rfq
              </Link></Button></td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>

      

    </>
  );
}