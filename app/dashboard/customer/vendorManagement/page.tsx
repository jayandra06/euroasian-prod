"use client";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';






export default function vendorManagement() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [enable, setEnable] = useState(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [rfqItems, setRfqItems] = useState<{ [key: number]: any[] }>({}); // Store items for each RFQ

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');



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
      const {
        data: { user },
      } = await supabase.auth.getUser();
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

  const handleToogle = ()=>{
    setEnable((prev)=>!prev)
  }


  const addTag = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      setTags([...tags, event.target.value.trim()]);
      event.target.value = ''; // Clear input after adding a tag
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  const handleBackspace = (event) => {
    if (event.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1); // Remove last tag
    }
  };


  return (
    <>
      <div
        className="pt-4"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h1 className="text-3xl font-bold">Your Vendors</h1>

        <Dialog>
  <DialogTrigger>
    
            
         
            <Button className="text-center text-white py-2 text-xs font-semibold grid w-full rounded-lg bg-black dark:text-black dark:bg-white">Invite Vendor</Button>
         </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="text-center">Invite Vendor</DialogTitle>
      <DialogDescription className="mt-4">
      <Label className="text-black font-bold" htmlFor="email">Email</Label>
      
      <div className="flex flex-wrap gap-2 border border-black rounded-md mt-2">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center bg-black text-white px-2 py-1 ml-1 rounded-md">
            <span>{tag}</span>
          </div>
        ))}
        <input
          type="text"
          placeholder="Enter a Email"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            addTag(e);
            handleBackspace(e);
          }}
          className="flex-1 min-w-[120px]  bg-white text-black border-none outline-none p-2"
        />
      </div>
      

      </DialogDescription>
    </DialogHeader>
    <DialogFooter><Button className="mx-auto">Submit</Button></DialogFooter>
  </DialogContent>
</Dialog>


        <Button className="ml-9">
          <Link
            href={"/dashboard/customer/view-rfq"}
            className="text-center text-white py-2 text-xs font-semibold grid w-full rounded-lg bg-black dark:text-black dark:bg-white "
          >
            Invite Vendor
          </Link>
        </Button>

      </div>
      <table className="mt-4 w-full max-w-7xl border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Vendor ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Vendor Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Mail Id
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Contact No.
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {rfqs.map((rfq, i) => (
            <React.Fragment key={rfq.id}>
              <tr
                
                key={i}
                className="border cursor-pointer border-gray-300"
              >
                <td className="border border-gray-300 px-4 py-2">3849479340</td>
                <td className="border border-gray-300 px-4 py-2">
                  Abhinav spares Pvt. Ltd
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  supplier@abhinav.com
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  +95174397408
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <label  className="inline-flex items-center cursor-pointer">
                    <input checked={enable} onChange={handleToogle}   type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {enable ? "Enable":"Disable"}
                    </span>
                  </label>
                </td>
              </tr>
            
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );

