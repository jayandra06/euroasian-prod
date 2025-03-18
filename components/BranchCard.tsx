"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { useEffect, useState } from "react";


export function AdminCard({ adminId, adminProfile }: { adminId: string, adminProfile: string }) {
    const [adminDetails, setAdminDetails] = useState<any>();

    async function fetchProfile() {
        const res = await fetch("/api/all-user", { method: "POST", body: JSON.stringify({ userID: adminProfile }) });
        const data = await res.json();
        setAdminDetails(data.userData);
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Member Details</CardTitle>
                <CardDescription>Member Descriptions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4">
                    <p>
                        <span className="font-bold">Id: </span> {adminId}
                    </p>
                    <p>
                        <span className="font-bold">Email: </span> {adminDetails?.email}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

