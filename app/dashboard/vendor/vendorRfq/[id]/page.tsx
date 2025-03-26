"use client";
import { Button } from "@/components/ui/button";

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
import Image from "next/image";
import { useRouter } from "next/router";
import { useParams, useSearchParams } from "next/navigation";






// @ts-ignore
function RFQInfoCard({
  rfqInfo,
  setRfqInfo,
}: {
  rfqInfo: any;
  setRfqInfo:any
  
}) {

  console.log("efq" , rfqInfo)
  
  console.log("rrrr" , rfqInfo)
  const supabase = createClient()

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("rfq-image").getPublicUrl(path);
    return data.publicUrl;
  };
  if (!rfqInfo) {
    return <p>Loading...</p>;
  }



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
                  value={rfqInfo?.lead_date || ""}
                 
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="supplyPort">
                  Supply Port <span className="text-red-500">*</span>
                </Label>
                <Input
              type="text"
              id="supply_port"
              value={rfqInfo?.supply_port || ""}
              disabled
              
              
            />
                
              </div>
              <div className="flex flex-col">
              <Label htmlFor="expireDate">
              Valid Until <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              type="text"
              id="date"
              value={
                rfqInfo?.created_at
                  ? new Date(rfqInfo.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : ""
              }
              disabled
              
              
            />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="imoNo">
                  IMO No <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="imoNo"
                  placeholder="Enter IMO No."
                  value={rfqInfo?.imo_no}
                  disabled
                  
                />
                
              </div>
             
              <div className="flex flex-col">
                <Label htmlFor="vesselName">
                  Vessel Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="vessel_name"
                  placeholder="vessel_name"
                  value={rfqInfo?.vessel_name}
                  disabled
                  
                />
                
              </div>
              <div className="flex flex-col">
                <Label htmlFor="imoNo">
                  HULL No <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="imoNo"
                  placeholder="Enter HULL No."
                  value={rfqInfo?.hull_no}
                  disabled
                 
                  
                />
                
              </div>
              <div className="flex flex-col">
                <Label htmlFor="clientName">Equipment Tags</Label>
                <Input
                  type="text"
                  id="clientName"
                  placeholder="Enter Equipment Tags"
                  value={rfqInfo?.equipement_tag}
                  className="mt-2"
                  disabled
                 
                />
                
              </div>

              <div className="flex flex-col">
                <Label htmlFor="brand">
                  Brand <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="brand"
                  placeholder="brand"
                  value={rfqInfo?.brand}
                  disabled
                  
                />
                
              </div>

              <div className="flex flex-col">
                <Label htmlFor="model">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="model"
                  placeholder="model"
                  value={rfqInfo?.model}
                  disabled
                  
                />

              </div>

              <div className="flex flex-col">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="category"
                  placeholder="category"
                  value={rfqInfo?.category}
                  disabled
                  
                />
                
              </div>

              {/* drawing Number */}
              <div className="flex flex-col">
                <Label htmlFor="clientName">Drawing Number</Label>
                <Input
                  type="text"
                  id="clientName"
                  placeholder="Enter Drawing Number"
                  value={rfqInfo?.drawing_number}
                  className="mt-2"
                  disabled
                  
                />
                
              </div>
              <div className="flex flex-col">
                <Label htmlFor="clientName">Serial Number</Label>
                <Input
                  type="text"
                  id="clientName"
                  placeholder="Serial Number"
                  value={rfqInfo?.serial_no}
                  className="mt-2"
                  disabled
                  
                />
                
              </div>
              <div className="flex flex-col">
              <Label htmlFor="clientName">Remarks</Label>
              <Input
                  type="text"
                  id="clientName"
                  placeholder="remarks"
                  value={rfqInfo?.remarks}
                  className="mt-2"
                  disabled
                  
                />
                
              </div>
              
              <div className="flex flex-col">
                <Label htmlFor="clientName">Offer Quality</Label>
                <Input
                  type="text"
                  id="clientName"
                  placeholder="Enter General Remark"
                  value={rfqInfo?.offer_quality}
                  className="mt-2"
                  disabled
                  
                />
                
              </div>
              <div className="flex flex-col">
                <Label htmlFor="clientName">Upload</Label>
                {rfqInfo?.upload ? (
      <Image
        height={100} 
        width={100} 
        src={getPublicUrl(rfqInfo.upload)} 
        alt="Uploaded File"
      />
    ) : (
      <p>No file uploaded</p>
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
  const params = useParams();
  const id = params.id; // Extract the dynamic ID

   const [rfqs, setRfqs] = useState<any[]>([]);
   const [selectedRfq, setSelectedRfq] = useState<any>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    
  
  const [rfqInfo, setRfqInfo] = useState({lead_date: ""});
  
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
  
  const [isMem, setIsMem] = useState(true);
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
      lead_date : ""
    };
    if (!rfqInfo?.lead_date)
      newErrors.lead_date = "Lead date is required.";

   

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
    
   
    
    if (
      itemErrors.some((item: { [s: string]: unknown } | ArrayLike<unknown>) =>
        Object.values(item).some((err) => err)
      )
    )
      return;

    const supabase = createClient();
    try {
      
      const rfq = await supabase
        .from("rfq")
        .insert({
          lead_date : rfqInfo?.lead_date
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
  
  function handleRemove(itemId: number) {
    const filteredItem = items.filter((i: any) => i.id !== itemId);

    setItems([...filteredItem]);
  }

  
  useEffect(() => {
    if (!id) return;
  
    async function fetchRfqs() {
      const supabase = createClient();
      const { data, error } = await supabase.from("rfq").select("*").eq("id", id).single();
  
      if (error) {
        console.error("Error fetching RFQs:", error);
        return;
      }
  
      console.log("Fetched RFQ:", data);
      setSelectedRfq(data); 
    }
  
    fetchRfqs();
  }, [id]);

  console.log("RFQ ID from URL:", id);
console.log("Selected RFQ Data:", selectedRfq);

  
 
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
            rfqInfo={selectedRfq} setRfqInfo={setSelectedRfq} 
            
           
            
          />
        </main>

        
       

        

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
        
        </div>

        <div className="text-right mt-3">
        
        <Button className="bg-green-600 mt-3 mx-2">Send for Delivery</Button>
        <Button className="bg-blue-600 mt-3 mx-2">Print Invoice</Button>
        </div>
        </div>

       


      
      </main>
    </>
  );


}



