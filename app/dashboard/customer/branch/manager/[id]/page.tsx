"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
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
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Router } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

interface Manager {
    id: string;
    branch_id: string;
    member_profile: string;
    vessels: string[];
    profile?: Profile;
    name?: string;
}

interface Profile {
    id: string;
    email: string;
    vessels: string[];
}

function ManagerRow({
    manager,
    vessels,
    fetchManagers,
}: {
    manager: Manager;
    vessels: string[];
    fetchManagers: () => void;
}) {
    const [managerProfile, setManagerProfile] = useState<Profile | undefined>(
        manager.profile
    );

    useEffect(() => {
        async function fetchProfile() {
            if (manager.member_profile && !managerProfile) {
                const res = await fetch("/api/all-user", {
                    method: "POST",
                    body: JSON.stringify({ userID: manager.member_profile }),
                });
                const data = await res.json();
                setManagerProfile(data.userData);
            }
        }

        fetchProfile();
    }, [manager.member_profile, managerProfile]);

    return (
        <>
            <td className="text-center">{manager.name || "Demo Name"}</td>
            <td className="text-center">{managerProfile?.email || "N/A"}</td>
            <td className="text-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <DotsVerticalIcon className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuItem
                            onClick={() => console.log(`Edit Manager ${manager.id} triggered`)}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                console.log(`Delete Manager ${manager.id} triggered`)
                            }
                        >
                            Delete
                        </DropdownMenuItem>
                        
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </>
    );
}

export default function BranchPage() {
    const { branchId } = useParams();
    const [managers, setManagers] = useState<Manager[]>([
        {
            id: "demo-id-1",
            branch_id: branchId || "demo-branch",
            member_profile: "demo-profile-id-1",
            vessels: ["Demo Vessel A"],
            name: "Alice Smith",
            profile: { id: "demo-profile-id-1", email: "alice.smith@example.com", vessels: [] },
        },
        {
            id: "demo-id-2",
            branch_id: branchId || "demo-branch",
            member_profile: "demo-profile-id-2",
            vessels: ["Demo Vessel B"],
            name: "Bob Johnson",
            profile: { id: "demo-profile-id-2", email: "bob.johnson@example.com", vessels: [] },
        },
    ]);
    const [vessels, setVessels] = useState<string[]>(["Demo Vessel A", "Demo Vessel B", "Demo Vessel C", "Demo Vessel D"]);
    const [newManagerEmail, setNewManagerEmail] = useState("");
    const [selectedVessel, setSelectedVessel] = useState<string | null>(null);

    async function addManager() {
        if (!branchId || !newManagerEmail || !selectedVessel) return;
        const newManager: Manager = {
            id: Math.random().toString(36).substring(7),
            branch_id: branchId,
            member_profile: "",
            vessels: selectedVessel ? [selectedVessel] : [],
            name: "", // You might want to add a name field in the dialog later
            profile: { id: "", email: newManagerEmail, vessels: [] },
        };
        setManagers((prevManagers) => [...prevManagers, newManager]);
        setNewManagerEmail("");
        setSelectedVessel(null);
    }

    return (
        <main className="grid max-w-6xl w-full justify-self-center">
            <div className="py-4 sm:flex justify-between">
                <div>
                    Managers for Branch ID: <span className="font-semibold">{branchId}</span>
                </div>
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Add Manager</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Manager</DialogTitle>
                                <DialogDescription>Enter the manager's email and assign one vessel.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Manager Email
                                    </Label>
                                    <Input
                                        id="email"
                                        placeholder="Enter Manager Email..."
                                        value={newManagerEmail}
                                        onChange={(e) => setNewManagerEmail(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vessel" className="text-right">
                                        Assign Vessel
                                    </Label>
                                    <Select
                                        onValueChange={(value) => setSelectedVessel(value)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a Vessel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[...new Set(vessels)].map((vessel) => (
                                                <SelectItem value={vessel} key={vessel}>
                                                    {vessel}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={addManager} disabled={!selectedVessel}>
                                    Add Manager
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Manager Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-50 divide-y divide-gray-100">
                        {managers.map((manager) => (
                            <tr key={manager.id} className="hover:bg-gray-50">
                                <ManagerRow
                                    manager={manager}
                                    vessels={vessels}
                                    fetchManagers={() => {}}
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
                {managers.length === 0 && (
                    <div className="py-4 text-center">No managers assigned to this branch yet.</div>
                )}
            </div>
        </main>
    );
}