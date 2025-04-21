"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  });
  const [brands, updatebrands] = useState<Brand[]>([]);
  const [models, updateModels] = useState<Model[]>([]);
  const [categories, updateCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>(
    {}
  );
  const [invitedBy,setInvitedBy]=useState("");

  const validateForm = () => {
    let newErrors: { [key in keyof FormData]?: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.business_email.trim())
      newErrors.business_email = "Business Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
    if (!formData.tax_id.trim()) newErrors.tax_id = "Tax ID is required.";
    if (!formData.warehouse_address.trim())
      newErrors.warehouse_address = "Warehouse address is required.";
    if (!formData.managing_director.trim())
      newErrors.managing_director = "Managing director name is required.";
    if (!formData.managing_director_email.trim())
      newErrors.managing_director_email =
        "Managing director email is required.";
    if (!formData.managing_director_phone.trim())
      newErrors.managing_director_phone =
        "Managing director phone is required.";
    if (!formData.managing_director_phone.trim())
      newErrors.managing_director_desk_phone =
        "Managing director desk phone is required.";
    if (!formData.port.trim()) newErrors.port = "port is required.";
    if (!formData.sales_manager.trim())
      newErrors.sales_manager = "Sales manager name is required.";
    if (!formData.sales_manager_email.trim())
      newErrors.sales_manager_email = "Sales manager email is required.";
    if (!formData.sales_manager_phone.trim())
      newErrors.sales_manager_phone = "Sales manager phone is required.";
    if (!formData.sales_manager_phone.trim())
      newErrors.sales_manager_desk_phone =
        "Sales manager desk phone is required.";
    if (!formData.sales_manager_phone.trim())
      newErrors.logistic_service = "Logistic service is required.";
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
  const [type, setType] = useState();
  const [profileId, setProfileId] = useState("");


  const [userID,setUserId]=useState("")

  useEffect(() => {
    const fetchUserAndType = async () => {
      console.log("This is t");
      // Step 1: Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        return;
      }

      setUserId(user?.id || " ");
      const userId = user.id;

      // Step 2: Use userId to get data from 'invitations'
      const { data, error } = await supabase
        .from("invitations")
        .select("type,invited_by")
        .eq("new_user_id", userId)
        .single(); // assuming only one invitation per user

      if (error) {
        console.error("Error fetching invitation data:", error);
        return;
      }

      if (data) {
        console.log("tye",data.type);
        console.log("profileId",userId);
        setType(data.type); // assuming you defined const [type, setType] = useState("")
        setProfileId(userId); // assuming you defined const [profileId, setProfileId] = useState("")
        setInvitedBy(data.invited_by);

      }
    };

    fetchUserAndType();
  }, []);

  async function handleSubmit() {
    const { data, error }: PostgrestSingleResponse<any> = await supabase
      .from("merchant")
      .insert({
        ...formData,
        status: "waiting",
        merchant_profile: profileId,
        parent_id:invitedBy,
        vendor_type: type, // ✅ use the passed 'type' here
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }
    else{
      alert("Successully filled");
      router.push('/dashboard');
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
      <div className="bg-white shadow-md rounded-md p-8">
        <NavigationMenu>
          <NavigationMenuList className="justify-start">
            <NavigationMenuItem>
              <div className="font-bold text-xl text-gray-800">Euroasian</div>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div>
              <h1 className="text-center text-3xl font-semibold text-gray-800 mb-8">
                Vendor Onboarding Page
              </h1>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Vendor Details
              </h2>
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

            <div className="mt-8">
              <Button
                className="bg-blue-500 hover:bg-blue-700 flex justify-center text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline"
                onClick={handleSubmit} // Call handleSubmit when the button is clicked
              >
                Become a Vendor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
