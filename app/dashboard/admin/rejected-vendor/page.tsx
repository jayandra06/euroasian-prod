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
import { Button } from "@/components/ui/button";


export default function InventoryMerchnats() {
    const [merchants, setMerchants] = useState<any[]>([]);

    async function approve(id: string) {
        const supabase = createClient();
        const merchant = await supabase.from("merchant").update({ status: "approved" }).eq("id", id);
        alert("Vendor Successfully Approved!");
        window.location.reload();
    }


    async function fetchMerchants() {
        const supabase = createClient();

        const merchants = await supabase.from("merchant").select("*").eq("status", "rejected");

        setMerchants([...merchants.data!]);
    }

    useEffect(() => {
        fetchMerchants();
    }, []);

    return (
        <main className="mt-8 p-4">
            <div className="flex justify-between">
                <h1 className="text-xl font-bold">
                    All Rejected Merchants
                </h1>
            </div>

            <div className="mt-8">
                <Table>
                    <TableCaption>A list of all Disabled Merchants.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Phone</TableHead>
                            <TableHead className="text-right">Status</TableHead>
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
                                    {(merchant.status == "waiting") || (merchant.status == "rejected") && (
                                        <Button onClick={() => approve(merchant.id)}>
                                            Approve
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </main>
    )
}