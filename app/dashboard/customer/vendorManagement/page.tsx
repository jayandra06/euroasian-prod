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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import "react-tagsinput/react-tagsinput.css";
import { set } from "react-hook-form";
import { loadComponents } from "next/dist/server/load-components";
import { inviteVendorWithEmail } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function vendorManagement() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [enable, setEnable] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [rfqItems, setRfqItems] = useState<{ [key: number]: any[] }>({}); // Store items for each RFQ

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setemail] = useState("");
  const router = useRouter();

  const supabase = createClient();

  const getVendors = async () => {
    const { data: vendorData, error: vendorError } = await supabase
      .from("externalvendor")
      .select();
    if (vendorError) {
      console.log("Failed to fetch vendors", vendorError);
    } else {
      setVendors(vendorData || []);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);
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

  const handleToogle = () => {
    setEnable((prev) => !prev);
  };

  const handleVendorEmail = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/invite-vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        alert("Vendor invite email sent successfully!");
      } else {
        const errorText = await res.text();
        alert("Failed to send invite: " + errorText);
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = event.currentTarget.value.trim();
      if (value !== "") {
        setTags([...tags, value]);
        event.currentTarget.value = ""; // Clear input after adding a tag
      }
    }
  };

  const removeTag = (index: any) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  const handleBackspace = (event: any) => {
    if (event.key === "Backspace" && inputValue === "" && tags.length > 0) {
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
            <Button className="text-center text-white py-2 text-xs font-semibold grid w-full rounded-lg bg-black dark:text-black dark:bg-white">
              Invite Vendor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">Invite Vendor</DialogTitle>
              <DialogDescription className="mt-4">
                <Label className="text-black font-bold" htmlFor="email">
                  Email
                </Label>

                <div className="flex flex-wrap gap-2 border border-black rounded-md mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-black text-white px-2 py-1 ml-1 rounded-md"
                    >
                      <span>{tag}</span>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Enter a Email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    onKeyDown={(e) => {
                      addTag(e);
                      handleBackspace(e);
                    }}
                    className="flex-1 min-w-[120px]  bg-white text-black border-none outline-none p-2"
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                disabled={loading}
                onClick={handleVendorEmail}
                className="mx-auto"
              >
                {loading ? "Sending..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          {vendors.length > 0 ? (
            vendors.map((vendor, i) => (
              <tr key={vendor.id} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">
                  {vendor.id.slice(0, 8)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {vendor.username}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {vendor.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {vendor.phonenumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      checked={enable}
                      onChange={() => setEnable((prev) => !prev)}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className="ml-3 text-sm font-medium">
                      {enable ? "Enable" : "Disable"}
                    </span>
                  </label>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No Vendors Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
