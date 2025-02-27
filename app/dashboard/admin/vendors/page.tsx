"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteVendorWithEmail } from "@/app/actions";


export default function InventoryMerchnats() {
    const [merchants, setMerchants] = useState<any[]>([]);

    async function approve(id: string) {
        const supabase = createClient();
        const merchant = await supabase.from("merchant").update({ status: "approved" }).eq("id", id);
        alert("Vendor Successfully Approved!");
        window.location.reload();
    }

    async function reject(id: string) {
        const supabase = createClient();
        const merchant = await supabase.from("merchant").update({ status: "rejected" }).eq("id", id);

        alert("Vendor Disabled!!!");
        window.location.reload();
    }

    async function fetchMerchants() {
        const supabase = createClient();

        const merchants = await supabase.from("merchant").select();

        setMerchants([...merchants.data!]);
    }

    async function addVendor(e: any) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const res = await fetch("/api/add-vendor/", {method: "POST", body: formData});
        const data = await res.json();
    }

    useEffect(() => {
        fetchMerchants();
    }, []);

    return (
        <main className="mt-8 p-4">
            <div className="flex justify-between">
                <h1 className="text-xl font-bold">
                    All Merchants
                </h1>

                <Dialog>
                    <DialogTrigger>
                        <Button variant={"outline"}>
                            Add Vendor
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Vendor</DialogTitle>
                            <DialogDescription>
                                Enter Vendor Details
                            </DialogDescription>
                        </DialogHeader>

                        <form method="POST" onSubmit={addVendor}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vesselName" className="text-right">
                                        Vendor Email
                                    </Label>
                                    <Input type="email" name="email" placeholder="Enter Vendor Email..." id="email" className="col-span-3" />
                                </div>
                            </div>
                            <Button type="submit">Add Vendor</Button>
                        </form>

                        <DialogFooter>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="my-4">
                <Link href={"/dashboard/admin/rejected-vendor"}>
                <Button>
                    View Disabled Vendors
                </Button>
                </Link>
            </div>

            <div className="mt-8">
                <Table>
                    <TableCaption>A list of all Merchants.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Phone</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {merchants.map((merchant, i) =>
                            <TableRow key={i}>
                                <TableCell className="font-medium">{merchant.id}</TableCell>
                                <TableCell>{merchant.name}</TableCell>
                                <TableCell>{merchant.business_email}</TableCell>
                                <TableCell className="text-right">{merchant.phone}</TableCell>
                                <TableCell className="text-right">
                                    {merchant.status == "waiting" && (
                                        <>
                                        <Button onClick={() => reject(merchant.id)}>
                                            Reject
                                        </Button>
                                        <Button onClick={() => approve(merchant.id)}>
                                            Approve
                                        </Button>
                                        </>
                                    )}
                                    {merchant.status == "approved" && (
                                        <Button onClick={() => reject(merchant.id)}>
                                            Disable
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/admin/vendors/${merchant.id}`}>
                                        View
                                    </Link>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </main>
    )
}