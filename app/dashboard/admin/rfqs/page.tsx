"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {createClient} from "@/utils/supabase/client";
import Link from "next/link"
import {useEffect, useState} from "react"


export default function RFQsPage() {
    const [rfqs, setRfqs] = useState<any[]>([]);

    async function fetchRfqs() {
        const supabase = createClient();

        const rfqs = await supabase.from("rfq").select();

        setRfqs([...rfqs.data!]);
    }

    useEffect(() => {
        fetchRfqs();
    }, []);

    return (
        <>
            <div className="pt-4">
                <h1 className="text-3xl font-bold">
                    RFQs Recieved
                </h1>
            </div>
            <main className="mt-4 grid max-w-7xl gap-4 justify-self-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {rfqs.map((rfq, i) =>
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle>RFQ Id</CardTitle>
                            <CardDescription>{rfq.id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="py-2 grid gap-2 text-base">
                                <div>
                                    <span className="font-bold">
                                        Lead Date: 
                                    </span>
                                    {rfq.lead_date}
                                </div>
                                <div>
                                    <span className="font-bold">
                                        Port: 
                                    </span>
                                    {rfq.port}
                                </div>
                                <div>
                                    <span className="font-bold">
                                        Supply Port: 
                                    </span>
                                    {rfq.supply_port}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/dashboard/admin/rfqs/${rfq.id}`}
                                  className="text-center text-white py-2 text-xs font-semibold grid w-full rounded-lg bg-black dark:text-black dark:bg-white">
                                View Details
                            </Link>
                        </CardFooter>
                    </Card>
                )}
            </main>
        </>
    )
}