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
}

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const [userId, setuserId] = useState("");
  const router = useRouter();

  const getVendors = useCallback(async () => {
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
  
      // Fetch merchants where user is the parent
      const { data: directMerchants, error: directError } = await supabase
        .from("merchant")
        .select("*")
        .eq("parent_id", userId);
  
      if (directError) throw directError;
  
      // Fetch merchants associated via vendor_access
      const { data: accessMerchants, error: accessError } = await supabase
        .from("vendor_access")
        .select("merchant:vendor_id(*)") // Get vendor info from merchant table
        .eq("customer_id", userId);
  
      if (accessError) throw accessError;
  
      // Extract nested merchant data from vendor_access
      const associatedMerchants = accessMerchants
        .map((item: any) => item.merchant)
        .filter((m: any) => m !== null); // In case of null joins
  
      // Combine both sets, remove duplicates by merchant id
      const allMerchantsMap = new Map();
      [...directMerchants, ...associatedMerchants].forEach((merchant: any) => {
        if (merchant && merchant.id) {
          allMerchantsMap.set(merchant.id, merchant);
        }
      });
  
      const combinedMerchants = Array.from(allMerchantsMap.values());
  
      setVendors(combinedMerchants as Vendor[]);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to load vendors.");
    }
  }, [supabase]);
  
  
  

  useEffect(() => {
    getVendors();
  }, [getVendors]);

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
          toast.error("This vendor exists but is not yet linked. You can proceed with linking.");
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
        setInviteEmail("");  // Clear email input after success
      } else {
        toast.error(`Failed to send invite: ${inviteData?.message || "Unknown error"}`);
      }
  
    } catch (error: any) {
      console.error("Error sending invite:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleStatusChange = async (vendorId: string, isActive: boolean) => {
    const { error } = await supabase
      .from("merchant")
      .update({ is_active: isActive })
      .eq("id", vendorId);

    if (error) {
      console.error("Error updating vendor status:", error);
      toast.error("Failed to update vendor status.");
    } else {
      // Optimistically update the UI
      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, is_active: isActive } : vendor
        )
      );
      toast.success(
        `Vendor status updated to ${isActive ? "Enabled" : "Disabled"}`
      );
    }
  };

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
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {vendors.length > 0 ? (
              vendors.map((vendor) => (
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
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                    <Switch
                      id={`vendor-status-${vendor.id}`}
                      checked={vendor.is_active}
                      onCheckedChange={(checked) =>
                        handleStatusChange(vendor.id, checked)
                      }
                    />
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
