"use client";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {Button} from "@/components/ui/button"
// import {RFQTable} from "@/dashboard/commonComponent/rfqtable"



export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);

  async function fetchRfqs() {
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const memberData = await supabase
        .from("member")
        .select("*")
        .eq("member_profile", user!.id);

      let allRfqs = [...rfqs];

      for (let i = 0; i < memberData.data!.length; i++) {
        const member = memberData.data![i];

        const rfqsAll = await supabase
          .from("rfq")
          .select("*")
          .eq("branch", member.branch);
        allRfqs = [...allRfqs, ...rfqsAll.data!];
        console;
      }

      setRfqs([...allRfqs]);
    } catch (e) {
      console.log("Unable to fetch RFQs, ", e);
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