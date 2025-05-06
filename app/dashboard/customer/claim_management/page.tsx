"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import Link from 'next/link';

const ClaimManagement = () => {
  const [orderNumber, setOrderNumber] = useState("");

  const handleProceed = () => {
    if (orderNumber.trim() === "") {
      alert("Please enter a valid order number.");
      return;
    }
    console.log("Proceeding with Order:", orderNumber);
    // Add your logic here
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Claim Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="flex gap-2 items-center">
              <PlusCircle className="w-4 h-4" />
              Create Claim
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Order Number</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Order Number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="mt-2"
            />
            <Button  className="mt-4 w-full" onClick={handleProceed}>
                <Link href={`/dashboard/customer/claim_management/claimSection `}>
              Proceed
                </Link>
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClaimManagement;
