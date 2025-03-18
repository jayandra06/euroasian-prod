"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";


function BrandBox({ brand }: { brand: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {brand?.name}
                </CardTitle>
                <CardDescription>
                    {brand?.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <h1 className="text-sm">
                        <span>Id: </span>{brand?.id}
                    </h1>
                    <h1 className="text-sm">
                        <span>Status: </span>{brand.is_active ? "Active" : "Waiting Approval"}
                    </h1>
                </div>
            </CardContent>
            <CardFooter>
                <p className="text-zinc-500">
                    Model Details
                </p>
            </CardFooter>
        </Card>
    )
}


export default function BrandsPage() {
    const [brands, setBrands] = useState<any[]>([]);

    async function fetchBrands() {
        const supabase = createClient();

        const {data:{user}} = await supabase.auth.getUser();
        const merchant = await supabase.from("merchant").select("*").eq("merchant_profile", user?.id).single();

        for (let i = 0; i < merchant.data.model!.length; i++) {
            const brand = merchant.data.model![i];
            const bran = await supabase.from("model").select("*").eq("name", brand);
            
            if(bran.data) {   
                setBrands((brands) => [...brands, ...bran.data!]);
            }
            
        }
    }

    useEffect(() => {
        fetchBrands();
    }, []);

    return (
        <>
            <div className="mt-8 p-4 flex justify-between">
                <h1 className="text-2xl font-bold">
                    All Models
                </h1>
            </div>
            <main className="max-w-6xl grid justify-self-center gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {brands.map((brand, i) =>
                    <BrandBox brand={brand} key={i} />
                )}
            </main>
        </>
    )
}