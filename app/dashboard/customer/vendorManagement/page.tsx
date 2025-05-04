"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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
import { PlusIcon } from "@radix-ui/react-icons";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Vendor {
  id: string;
  name: string;
  business_email: string;
  phone: string;
  is_active: boolean;
  status: string;
  vendor_type: string;
}

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const [userId, setuserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    vendorType: "",
    country: "",
    searchTerm: "",
  });

  const router = useRouter();

  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleVendorTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      vendorType: e.target.value,
    }));
  };

  const getVendors = useCallback(
    async (filters: any) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const userId = user?.id;
        if (!userId) {
          toast.error("User not found.");
          return;
        }

        setuserId(userId);

        let query = supabase
          .from("merchant")
          .select("*")
          .eq("parent_id", userId);
        console.log("filters", filters);

        if (filters.status) query = query.eq("status", filters.status);
        if (filters.vendorType)
          query = query.eq("vendor_type", filters.vendorType);
        if (filters.country)
          query = query.eq("vendor_country", filters.country);

        // If there's a search term, apply it to filter vendor name
        if (filters.searchTerm) {
          query = query.ilike("name", `%${filters.searchTerm}%`);
        }

        const { data: directMerchants, error: directError } = await query;
        if (directError) throw directError;

        let accessQuery = supabase
          .from("vendor_access")
          .select("merchant:vendor_id(*)")
          .eq("customer_id", userId);

        const { data: accessMerchants, error: accessError } = await accessQuery;
        if (accessError) throw accessError;

        const associatedMerchants = accessMerchants
          .map((item) => item.merchant)
          .filter((m) => m !== null);

        const allMerchantsMap = new Map();
        [...directMerchants, ...associatedMerchants].forEach((merchant) => {
          if (merchant?.id) {
            allMerchantsMap.set(merchant.id, merchant);
          }
        });

        setVendors(Array.from(allMerchantsMap.values()));
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Failed to load vendors.");
      }
    },
    [supabase]
  );

  useEffect(() => {
    getVendors(filters);
  }, [filters, getVendors]);

  const type = "INTERNAL_VENDOR";

  const handleInviteVendor = async () => {
    setLoading(true);

    const trimmedEmail = inviteEmail.trim();

    if (!trimmedEmail) {
      toast.error("Please enter an email to invite.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Check if email exists and is already linked
      const checkRes = await fetch("/api/check-user-exist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          userId,
          type,
        }),
      });

      const checkData = await checkRes.json();

      if (checkRes.ok) {
        // Handle case where the user exists but is already linked
        if (checkData.exists && checkData.linked) {
          toast.success("Vendor already exist in admin. Added Successfully");
          setLoading(false);
          return;
        }

        // Handle case where user exists but is not linked (you may want to take specific action here)
        if (checkData.exists && !checkData.linked) {
          toast.error(
            "This vendor exists but is not yet linked. You can proceed with linking."
          );
        }
      } else {
        // Handle any error in the check API (e.g., failed request)
        toast.error(checkData?.message || "Error checking vendor access.");
        setLoading(false);
        return;
      }

      // Step 2: Proceed with sending invite
      const inviteRes = await fetch("/api/invite-vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          userId,
          type,
        }),
      });

      const inviteData = await inviteRes.json();

      if (inviteRes.ok) {
        toast.success("Vendor invite sent successfully!");
        setInviteEmail(""); // Clear email input after success
      } else {
        toast.error(
          `Failed to send invite: ${inviteData?.message || "Unknown error"}`
        );
      }
    } catch (error: any) {
      console.error("Error sending invite:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const search = searchTerm.toLowerCase();
    return (
      vendor.name?.toLowerCase().includes(search) ||
      vendor.status?.toLowerCase().includes(search) ||
      vendor.business_email?.toLowerCase().includes(search) ||
      vendor.phone?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Manage Your Vendors
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition duration-200">
              <PlusIcon className="mr-2 h-4 w-4" />
              Invite Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Invite New Vendor
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                Enter the email address of the vendor you wish to invite.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="invite-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="vendor@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full rounded-md shadow-sm border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setInviteEmail("")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleInviteVendor}
                disabled={loading}
              >
                {loading ? "Sending Invite..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
<div className="flex flex-wrap items-center justify-between space-y-4 mb-6">
  <div className="flex flex-col space-y-2 w-full sm:w-auto sm:mr-4">
    <Label
      htmlFor="status-filter"
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Filter by Status
    </Label>
    <select
      id="status-filter"
      value={filters.status}
      onChange={handleStatusChange}
      className="border px-2 py-1 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
    >
      <option value="">All Statuses</option>
      <option value="approved">Approved</option>
      <option value="waiting">Pending</option>
      <option value="rejected">Rejected</option>
    </select>
  </div>

  <div className="flex flex-col space-y-2 w-full sm:w-auto sm:mr-4">
    <Label
      htmlFor="vendor-type-filter"
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Filter by Vendor Type
    </Label>
    <select
      id="vendor-type-filter"
      value={filters.vendorType}
      onChange={(e) =>
        setFilters({ ...filters, vendorType: e.target.value })
      }
      className="border px-2 py-1 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
    >
      <option value="">All Vendor Types</option>
      <option value="INTERNAL_VENDOR">Internal Vendor</option>
      <option value="EXTERNAL_VENDOR">External Vendor</option>
    </select>
  </div>

  <div className="flex flex-col space-y-2 w-full sm:w-auto sm:flex-1">
    <Label
      htmlFor="search-filter"
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Search Vendors
    </Label>
    <Input
      id="search-filter"
      type="text"
      placeholder="Search by vendor name, email, status, phone..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    />
  </div>
</div>

       
      

      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader className="bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vendor Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email ID
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact No.
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vendor Type
              </TableHead>

              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
            <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {vendor.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {vendor.business_email}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {vendor.phone || "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {vendor.vendor_type || "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {vendor.status || "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div className="relative">
                  <Button
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md"
                  onClick={() =>
                    window.location.href = `http://localhost:3000/dashboard/customer/view-vendor/${vendor.id}`
                  }
                  >
                  View
                  </Button>
                </div>
                </TableCell>
              </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No Vendors Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
