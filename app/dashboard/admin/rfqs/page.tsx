"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RFQsPage() {
    const [rfqs, setRfqs] = useState<any[]>([]);

    async function fetchRfqs() {
        const supabase = createClient();
        const { data, error } = await supabase.from("rfq").select();

        if (error) {
            console.error("Error fetching RFQs:", error);
            return;
        }

        setRfqs(data || []);
    }

    useEffect(() => {
        fetchRfqs();
    }, []);

    return (
        <>
            <div className="pt-4">
                <h1 className="text-3xl font-bold">RFQs Received</h1>
            </div>
            <table className="mt-4 w-full max-w-7xl border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Ref ID</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Lead Date</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Port</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Supply Port</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {rfqs.map((rfq, i) => (
          <tr key={i} className="border border-gray-300">
            <td className="border border-gray-300 px-4 py-2">{rfq.id}</td>
            <td className="border border-gray-300 px-4 py-2">{rfq.created_at}</td>
            <td className="border border-gray-300 px-4 py-2">{rfq.port ? rfq.port : "-"}</td>
            <td className="border border-gray-300 px-4 py-2">{rfq.supply_port ? rfq.supply_port : "-"}</td>
            <td className="border border-gray-300 px-4 py-2">
              <Link
                href={`/dashboard/customer/rfqs/${rfq.id}`}
                className="text-white px-4 py-1 text-xs font-semibold rounded bg-black dark:text-black dark:bg-white"
              >
                View Details
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
        </>
    );
}
