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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



export default function VendorDetails() {
    const [vendorDetails, setVendorDetails] = useState<any>();
    const [newBrand, setNewBrand] = useState("");
    const [newModel, setNewModel] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [category, setCategory] = useState<any[]>([]);


    async function addBrand() {
        try {
            const supabase = createClient();

            const find = brands.filter((b) => b.name == newBrand);

            if(find.length == 0) {
                const brand = await supabase.from("brand").insert({ name: newBrand, description: newBrand, is_active: false, created_at: new Date().toISOString() });
            }

            const merchant = await supabase.from("merchant").update({ brands: [...vendorDetails.data.brands, newBrand] }).eq("id", vendorDetails.data.id);

            setVendorDetails({ ...vendorDetails, data: { ...vendorDetails.data, brands: [...vendorDetails.data.brands, newBrand] } });

            setNewBrand("");
        } catch (e) {
            console.log("Error Occured", e);
        }
    }

    async function addModel() {
        try {
            const supabase = createClient();

            
            const find = models.filter((b) => b.name == newModel);

            if(find.length == 0) {
                const brand = await supabase.from("model").insert({ name: newModel, description: newModel, is_active: false, created_at: new Date().toISOString() });
            }

            const merchant = await supabase.from("merchant").update({ model: [...vendorDetails.data.model, newModel] }).eq("id", vendorDetails.data.id);

            setVendorDetails({ ...vendorDetails, data: { ...vendorDetails.data, model: [...vendorDetails.data.model, newModel] } });

            setNewModel("");
        } catch (e) {
            console.log("Error Occured", e);
        }
    }

    async function addCategory() {
        try {
            const supabase = createClient();

            
            const find = category.filter((b) => b.name == newCategory);

            if(find.length == 0) {
                const brand = await supabase.from("category").insert({ name: newCategory, description: newCategory, is_active: false, created_at: new Date().toISOString() });
            }

            const merchant = await supabase.from("merchant").update({ category: [...vendorDetails.data.category, newCategory] }).eq("id", vendorDetails.data.id);


            setVendorDetails({ ...vendorDetails, data: { ...vendorDetails.data, category: [...vendorDetails.data.category, newCategory] } });

            setNewCategory("");
        } catch (e) {
            console.log("Error Occured, ", e);
        }
    }

    async function getDetails() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const vendorDetails = await supabase.from("merchant").select("*").eq("merchant_profile", user!.id).single();
        setVendorDetails(vendorDetails);


        const brands = await supabase.from("brand").select("*");
        setBrands([...brands.data!]);



        const models = await supabase.from("model").select("*");
        setModels([...models.data!]);


        const categories = await supabase.from("category").select("*");
        setCategory([...categories.data!]);
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

                        <div>
                            <Label>
                                Select Brand
                            </Label>
                            <Select onValueChange={(v) => setNewBrand(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand: any, i: number) =>
                                        <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
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

                        <div>
                            <Label>
                                Select Model
                            </Label>
                            <Select onValueChange={(v) => setNewModel(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {models.map((brand: any, i: number) =>
                                        <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
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

                        <div>
                            <Label>
                                Select Category
                            </Label>
                            <Select onValueChange={(v) => setNewCategory(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {category.map((brand: any, i: number) =>
                                        <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
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

            {/* 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            </div> */}
        </div>
    )
}