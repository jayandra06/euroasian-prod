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

// function InfoCard() {
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Requisition Info</CardTitle>
//                 <CardDescription></CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <div className="grid w-full max-w-sm items-center gap-1.5">
//                     <Label htmlFor="clientName">Client Name</Label>
//                     <Input type="text" id="clientName" placeholder="Client Name" />
//                 </div>
//                 <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
//                     <Label htmlFor="clientName">Client Email</Label>
//                     <Input type="email" id="clientName" placeholder="Client Email" />
//                 </div>
//                 <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
//                     <Label htmlFor="clientName">Created At</Label>
//                     <Input type="text" id="clientName" placeholder="10/02/2025" />
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// @ts-ignore
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

  async function fetchVessels() {
    const supabase = createClient();
  
    try {
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
  
      // Fetch all member records for the current user
      const { data: members, error: memberError } = await supabase
        .from("member")
        .select("member_profile, branch")
        .eq("member_profile", user.id);
  
      if (memberError) throw memberError;
  
      if (!members || members.length === 0) {
        throw new Error("No member records found for the current user");
      }
  
      let allVessels: string[] = [];
  
      for (const member of members) {
        // Fetch vessels from the profiles table
        const { data: memberProfile, error: profileError } = await supabase
          .from("profiles")
          .select("vessels")
          .eq("id", member.member_profile)
          .single();
  
        if (profileError) {
          console.error("Error fetching profiles:", profileError);
          throw profileError;
        }
  
        // Fetch vessels from the manager table based on branch_id
        const { data: managers, error: managerError } = await supabase
          .from("manager")
          .select("vessel")
          .eq("branch_id", member.branch); // Use member.branch
  
        if (managerError) {
          console.error("Error fetching manager vessels:", managerError);
          throw managerError;
        }
  
        // Combine vessels from profiles and managers
        if (memberProfile?.vessels) {
          allVessels = [...allVessels, ...memberProfile.vessels];
        }
  
        if (managers?.length) {
          allVessels = [...allVessels, ...managers.map(m => m.vessel)];
        }
      }
  
      // Remove duplicates and set the vessels state
      setVessels([...new Set(allVessels)]);
    } catch (error) {
      console.error("Error fetching vessels:", error);
    }
  }
  

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
                    {vessels.map((vessel, i) => (
                      <SelectItem value={vessel} key={i}>
                        {vessel}
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
                <Label htmlFor="remark">General Remarks</Label>
                <Input
                  type="text"
                  id="remark"
                  placeholder="Remark"
                  name="remark"
                  value={createRfq.remark}
                  onChange={(e) =>
                    setcreateRfq({ ...createRfq, remark: e.target.value })
                  }
                  className={`border mt-2 ${
                    errors.remark ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.remark && (
                  <p className="text-red-500 text-sm">{errors.remark}</p>
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

  <TableCell colSpan={3}>
    <div className="grid grid-cols-2 gap-4">
      {/* Group 1: Description */}
      <div className="flex flex-col">
        <Textarea
          placeholder="Item Description.."
          value={item.description}
          name="description"
          onChange={handleChange}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      {/* Group 2: Part Numbers */}
      <div className="grid grid-cols-1 gap-2">
        <div>
          <Input
            type="text"
            placeholder="Part No."
            value={item.part_no}
            name="part_no"
            onChange={handleChange}
          />
          {errors.part_no && (
            <p className="text-red-500 text-sm">{errors.part_no}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Alternate Part No."
            value={item.alternate_part_no}
            name="alternative_part_no"
            onChange={handleChange}
          />
          {errors.alternate_part_no && (
            <p className="text-red-500 text-sm">{errors.alternate_part_no}</p>
          )}
        </div>
      </div>

      {/* Group 3: Position Numbers */}
      <div className="grid grid-cols-1 gap-2">
        <div>
          <Input
            type="text"
            placeholder="Position No."
            value={item.position_no}
            name="position_no"
            onChange={handleChange}
          />
          {errors.position_no && (
            <p className="text-red-500 text-sm">{errors.position_no}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Alternative Position No."
            value={item.alternative_position_no}
            name="alternative_position_no"
            onChange={handleChange}
          />
          {errors.alternative_position_no && (
            <p className="text-red-500 text-sm">
              {errors.alternative_position_no}
            </p>
          )}
        </div>
      </div>

      {/* Group 4: Quantity & Impa */}
      <div className="grid grid-cols-1 gap-2">
        <div>
          <Input
            type="text"
            placeholder="Impa No"
            value={item.impa_no}
            name="impa_no"
            onChange={handleChange}
          />
          {errors.impa_no && (
            <p className="text-red-500 text-sm">{errors.impa_no}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Required Quantity"
            value={item.req_qty}
            name="req_qty"
            onChange={handleChange}
          />
          {errors.req_qty && (
            <p className="text-red-500 text-sm">{errors.req_qty}</p>
          )}
        </div>
      </div>

      {/* Group 5: Dimensions */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            type="text"
            placeholder="Beadth"
            value={item.beadth}
            name="beadth"
            onChange={handleChange}
          />
          {errors.beadth && (
            <p className="text-red-500 text-sm">{errors.beadth}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Height"
            value={item.height}
            name="height"
            onChange={handleChange}
          />
          {errors.height && (
            <p className="text-red-500 text-sm">{errors.height}</p>
          )}
        </div>
        <div className="col-span-2">
          <Input
            type="text"
            placeholder="Width"
            value={item.width}
            name="width"
            onChange={handleChange}
          />
          {errors.width && (
            <p className="text-red-500 text-sm">{errors.width}</p>
          )}
        </div>
      </div>
    </div>
  </TableCell>

  {/* UOM */}
  <TableCell>
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

  {/* Remove Button */}
  <TableCell className="text-right relative">
    <Button
      onClick={() => handleRemove(item.id)}
      className="absolute top-4 right-4"
      variant={"outline"}
    >
      <Trash2 />
    </Button>
  </TableCell>
</TableRow>

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
    remark: "",
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
      beadth: "",
      height: "",
    },
  ]);
  console.log("Items", items);

  const [isMem, setIsMem] = useState(false);
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
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    let newErrors = {
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
      remark: "",
      serial_no: "",
      vessel_ex_name: "",
      upload: "",
      items: [],
    };

    if (!createRfq.brand) newErrors.brand = "Brand is Required";
    if (!createRfq.category) newErrors.category = "Category is requied";
    if (!createRfq.drawing_number)
      newErrors.drawing_number = "Drawing Number is required";
    if (!createRfq.equipement_tag)
      newErrors.equipement_tag = "Equipment Tag is required";
    if (!createRfq.hull_no) newErrors.hull_no = "Hull no is required";
    if (!createRfq.imo_no) newErrors.imo_no = "Impo no is required";
    if (!createRfq.lead_date) newErrors.lead_date = "Lead date is required";
    if (!createRfq.model) newErrors.model = "Model is rquired";
    if (!createRfq.offer_quality)
      newErrors.offer_quality = "Qffered quality is requied";
    if (!createRfq.remark) newErrors.remark = "Remark is required";
    if (!createRfq.serial_no) newErrors.serial_no = "Serial Number is required";
    if (!createRfq.upload) newErrors.upload = "Upload the file";
    if (!createRfq.vessel_ex_name)
      newErrors.vessel_ex_name = "Vessel ex name is required";
    if (!createRfq.vessel_name)
      newErrors.vessel_name = "Veseel name is requied";
    if (!createRfq.supply_port)
      newErrors.supply_port = "Supply Port is required.";

    const itemErrors = items.map((item: any) => ({
      description: item.description ? "" : "Description is required.",
      part_no: item.part_no ? "" : "Part No is required.",
      alternative_part_no: item.alternative_part_no
        ? ""
        : "Alternative Part No is required.",
      position_no: item.position_no ? "" : "Position No is required.",
      alternative_position_no: item.alternative_position_no
        ? ""
        : "Alternative position nnumber is required",
      impa_no: item.impa_no ? "" : "Impa code is required",
      uom: item.uom ? "" : "UOM is required.",
      offered_qty: item.offered_qty ? "" : "Offered Quantity is required.",
      req_qty: item.req_qty ? "" : "Required Quantity is required.",
      width: item.width ? "" : "Width is required",
      beadth: item.beadth ? "" : "Breadth is required",
      height: item.height ? "" : "Height is required",
    }));
    newErrors.items = itemErrors;
    setErrors(newErrors);
    if (
      !reqdVendors.vendor1.vendorId ||
      !reqdVendors.vendor2.vendorId ||
      !reqdVendors.vendor3.vendorId
    ) {
      setVendorsError(true);
      setIsLoading(false);
      return;
    } else {
      setVendorsError(false);
    }
    if (
      itemErrors.some((item: { [s: string]: unknown } | ArrayLike<unknown>) =>
        Object.values(item).some((err) => err)
      )
    )
      return;

    try {
      // File image start
      let fileUrl = "";

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("rfq-image") // Replace with your bucket name
          .upload(`uploads/${fileName}`, selectedFile);

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          setErrorMessage("Failed to upload file. Please try again.");
          setIsLoading(false);
          return;
        }
        const { data: publicUrlData } = supabase.storage
          .from("rfq-image")
          .getPublicUrl(uploadData.path);

        fileUrl = publicUrlData.publicUrl;

        // File image end
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        const member = await supabase
          .from("member")
          .select("branch")
          .eq("member_profile", user!.id);

        console.log(
          "selected vendors",
          Object.values(reqdVendors).map((vendor) => vendor.vendorId)
        );
        if (userError) {
          console.error("Error fetching member:", userError);
        } else {
          console.log("Fetched Member Data:", member);
        }
        console.log("createRfq state before insertion:", createRfq);
        console.log("Member Data:", member.data);

        const branchValues = member.data?.map((m) => m.branch) ?? [];
        console.log("All Branch Values:", branchValues);

        const { data: rfqData, error: rfqError } = await supabase
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
              remarks: createRfq.remark,
              serial_no: createRfq.serial_no,
              vessel_ex_name: createRfq.vessel_ex_name,
              upload: fileUrl,
              requested_by: user!.id,
              suppliers: Object.values(reqdVendors)
                .filter((vendor) => vendor.vendorId)
                .map((vendor) => vendor.vendorId),
              created_at: new Date().toISOString(),
              branch: branchValues[0] ?? null, // Handling null
              status: Object.values(reqdVendors).filter(
                (vendor) => vendor.vendorId
              ).length
                ? "sent"
                : "draft",
            },
          ])
          .select("*")
          .single();
        console.log("RFQ Insert Response:", { rfqData, rfqError });
        console.log("RFQ ID before inserting into rfq_supplier:", rfqData?.id);


        if (rfqError) {
          console.error("Supabase RFQ Insert Error:", rfqError);
          setErrorMessage(`Error inserting RFQ: ${rfqError.message}`);
          setIsLoading(false);
          return; // ✅ Stop execution if RFQ insertion fails
        }

        if (!rfqData || !rfqData.id) {

          console.log("RFQ creation failed, no ID returned!");
          setErrorMessage("RFQ creation failed, please try again.");
          setIsLoading(false);
          return;
        }
        console.log("✅ RFQ Created with ID:", rfqData.id);
        

        console.log("Raw RFQ Data:", rfqData);
        const rfq = Array.isArray(rfqData) ? rfqData[0] : rfqData;
        console.log("Extracted RFQ:", rfq);
        console.log("RFQ ID:", rfq?.id);

       

        

        const vendorsToInsert = Object.values(reqdVendors)
  .filter((vendor) => vendor.vendorId)
  .map((vendor) => ({
    rfq_id: rfqData.id,
    vendor_id: vendor.vendorId, // Ensure vendorId is a valid UUID
  }));

  console.log("🟢 Step 1: Raw vendor IDs before filtering:", vendorsToInsert);

if (vendorsToInsert.length === 0) {
  console.warn("⚠️ No vendors selected, skipping rfq_supplier insert.");
} else {
  console.log("✅ Vendors to insert:", vendorsToInsert);
}

// 🟢 Fetch merchants from Supabase to validate vendor IDs
const { data: validMerchants, error: merchantError } = await supabase
  .from("merchant")
  .select("id")
  .in(
    "id",
    vendorsToInsert.map((v) => v.vendor_id)
  );

console.log("🟢 Step 2: Valid Merchants from merchant table:", validMerchants);

if (merchantError) {
  console.error("❌ Error fetching merchants:", merchantError);
} else if (!validMerchants || validMerchants.length === 0) {
  console.warn("⚠️ No matching merchants found. Vendor IDs might be incorrect.");
}

// 🟢 Filter vendors that exist in the `merchant` table
const validVendorIds = validMerchants?.map((m) => m.id) ?? [];
const filteredVendorsToInsert = vendorsToInsert.filter((v) =>
  validVendorIds.includes(v.vendor_id)
);

console.log("🟢 Step 3: Filtered vendor IDs after validation:", filteredVendorsToInsert);

if (filteredVendorsToInsert.length === 0) {
  console.warn("⚠️ No valid suppliers found after filtering, skipping rfq_supplier insert.");
} else {
  console.log("✅ Proceeding to insert into rfq_supplier");

  const { data: suppliersData, error: suppliersError } = await supabase
    .from("rfq_supplier") // ✅ Ensure table name is correct
    .insert(filteredVendorsToInsert)
    .select("*");

  console.log("🟢 Step 4: RFQ Suppliers Insert Response:", suppliersData, suppliersError);

  if (suppliersError) {
    console.error("❌ Error inserting suppliers:", suppliersError);
  } else {
    console.log("✅ RFQ Suppliers inserted successfully:", suppliersData);
  }
}


  


        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          console.log("Inserting RFQ Item for RFQ ID:", rfqData.id);

          const { data: rfqItemData, error: rfqItemError } = await supabase
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
                width: item.width,
                height: item.height,
                beadth: item.beadth,
              },
            ])
            .select("*")
            .single();
            
          if (rfqItemError) {
            console.error("RFQ Item Insert Error:", rfqItemError);
          }

          console.log("Inserted RFQ Item:", rfqItemData);
        }


        setSuccessMessage("RFQ Successfully Created!");
        // window.location.reload();
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Error:", e);
      setErrorMessage("Unable to create RFQ. Please try again!");
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

    const externalVendor = await supabase.from("merchant").select("*");
    updateVendors([...externalVendor.data!]);

    const brands = await supabase
      .from("brand")
      .select("*")
      .eq("is_active", true);
    setBrands([...brands.data!]);

    const models = await supabase
      .from("model")
      .select("*")
      .eq("is_active", true);
    console.log(models);
    setModels([...models.data!]);

    const categories = await supabase
      .from("category")
      .select("*")
      .eq("is_active", true);
    setCategory([...categories.data!]);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const member = await supabase
      .from("member")
      .select("*")
      .eq("member_profile", user!.id);
    console.log(member);
    if (member.data) {
      setIsMem(true);
    }
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
        <div className="pt-4 max-w-6xl w-full grid justify-self-center">
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
                    <TableHead >No.</TableHead>
                    <TableHead colSpan={3}>
                      Description<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                    <TableHead>
                      Req. Qty.<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                    <TableHead>
                      UOM<span className="text-red-500 ml-1">*</span>
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
                        beadth: "",
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
              disabled={isloading}
            >
              Get Quote {isloading && <Loader size="small" />}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
