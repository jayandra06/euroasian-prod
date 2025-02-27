"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function BecomeASeller() {
    const [formData, setFormData] = useState<any>({
        name: "",
        business_email: "",
        phone: "",
        brands: [],
        category: [],
        model: [],
        tax_id: "",
        warehouse_address: "",
        managing_director: "",
        managing_director_email: "",
        managing_director_phone: "",
        managing_director_desk_phone: "",
        port: "",
        sales_manager: "",
        sales_manager_email: "",
        sales_manager_phone: "",
        sales_manager_desk_phone: "",
        logistic_service: "",
    });
    const router = useRouter();
    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [category, setCategory] = useState<any[]>([]);
    const [newBrand, setNewBrand] = useState("");
    const [newModel, setNewModel] = useState("");
    const [newCategory, setNewCategory] = useState("");
    // const [uploadedFile, setUploadedFile] = useState<{
    //     id: string;
    //     path: string;
    //     fullPath: string;
    // } | null>(null);


    // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         const supabase = createClient();
    //         const file = e.target.files[0];
    //         const user = await supabase.auth.getUser();

    //         console.log(file.name, user.data.user?.id);
    //         const { data } = await supabase
    //             .storage
    //             .from('brand-image')
    //             .upload(`${user.data.user?.id}/${crypto.randomUUID()}/${file.name}`, file);
    //         setUploadedFile(data);
    //     }
    // }


    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     const supabase = createClient();
    // const { data: { user } } = await supabase.auth.getUser();

    // const profileData = await supabase.from("profiles").update({ user_role: "vendor" }).eq("id", user!.id).select("*").single();
    // const merchant = await supabase.from("merchant").insert({ name: formData.name, business_email: formData.business_email, phone: formData.phone, status: "waiting", created_at: new Date().toISOString(), merchant_profile: profileData.data!.id }).select().single();

    //     const brand = await supabase.from("brand").insert({ name: formData.brand_name, description: formData.description, brand_image: uploadedFile?.id, merchant: merchant.data!.id, created_at: new Date().toISOString() });

    //     alert("Form submitted successfully!")
    //     router.push("/");
    // }

    async function handleSubmit() {
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();

        const profileData = await supabase.from("profiles").update({ user_role: "vendor" }).eq("id", user!.id).select("*").single();

        const vendorData = await supabase.from("merchant").insert({ ...formData, status: "waiting", merchant_profile: profileData.data!.id, created_at: new Date().toISOString() }).select().single();

        console.log("Vendor Created, ", vendorData.data);

        alert("Form Submitted Successfully!");
        router.push("/");
    }


    async function addBrand() {
        try {

            const supabase = createClient();
            const brand = await supabase.from("brand").insert({ name: newBrand, description: newBrand, is_active: false, created_at: new Date().toISOString() });

            setFormData({ ...formData, brands: [...formData.brands, newBrand] });

            setNewBrand("");
        } catch (e) {
            console.log("Error Occured, ", e);
        }
    }


    async function addModel() {
        try {
            const supabase = createClient();

            const brand = await supabase.from("model").insert({ name: newModel, description: newModel, is_active: false, created_at: new Date().toISOString() });
            setFormData({ ...formData, model: [...formData.model, newModel] });

            setNewModel("");
        } catch (e) {
            console.log("Error Occured, ", e);
        }
    }

    async function addCategory() {
        try {
            const supabase = createClient();
            const brand = await supabase.from("category").insert({ name: newCategory, description: newCategory, is_active: false, created_at: new Date().toISOString() });
            setFormData({ ...formData, category: [...formData.category, newCategory] });

            setNewCategory("");
        } catch (e) {
            console.log("Error Occured, ", e);
        }
    }



    async function fetchDetails() {
        const supabase = createClient();

        const brands = await supabase.from("brand").select("*");
        setBrands([...brands.data!]);

        const models = await supabase.from("model").select("*");
        setModels([...models.data!]);

        const categories = await supabase.from("category").select("*");
        setCategory([...categories.data!]);
    }

    useEffect(() => {
        fetchDetails();
    }, []);



    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl grid justify-self-center my-8 gap-4">
            <div>
                <h1 className="text-center py-4 text-2xl font-bold">
                    Become a Vendor
                </h1>
            </div>

            <div className="grid gap-2 mt-8">
                <div className="mt-8 mb-4">
                    <h1 className="text-xl font-bold">
                        Vendor Details
                    </h1>
                </div>
                <div>
                    <Label>
                        Name
                    </Label>
                    <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div>
                    <Label>
                        Business Email
                    </Label>
                    <Input type="text" value={formData.business_email} onChange={(e) => setFormData({ ...formData, business_email: e.target.value })} />
                </div>

                <div>
                    <Label>
                        Phone
                    </Label>
                    <Input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-1">
                    <div className="flex gap-1">
                        {formData.brands.map((brand: string, i: number) =>
                            <div key={i} className="text-xs text-white bg-zinc-600 rounded-full px-2">
                                {brand}
                            </div>
                        )}
                    </div>
                    <div className="grid ">
                        <Label>
                            Select Brands
                        </Label>
                        <Select onValueChange={(v) => setFormData({ ...formData, brands: [...formData.brands, v] })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Brand" />
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>


                        <Dialog>
                            <DialogTrigger>
                                <Button className="grid mt-2">
                                    Add Brand
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Brand</DialogTitle>
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
                    </div>
                </div>



                <div className="grid gap-1">
                    <div className="flex gap-1">
                        {formData.model.map((brand: string, i: number) =>
                            <div key={i} className="text-xs text-white bg-zinc-600 rounded-full">
                                {brand}
                            </div>
                        )}
                    </div>
                    <div>
                        <Label>
                            Select Models
                        </Label>
                        <Select onValueChange={(v) => setFormData({ ...formData, model: [...formData.model, v] })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Model" />
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>




                        <Dialog>
                            <DialogTrigger>
                                <Button className="grid mt-2">
                                    Add Model
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Model</DialogTitle>
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
                    </div>
                </div>



                <div className="grid gap-1">
                    <div className="flex gap-1">
                        {formData.category.map((brand: string, i: number) =>
                            <div key={i} className="text-xs text-white bg-zinc-600 rounded-full">
                                {brand}
                            </div>
                        )}
                    </div>
                    <div>
                        <Label>
                            Select Categories
                        </Label>
                        <Select onValueChange={(v) => setFormData({ ...formData, category: [...formData.category, v] })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {category.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>


                        <Dialog>
                            <DialogTrigger>
                                <Button className="grid mt-2">
                                    Add Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Category</DialogTitle>
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
                </div>
            </div>

            <div className="grid gap-2">
            <div className="mt-8 mb-4">
                    <h1 className="text-xl font-bold">
                        Business Details
                    </h1>
                </div>
                <div>
                    <Label>
                        Tax ID
                    </Label>
                    <Input type="text" value={formData.tax_id} onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })} />
                </div>

                <div>
                    <Label>
                        Warehouse Address
                    </Label>
                    <Input type="text" value={formData.warehouse_address} onChange={(e) => setFormData({ ...formData, warehouse_address: e.target.value })} />
                </div>

                <div className="mt-8 mb-4">
                    <h1 className="text-xl font-bold">
                        Managing Directory Details
                    </h1>
                </div>
                <div>
                    <Label>
                        Managing Directory
                    </Label>
                    <Input type="text" value={formData.managing_director} onChange={(e) => setFormData({ ...formData, managing_director: e.target.value })} />
                </div>

                <div>
                    <Label>
                        Managing Directory Email
                    </Label>
                    <Input type="email" value={formData.managing_director_email} onChange={(e) => setFormData({ ...formData, managing_director_email: e.target.value })} />
                </div>

                <div>
                    <Label>
                        Managing Directory Personal Phone
                    </Label>
                    <Input type="text" value={formData.managing_director_phone} onChange={(e) => setFormData({ ...formData, managing_director_phone: e.target.value })} />
                </div>

                <div>
                    <Label>
                        Managing Directory Desk Phone
                    </Label>
                    <Input type="text" value={formData.managing_director_desk_phone} onChange={(e) => setFormData({ ...formData, managing_director_desk_phone: e.target.value })} />
                </div>

                <div>
                    <Label>
                        Port
                    </Label>
                    <Input type="text" value={formData.port} onChange={(e) => setFormData({ ...formData, port: e.target.value })} />
                </div>
            </div>

            <div className="my-4 grid gap-2">
                <div className="mt-8 mb-4">
                    <h1 className="text-xl font-bold">
                        Sales Manager Details
                    </h1>
                </div>
                <div>
                    <Label>
                        Sales Manager Name
                    </Label>
                    <Input type="text" value={formData.sales_manager} onChange={(e) => setFormData({ ...formData, sales_manager: e.target.value })} />
                </div>
                <div>
                    <Label>
                        Sales Manager Email
                    </Label>
                    <Input type="email" value={formData.sales_manager_email} onChange={(e) => setFormData({ ...formData, sales_manager_email: e.target.value })} />
                </div>
                <div>
                    <Label>
                        Sales Manager Phone
                    </Label>
                    <Input type="text" value={formData.sales_manager_phone} onChange={(e) => setFormData({ ...formData, sales_manager_phone: e.target.value })} />
                </div>
                <div>
                    <Label>
                        Sales Manager Desk Phone
                    </Label>
                    <Input type="text" value={formData.sales_manager_desk_phone} onChange={(e) => setFormData({ ...formData, sales_manager_desk_phone: e.target.value })} />
                </div>
            </div>



            <div className="my-4 grid gap-2">
                <div className="mt-8 mb-4">
                    <h1 className="text-xl font-bold">
                        Logistic Service Details
                    </h1>
                </div>
                <div>
                    <Label>
                        Enter Logistic Service
                    </Label>
                    <Input type="text" value={formData.logistic_service} onChange={(e) => setFormData({ ...formData, logistic_service: e.target.value })} />
                </div>

            </div>

            <div className="my-4 grid">
                <Button onClick={handleSubmit}>
                    Become a Vendor
                </Button>
            </div>
        </div>
    )
}

