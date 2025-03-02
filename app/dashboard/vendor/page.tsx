"use client";
import { Chart2Component } from "@/components/Chart2Component"
import { ChartsComponent } from "@/components/ChartsComponents"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"
;


function RFQCard({rfqs}: {rfqs: number}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>RFQs</CardTitle>
                <CardDescription>Total RFQs Recieved</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold">
                    {rfqs}
                </h1>
            </CardContent>
            <CardFooter>
                <p className="text-xs">Updated Now</p>
            </CardFooter>
        </Card>

    )
}



function RevenueCard({branches}:{branches: number}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sub Merchants</CardTitle>
                <CardDescription>Total Sub Merchants</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold">
                    {branches}
                </h1>
            </CardContent>
            <CardFooter>
                <p className="text-xs">Updated Now</p>
            </CardFooter>
        </Card>

    )
}


function CustomerCard({employee}:{employee: number}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Employees</CardTitle>
                <CardDescription>Total Happy Employees</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold">
                    {employee}
                </h1>
            </CardContent>
            <CardFooter>
                <p className="text-xs">Updated Now</p>
            </CardFooter>
        </Card>

    )
}


export default function VendorPage() {
    const [rfqs, setRfqs] = useState(0);
    const [employee, setEmployee] = useState(0);
    const [branches, setBranches] = useState(0);

    async function fetchDetails() {
        const supabase = createClient();
        
        const {data:{user}} = await supabase.auth.getUser();
        
        const merchant = await supabase.from("merchant").select("*").eq("merchant_profile", user?.id).single();

        const rfqs = await supabase.from("itemcopy").select("*").eq("merchant", merchant.data.id);
        setRfqs(rfqs.data!.length);

        const branches = await supabase.from("branch").select("*").eq("creator", user?.id);
        setBranches(branches.data!.length);

        for (let i = 0; i < branches.data!.length; i++) {
            const branch = branches.data![i];
            
            const member = await supabase.from("member").select("*").eq("branch", branch.id);
            setEmployee(e => e+member.data!.length);
        }

    }

    useEffect(() => {
        fetchDetails();
    }, []);

    return (
        <main className="">
            <div className="max-w-7xl w-full justify-self-center grid md:grid-cols-3 gap-4 mt-4">
                <RFQCard rfqs={rfqs} />
                <RevenueCard branches={branches} />
                <CustomerCard employee={employee} />
            </div>


            <div className="mt-8">
                <h1 className="text-md font-bold">
                    Dashboard
                </h1>
            </div>

            <div className="max-w-7xl w-full justify-self-center grid md:grid-cols-2 gap-4 mt-4">
                <ChartsComponent />
                <Chart2Component />
            </div>
        </main>
    )
}