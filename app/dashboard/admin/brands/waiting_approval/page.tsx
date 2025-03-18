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
import createClient  from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


function BrandBox({ brand }: { brand: any }) {
    const router = useRouter();
    async function approve() {
        const supabase = createClient();
        await supabase.from("brand").update({is_active: true}).eq("id", brand.id);

        alert("Successfully Approved Brand!!!");
        window.location.reload();
    }

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
                {brand?.is_active ? (
                    <p className="text-zinc-500">
                        Brand Details
                    </p>
                ) : (
                    <Button onClick={approve}>
                        Approve
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}


export default function BrandsPage() {
    const [brands, setBrands] = useState<any[]>([]);
    const [newBrand, setNewBrand] = useState({ name: "", description: "" });

    async function fetchBrands() {
        const supabase = createClient();
        const brands = await supabase.from("brand").select("*").eq("is_active", false);

        setBrands([...brands.data!]);
    }

    async function addBrand() {
        const supabase = createClient();

        const brand = await supabase.from("brand").insert({ ...newBrand, created_at: new Date().toISOString() }).select().single();

        setBrands([...brands, brand.data!]);
        alert("Brand Successfully Added!!!");
        window.location.reload();
    }

    async function handleBrandImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const supabase = createClient();
            const file = e.target.files[0];
            const user = await supabase.auth.getUser();

            console.log(file.name, user.data.user?.id);
            const { data } = await supabase
                .storage
                .from('brand-image')
                .upload(`${user.data.user?.id}/${crypto.randomUUID()}/${file.name}`, file);

            // setNewBrand({ ...newBrand, brand_image: data!.id });
        }
    }

    useEffect(() => {
        fetchBrands();
    }, []);

    return (
        <>
            <div className="mt-8 p-4 flex justify-between">
                <h1 className="text-2xl font-bold">
                    Approve Brands
                </h1>

                <Dialog>
                    <DialogTrigger>
                        <Button>
                            Add Brand
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Brand</DialogTitle>
                            <DialogDescription>
                                Enter Details of New Brand
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
                            {/* <div>
                                <Label>
                                    Brand Image
                                </Label>
                                <Input type="file" onChange={handleBrandImageUpload} />
                            </div> */}
                        </div>

                        <DialogFooter>
                            <Button type="submit" onClick={addBrand}>Add Brand</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <main className="max-w-6xl grid justify-self-center gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {brands.map((brand, i) =>
                    <BrandBox brand={brand} key={i} />
                )}
            </main>
        </>
    )
}