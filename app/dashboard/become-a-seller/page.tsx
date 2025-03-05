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
    const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>({});
 
   
      const validateForm = () => {
        let newErrors: { [key in keyof FormData]?: string } = {}
 
   
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.business_email.trim()) newErrors.business_email = "Business Email is required.";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
        if (!formData.tax_id.trim()) newErrors.tax_id = "Tax ID is required.";
        if (!formData.warehouse_address.trim()) newErrors.warehouse_address = "Warehouse address is required.";
        if (!formData.managing_director.trim()) newErrors.managing_director = "Managing director name is required.";
        if (!formData.managing_director_email.trim()) newErrors.managing_director_email = "Managing director email is required.";
        if (!formData.managing_director_phone.trim()) newErrors.managing_director_phone = "Managing director phone is required.";
        if (!formData.managing_director_phone.trim()) newErrors.managing_director_desk_phone = "Managing director desk phone is required.";
        if (!formData.port.trim()) newErrors.port = "port is required.";
 
        if (!formData.sales_manager.trim()) newErrors.sales_manager = "Sales manager name is required.";
        if (!formData.sales_manager_email.trim()) newErrors.sales_manager_email = "Sales manager email is required.";
        if (!formData.sales_manager_phone.trim()) newErrors.sales_manager_phone = "Sales manager phone is required.";
        if (!formData.sales_manager_phone.trim()) newErrors.sales_manager_desk_phone = "Sales manager desk phone is required.";
        if (!formData.sales_manager_phone.trim()) newErrors.logistic_service = "Logistic service is required.";
        if (formData.brands.length === 0) {
            newErrors.brands = "At least one brand is required.";
        }
        if (formData.category.length === 0) {
            newErrors.category = "At least one category is required.";
        }
        if (formData.model.length === 0) {
            newErrors.model = "At least one model is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
  };
 
  const handleSelectCategory = (v: string) => {
    if (!formData.category.includes(v)) {
        setFormData({ ...formData, category: [...formData.category, v] });
    }
};
 
// Handle select model
const handleSelectModel = (v: string) => {
    if (!formData.model.includes(v)) {
        setFormData({ ...formData, model: [...formData.model, v] });
    }
};
 
// Handle select brand
const handleSelectBrand = (v: string) => {
    if (!formData.brands.includes(v)) {
        setFormData({ ...formData, brands: [...formData.brands, v] });
    }
};
 
 
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
        if (!validateForm()) {
            return;
          }
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
        setErrors({ ...errors, [e.target.name]: "" });
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
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="text" name={"name"} value={formData.name} onChange={handleFormChange}/>
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
 
                <div>
                    <Label>
                        Business Email
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="text" name={"business_email"} value={formData.business_email}
                           onChange={handleFormChange}/>
                             {errors.business_email && <p className="text-red-500 text-sm">{errors.business_email}</p>}
                </div>
 
                <div>
                    <Label>
                        Phone
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="tel" name={"phone"} value={formData.phone} onChange={handleFormChange}/>
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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
                    <div>
                        <Label>
                            Select Brands
                        </Label>  <span className="text-red-500">*</span>
                       
                        <Select name={"brands"}
                                onValueChange={(v) => {
                                setFormData({...formData, brands: [...formData.brands, v]})
                                setErrors({ ...errors, brands: "" })
                                }}
                                >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Brand"/>
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.brands && <p className="text-red-500">{errors.brands}</p>}
 
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
                        </Label>  <span className="text-red-500">*</span>
                     
                        <Select onValueChange={(v) => { setFormData({...formData, model: [...formData.model, v]})
                            setErrors({ ...errors, model: "" })
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Model"/>
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.model && <p className="text-red-500">{errors.model}</p>}
 
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
                        </Label>  <span className="text-red-500">*</span>
                        <Select onValueChange={(v) => { setFormData({...formData, category: [...formData.category, v]})
                                                    setErrors({ ...errors, category: "" })
                                                }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category"/>
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500">{errors.category}</p>}
 
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
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="text" name={"tax_id"} value={formData.tax_id} onChange={handleFormChange}/>
                    {errors.tax_id && <p className="text-red-500 text-sm">{errors.tax_id}</p>}
                </div>
 
                <div>
                    <Label>
                        Warehouse Address
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="text" name={"warehouse_address"} value={formData.warehouse_address}
                           onChange={handleFormChange}/>
                           {errors.warehouse_address && <p className="text-red-500 text-sm">{errors.warehouse_address}</p>}
                </div>
 
                <div className="mt-8 mb-4">
                    <h1 className="text-xl font-bold">
                        Managing Directory Details
                    </h1>
                </div>
                <div>
                    <Label>
                        Managing Directory
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="text" name={"managing_director"} value={formData.managing_director}
                           onChange={handleFormChange}/>
                           {errors.managing_director && <p className="text-red-500 text-sm">{errors.managing_director}</p>}
 
                </div>
 
                <div>
                    <Label>
                        Managing Directory Email
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="email" name={"managing_director_email"} value={formData.managing_director_email}
                           onChange={handleFormChange}/>
                           {errors.managing_director_email && <p className="text-red-500 text-sm">{errors.managing_director_email}</p>}
 
                </div>
 
                <div>
 
                    <Label>
                        Managing Directory Personal Phone
                    </Label>  <span className="text-red-500">*</span>
                   
                    <Input  name={"managing_director_phone"} value={formData.managing_director_phone}
                           onChange={handleFormChange}/>
                            {errors. managing_director_phone && <p className="text-red-500 text-sm">{errors. managing_director_phone}</p>}
                </div>
 
                <div>
                    <Label>
                        Managing Directory Desk Phone
                    </Label> <span className="text-red-500">*</span>

                    <Input type="tel" name={"managing_director_desk_phone"} value={formData.managing_director_desk_phone} onChange={handleFormChange}/>
                            {errors.managing_director_desk_phone && <p className="text-red-500 text-sm">{errors.managing_director_desk_phone}</p>}
                </div>
 
                <div>
                    <Label>
                        Port
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="tel" name={"port"} value={formData.port}
                           onChange={handleFormChange}/>
                            {errors.port && <p className="text-red-500 text-sm">{errors.port}</p>}
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
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="text" name={"sales_manager"} value={formData.sales_manager}
                           onChange={handleFormChange}/>
                            {errors.sales_manager && <p className="text-red-500 text-sm">{errors.sales_manager}</p>}
                </div>
                <div>
                    <Label>
                        Sales Manager Email
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="email" name={"sales_manager_email"} value={formData.sales_manager_email}
                           onChange={handleFormChange}/>
                            {errors.sales_manager_email && <p className="text-red-500 text-sm">{errors.sales_manager_email}</p>}
                </div>
                <div>
                    <Label>
                        Sales Manager Phone
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="text" name={"sales_manager_phone"} value={formData.sales_manager_phone}
                           onChange={handleFormChange}/>
                            {errors.sales_manager_phone && <p className="text-red-500 text-sm">{errors.sales_manager_phone}</p>}
                </div>
                <div>
                    <Label>
                        Sales Manager Desk Phone
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="text" name={"sales_manager_desk_phone"} value={formData.sales_manager_desk_phone}
                           onChange={handleFormChange}/>
                            {errors.sales_manager_desk_phone && <p className="text-red-500 text-sm">{errors.sales_manager_desk_phone}</p>}
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
                    </Label>  <span className="text-red-500">*</span>
                    <Input type="text" name={"logistic_service"} value={formData.logistic_service}
                           onChange={handleFormChange}/>
                            {errors.logistic_service && <p className="text-red-500 text-sm">{errors.logistic_service}</p>}
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