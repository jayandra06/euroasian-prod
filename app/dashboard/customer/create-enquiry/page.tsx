"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
// import { useRouter } from "next/router";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Trash2 } from "lucide-react";
import ErrorToast from "@/components/ui/errorToast";
import SuccessToast from "@/components/ui/successToast";
import { equal } from "assert";

function RFQInfoCard({
  createRfq,
  setcreateRfq,
  models,
  brands,
  category,
  setSelectedFile,

  errors,
  setErrors,
}: {
  createRfq: any;
  setcreateRfq: React.Dispatch<React.SetStateAction<any>>;
  models: any[];
  brands: any[];
  category: any[];
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;

  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
}) {
  useEffect(() => {
    if (!createRfq.lead_date) {
      const currentDate = new Date().toISOString().split("T")[0];
      setcreateRfq((prev: any) => ({ ...prev, lead_date: currentDate }));
    }
  }, [createRfq.lead_date, setcreateRfq]);

  const [vessels, setVessels] = useState<any[]>([]);

  const fetchVessels = async () => {
    try {
      const supabase = createClient();

      // --- get current user ---
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not found or error:", userError);
        return;
      }

      // Properly structure the GET request with query params or use POST for body
      const res = await axios.get("/api/fetch-vessel-role-wise", {
        params: {
          email: user.email,
          id: user.id,
        },
      });

      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setVessels(res.data.data);
      } else {
        console.error(
          'Error: API response does not contain an array in the "data" property.'
        );
        setVessels([]);
      }
    } catch (error) {
      console.error("Error fetching vessels:", error);
      setVessels([]);
    }
  };

  useEffect(() => {
    fetchVessels();
  }, []);
  return (
    <>
      <div className="w-[950px] max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold">RFQ and Vessel Information</h2>
          <p className="text-gray-600">
            Details for RFQ, Vessel, and Equipment
          </p>
        </div>

        <div>
          {/* RFQ Info Section */}
          <div className="w-full p-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="flex flex-col">
                <Label htmlFor="vesselName">
                  Vessel Name <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="vessel_name"
                  onValueChange={(e) =>
                    setcreateRfq({ ...createRfq, vessel_name: e })
                  }
                >
                  <SelectTrigger
                    className={`border mt-2 ${
                      errors.vessel_name ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select Vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(vessels) &&
                      vessels.map((vessel, i) => (
                        <SelectItem value={vessel.vessel_name} key={vessel.id}>
                          {vessel.vessel_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.vessel_name && (
                  <p className="text-red-500 text-sm">{errors.vessel_name}</p>
                )}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="supplyPort">
                  Supply Port <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="supply_port"
                  onValueChange={(value) =>
                    setcreateRfq({ ...createRfq, supply_port: value })
                  }
                  value={createRfq.supply_port || ""}
                >
                  <SelectTrigger
                    className={`border mt-2 ${
                      errors.supply_port ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select Supply Port" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Bussan", "Goa", "Tamil Nadu", "Kerala", "Mumbai"].map(
                      (port) => (
                        <SelectItem key={port} value={port}>
                          {port}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {errors.supply_port && (
                  <p className="text-red-500 text-sm">{errors.supply_port}</p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="createdDate">Created Date</Label>
                <Input
                  type="date"
                  className="mt-2"
                  id="createDate"
                  value={new Date().toISOString().split("T")[0]}
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="leadDate">
                  Lead Date <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  type="date"
                  id="lead_date"
                  name="lead_date"
                  placeholder="Lead date"
                  value={createRfq.lead_date}
                  onChange={(e) => {
                    setcreateRfq({ ...createRfq, lead_date: e.target.value });
                  }}
                  className={`grid  mt-2 border ${
                    errors.lead_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lead_date && (
                  <p className="text-red-500 text-sm">{errors.lead_date}</p>
                )}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="drawingNumber">Drawing Number</Label>
                <Input
                  type="text"
                  id="drawingNumber"
                  name="drawing_number"
                  placeholder="Drawing Number"
                  value={createRfq.drawing_number}
                  onChange={(e) => {
                    setcreateRfq({
                      ...createRfq,
                      drawing_number: e.target.value,
                    });
                    setErrors({ ...errors, drawing_number: "" });
                  }}
                  className={`grid  mt-2 border ${
                    errors.drawing_number ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.drawing_number && (
                  <p className="text-red-500 text-sm">
                    {errors.drawing_number}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="imoNo">
                  IMO No <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="imoNo"
                  placeholder="IMO No."
                  name="imo_no"
                  value={createRfq.imo_no}
                  onChange={(e) =>
                    setcreateRfq({ ...createRfq, imo_no: e.target.value })
                  }
                  className={`border mt-2 ${
                    errors.imo_no ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.imo_no && (
                  <p className="text-red-500 text-sm">{errors.imo_no}</p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="equipmentTag">Equipment Tags</Label>
                <Input
                  type="text"
                  id="equpipmentTag"
                  placeholder="Equipment Tag"
                  name="equipement_tag"
                  value={createRfq.equipement_tag}
                  onChange={(e) => {
                    setcreateRfq({
                      ...createRfq,
                      equipement_tag: e.target.value,
                    });
                    setErrors({ ...errors, equipement_tag: "" });
                  }}
                  className={`grid  mt-2 border ${
                    errors.equipement_tag ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.equipement_tag && (
                  <p className="text-red-500 text-sm">
                    {errors.equipement_tag}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="brand">
                  Brand <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="brand"
                  onValueChange={(v) => {
                    setcreateRfq({ ...createRfq, brand: v });
                    setErrors({ ...errors, brand: "" });
                  }}
                >
                  <SelectTrigger
                    className={`border mt-2 ${
                      errors.brand ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand, i) => (
                      <SelectItem value={brand.name} key={i}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brand && (
                  <p className="text-red-500 text-sm">{errors.brand}</p>
                )}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="model">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="model"
                  onValueChange={(v) => {
                    setcreateRfq({ ...createRfq, model: v });
                    setErrors({ ...errors, model: "" });
                  }}
                >
                  <SelectTrigger
                    className={`border mt-2 ${
                      errors.model ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model, i) => (
                      <SelectItem value={model.name} key={i}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.model && (
                  <p className="text-red-500 text-sm">{errors.model}</p>
                )}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="category"
                  onValueChange={(v) => {
                    setcreateRfq({ ...createRfq, category: v });
                    setErrors({ ...errors, category: "" });
                  }}
                >
                  <SelectTrigger
                    className={`border mt-2 ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {category.map((cat, i) => (
                      <SelectItem value={cat.name} key={i}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}
              </div>

              {/* drawing Number */}
              <div className="flex flex-col">
                <Label htmlFor="imoNo">
                  HULL No <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="hullNo"
                  placeholder="HULL No."
                  name="hull_no"
                  value={createRfq.hull_no}
                  onChange={(e) =>
                    setcreateRfq({ ...createRfq, hull_no: e.target.value })
                  }
                  className={`border mt-2 ${
                    errors.hull_no ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.hull_no && (
                  <p className="text-red-500 text-sm">{errors.hull_no}</p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="model">
                  Offered Quality <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="offer_quality"
                  onValueChange={(v) => {
                    setcreateRfq({ ...createRfq, offer_quality: v });
                    setErrors({ ...errors, offer_quality: "" });
                  }}
                  value={createRfq.offer_quality || ""}
                >
                  <SelectTrigger
                    className={`border mt-2 ${
                      errors.offer_quality
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Genuine", "OEM", "Copy", "Parts"].map((quality) => (
                      <SelectItem key={quality} value={quality}>
                        {quality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.offer_quality && (
                  <p className="text-red-500 text-sm">{errors.offer_quality}</p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="general_remarks">General Remarks</Label>
                <Input
                  type="text"
                  id="general_remarks"
                  placeholder="general_remarks"
                  name="general_remarks"
                  value={createRfq.general_remarks}
                  onChange={(e) =>
                    setcreateRfq({
                      ...createRfq,
                      general_remarks: e.target.value,
                    })
                  }
                  className={`border mt-2 ${
                    errors.general_remarks
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.general_remarks && (
                  <p className="text-red-500 text-sm">
                    {errors.general_remarks}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  type="text"
                  id="serialNumber"
                  placeholder="Serial Number"
                  name="serial_no"
                  value={createRfq.serial_no}
                  onChange={(e) =>
                    setcreateRfq({ ...createRfq, serial_no: e.target.value })
                  }
                  className={`border mt-2 ${
                    errors.serial_no ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.serial_no && (
                  <p className="text-red-500 text-sm">{errors.serial_no}</p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="vesselExNumber">Vessel Ex Name</Label>
                <Input
                  type="text"
                  id="vesselExNumber"
                  placeholder="Vessel Ex Number"
                  name="vessel_ex_name"
                  value={createRfq.vessel_ex_name}
                  onChange={(e) =>
                    setcreateRfq({
                      ...createRfq,
                      vessel_ex_name: e.target.value,
                    })
                  }
                  className={`border mt-2 ${
                    errors.vessel_ex_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.vessel_ex_name && (
                  <p className="text-red-500 text-sm">
                    {errors.vessel_ex_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="upload">Upload File</Label>
                <Input
                  id="upload"
                  type="file"
                  className="mt-2"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      setErrors({ ...errors, upload: "" }); // Clear upload error
                    }
                  }}
                />
                {errors.upload && (
                  <p className="text-red-500 text-sm">{errors.upload}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// @ts-ignore
function Item({ item, handleUpdateItem, handleRemove, setErrors, errors }) {
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    handleUpdateItem(item.id, name, value);
    console.log("Field:", name, "Value:", value);
    if (errors?.description) {
      setErrors({ ...errors, description: "" });
    }
  };
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{item.id}</TableCell>
        <TableCell>
          {" "}
          {/* Description Column */}
          <div className="grid gap-2 grid-cols-1 items-center">
            {" "}
            {/* Single column grid */}
            <div>
              <Input
                type="text"
                placeholder="Impa No"
                value={item.impa_no}
                name="impa_no"
                onChange={handleChange}
                className="p-2" // Added padding to Input
              />
              {errors.impa_no && (
                <p className="text-red-500 text-sm">{errors.impa_no}</p>
              )}
            </div>
            <Textarea
              placeholder="Item Description.."
              value={item.description}
              name="description"
              onChange={handleChange}
              className="p-2" // Added padding to Textarea
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
        </TableCell>
        <TableCell>
          {" "}
          {/* Part No. Column */}
          <div className="grid gap-2 grid-cols-1 items-center">
            {" "}
            {/* Single column grid */}
            <Input
              type="text"
              placeholder="Part No."
              value={item.part_no}
              name="part_no"
              onChange={handleChange}
              className="p-2" // Added padding to Input
            />
            {errors.part_no && (
              <p className="text-red-500 text-sm">{errors.part_no}</p>
            )}
            <Input
              type="text"
              placeholder="alt. Part No."
              value={item.alternate_part_no}
              name="alternative_part_no"
              onChange={handleChange}
              className="p-2" // Added padding to Input
            />
            {errors.alternate_part_no && (
              <p className="text-red-500 text-sm">{errors.alternate_part_no}</p>
            )}
          </div>
        </TableCell>
        <TableCell>
          {" "}
          {/* Position No. Column */}
          <div className="grid gap-2 grid-cols-1 items-center">
            {" "}
            {/* Single column grid */}
            <Input
              type="text"
              placeholder="Position No"
              value={item.position_no}
              name="position_no"
              onChange={handleChange}
              className="p-2" // Added padding to Input
            />
            {errors.offered_qty && (
              <p className="text-red-500 text-sm">{errors.offered_qty}</p>
            )}
            <Input
              type="text"
              placeholder="W x B x H"
              value={item.dimensions}
              name="dimensions"
              onChange={handleChange}
              className="p-2" // Added padding to Input
            />
            {errors.dimensions && (
              <p className="text-red-500 text-sm">{errors.dimensions}</p>
            )}
          </div>
        </TableCell>
        <TableCell>
          {" "}
          {/* Req. Qty. Column */}
          <Input
            type="text"
            placeholder="required quanitity"
            value={item.req_qty}
            name="req_qty"
            onChange={handleChange}
            className="p-2" // Added padding to Input
          />
          {errors.req_qty && (
            <p className="text-red-500 text-sm">{errors.req_qty}</p>
          )}
        </TableCell>
        <TableCell>
          {" "}
          {/* UOM Column */}
          <Select
            name="uom"
            onValueChange={(v) => handleUpdateItem(item.id, "uom", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select UOM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pieces">Pieces</SelectItem>
              <SelectItem value="KiloGrams">KiloGrams</SelectItem>
              <SelectItem value="Litres">Litres</SelectItem>
            </SelectContent>
          </Select>
          {errors.uom && <p className="text-red-500 text-sm">{errors.uom}</p>}
        </TableCell>
        <TableCell>
          {" "}
          {/* General Remarks Column */}
          <Input
            type="text"
            placeholder="General Remarks"
            value={item.general_remarks}
            name="general_remarks" // You might want to change this name
            onChange={handleChange}
            className="p-2" // Added padding to Input
          />
          {errors.general_remarks && (
            <p className="text-red-500 text-sm">{errors.general_remarks}</p>
          )}
        </TableCell>
        <TableCell className="text-right relative">
          <Button
            onClick={() => handleRemove(item.id)}
            className=" mt-1 right-4"
            variant={"outline"}
          >
            <Trash2 />
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function CreateEnquiryPage() {
  const supabase = createClient();
  const [reqdVendors, updateReqdVendors] = useState({
    vendor1: {
      name: "",
      vendorId: "",
    },
    vendor2: {
      name: "",
      vendorId: "",
    },
    vendor3: {
      name: "",
      vendorId: "",
    },
  });

  const [brands, setBrands] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<any[]>([]);
  const [model, setModels] = useState<any[]>([]);
  const [vendors, updateVendors] = useState<any[]>([]);
  console.log("vendor", vendors);
  const [vendorsError, setVendorsError] = useState(false);
  const [createRfq, setCreateRfq] = useState({
    vessel_name: "",
    supply_port: "",
    created_date: "",
    lead_date: "",
    drawing_number: "",
    imo_no: "",
    equipement_tag: "",
    brand: "",
    model: "",
    category: "",
    hull_no: "",
    offer_quality: "",
    remarks: "",
    serial_no: "",
    vessel_ex_name: "",
    upload: "",
  });
  const [items, setItems] = useState<any>([
    {
      id: 1,
      description: "",
      part_no: "",
      alternative_part_no: "",
      position_no: "",
      alternative_position_no: "",
      impa_no: "",
      uom: "",
      req_qty: "",
      offered_qty: "0",
      width: "",
      dimensions: "",
      height: "",
      general_remarks: "",
    },
  ]);
  console.log("Items", items);

  const [isMem, setIsMem] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [errors, setErrors] = useState({ supply_port: "", items: [] });
  const handleUpdateItem = (id: number, key: any, value: any) => {
    setItems((prevItems: any) =>
      prevItems.map((item: any) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState(false);

  const getQuote = async () => {
    try {
      console.log("🔵 Starting RFQ creation process...");
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      let fileUrl = "";

      if (!selectedFile) {
        console.warn("⚠️ No file selected. Skipping file upload.");
      } else {
        try {
          console.log("📁 Uploading selected file...");

          const fileExt = selectedFile.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("rfq-image")
              .upload(`uploads/${fileName}`, selectedFile);

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from("rfq-image")
            .getPublicUrl(uploadData.path);

          fileUrl = publicUrlData.publicUrl;
          console.log("✅ File uploaded. Public URL:", fileUrl);
        } catch (uploadErr) {
          console.error("❌ File upload failed:", uploadErr);
          setErrorMessage("Failed to upload file.");
          setIsLoading(false);
          return;
        }
      }

      let user,
        branchValues = [];
      try {
        console.log("👤 Fetching current user...");
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;
        user = userData.user;

        const { data: memberData, error: memberError } = await supabase
          .from("member")
          .select("branch")
          .eq("member_profile", user.id);

        if (memberError) throw memberError;

        branchValues = memberData?.map((m) => m.branch) ?? [];
        console.log("✅ User & branch fetched:", user.id, branchValues);
      } catch (userErr) {
        console.error("❌ Error fetching user/member:", userErr);
        setErrorMessage("User authentication or branch fetch failed.");
        setIsLoading(false);
        return;
      }

      // Insert into `rfq` table
      let rfqData;
      try {
        const { data, error } = await supabase
          .from("rfq")
          .insert([
            {
              vessel_name: createRfq.vessel_name,
              supply_port: createRfq.supply_port,
              lead_date: createRfq.lead_date,
              drawing_number: createRfq.drawing_number,
              imo_no: createRfq.imo_no,
              equipement_tag: createRfq.equipement_tag,
              brand: createRfq.brand,
              model: createRfq.model,
              category: createRfq.category,
              hull_no: createRfq.hull_no,
              offer_quality: createRfq.offer_quality,
              remarks: createRfq.remarks,
              serial_no: createRfq.serial_no,
              vessel_ex_name: createRfq.vessel_ex_name,
              upload: fileUrl,
              requested_by: user.id,
              created_at: new Date().toISOString(),
              branch: branchValues[0] ?? null,
              status: "sent",
              initiator_role: userRole,
            },
          ])
          .select("*")
          .single();

        if (error) throw error;
        rfqData = data;
        console.log("✅ RFQ inserted:", rfqData);
      } catch (rfqInsertErr) {
        console.error("❌ Failed to insert RFQ:", rfqInsertErr);
        setErrorMessage("Failed to create RFQ.");
        setIsLoading(false);
        return;
      }

      // Insert into rfq_supplier
      try {
        const vendorsToInsert = Object.values(reqdVendors)
          .filter((v) => v.vendorId)
          .map((v) => ({ rfq_id: rfqData.id, vendor_id: v.vendorId }));

        if (vendorsToInsert.length === 0) {
          console.warn("⚠️ No vendors selected. Skipping rfq_supplier.");
        } else {
          const { data: validMerchants, error: merchantError } = await supabase
            .from("merchant")
            .select("id")
            .in(
              "id",
              vendorsToInsert.map((v) => v.vendor_id)
            );

          if (merchantError) throw merchantError;

          const validVendorIds = validMerchants?.map((m) => m.id) ?? [];
          const filteredVendorsToInsert = vendorsToInsert
            .filter((v) => validVendorIds.includes(v.vendor_id))
            .map((v) => ({ ...v, status: "received" }));

          if (filteredVendorsToInsert.length > 0) {
            const { data, error } = await supabase
              .from("rfq_supplier")
              .insert(filteredVendorsToInsert)
              .select("*");

            if (error) throw error;
            console.log("✅ rfq_supplier inserted:", data);
          } else {
            console.warn("⚠️ No valid vendors after filtering.");
          }
        }
      } catch (supplierErr) {
        console.error("❌ Error inserting into rfq_supplier:", supplierErr);
        setErrorMessage("Some suppliers couldn't be linked.");
      }

      items.forEach((item: any) => console.log(item));

      // Insert items
      for (let i = 0; i < items.length; i++) {
        try {
          const item = items[i];
          const { data, error } = await supabase
            .from("rfq_items")
            .insert([
              {
                rfq_id: rfqData.id,
                item_part_no: item.part_no,
                alternate_part_no: item.alternative_part_no,
                impa_no: item.impa_no,
                item_position_no: item.position_no,
                alternative_position_no: item.alternative_position_no,
                description: item.description,
                req_qty: item.req_qty,
                uom: item.uom,
                general_remarks: item.general_remarks,
                dimensions: item.dimensions,
              },
            ])
            .select("*")
            .single();

          if (error) throw error;
          console.log(`✅ RFQ item ${i + 1} inserted:`, data);
        } catch (itemErr) {
          console.error(`❌ Error inserting item ${i + 1}:`, itemErr);
        }
      }

      setSuccessMessage("RFQ Successfully Created!");
      console.log("🎉 All done!");
    } catch (finalError) {
      console.error("🔥 Fatal error in getQuote:", finalError);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVendors = [
    reqdVendors.vendor1?.name,
    reqdVendors.vendor2?.name,
    reqdVendors.vendor3?.name,
  ].filter(Boolean);

  const handleAddQuote = () => {
    getQuote();
  };

  function handleRemove(itemId: number) {
    const filteredItem = items.filter((i: any) => i.id !== itemId);

    setItems([...filteredItem]);
  }

  async function fetchDetails() {
    const supabase = createClient();

    // --- get current user ---
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not found or error:", userError);
      return;
    }

    // --- get user role ---
    const { data: userData, error: roleError } = await supabase
      .from("profiles")
      .select("user_role")
      .eq("id", user.id)
      .single();

    if (roleError || !userData) {
      console.error("User role fetch error:", roleError);
      return;
    }

    const userRole = userData.user_role;

    setUserRole(userRole);

    let customerId = user.id; // default

    if (userRole !== "customer") {
      let branchId: string | null = null;

      if (userRole === "admin" || userRole === "branch_admin") {
        // --- get branch_id from branch_admin table ---
        const { data: baData, error: baError } = await supabase
          .from("branch_admin")
          .select("branch")
          .eq("customer_id", user.id)
          .single();

        if (baError || !baData) {
          console.error("Branch admin fetch error:", baError);
          return;
        }

        branchId = baData.branch;
      } else if (userRole === "manager") {
        // --- get branch_id from manager table ---
        const { data: managerData, error: managerError } = await supabase
          .from("manager")
          .select("branch_id")
          .eq("customer_id", user.id)
          .single();

        if (managerError || !managerData) {
          console.error("Manager fetch error:", managerError);
          return;
        }

        branchId = managerData.branch_id;
      }

      if (!branchId) {
        console.error("Branch ID not found for user");
        return;
      }

      // --- now get customer_id from branch table using branch_id ---
      const { data: branchData, error: branchError } = await supabase
        .from("branch")
        .select("customer_id")
        .eq("id", branchId)
        .single();

      if (branchError || !branchData) {
        console.error("Branch fetch error:", branchError);
        return;
      }

      customerId = branchData.customer_id;
      console.log("Customer ID:", customerId);
    }

    // --- 1) Direct vendors ---
    const { data: dv, error: directError } = await supabase
      .from("merchant")
      .select("*")
      .eq("parent_id", customerId);

    if (directError) console.error("Direct vendor fetch error:", directError);

    const directVendors = dv ?? [];

    // --- 2) Associated vendors ---
    const { data: ar, error: accessError } = await supabase
      .from("vendor_access")
      .select("merchant:vendor_id(*)")
      .eq("customer_id", customerId);

    if (accessError)
      console.error("Associated vendor fetch error:", accessError);

    const accessRows = ar ?? [];
    const associatedVendors = accessRows
      .map((r: any) => r.merchant)
      .filter((m: any) => m !== null);

    // --- 3) Merge & dedupe ---
    const vendorMap = new Map<string, any>();
    for (const v of [...directVendors, ...associatedVendors]) {
      if (v && v.id) vendorMap.set(v.id, v);
    }

    updateVendors(Array.from(vendorMap.values()));

    // --- the rest of your logic unchanged ---
    const { data: brands, error: brandError } = await supabase
      .from("brand")
      .select("*")
      .eq("is_active", true);
    if (brandError) console.error("Brand fetch error:", brandError);
    else setBrands(brands ?? []);

    const { data: models, error: modelError } = await supabase
      .from("model")
      .select("*")
      .eq("is_active", true);
    if (modelError) console.error("Model fetch error:", modelError);
    else setModels(models ?? []);

    const { data: categories, error: categoryError } = await supabase
      .from("category")
      .select("*")
      .eq("is_active", true);
    if (categoryError) console.error("Category fetch error:", categoryError);
    else setCategory(categories ?? []);

    const { data: member, error: memberError } = await supabase
      .from("member")
      .select("*")
      .eq("member_profile", user.id);
    if (memberError) console.error("Member fetch error:", memberError);
    else if ((member ?? []).length) setIsMem(true);
  }

  useEffect(() => {
    void fetchDetails();
  }, []);
  // if (!isMem)
  //   return "Create a Branch or be the Part of any Branch to Create Enquiry...";
  return (
    <>
      {errorMessage && (
        <ErrorToast
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      <main className="grid">
        <div className="pt-4  w-full grid justify-self-center">
          <h1 className="text-3xl font-bold">Create RFQ</h1>
          <h3 className="mt-2"></h3>
        </div>

        <main className="grid justify-self-center max-w-6xl w-full md:grid-cols-3 gap-4 mt-4">
          <RFQInfoCard
            createRfq={createRfq}
            setcreateRfq={setCreateRfq}
            models={model}
            brands={brands}
            setSelectedFile={setSelectedFile}
            category={category}
            errors={errors}
            setErrors={setErrors}
          />
        </main>

        <div className="flex w-full max-w-6xl justify-self-center items-center mt-8">
          <h1 className="text-xl font-bold">Choose vendors</h1>
        </div>
        {vendorsError && (
          <div className="text-red-500 text-sm ml-32 mt-2">
            Please select all vendors.
          </div>
        )}

        <div className="grid justify-self-center grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl w-full mt-4">
          {(["vendor1", "vendor2", "vendor3"] as const).map(
            (vendorKey, index) => {
              const availableVendors = vendors.filter(
                (v) =>
                  !selectedVendors.includes(v.name) ||
                  reqdVendors[vendorKey]?.name === v.name
              );

              return (
                <div key={vendorKey} className="grid gap-1">
                  <div className="flex gap-1">
                    {reqdVendors[vendorKey]?.name && (
                      <div className="text-xs text-white bg-zinc-600 rounded-full px-2">
                        {reqdVendors[vendorKey].name}
                      </div>
                    )}
                  </div>
                  <div className="grid">
                    <Label className="mb-3">
                      Vendor {index + 1}{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select
                      onValueChange={(e) => {
                        updateReqdVendors({
                          ...reqdVendors,
                          [vendorKey]: {
                            name: e,
                            vendorId:
                              vendors.find((v) => v.name === e)?.id || "",
                          },
                        });
                      }}
                    >
                      <SelectTrigger
                        className={`w-full border ${
                          vendorsError ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <SelectValue placeholder="Select Vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVendors.map((vendor) => (
                          <SelectItem value={vendor.name} key={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div className="grid justify-self-center max-w-6xl w-full mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Items</h1>
          </div>
          <div className="mt-4 max-w-6xl overflow-x-scroll">
            <div className="min-w-5xl max-w-9xl grid">
              <Table className="min-w-5xl max-w-9xl w-full">
                <TableCaption>List Of Items.</TableCaption>

                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead colSpan={3}>
                      Description<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                    <TableHead>
                      Required Quantity
                      <span className="text-red-500 ml-1">*</span>
                    </TableHead>

                    <TableHead>
                      UOM<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                    <TableHead>
                      General Remark<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                    <TableHead className="text-right">
                      Action<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item: any, i: any) => (
                    <Item
                      key={i}
                      item={item}
                      handleRemove={handleRemove}
                      handleUpdateItem={handleUpdateItem}
                      setErrors={setErrors}
                      errors={errors.items?.[i] || {}}
                    />
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-2 mb-2">
                <Button
                  onClick={() => {
                    setItems([
                      ...items,
                      {
                        id: items.length + 1,
                        description: "",
                        alternative_position_no: "",
                        part_no: "",
                        impa_no: "",
                        position_no: "",
                        alternative_part_no: "",
                        uom: "",
                        req_qty: "",
                        offered_qty: "",
                        width: "",
                        height: "",
                        dimensions: "",
                        general_remarks: "",
                      },
                    ]);
                  }}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl w-full grid justify-self-center justify-center mt-8 mb-24">
          <div>
            <Button
              onClick={handleAddQuote}
              className="flex items-center justify-center gap-2"
            >
              Get Quote
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
