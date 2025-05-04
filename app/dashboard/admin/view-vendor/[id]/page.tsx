"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostgrestSingleResponse, UserResponse } from "@supabase/supabase-js";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import SuccessToast from "@/components/ui/successToast";

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
  account_holder_name: string;
  ifsc_code?: string;
  spea_code?: string;
  bic_swift?: string;
  account_type?: string;
  branch_name?: string;
  bank_address?: string;
  bank_name?: string;
  account_number?: string;
  micr_code?: string;
  document?: string;
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
    status: "",
    account_holder_name: "",
    ifsc_code: "",
    spea_code: "",
    bic_swift: "",
    account_type: "",
    branch_name: "",
  
    micr_code: "",
    document: "",
  });
  const [brands, updatebrands] = useState<Brand[]>([]);
  const [models, updateModels] = useState<Model[]>([]);
  const [categories, updateCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>(
    {}
  );
  const [invitedBy, setInvitedBy] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const  [fileUrl, setFileUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { id } = useParams(); 

  useEffect(() => {
    const fetchVendorData = async () => {
        if (!id) {
            setError("Vendor ID is missing.");
            setLoading(false);
            return;
        }

        try {
            const { data, error: fetchError } = await supabase
                .from("merchant")
                .select("*")
                .eq("id", id) // Use the id from the URL
                .single();

            if (fetchError) {
                setError(`Error fetching vendor data: ${fetchError.message}`);
                setLoading(false);
                return;
            }

            if (!data) {
                setError("Vendor not found.");
                setLoading(false);
                return;
            }

            // Assuming your column names match the FormData interface
            setFormData({
                name: data.name || "",
                business_email: data.business_email || "",
                phone: data.phone || "",
                status: data.status || "",
                merchant_profile: data.merchant_profile || "",
                brands: data.brands || [],
                category: data.category || [],
                model: data.model || [],
                tax_id: data.tax_id || "",
                warehouse_address: data.warehouse_address || "",
                managing_director: data.managing_director || "",
                managing_director_email: data.managing_director_email || "",
                managing_director_phone: data.managing_director_phone || "",
                managing_director_desk_phone: data.managing_director_desk_phone || "",
                port: data.port || "",
                logistic_service: data.logistic_service || "",
                sales_manager: data.sales_manager || "",
                sales_manager_email: data.sales_manager_email || "",
                sales_manager_phone: data.sales_manager_phone || "",
                sales_manager_desk_phone: data.sales_manager_desk_phone || "",
                account_holder_name: data.account_holder_name || "",
                ifsc_code: data.ifsc_code || "",
                spea_code: data.spea_code || "",
                bic_swift: data.bic_swift || "",
                account_type: data.account_type || "",
                branch_name: data.branch_name || "",
                bank_address: data.bank_address || "",
                bank_name: data.bank_name || "",
                account_number: data.account_number || "",
                micr_code: data.micr_code || "",
                document: data.document || "",
            });
            setLoading(false);
        } catch (err) {
            setError(`An unexpected error occurred: ${err}`);
            setLoading(false);
        }
    };

    fetchVendorData();
}, [id, supabase]);


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
  const [type, setType] = useState();
  const [profileId, setProfileId] = useState("");

  const [userID, setUserId] = useState("");



  async function handleSubmit() {
    let fileUrl = "";

    if (!selectedFile) {
      console.warn("⚠️ No file selected. Skipping file upload.");
    } else {
      try {
        console.log("📁 Uploading selected file...");

        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("merchant")
          .upload(`uploads/${fileName}`, selectedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("merchant")
          .getPublicUrl(uploadData.path);

        fileUrl = publicUrlData.publicUrl;
        console.log("✅ File uploaded. Public URL:", fileUrl);

        setFileUrl(fileUrl); // Store the file URL in state if needed
      } catch (uploadErr) {
        console.error("❌ File upload failed:", uploadErr);
        alert("File upload failed. Please try again.");
        return;
      }
    }

    const { data, error }: PostgrestSingleResponse<any> = await supabase
      .from("merchant")
      .insert({
        ...formData,
        document: fileUrl, // Use the file URL here
        status: "waiting",
        merchant_profile: profileId,
        parent_id: invitedBy,
        vendor_type: type, // ✅ use the passed 'type' here
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    } else {
      alert("Successully filled");
      router.push("/dashboard");
    }
    return data;
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <>
    
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div>
              <h1 className="text-center text-3xl font-semibold text-gray-800 mb-8">
                Vendor Details
              </h1>
            </div>

            <div className="mb-6">
             
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-700">Name</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">Business Email</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name="business_email"
                    value={formData.business_email}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.business_email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.business_email && (
                    <p className="text-red-500 text-sm">
                      {errors.business_email}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">Phone</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Product Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <div className="flex gap-1 mb-2">
                    {formData.brands.map((brand: string, i: number) => (
                      <div
                        key={i}
                        className="text-xs text-white bg-blue-500 rounded-full px-2 py-1"
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                  <div>
                    <Label className="text-gray-700">Select Brands</Label>{" "}
                    <span className="text-red-500">*</span>
                    <Select
                      name={"brands"}
                      onValueChange={(v) => {
                        setFormData({
                          ...formData,
                          brands: [...formData.brands, v],
                        });
                        setErrors({ ...errors, brands: "" });
                      }}
                    >
                      <SelectTrigger
                        className={`text-gray-700 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.brands ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        {formData.brands.length > 0 ? (
                          <SelectValue className="text-gray-700" />
                        ) : (
                          <span className="text-gray-400">Select Brand</span>
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand: any, i: number) => (
                          <SelectItem value={brand.name} key={i}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.brands && (
                      <p className="text-red-500">{errors.brands}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex gap-1 mb-2">
                    {formData.model.map((model: string, i: number) => (
                      <div
                        key={i}
                        className="text-xs text-white bg-blue-500 rounded-full px-2 py-1"
                      >
                        {model}
                      </div>
                    ))}
                  </div>
                  <div>
                    <Label className="text-gray-700">Select Models</Label>{" "}
                    <span className="text-red-500">*</span>
                    <Select
                      onValueChange={(v) => {
                        setFormData({
                          ...formData,
                          model: [...formData.model, v],
                        });
                        setErrors({ ...errors, model: "" });
                      }}
                    >
                      <SelectTrigger
                        className={`text-gray-700 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.model ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        {formData.model.length > 0 ? (
                          <SelectValue className="text-gray-700" />
                        ) : (
                          <span className="text-gray-400">Select Model</span>
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model: any, i: number) => (
                          <SelectItem value={model.name} key={i}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.model && (
                      <p className="text-red-500">{errors.model}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex gap-1 mb-2">
                    {formData.category.map((category: string, i: number) => (
                      <div
                        key={i}
                        className="text-xs text-white bg-blue-500 rounded-full px-2 py-1"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                  <div>
                    <Label className="text-gray-700">Select Categories</Label>{" "}
                    <span className="text-red-500">*</span>
                    <Select
                      onValueChange={(v) => {
                        setFormData({
                          ...formData,
                          category: [...formData.category, v],
                        });
                        setErrors({ ...errors, category: "" });
                      }}
                    >
                      <SelectTrigger
                        className={`text-gray-700 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        {formData.category.length > 0 ? (
                          <SelectValue className="text-gray-700" />
                        ) : (
                          <span className="text-gray-400">Select Category</span>
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: any, i: number) => (
                          <SelectItem value={category.name} key={i}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500">{errors.category}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Business Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-700">Tax ID</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name={"tax_id"}
                    value={formData.tax_id}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.tax_id ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.tax_id && (
                    <p className="text-red-500 text-sm">{errors.tax_id}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">Warehouse Address</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name={"warehouse_address"}
                    value={formData.warehouse_address}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.warehouse_address
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.warehouse_address && (
                    <p className="text-red-500 text-sm">
                      {errors.warehouse_address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Managing Director Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-700">Managing Director</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name={"managing_director"}
                    value={formData.managing_director}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.managing_director
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.managing_director && (
                    <p className="text-red-500 text-sm">
                      {errors.managing_director}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-700">
                    Managing Director Email
                  </Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="email"
                    name={"managing_director_email"}
                    value={formData.managing_director_email}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.managing_director_email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.managing_director_email && (
                    <p className="text-red-500 text-sm">
                      {errors.managing_director_email}
                    </p>
                  )}
                </div>
                <div>
                  <div className="whitespace-nowrap">
                    <Label className="text-gray-700">
                      Managing Director Personal Phone
                    </Label>{" "}
                    <span className="text-red-500">*</span>
                  </div>
                  <Input
                    name={"managing_director_phone"}
                    value={formData.managing_director_phone}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.managing_director_phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.managing_director_phone && (
                    <p className="text-red-500 text-sm">
                      {errors.managing_director_phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label className="text-gray-700">
                    Managing Director Desk Phone
                  </Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="tel"
                    name={"managing_director_desk_phone"}
                    value={formData.managing_director_desk_phone}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.managing_director_desk_phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.managing_director_desk_phone && (
                    <p className="text-red-500 text-sm">
                      {errors.managing_director_desk_phone}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">Port</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="tel"
                    name={"port"}
                    value={formData.port}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.port ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.port && (
                    <p className="text-red-500 text-sm">{errors.port}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Sales Manager Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-700">Sales Manager Name</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name={"sales_manager"}
                    value={formData.sales_manager}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.sales_manager
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.sales_manager && (
                    <p className="text-red-500 text-sm">
                      {errors.sales_manager}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-700">Sales Manager Email</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="email"
                    name={"sales_manager_email"}
                    value={formData.sales_manager_email}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.sales_manager_email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.sales_manager_email && (
                    <p className="text-red-500 text-sm">
                      {errors.sales_manager_email}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">Sales Manager Phone</Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name={"sales_manager_phone"}
                    value={formData.sales_manager_phone}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.sales_manager_phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.sales_manager_phone && (
                    <p className="text-red-500 text-sm">
                      {errors.sales_manager_phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label className="text-gray-700">
                    Sales Manager Desk Phone
                  </Label>{" "}
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name={"sales_manager_desk_phone"}
                    value={formData.sales_manager_desk_phone}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.sales_manager_desk_phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.sales_manager_desk_phone && (
                    <p className="text-red-500 text-sm">
                      {errors.sales_manager_desk_phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Logistic Service Details
              </h2>
              <div>
                <Label className="text-gray-700">Enter Logistic Service</Label>{" "}
                <span className="text-red-500">*</span>
                <Input
                  type="text"
                  name={"logistic_service"}
                  value={formData.logistic_service}
                  onChange={handleFormChange}
                  className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.logistic_service
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.logistic_service && (
                  <p className="text-red-500 text-sm">
                    {errors.logistic_service}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Document Uploads
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Document</Label>
                  
                  {formData.document && (
                    <div className="mt-2">
                      {formData.document.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <img
                          src={formData.document}
                          alt="Uploaded Document"
                          className="w-full h-auto rounded-md"
                        />
                      ) : (
                        <a
                          href={formData.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Document
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Bank Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Account Information (Usually Required) */}
                <div>
                  <Label className="text-gray-700">Account Holder Name</Label>
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name="account_holder_name"
                    value={formData.account_holder_name}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.account_holder_name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.account_holder_name && (
                    <p className="text-red-500 text-sm">
                      {errors.account_holder_name}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">Bank Name</Label>
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.bank_name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.bank_name && (
                    <p className="text-red-500 text-sm">{errors.bank_name}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">Account Number</Label>
                  <span className="text-red-500">*</span>
                  <Input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleFormChange}
                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.account_number
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.account_number && (
                    <p className="text-red-500 text-sm">
                      {errors.account_number}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">IFSC Code</Label>
                  <Input
                    type="text"
                    name="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={handleFormChange}
                    className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
                  />
                  {errors.ifsc_code && (
                    <p className="text-red-500 text-sm">{errors.ifsc_code}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">Spea Code</Label>
                  <Input
                    type="text"
                    name="spea_code"
                    value={formData.spea_code}
                    onChange={handleFormChange}
                    className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
                  />
                  {errors.spea_code && (
                    <p className="text-red-500 text-sm">{errors.spea_code}</p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-700">MICR CODE</Label>
                  <Input
                    type="text"
                    name="micr_code"
                    value={formData.micr_code}
                    onChange={handleFormChange}
                    className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
                  />
                  {errors.spea_code && (
                    <p className="text-red-500 text-sm">{errors.micr_code}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">BIC / SWIFT Code</Label>
                  <Input
                    type="text"
                    name="bic_swift"
                    value={formData.bic_swift}
                    onChange={handleFormChange}
                    className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
                  />
                  {errors.bic_swift && (
                    <p className="text-red-500 text-sm">{errors.bic_swift}</p>
                  )}
                </div>

                {/* Account Type */}
                <div>
                  <Label className="text-gray-700">Account Type</Label>
                  <Select
                    onValueChange={(v) =>
                      setFormData({ ...formData, account_type: v })
                    }
                  >
                    <SelectTrigger className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-gray-300">
                      <SelectValue placeholder="Select Account Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      {/* Add other relevant account types */}
                    </SelectContent>
                  </Select>
                  {errors.account_type && (
                    <p className="text-red-500 text-sm">
                      {errors.account_type}
                    </p>
                  )}
                </div>

                {/* Optional but Potentially Useful Information */}
                <div>
                  <Label className="text-gray-700">
                    Branch Name (Optional)
                  </Label>
                  <Input
                    type="text"
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleFormChange}
                    className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
                  />
                  {errors.branch_name && (
                    <p className="text-red-500 text-sm">{errors.branch_name}</p>
                  )}
                </div>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </>
  );
}
