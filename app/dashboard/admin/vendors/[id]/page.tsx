"use client";
import { createClient } from "@/utils/supabase/client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";



export default function VendorDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const [vendorDetails, setVendorDetails] = useState<any>();
    const [newBrand, setNewBrand] = useState("");
    const [newModel, setNewModel] = useState("");
    const [newCategory, setNewCategory] = useState("");


    async function addBrand() {
        setVendorDetails({...vendorDetails, data: {...vendorDetails.data, brands: [...vendorDetails.data.brands, newBrand]}});

        setNewBrand("");
    }

    async function addModel() {
        setVendorDetails({...vendorDetails, data: {...vendorDetails.data, model: [...vendorDetails.data.model, newModel]}});

        setNewModel("");
    }

    async function addCategory() {
        setVendorDetails({...vendorDetails, data: {...vendorDetails.data, category: [...vendorDetails.data.category, newCategory]}});

        setNewCategory("");
    }

    async function getDetails() {
        const supabase = createClient();
        const id = (await params).id;
        const vendorDetails = await supabase.from("merchant").select("*").eq("id", id).single();
        setVendorDetails(vendorDetails);
    }

    useEffect(() => {
        getDetails();
    }, []);

    if (!vendorDetails) return "Loading...."


    return (
        <div className="max-w-5xl grid justify-self-center p-4">
            <div>
                <h1 className="text-xl font-bold">
                    Your Details
                </h1>
                <h1 className="text-base mt-2">
                    Id: {vendorDetails.data?.id}
                </h1>
            </div>
            <div className="flex gap-2 my-8">
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
                                <div className="flex gap-1 mt-4">
                                    {vendorDetails.data?.brands.map((brand: string, i: number) =>
                                        <div key={i} className="px-1 text-xs text-white bg-zinc-600 rounded-full">
                                            {brand}
                                        </div>
                                    )}
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <Label>
                                Enter Brand Name
                            </Label>
                            <Input type="text" value={newBrand} onChange={(e) => setNewBrand(e.target.value)} />
                        </div>

                        <DialogFooter>
                            <Button type="submit" onClick={addBrand}>
                                Add Brand
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger>
                        <Button>
                            Add Model
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Model</DialogTitle>
                            <DialogDescription>
                                <div className="flex gap-1 mt-4">
                                    {vendorDetails.data?.model.map((brand: string, i: number) =>
                                        <div key={i} className="px-1 text-xs text-white bg-zinc-600 rounded-full">
                                            {brand}
                                        </div>
                                    )}
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <Label>
                                Enter Model Name
                            </Label>
                            <Input type="text" value={newModel} onChange={(e) => setNewModel(e.target.value)} />
                        </div>

                        <DialogFooter>
                            <Button type="submit" onClick={addModel}>
                                Add Model
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


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
                                <div className="flex gap-1 mt-4">
                                    {vendorDetails.data?.category.map((brand: string, i: number) =>
                                        <div key={i} className="px-1 text-xs text-white bg-zinc-600 rounded-full">
                                            {brand}
                                        </div>
                                    )}
                                </div>

                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <Label>
                                Enter Category Name
                            </Label>
                            <Input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                        </div>

                        <DialogFooter>
                            <Button type="submit" onClick={addCategory}>
                                Add Category
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {vendorDetails.data?.name}
                        </CardTitle>
                        <CardDescription>
                            Vendor Description
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <h1 className="text-sm">
                                <span>Id: </span>{vendorDetails.data?.id}
                            </h1>
                            <h1 className="text-sm">
                                <span>Business Email: </span>{vendorDetails.data?.business_email}
                            </h1>
                            <h1 className="text-sm">
                                <span>Phone: </span>{vendorDetails.data?.phone}
                            </h1>
                            <h1 className="text-sm">
                                <span>Port: </span>{vendorDetails.data?.port}
                            </h1>
                            <h1 className="text-sm">
                                <span>Status: </span>{vendorDetails.data?.status}
                            </h1>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-zinc-500">
                            Business Details
                        </p>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Warehouse Details
                        </CardTitle>
                        <CardDescription>
                            Warehouse Description
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <h1 className="text-sm">
                                <span>Warehouse Address: </span>{vendorDetails.data?.warehouse_address}
                            </h1>
                            <h1 className="text-sm">
                                <span>Managing Director Name: </span>{vendorDetails.data?.managing_director}
                            </h1>
                            <h1 className="text-sm">
                                <span>Managing Director Email: </span>{vendorDetails.data?.managing_director_email}
                            </h1>
                            <h1 className="text-sm">
                                <span>Tax Id: </span>{vendorDetails.data?.tax_id}
                            </h1>
                            <h1 className="text-sm">
                                <span>Created At: </span>{vendorDetails.data?.created_at}
                            </h1>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-zinc-500">
                            Other Details
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}