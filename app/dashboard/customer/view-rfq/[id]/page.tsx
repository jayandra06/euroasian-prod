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

import { Loader, Loader2, Trash2 } from "lucide-react";

import { useParams } from "next/navigation";

const tabs = [
  { id: "Vendor 1", label: "Vendor 1", color: "bg-white", text: "text-black" },
  { id: "Vendor 2", label: "Vendor 2", color: "bg-blue-500" },
  { id: "Vendor 3", label: "Vendor 3", color: "bg-green-400" },
  
];


// @ts-ignore
function RFQInfoCard({
 rfqData
}: {
  rfqData:any[]
}) {
  
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
                  type="text"
                  className="mt-2"
                  id="leadDate"
                  disabled
                  value={
                    rfqData?.lead_date
                      ? new Date(rfqData.lead_date).toLocaleDateString("en-GB", {
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
                <Label htmlFor="supplyPort">
                  Supply Port <span className="text-red-500">*</span>
                </Label>
                <Input
              type="text"
              id="supplyport"
              value={rfqData.supply_port || ""}
              disabled
              
              
            />
              </div>
              <div className="flex flex-col">
              <Label htmlFor="valid_date">
              Valid Until <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              type="text"
              id="valid_date"
              value={rfqData.valid_date || ""}
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
                  value={rfqData.imo_no}
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
                  placeholder="Enter Vessel Name"
                  value={rfqData.vessel_name}
                  disabled
                 
                />
                
              </div>
              <div className="flex flex-col">
                <Label htmlFor="imoNo">
                  HULL No <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="hull_no"
                  placeholder="Enter HULL No."
                  value={rfqData.hull_no}
                  disabled
                 
                />
               
              </div>
              <div className="flex flex-col">
                <Label htmlFor="clientName">Equipment Tags</Label>
                <Input
                  type="text"
                  id="equipement_tag"
                  placeholder="Enter Equipment Tags"
                  value={rfqData.equipement_tag}
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
                  value={rfqData.brand}
                  className="mt-2"
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
                  placeholder="Enter Model"
                  value={rfqData.model}
                  className="mt-2"
                  disabled
                  
                />
               
              </div>

              <div className="flex flex-col">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="Category"
                  placeholder="Enter Category"
                  value={rfqData.category}
                  className="mt-2"
                  disabled
                  
                />
               
              </div>

              {/* drawing Number */}
              <div className="flex flex-col">
                <Label htmlFor="clientName">Drawing Number</Label>
                <Input
                  type="text"
                  id="drawing_number"
                  placeholder="Enter Drawing Number"
                  value={rfqData.drawing_number}
                  className="mt-2"
                  disabled
                  
                />
                
              </div>
              <div className="flex flex-col">
                <Label htmlFor="clientName">Serial Number</Label>
                <Input
                  type="text"
                  id="serial_number"
                  placeholder="Enter Serial No"
                  value={rfqData.serial_no}
                  className="mt-2"
                  disabled
                  
                />
                
              </div>
              <div className="flex flex-col">
              <Label htmlFor="clientName">Uploaded File</Label>
              <Input
                  type="text"
                  id="clientName"
                  placeholder="Enter Equipment Tags"
                  value={rfqData.currentTag}
                  className="mt-2"
                  disabled
                  
                />
                
              </div>
              <div className="flex flex-col">
                <Label htmlFor="model">
                  Offered Quality <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="offer_quality"
                  placeholder="Enter Offer_quality"
                  value={rfqData.offer_quality}
                  className="mt-2"
                  disabled
                  
                />
                
              </div>
              <div className="flex flex-col">
                <Label htmlFor="clientName">General Remarks</Label>
                <Input
                  type="text"
                  id="remarks"
                  placeholder="Enter Remarks"
                  value={rfqData.remarks}
                  className="mt-2"
                  disabled
                  
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
function Item({ item }) {

  return (
    <>
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.id}</TableCell>
        <TableCell colSpan={3}>
          

          
          <div className="grid gap-2 grid-cols-2 items-center">
            
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Part No."
                value={item.item_part_no}
                name="part_no"
                disabled
                
              />
             
            </div>
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Position No."
                value={item.item_position_no}
                name="position_no"
                disabled
                

               
              />
              
            </div>
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Alternate Part No."
                value={item.alternate_part_no}
                name="alternative_part_no"
                disabled
               

              />
              
            </div>
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Alternate Position No."
                value={item.alternative_position_no}
                name="alternative_position_no"
                disabled
                
               
              />
              
            </div>
          </div>
          
            
         
        </TableCell>
        <TableCell>
        <div className="col-span-1">
              <Textarea
                placeholder="Enter Item Description.."
                value={item.description}
                name="description"
                disabled
                
                
              />
              
            </div>
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="Width"
            value={item.width}
            name="width"
            disabled
            
           
          />
         
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="B"
            value={item.beadth}
            name="beadth"
            disabled
            
           
          />
         
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="H"
            value={item.height}
            name="height"
            disabled
           
          />
         
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="req_quantity"
            value={item.req_qty}
            name="req_qty"
            disabled

          />
         
         
        </TableCell>
        <TableCell>
         
          <Input
            type="text"
            placeholder="uom"
            value={item.uom}
            name="uom"
            disabled
            
          />
          
        </TableCell>
        <TableCell className="text-right relative">
        <Input
            type="number"
            placeholder="offer_quality"
            value={item.offer_quality}
            name="offer_quality"
            disabled
            
          />
        </TableCell>
        <TableCell>
          
          <Input
            type="text"
            placeholder="uom_vendor"
            value={item.uom_vendor}
            name="uom_vednor"
            disabled
           
           
          />
          
        </TableCell>
        <TableCell className="text-right relative">
        <Input
            type="number"
            placeholder=""
            value={item.offer_price}
            name="offer_price"
            disabled
            
          />
        </TableCell>
        
      </TableRow>
    </>
  );
}



export default function ViewRfq() {

  const params = useParams()
  const id = params.id

  const supabase = createClient()
  
  const [rfqData, setRfqData] = useState<any>(null);
  const [rfqItems, setRfqItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  console.log("filtered items" , filteredItems)


  const [rfqs, setrfqs] = useState<any[]>([])
  

  const [isMem, setIsMem] = useState(true);
  const [activeTab, setActiveTab] = useState("")
  
  



  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch RFQ data
        const { data: rfq, error: rfqError } = await supabase
          .from("rfq")
          .select("*")
          .eq("id", id)
          .single();

        if (rfqError) throw rfqError;

        // Fetch RFQ items
        const { data: items, error: itemsError } = await supabase
          .from("rfq_items")
          .select("*")
          .eq("rfq_id", id);

        if (itemsError) throw itemsError;

        setRfqData(rfq);
        setRfqItems(items);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load RFQ data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const fetchVendorResponses = async (rfqId) => {
    try {
      const { data: responses, error } = await supabase
        .from("rfq_response")
        .select("vendor_id, offered_quantity, offered_price, uom")
        .eq("rfq_id", rfqId);

      if (error) throw error;
      return responses;
    } catch (err) {
      console.error("Error fetching responses:", err.message);
      return [];
    }
  };

  const handleVendorClick = async (vendor) => {
    setSelectedVendor(vendor); // Update selected vendor
    try {
      // Fetch vendor responses
      const responses = await fetchVendorResponses(id);
  
      // Filter RFQ items that match the selected vendor
      const filtered = rfqItems
        .map((item) => {
          const vendorResponse = responses.find((res) => res.vendor_id === vendor);
          return vendorResponse
            ? {
                ...item,
                offered_quantity: vendorResponse.offered_quantity,
                offered_price: vendorResponse.offered_price,
                uom: vendorResponse.uom,
              }
            : null; // Exclude items that don't match the vendor
        })
        .filter(Boolean); // Remove null values
  
      setFilteredItems(filtered);
    } catch (error) {
      console.error("Error fetching vendor responses:", error);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!rfqData) {
    return <div className="text-center py-8">RFQ not found</div>;
  }
  

  
  if (!isMem)
    return "Create a Branch or be the Part of any Branch to Create Enquiry...";

  return (
    <>
     
      <main className="grid">
        <div className="pt-4 max-w-6xl w-full grid justify-self-center">
          <h1 className="text-3xl font-bold">Create RFQ</h1>
          <h3 className="mt-2"></h3>
        </div>

        <main className="grid justify-self-center max-w-6xl w-full md:grid-cols-3 gap-4 mt-4">
          <RFQInfoCard
            rfqData = {rfqData}
          />
        </main>

        <div className="flex w-full max-w-6xl justify-self-center items-center mt-8">
          <h1 className="text-xl font-bold">Choose vendors</h1>
        </div>
        <div className="relative flex justify-center max-w-5xl mx-auto mt-4  bg-gray-100 rounded-full p-2 shadow-xl mb-4">
        <div className="relative flex gap-4">
  {["vendor1", "vendor2", "vendor3"].map((vendor) => (
    <button
      key={vendor}
      onClick={() => handleVendorClick(vendor)}
      className={`relative z-10 px-4 py-2 text-sm font-medium transition ${
        selectedVendor === vendor ? "text-black font-bold bg-gray-200" : "text-gray-700"
      }`}
    >
      {vendor.toUpperCase()}
      {selectedVendor === vendor && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 shadow-2xl rounded-full z-[-1]"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
    </button>
  ))}
</div>

      </div>

      

        <div className="grid justify-self-center max-w-6xl w-full mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Items</h1>
          </div>
          <div className="mt-4 max-w-6xl overflow-x-scroll">
            <div className="min-w-5xl max-w-9xl grid">
            <Table>
  <TableHeader>
    <TableRow>
      <TableHead>No.</TableHead>
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
  {selectedVendor && filteredItems.length > 0 ? (
    filteredItems.map((item) => <Item key={item.id} item={item} />)
  ) : selectedVendor ? (
    <TableRow>
      <TableCell colSpan={12} className="text-center py-4">
        No items found for {selectedVendor}
      </TableCell>
    </TableRow>
  ) : (
    rfqItems.map((item) => <Item key={item.id} item={item} />)
  )}
</TableBody>

</Table>

              
            </div>
          </div>
          <Separator />
        {rfqItems.map((item,i)=>(<>
       <div key={item.id} className="flex gap-4 items-center mx-auto mt-10">
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Freight Charges
</label>
            <input type="text" id="freight_charges" name="freight_charges" disabled value={item.freight_charges} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            
            
        </div>
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customs Charges
</label>
           
         <input type="text" id="first_name" value={item.custom_charges} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
         
            
        </div>
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Shipment CHarges
            </label>
            <input type="text" id="first_name" value={item.shipment_charges} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            
        </div>
        
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Port Connectivity CHarges
            </label>
            <input type="text" id="first_name" value={item.port_connectivity_charges} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            
        </div>
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Agent Charges
            </label>
            <input type="text" id="first_name" value={item.agent_charges} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            
        </div>
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Other  CHarges
            </label>
            <input type="text" id="first_name" value={item.other_charges}disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
            
        </div>
        <div>
        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Remark
        </label>
        <input type="text" id="first_name" value={item.remark_charges} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
        </div>
        
        </div> </>))}

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



