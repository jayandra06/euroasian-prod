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
import { motion } from "framer-motion";
// import { useRouter } from "next/router";
import { Separator } from "@/components/ui/separator"


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

const tabs = [
  { id: "Vendor 1", label: "Vendor 1", color: "bg-white", text: "text-black" },
  { id: "Vendor 2", label: "Vendor 2", color: "bg-blue-500" },
  { id: "Vendor 3", label: "Vendor 3", color: "bg-green-400" },
  
];

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
  rfqInfo,
  setRfqInfo,
  vesselInfo,
  setVesselInfo,
  equipmentTags,
  setEquipmentTags,
  models,
  brands,
  category,
  offerQuality,
  errors,
  setErrors,
}: {
  rfqInfo: any;
  setRfqInfo: React.Dispatch<React.SetStateAction<any>>;
  vesselInfo: any;
  setVesselInfo: React.Dispatch<React.SetStateAction<any>>;
  equipmentTags: any;
  setEquipmentTags: React.Dispatch<React.SetStateAction<any>>;
  models: any[];
  brands: any[];
  category: any[];
  offerQuality: any[];
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
}) {
  useEffect(() => {
    if (!rfqInfo.lead_date) {
      const currentDate = new Date().toISOString().split("T")[0];
      setRfqInfo((prev: any) => ({ ...prev, lead_date: currentDate }));
    }
  }, [rfqInfo.lead_date, setRfqInfo]);

  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTag = () => {
    if (!currentTag.trim()) return; // Prevent empty tags
    setLoading(true);

    setTimeout(() => {
      setEquipmentTags((prev: any) => ({
        ...prev,
        tags: [...prev.tags, currentTag],
      }));
      setCurrentTag("");
      setLoading(false);
    }, 1000); // Simulating API or processing delay
  };

  const [vessels, setVessels] = useState<any[]>([]);
  console.log("vessels", vessels);

  async function fetchVessels() {
    const supabase = createClient();

    try {
      // Get the current authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Fetch all member records for the current user
      const { data: members, error: memberError } = await supabase
        .from("member")
        .select("member_profile, branch")
        .eq("member_profile", user.id); // Remove .single() to handle multiple rows

      if (memberError) throw memberError;

      // If no members are found, throw an error
      if (!members || members.length === 0) {
        throw new Error("No member records found for the current user");
      }

      // Fetch vessels from all member profiles and branches
      let allVessels: string[] = [];

      for (const member of members) {
        // Fetch vessels from the profiles table
        const { data: memberProfile, error: profileError } = await supabase
          .from("profiles") // Use the correct table name
          .select("vessels")
          .eq("id", member.member_profile)
          .single(); // Use .single() here because profiles.id should be unique

        if (profileError) {
          console.error("Error fetching profiles:", profileError);
          throw profileError;
        }

        // Fetch vessels from the branch
        const { data: branch, error: branchError } = await supabase
          .from("branch")
          .select("vessels")
          .eq("id", member.branch)
          .single(); // Use .single() here because branch.id should be unique

        if (branchError) {
          console.error("Error fetching branch:", branchError);
          throw branchError;
        }

        // Combine vessels from profiles and branch
        if (memberProfile?.vessels) {
          allVessels = [...allVessels, ...memberProfile.vessels];
        }
        if (branch?.vessels) {
          allVessels = [...allVessels, ...branch.vessels];
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
            <div className="grid grid-cols-5 gap-6">
              <div className="flex flex-col">
                <Label htmlFor="leadDate">Lead Date</Label>
                <Input
                  type="date"
                  className="mt-2"
                  id="leadDate"
                  value={rfqInfo.lead_date || ""}
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="supplyPort">
                  Supply Port <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setRfqInfo({ ...rfqInfo, supply_port: value })
                  }
                  value={rfqInfo.supply_port || ""}
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
              <Label htmlFor="expireDate">
              Valid Until <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              type="date"
              id="expireDate"
              value={rfqInfo.expire_date || ""}
              onChange={(e) => {
                setRfqInfo({ ...rfqInfo, expire_date: e.target.value });
                setErrors({ ...errors, expire_date: "" });
              }}
              className={`grid  mt-2 border ${
                errors.expire_date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.expire_date && (
              <p className="text-red-500 text-sm">{errors.expire_date}</p>
            )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="imoNo">
                  IMO No <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="imoNo"
                  placeholder="Enter IMO No."
                  value={vesselInfo.imo_no}
                  onChange={(e) =>
                    setVesselInfo({ ...vesselInfo, imo_no: e.target.value })
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
                <Label htmlFor="vesselName">
                  Vessel Name <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(e) =>
                    setVesselInfo({ ...vesselInfo, name: e })
                  }
                >
                  <SelectTrigger
                    className={`border mt-2 ${
                      errors.name ? "border-red-500" : "border-gray-300"
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
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="imoNo">
                  HULL No <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="imoNo"
                  placeholder="Enter HULL No."
                  value={vesselInfo.imo_no}
                  onChange={(e) =>
                    setVesselInfo({ ...vesselInfo, imo_no: e.target.value })
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
                <Label htmlFor="clientName">Equipment Tags</Label>
                <Input
                  type="text"
                  id="clientName"
                  placeholder="Enter Equipment Tags"
                  value={currentTag}
                  className="mt-2"
                  onChange={(e) => setCurrentTag(e.target.value)}
                />
                
              </div>

              <div className="flex flex-col">
                <Label htmlFor="brand">
                  Brand <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(v) => {
                    setEquipmentTags({ ...equipmentTags, brand: v });
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
                  onValueChange={(v) => {
                    setEquipmentTags({ ...equipmentTags, model: v });
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
                  onValueChange={(v) => {
                    setEquipmentTags({ ...equipmentTags, category: v });
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
                <Label htmlFor="clientName">Drawing Number</Label>
                <Input
                  type="text"
                  id="clientName"
                  placeholder="Enter Drawing Number"
                  value={currentTag}
                  className="mt-2"
                  onChange={(e) => setCurrentTag(e.target.value)}
                />
                
              </div>
              <div className="flex flex-col">
                <Label htmlFor="clientName">Serial Number</Label>
                <Input
                  type="text"
                  id="clientName"
                  placeholder="Serial Number"
                  value={currentTag}
                  className="mt-2"
                  onChange={(e) => setCurrentTag(e.target.value)}
                />
                
              </div>
              <div className="flex flex-col">
              <Label htmlFor="clientName">Uploaded File</Label>
              <Input
                  type="text"
                  id="clientName"
                  placeholder="Uploaded file"
                  value={currentTag}
                  className="mt-2"
                  
                />
                
              </div>
              <div className="flex flex-col">
                <Label htmlFor="model">
                  Offered Quality <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(v) => {
                    setEquipmentTags({ ...equipmentTags, offerquality: v });
                    setErrors({ ...errors, offerquality: "" });
                  }}
                >
                  <SelectTrigger
                    className={`border mt-2 ${
                      errors.model ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Select Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {offerQuality.map((offerquality, i) => (
                      <SelectItem value={offerquality.name} key={i}>
                        {offerquality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.offerQuality && (
                  <p className="text-red-500 text-sm">{errors.offerQuality}</p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="clientName">General Remarks</Label>
                <Input
                  type="text"
                  id="clientName"
                  placeholder="Enter General Remark"
                  value={currentTag}
                  className="mt-2"
                  onChange={(e) => setCurrentTag(e.target.value)}
                />
                
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
    if (errors?.description) {
      setErrors({ ...errors, description: "" });
    }
  };
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{item.id}</TableCell>
        <TableCell colSpan={3}>
          

          
          <div className="grid gap-2 grid-cols-2 items-center">
            
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Part No."
                value={item.part_no}
                name="part_no"
                //    onChange={(e) => {
                //     handleChange(e);
                //     setErrors({ ...errors, part_no: "" });
                //   }}
                onChange={handleChange}
              />
              {errors.part_no && (
                <p className="text-red-500 text-sm">{errors.part_no}</p>
              )}
            </div>
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Position No."
                value={item.position_no}
                name="position_no"
                //    onChange={(e) => {
                //     handleChange(e);
                //     setErrors({ ...errors, position_no: "" });
                //   }}

                onChange={handleChange}
              />
              {errors.position_no && (
                <p className="text-red-500 text-sm">{errors.position_no}</p>
              )}
            </div>
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Alternate Part No."
                value={item.alternative_part_no}
                name="alternative_part_no"
                //    onChange={(e) => {
                //     handleChange(e);
                //     setErrors({ ...errors, alternative_part_no: "" });
                //   }}
                onChange={handleChange}
              />
              {errors.alternative_part_no && (
                <p className="text-red-500 text-sm">
                  {errors.alternative_part_no}
                </p>
              )}
            </div>
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Alternate Position No."
                value={item.alternative_part_no}
                name="alternative_position_no"
                //    onChange={(e) => {
                //     handleChange(e);
                //     setErrors({ ...errors, alternative_part_no: "" });
                //   }}
                onChange={handleChange}
              />
              {errors.alternative_part_no && (
                <p className="text-red-500 text-sm">
                  {errors.alternative_part_no}
                </p>
              )}
            </div>
          </div>
          
            
         
        </TableCell>
        <TableCell>
        <div className="col-span-1">
              <Textarea
                placeholder="Enter Item Description.."
                value={item.description}
                name="description"
                //   onChange={(e) => {
                //     const {name, value} = e.target;
                //     handleUpdateItem(item.id, name, value);
                //     // setErrors({ ...errors, description: "" });
                //   }}
                onChange={handleChange}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="W"
            value={item.req_qty}
            name="req_qty"
            // onChange={(e) => {
            //     handleChange(e);
            //     setErrors({ ...errors, req_qty: "" });
            //   }}
            onChange={handleChange}
          />
          {errors.req_qty && (
            <p className="text-red-500 text-sm">{errors.req_qty}</p>
          )}
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="B"
            value={item.req_qty}
            name="req_qty"
            // onChange={(e) => {
            //     handleChange(e);
            //     setErrors({ ...errors, req_qty: "" });
            //   }}
            onChange={handleChange}
          />
          {errors.req_qty && (
            <p className="text-red-500 text-sm">{errors.req_qty}</p>
          )}
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="H"
            value={item.req_qty}
            name="req_qty"
            // onChange={(e) => {
            //     handleChange(e);
            //     setErrors({ ...errors, req_qty: "" });
            //   }}
            onChange={handleChange}
          />
          {errors.req_qty && (
            <p className="text-red-500 text-sm">{errors.req_qty}</p>
          )}
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="offered quanity"
            value={item.req_qty}
            name="req_qty"
            // onChange={(e) => {
            //     handleChange(e);
            //     setErrors({ ...errors, req_qty: "" });
            //   }}
            onChange={handleChange}
          />
          {errors.req_qty && (
            <p className="text-red-500 text-sm">{errors.req_qty}</p>
          )}
         
        </TableCell>
        <TableCell>
          {/* <Input type="text" placeholder="Enter UOM..." value={item.uom} name="uom" onChange={} /> */}
          <Select
            name="uom"
            onValueChange={
              (v) =>
                // {
                handleUpdateItem(item.id, "uom", v)
              //  setErrors({ ...errors, uom: "" });
              // }
            }
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
        <TableCell className="text-right relative">
        <Input
            type="number"
            placeholder=""
            value={item.req_qty}
            name="req_qty"
            // onChange={(e) => {
            //     handleChange(e);
            //     setErrors({ ...errors, req_qty: "" });
            //   }}
            onChange={handleChange}
          />
        </TableCell>
        <TableCell>
          {/* <Input type="text" placeholder="Enter UOM..." value={item.uom} name="uom" onChange={} /> */}
          <Select
            name="uom"
            onValueChange={
              (v) =>
                // {
                handleUpdateItem(item.id, "uom", v)
              //  setErrors({ ...errors, uom: "" });
              // }
            }
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
        <TableCell className="text-right relative">
        <Input
            type="number"
            placeholder=""
            value={item.req_qty}
            name="req_qty"
            // onChange={(e) => {
            //     handleChange(e);
            //     setErrors({ ...errors, req_qty: "" });
            //   }}
            onChange={handleChange}
          />
        </TableCell>
        
      </TableRow>
    </>
  );
}



export default function ViewRfq() {
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
   const [rfqs, setRfqs] = useState<any[]>([]);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [rfqItems, setRfqItems] = useState<{ [key: number]: any[] }>({}); // Store items for each RFQ
    const [filterRfqs, setFilterRfq] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("all");

  const [brands, setBrands] = useState<any[]>([]);
  const [offerQuality, setofferQuality] = useState<any[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const [model, setModels] = useState<any[]>([]);
  const [vendors, updateVendors] = useState<any[]>([]);
  const [vendorsError, setVendorsError] = useState(false);
  const [rfqInfo, setRfqInfo] = useState({
    lead_date: "",
    supply_port: "",
    rfq_no: "",
  });
  const [vesselInfo, setVesselInfo] = useState({
    name: "",
    imo_no: "",
    hull_no: "",
    port: "",
  });
  const [equipmentTags, setEquipmentTags] = useState({
    tags: [],
    brand: "",
    model: "",
    category: "",
    offerquality: "",
  });
  const [items, setItems] = useState<any>([
    {
      id: 1,
      description: "",
      part_no: "",
      position_no: "",
      alternative_part_no: "",
      uom: "",
      req_qty: "",
      offered_qty: "0",
    },
  ]);
  const [fiedData, setFieldData] = useState({
    description: "",
    part_no: "",
    position_no: "",
    alternative_part_no: "",
    uom: "",
    req_qty: "",
    offered_qty: "0",
  });
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
  console.log(errors);

  const getQuote = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    let newErrors = {
      supply_port: "",
      expire_date: "",
      name: "",
      imo_no: "",
      hull_no: "",
      port: "",
      brand: "",
      model: "",
      category: "",
      items: [],
      offerquality: "",
    };
    if (!rfqInfo.supply_port)
      newErrors.supply_port = "Supply Port is required.";

    if (!vesselInfo.name) newErrors.name = "Vessel Name is required.";
    if (!vesselInfo.imo_no) newErrors.imo_no = "IMO No is required.";
    // if(!vesselInfo.hull_no) newErrors.hull_no="Hull No is required.";
    if (!vesselInfo.port) newErrors.port = "Port is required.";
    if (!equipmentTags.brand) newErrors.brand = "Brand is required";
    if (!equipmentTags.model) newErrors.model = "Model is required.";
    if (!equipmentTags.category) newErrors.category = "Catrgory is required.";
    if (!equipmentTags.offerquality)
      newErrors.offerquality = "Offer quality is required";

    const itemErrors = items.map((item: any) => ({
      description: item.description ? "" : "Description is required.",
      part_no: item.part_no ? "" : "Part No is required.",
      position_no: item.position_no ? "" : "Position No is required.",
      alternative_part_no: item.alternative_part_no
        ? ""
        : "Alternative Part No is required.",
      uom: item.uom ? "" : "UOM is required.",
      offered_qty: item.offered_qty ? "" : "Offered Quantity is required.",
      req_qty: item.req_qty ? "" : "Required Quantity is required.",
    }));
    setErrors(newErrors);
    newErrors.items = itemErrors;
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

    const supabase = createClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const member = await supabase
        .from("member")
        .select("*")
        .eq("member_profile", user!.id)
        .single();
      console.log(
        "selected vendors",
        Object.values(reqdVendors).map((vendor) => vendor.vendorId)
      );
      const rfq = await supabase
        .from("rfq")
        .insert({
          vessel_name: vesselInfo.name,
          imo_no: vesselInfo.imo_no,
          hull_no: vesselInfo.hull_no,
          requested_by: user!.id,
          port: vesselInfo.port,
          supply_port: rfqInfo.supply_port,
          suppliers: Object.values(reqdVendors)
            .filter((vendor) => vendor.vendorId)
            .map((vendor) => vendor.vendorId),
          created_at: new Date().toISOString(),

          equipment_tags: equipmentTags.tags,
          branch: member.data.branch,
          status: Object.values(reqdVendors).filter((vendor) => vendor.vendorId)
            .length
            ? "sent"
            : "draft",
        })
        .select()
        .single();
      console.log("rfq", rfq);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await supabase.from("rfq_items").insert({
          rfq_id: rfq.data!.id,
          item_part_no: item.part_no,
          item_position_no: item.position_no,
          alternate_part_no: item.alternative_part_no,
          description: item.description,
          req_qty: item.req_qty,
          uom: item.uom,
        });
      }
      setSuccessMessage("RFQ Successfully Created!");
      window.location.reload();
      setIsLoading(false);
    } catch (e) {
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

    const merchants = await supabase.from("merchant").select("*").select("*");
    updateVendors([...merchants.data!]);

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

  async function fetchRfqs() {
      const supabase = createClient();
  
      const rfqs = await supabase.from("rfq").select();
      console.log("rfq", rfqs);
  
      setRfqs([...rfqs.data!]);
      setFilterRfq([...rfqs.data!]);
    }
  
    useEffect(() => {
      fetchRfqs();
    }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    let filteredData = [...rfqs];

    switch (tab) {
      case "received":
        filteredData = rfqs.filter((rfqs) => rfqs.supply_port === "Tamil Nadu");
        break;
      case "sent":
        filteredData = rfqs.filter((rfqs) => rfqs.supply_port === "Goa");
        break;
      case "cancelled":
        filteredData = rfqs.filter((rfqs) => rfqs.supply_port === "Kerala");
        break;
      case "confirmed":
        filteredData = rfqs.filter((rfqs) => rfqs.supply_port === "Mumbai");
        break;
      default:
        filteredData = rfqs;
    }

    setFilterRfq(filteredData);
  };

  useEffect(() => {
    void fetchDetails();
  }, []);
  if (!isMem)
    return "Create a Branch or be the Part of any Branch to Create Enquiry...";
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
            rfqInfo={rfqInfo}
            setRfqInfo={setRfqInfo}
            vesselInfo={vesselInfo}
            setVesselInfo={setVesselInfo}
            errors={errors}
            setErrors={setErrors}
            equipmentTags={equipmentTags}
            setEquipmentTags={setEquipmentTags}
            models={model}
            brands={brands}
            category={category}
            offerQuality={offerQuality}
          />
        </main>

        <div className="flex w-full max-w-6xl justify-self-center items-center mt-8">
          <h1 className="text-xl font-bold">Choose vendors</h1>
        </div>
        <div className="relative flex justify-center max-w-5xl mx-auto mt-4  bg-gray-100 rounded-full p-2 shadow-xl mb-4">
        <div className="relative flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative z-10 px-4 py-2 text-sm font-medium transition ${tab.text} ${
                activeTab === tab.id ? "text-black" : "text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className={`absolute inset-0 ${tab.color} ${tab.text} shadow-2xl rounded-full z-[-1]`}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

        {/* <div className="grid justify-self-center grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl w-full mt-4">
          <div className="grid gap-1">
            <div className="flex gap-1">
              {reqdVendors.vendor1?.name ? (
                <div className="text-xs text-white bg-zinc-600 rounded-full px-2">
                  {reqdVendors.vendor1.name}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="grid ">
              <Label className={"mb-3"}>
                Vendor 1 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                onValueChange={(e) =>
                  updateReqdVendors({
                    ...reqdVendors,
                    vendor1: {
                      name: e,
                      vendorId: vendors.find((v) => v.name === e).id,
                    },
                  })
                }
              >
                <SelectTrigger
                  className={`w-full border ${
                    vendorsError ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor: any, i: number) => (
                    <SelectItem value={vendor.name} key={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1">
            <div className="flex gap-1">
              {reqdVendors.vendor2?.name ? (
                <div className="text-xs text-white bg-zinc-600 rounded-full px-2">
                  {reqdVendors.vendor2.name}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="grid ">
              <Label className={"mb-3"}>
                Vendor 2 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                onValueChange={(e) =>
                  updateReqdVendors({
                    ...reqdVendors,
                    vendor2: {
                      name: e,
                      vendorId: vendors.find((v) => v.name === e).id,
                    },
                  })
                }
              >
                <SelectTrigger className={`w-full border ${
                    vendorsError ? "border-red-500" : "border-gray-300"
                  }`}>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor: any, i: number) => (
                    <SelectItem value={vendor.name} key={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1">
            <div className="flex gap-1">
              {reqdVendors.vendor3?.name ? (
                <div className="text-xs text-white bg-zinc-600 rounded-full px-2">
                  {reqdVendors.vendor3.name}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="grid ">
              <Label className={"mb-3"}>
                Vendor 3 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                onValueChange={(e) => {
                  updateReqdVendors({
                    ...reqdVendors,
                    vendor3: {
                      name: e,
                      vendorId: vendors.find((v) => v.name === e).id,
                    },
                  });
                  setVendorsError(false);
                }}
              >
                <SelectTrigger className={`w-full border ${
                    vendorsError ? "border-red-500" : "border-gray-300"
                  }`}>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor: any, i: number) => (
                    <SelectItem value={vendor.name} key={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div> */}

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
                    <TableHead className="w-[100px]">No.</TableHead>
                    <TableHead colSpan={7}>
                      Description<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                    

                    <TableHead>
                      Req. Qty.<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                    <TableHead>
                      UOM<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                    <TableHead>
                      Offered. Qty.<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                    <TableHead>
                      UOM<span className="text-red-500 ml-1">*</span>
                    </TableHead>
                    

                    <TableHead className="text-right">
                      Offered Price<span className="text-red-500 ml-1">*</span>
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
              
            </div>
          </div>
          <Separator />
        <div className="flex gap-4 items-center mx-auto mt-10">
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Freight Charges
</label>
            <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            
            
        </div>
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customs Charges
</label>
           
         <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
         
            
        </div>
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Shipment CHarges
            </label>
            <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            
        </div>
        
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Port Connectivity CHarges
            </label>
            <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            
        </div>
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Agent Charges
            </label>
            <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            
        </div>
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Other  CHarges
            </label>
            <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            
        </div>
        <div>
        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Remark
        </label>
        <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
        </div>
        
        </div>

        <div className="text-right mt-3">
        <Button className="bg-blue-500 mt-3">Save as Draft</Button>
        <Button className="bg-green-600 mt-3 mx-2">Send for Approval</Button>
        <Button className="bg-pink-500 mt-3 mx-2">Print RFQ</Button>
        <Button className="bg-red-600 mt-3 mx-2">Cancel</Button>
        </div>
        </div>

       


      
      </main>
    </>
  );


}



