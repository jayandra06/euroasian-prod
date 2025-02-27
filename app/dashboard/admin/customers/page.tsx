"use client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";


function ProfileRow({ profile, i }: { profile: any, i: number }) {
    const [userData, setUserData] = useState<any>();

    async function getUserDetail() {
        const res = await fetch("/api/all-user", { method: "POST", body: JSON.stringify({ userID: profile.id }) });

        const data = await res.json();
        console.log(data);

        setUserData(data.userData);
    }

    useEffect(() => {
        getUserDetail();
    }, []);

    return (
        <TableRow>
            <TableCell>
                {i + 1}
            </TableCell>
            <TableCell>
                {profile.id}
            </TableCell>
            <TableCell>
                {userData?.email}
            </TableCell>
            <TableCell>
                {profile.user_role}
            </TableCell>
            <TableCell className="grid items-center">
                <div className="grid grid-cols-2 text-center gap-1">
                    {profile.vessels?.map((vessel: string, i: number) =>
                        <div key={i} className="text-xs px-2 rounded-full bg-zinc-600 text-white">
                            {vessel}
                        </div>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}


export default function CustomersPage() {
    const [profiles, setProfiles] = useState<any[]>([]);
    async function fetchProfiles() {
        const supabase = createClient();
        const profiles = await supabase.from("profiles").select("*").eq("user_role", "customer");

        setProfiles([...profiles.data!]);
    }

    useEffect(() => {
        fetchProfiles();
    }, []);


    return (
        <main className="p-4 mt-8">
            <div>
                <h1 className="text-xl font-bold">
                    All Customers
                </h1>
            </div>

            <div className="mt-8">
                <Table>
                    <TableCaption>A list of all Customers.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>S. No.</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Vessels</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {profiles.map((profile, i) =>
                            <ProfileRow key={i} profile={profile} i={i} />
                        )}
                    </TableBody>
                </Table>
            </div>
        </main>
    )
}