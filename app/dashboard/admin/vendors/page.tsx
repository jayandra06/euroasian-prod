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
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 5;

type MerchantStatus = "waiting" | "approved" | "rejected" | "disabled" | "all";

export default function InventoryMerchnats() {
    const [merchants, setMerchants] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMerchants, setTotalMerchants] = useState(0);
    const [currentStatus, setCurrentStatus] = useState<MerchantStatus>("all");
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function getUserId() {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        }
        getUserId();
    }, [supabase]);

    async function updateMerchantStatus(
        id: string,
        status: "approved" | "rejected" | "disabled"
    ) {
        const { error } = await supabase
            .from("merchant")
            .update({ status: status === "disabled" ? "rejected" : status }) // Map 'disabled' to 'rejected' in DB
            .eq("id", id);

        if (error) {
            toast.error(`Failed to ${status} vendor: ${error.message}`);
        } else {
            toast.success(`Vendor successfully ${status}!`);
            fetchMerchants();
        }
    }

    const approve = (id: string) => updateMerchantStatus(id, "approved");
    const reject = (id: string) => updateMerchantStatus(id, "rejected");
    const disable = (id: string) => updateMerchantStatus(id, "disabled");
    const enable = (id: string) => updateMerchantStatus(id, "approved"); // Assuming enabling means setting status back to approved

    async function fetchMerchants() {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE - 1;

        let query = supabase
            .from("merchant")
            .select("*", { count: "exact" })
            .range(startIndex, endIndex);

        if (currentStatus !== "all") {
            query = query.eq(
                "status",
                currentStatus === "disabled" ? "rejected" : currentStatus
            ); // Assuming 'rejected' is 'disabled' in your DB
        }

        const { data, error, count } = await query;

        if (error) {
            toast.error(`Failed to fetch merchants: ${error.message}`);
        } else {
            setMerchants(data || []);
            setTotalMerchants(count || 0);
        }
    }

    const addVendor = async (e: any) => {
        e.preventDefault();
    
        if (!userId) {
            toast.error("User ID not available. Please try again.");
            return;
        }
    
        const formData = new FormData(e.target);
        const inviteEmail = (formData.get("email") as string).trim();
        const type = "EXTERNAL_VENDOR";
    
        if (!inviteEmail) {
            toast.error("Email is required.");
            return;
        }
    
        setLoading(true);
    
        try {
            // Call your internal API to check user existence
            const checkRes = await fetch("/api/check-user-exist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: inviteEmail }),
            });
    
            const checkData = await checkRes.json();
    
            if (checkData.exists) {
                alert("Email already exists.");
                return;
            }
    
            // Proceed with invite if user doesn't exist
            const res = await fetch("/api/invite-vendor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: inviteEmail,
                    userId,
                    type,
                }),
            });
    
            if (res.ok) {
                alert("Vendor invite sent successfully!");
            } else {
                const errorData = await res.json();
                toast.error(
                    `Failed to send invite: ${errorData?.message || "Unknown error"}`
                );
            }
        } catch (error: any) {
            console.error("Error sending invite:", error);
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        setCurrentPage(1); // Reset to the first page when the status changes
        fetchMerchants();
    }, [currentPage, currentStatus]);

    const totalPages = Math.ceil(totalMerchants / ITEMS_PER_PAGE);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleTabChange = (status: MerchantStatus) => {
        setCurrentStatus(status);
    };

    return (
        <main className="mt-8 p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">All Merchants</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={"outline"}>Add Vendor</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite New Vendor</DialogTitle>
                            <DialogDescription>
                                Enter the vendor's email address to send an invitation.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={addVendor}> {/* Use onSubmit here */}
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Vendor Email
                                    </Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="vendor@example.com"
                                        id="email"
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Sending..." : "Send Invitation"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex space-x-2 mb-4">
                <Button
                    variant={currentStatus === "all" ? "default" : "outline"}
                    onClick={() => handleTabChange("all")}
                >
                    All
                </Button>
                <Button
                    variant={currentStatus === "approved" ? "default" : "outline"}
                    onClick={() => handleTabChange("approved")}
                >
                    Approved
                </Button>
                <Button
                    variant={currentStatus === "waiting" ? "default" : "outline"}
                    onClick={() => handleTabChange("waiting")}
                >
                    Waiting
                </Button>
                <Button
                    variant={currentStatus === "rejected" ? "default" : "outline"}
                    onClick={() => handleTabChange("rejected")}
                >
                    Rejected
                </Button>
                <Button
                    variant={currentStatus === "disabled" ? "default" : "outline"}
                    onClick={() => handleTabChange("disabled")}
                >
                    Disabled
                </Button>
               
            </div>

            <div className="mt-8">
                <Table>
                    <TableCaption>
                        A list of {currentStatus === "all" ? "all" : currentStatus}{" "}
                        Merchants.
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Phone</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {merchants.map((merchant, i) => (
                            <TableRow key={i}>
                                <TableCell>{merchant.name}</TableCell>
                                <TableCell>{merchant.business_email}</TableCell>
                                <TableCell className="text-right">{merchant.phone}</TableCell>
                                <TableCell className="text-center">{merchant.status}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                &#8942;
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {merchant.status === "waiting" && (
                                                <>
                                                    <DropdownMenuItem
                                                        onClick={() => approve(merchant.id)}
                                                    >
                                                        Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => reject(merchant.id)}>
                                                        Reject
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            {merchant.status === "approved" && (
                                                <DropdownMenuItem onClick={() => disable(merchant.id)}>
                                                    Disable
                                                </DropdownMenuItem>
                                            )}
                                            {merchant.status === "rejected" && (
                                                <DropdownMenuItem onClick={() => approve(merchant.id)}>
                                                    Enable
                                                </DropdownMenuItem>
                                            )}
                                            {merchant.status === "disabled" && (
                                                <DropdownMenuItem onClick={() => approve(merchant.id)}>
                                                    Enable
                                                </DropdownMenuItem>
                                            )}
                                            <div className="my-1 border-t" />
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/admin/view-vendor/${merchant.id}`}>
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <Button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                    >
                        Previous
                    </Button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                    >
                        Next
                    </Button>
                </div>
            )}
        </main>
    );
}