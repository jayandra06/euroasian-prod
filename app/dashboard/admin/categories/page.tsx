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
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
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
                        <span>Status: </span>{brand?.is_active ? "Active" : "Waiting Approval"}
                    </h1>
                </div>
            </CardContent>
            <CardFooter>
                <p className="text-zinc-500">
                    Category Details
                </p>
            </CardFooter>
        </Card>
    )
}


export default function BrandsPage() {
    const [brands, setBrands] = useState<any[]>([]);
    const [newBrand, setNewBrand] = useState({ name: "", description: "" });

    async function fetchBrands() {
        const supabase = createClient();
        const brands = await supabase.from("category").select("*");

        setBrands([...brands.data!]);
    }

    async function addBrand() {
        const supabase = createClient();

        const brand = await supabase.from("category").insert({ ...newBrand, created_at: new Date().toISOString() }).select().single();

        setBrands([...brands, brand.data!]);
        alert("Category Successfully Added!!!");
        window.location.reload();
    }


    useEffect(() => {
        fetchBrands();
    }, []);

    return (
        <>
            <div className="mt-8 p-4 flex justify-between">
                <h1 className="text-2xl font-bold">
                    All Categories
                </h1>
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger>
                            <Button>
                                Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Category</DialogTitle>
                                <DialogDescription>
                                    Enter Details of New Category
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-2">
                                <div>
                                    <Label>
                                        Name
                                    </Label>
                                    <Input type="text" value={newBrand.name} onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} />
                                </div>
                                <div>
                                    <Label>
                                        Description
                                    </Label>
                                    <Input type="text" value={newBrand.description} onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })} />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" onClick={addBrand}>Add Category</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Link href="/dashboard/admin/categories/waiting_approval">
                        <Button>
                            Waiting Approval
                        </Button>
                    </Link>
                </div>
            </div >
            <main className="max-w-6xl grid justify-self-center gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {brands.map((brand, i) =>
                    <BrandBox brand={brand} key={i} />
                )}
            </main>
        </>
    )
}