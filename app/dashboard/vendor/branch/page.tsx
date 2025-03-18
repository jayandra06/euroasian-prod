"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";



function BranchCard({ branch }: { branch: any }) {
    const [admin, setAdmin] = useState<any>(null);
    const [memberCount, setMemberCount] = useState(0);
    const [rfqCount, setRfqCount] = useState(0);
    const [adminProfile, setAdminProfile] = useState<any>();

    async function addAdmin(e: any) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const res = await fetch("/api/add-admin-to-branch/", {method: "POST", body: JSON.stringify({email: formData.get("email"), branch: branch.id})})
        const data = await res.json();
        alert("Successfully Added Employee");
    }

    async function addEmployee(e: any) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const res = await fetch("/api/add-manager-to-branch/", {method: "POST", body: JSON.stringify({email: formData.get("email"), branch: branch.id})});
        const data = await res.json();

        alert("Successfully Added Employee");
    }

    async function fetchBranch() {
        const supabase = createClient();

        const member = await supabase.from("member").select("*").eq("branch", branch.id);
        setMemberCount(member.data!.length);

        const rfq = await supabase.from("rfq").select("*").eq("branch", branch.id);
        setRfqCount(rfq.data!.length);

        const admin = await supabase.from("member").select("*").eq("branch", branch.id).eq("member_role", "admin").single();
        // console.log(admin);
        setAdmin(admin.data);

        const res = await fetch("/api/all-user", {method: "POST", body: JSON.stringify({userID: admin.data.member_profile})});
        const data = await res.json();

        setAdminProfile(data.userData);
        console.log(data)
    }

    useEffect(() => {
        fetchBranch();
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>{branch.name}</CardTitle>
                <CardDescription>Id: {branch.id}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-2 grid grid-cols-1 gap-2 text-sm">
                    {!admin && (
                        <Dialog>
                            <DialogTrigger className="grid">
                                <Button>
                                    Assign
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Employee</DialogTitle>
                                    <DialogDescription>
                                        Enter Employee Details
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={addAdmin}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="vesselName" className="text-right">
                                                Employee Email
                                            </Label>
                                            <Input type="email" name="email" placeholder="Enter Employee Email..." id="email" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="vesselName" className="text-right">
                                                Sub Merchant Id
                                            </Label>
                                            <Input type="text" name="branch" id="branch" value={branch.id} disabled className="col-span-3" />
                                        </div>
                                    </div>
                                    <Button type="submit">Assign</Button>
                                </form>

                                <DialogFooter>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
                {admin && (
                    <div className="text-xs">
                        <h1 className="text-sm font-bold mb-1">
                            Employee
                        </h1>
                        <p>
                            <span className="font-bold">Id: </span> {admin.id}
                        </p>
                        <p>
                            <span className="font-bold">Email: </span> {adminProfile?.email}
                        </p>
                    </div>
                )}

                {/* <div className="mt-2 grid grid text-base">
                    <div>
                        <span className="font-bold">Managers: </span> {memberCount}
                    </div>
                    <div>
                        <span className="font-bold">RFQs: </span> {rfqCount}
                    </div>
                </div> */}

            </CardContent>
            <CardFooter className="grid">
                <p>
                Sub Merchant Details
                </p>
                {/* <Link href={`/dashboard/customer/branch/${branch.id}`} className="grid">
                    <Button>
                        View Details
                    </Button>
                </Link> */}
            </CardFooter>
        </Card>
    )
}


export default function BranchPage() {
    const [vesselName, setVesselName] = useState("");
    const [vessels, setVessels] = useState<string[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [newBranch, setNewBranch] = useState<{ name: string, vessels: string[] }>({ name: "", vessels: [] });
    const [isClient, setIsClient] = useState(true);

    async function addVessel() {
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const profileData = await supabase.from("profiles").select("*").eq("id", user?.id).single();


            if (profileData.data.vessels) {
                const { data } = await supabase.from("profiles").update({
                    vessels: [...profileData.data.vessels, vesselName],
                }).eq("id", profileData.data.id);
                console.log("Vessel Successfully Added!", data);
            } else {
                const { data } = await supabase.from("profiles").update({
                    vessels: [vesselName],
                }).eq("id", profileData.data.id);
                console.log("Vessel Successfully Added!", data);
            }

            alert("Vessel Successfully Added!");
        } catch (e) {
            console.log("Error Occurse", e);
        }

        setVesselName("");
    }

    async function addBranch() {
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const profileData = await supabase.from("profiles").select("*").eq("id", user?.id).single();

            // Format time as HH:MM:SS
            const currentTime = new Date().toISOString();
            const branchData = await supabase.from("branch").insert({ name: newBranch.name, vessels: newBranch.vessels, creator: user!.id, created_at: currentTime }).select().single();
            const member = await supabase.from("member").insert({ branch: branchData.data?.id, member_profile: user?.id, member_role: "creator" })

            console.log("Branch Created: ", branchData);

            alert("Branch Created Successfully!");
            window.location.reload();

        } catch (e) {
            console.log("Unable to Create Branch, ", e);
            alert("Unable to Create Branch!!");
        }
    }

    async function fetchDetails() {
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();

            // const vessels = (await supabase.from("profiles").select("*").eq("id", user!.id).single()).data.vessels;
            // setVessels([...vessels]);

            const member = await supabase.from("member").select("*").eq("member_profile", user?.id);
            const allBranches = [...branches]
            for (let i = 0; i < member.data!.length; i++) {
                const m = member.data![i];
                const branchesData = await supabase.from("branch").select("*").eq("id", m.branch).single();
                if (branchesData.data) {
                    // setBranches([...branches, branchesData.data];
                    allBranches.push(branchesData.data)
                    console.log(branchesData.data);
                }
            }

            if (member.data!.length == 1) {
                if (member.data![0].member_role !== "creator") {
                    setIsClient(false);
                }
            }

            setBranches([...allBranches])
        } catch (e) {
            console.log("Unable to Fetch Details, ", e);
            // alert("Error Occured White fetching details");
        }
    }

    useEffect(() => {
        fetchDetails();
    }, []);


    return (
        <main className="grid max-w-6xl w-full justify-self-center">
            <div className="py-4 sm:flex justify-between">
                <div>
                    Your Sub Merchant
                </div>
                
                {isClient && (
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger>
                            <Button>
                                Add Sub Merchant
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Sub Merchant</DialogTitle>
                                <DialogDescription>
                                    Create New Sub Merchant
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vesselName" className="text-right">
                                        Sub Merchant Name
                                    </Label>
                                    <Input id="vesselName" placeholder="Enter Sub Merchant Name..." value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} className="col-span-3" />
                                </div>
                                {/* <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vesselName" className="text-right">
                                        Select Vessels
                                    </Label>
                                    <Select onValueChange={(value) => setNewBranch({ ...newBranch, vessels: [...newBranch.vessels, value] })}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Vessels..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vessels.map((vessel, i) =>
                                                <SelectItem value={vessel} key={i}>{vessel}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div> */}
                            </div>

                            <DialogFooter>
                                <Button type="submit" onClick={addBranch}>Add Sub Merchant</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                )}
            </div>

            <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {branches.map((branch, i) =>
                    <BranchCard key={i} branch={branch} />
                )}
            </div>
        </main>
    )
}