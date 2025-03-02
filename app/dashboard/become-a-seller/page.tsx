"use client"

import type React from "react"
import {useState, useEffect} from "react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {createClient} from "@/utils/supabase/client"
import {useRouter} from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {PostgrestSingleResponse, UserResponse} from "@supabase/supabase-js";

interface FormData {
    name: string;
    business_email: string;
    phone: string;
    status: string;
    merchant_profile: string;
    brands: string[];
    category: string[];
    model: string[];
    tax_id: string;
    warehouse_address: string;
    managing_director: string;
    managing_director_email: string;
    port: string;
    logistic_service: string;
    managing_director_phone: string;
    managing_director_desk_phone: string;
    sales_manager: string;
    sales_manager_email: string;
    sales_manager_phone: string;
    sales_manager_desk_phone: string;
}

interface Brand {
    id?: number;
    name: string;
}

interface Model {
    id?: number;
    name: string;
}

interface Category {
    id?: number;
    name: string;
}

export default function BecomeASeller() {

    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState<FormData>({
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
        merchant_profile: "",
        status: ""
    });
    const [brands, updatebrands] = useState<Brand[]>([]);
    const [models, updateModels] = useState<Model[]>([]);
    const [categories, updateCategories] = useState<Category[]>([]);

    async function updateProfile(userId: string) {
        const {data, error}: PostgrestSingleResponse<any> = await supabase
            .from("profiles")
            .update({user_role: "vendor"})
            .eq("id", userId)
            .select("*")
            .single();

        if (error) {
            console.error(error.details);
            return null;
        }
        return data;
    }

    async function createNewMerchant(profileId: string) {
        const {data, error}: PostgrestSingleResponse<any> = await supabase
            .from("merchant")
            .insert({
                ...formData,
                status: "waiting",
                merchant_profile: profileId,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error(error);
            return null;
        }
        return data;
    }

    async function handleSubmit(): Promise<void> {
        try {
            const {data: {user}, error}: UserResponse = await supabase.auth.getUser();
            if (error) console.error(error);
            if (!user) console.error("User not found");

            const updatedProfile = await updateProfile(user!.id);
            console.log({updatedProfile});
            if (!updatedProfile) return console.error("Failed to update profile data.");

            const newMerchant = await createNewMerchant(updatedProfile.id)
            if (!newMerchant) return console.error("Failed to create a new merchant.");

            console.log("New Merchant created successfully.");
            router.push("/");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error submitting form. Please try again.");
        }
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };


    async function fetchDetails() {
        const supabase = createClient();

        const brands = await supabase.from("brand").select("*");
        updatebrands([...brands.data!]);

        const models = await supabase.from("model").select("*");
        updateModels([...models.data!]);

        const categories = await supabase.from("category").select("*");
        updateCategories([...categories.data!]);
    }

    useEffect(() => {
        void fetchDetails();
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
                    <Input type="text" name={"name"} value={formData.name} onChange={handleFormChange}/>
                </div>

                <div>
                    <Label>
                        Business Email
                    </Label>
                    <Input type="text" name={"business_email"} value={formData.business_email}
                           onChange={handleFormChange}/>
                </div>

                <div>
                    <Label>
                        Phone
                    </Label>
                    <Input type="text" name={"phone"} value={formData.phone} onChange={handleFormChange}/>
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
                        {/*    WTF is this? */}
                    </div>
                    <div className="grid ">
                        <Label>
                            Select Brands
                        </Label>
                        <Select name={"brands"}
                                onValueChange={(v) => setFormData({...formData, brands: [...formData.brands, v]})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Brand"/>
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>


                        {/*  <Dialog>
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
                                    <Input type="text" value={newBrand} onChange={(e) => setNewBrand(e.target.value)}/>
                                </div>

                                <DialogFooter>
                                    <Button type="submit" onClick={addBrand}>
                                        Add Brand
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>*/}
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
                        <Select onValueChange={(v) => setFormData({...formData, model: [...formData.model, v]})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Model"/>
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>


                        {/*<Dialog>
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
                                    <Input type="text" value={newModel} onChange={(e) => setNewModel(e.target.value)}/>
                                </div>

                                <DialogFooter>
                                    <Button type="submit" onClick={addModel}>
                                        Add Model
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>*/}
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
                        <Select onValueChange={(v) => setFormData({...formData, category: [...formData.category, v]})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category"/>
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>


                        {/*<Dialog>
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
                                    <Input type="text" value={newCategory}
                                           onChange={(e) => setNewCategory(e.target.value)}/>
                                </div>

                                <DialogFooter>
                                    <Button type="submit" onClick={addCategory}>
                                        Add Category
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>*/}
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
                    <Input type="text" name={"tax_id"} value={formData.tax_id} onChange={handleFormChange}/>
                </div>

                <div>
                    <Label>
                        Warehouse Address
                    </Label>
                    <Input type="text" name={"warehouse_address"} value={formData.warehouse_address}
                           onChange={handleFormChange}/>
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
                    <Input type="text" name={"managing_director"} value={formData.managing_director}
                           onChange={handleFormChange}/>
                </div>

                <div>
                    <Label>
                        Managing Directory Email
                    </Label>
                    <Input type="email" name={"managing_director_email"} value={formData.managing_director_email}
                           onChange={handleFormChange}/>
                </div>

                <div>
                    <Label>
                        Managing Directory Personal Phone
                    </Label>
                    <Input type="text" name={"managing_director_phone"} value={formData.managing_director_phone}
                           onChange={handleFormChange}/>
                </div>

                <div>
                    <Label>
                        Managing Directory Desk Phone
                    </Label>
                    <Input type="text" name={"managing_director_desk_phone"}
                           value={formData.managing_director_desk_phone} onChange={handleFormChange}/>
                </div>

                <div>
                    <Label>
                        Port
                    </Label>
                    <Input type="text" name={"port"} value={formData.port}
                           onChange={handleFormChange}/>
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
                    <Input type="text" name={"sales_manager"} value={formData.sales_manager}
                           onChange={handleFormChange}/>
                </div>
                <div>
                    <Label>
                        Sales Manager Email
                    </Label>
                    <Input type="email" name={"sales_manager_email"} value={formData.sales_manager_email}
                           onChange={handleFormChange}/>
                </div>
                <div>
                    <Label>
                        Sales Manager Phone
                    </Label>
                    <Input type="text" name={"sales_manager_phone"} value={formData.sales_manager_phone}
                           onChange={handleFormChange}/>
                </div>
                <div>
                    <Label>
                        Sales Manager Desk Phone
                    </Label>
                    <Input type="text" name={"sales_manager_desk_phone"} value={formData.sales_manager_desk_phone}
                           onChange={handleFormChange}/>
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
                    <Input type="text" name={"logistic_service"} value={formData.logistic_service}
                           onChange={handleFormChange}/>
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

