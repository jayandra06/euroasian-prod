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
import { set } from "react-hook-form";

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
  console.log("item", item);

  return (
    <>
      <TableRow key={item.id}>
        <TableCell className="font-medium">{(item.id).slice(0,8)}</TableCell>
        <TableCell colSpan={3}>
          

          
          <div className="grid gap-2 grid-cols-2 items-center">
            
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Part No."
                value={item.item.item_part_no}
                name="part_no"
                disabled
                
              />
             
            </div>
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Position No."
                value={item.item.item_position_no}
                name="position_no"
                disabled
                

               
              />
              
            </div>
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Alternate Part No."
                value={item.item.alternate_part_no}
                name="alternative_part_no"
                disabled
               

              />
              
            </div>
            <div className="col-span-1 ">
              <Input
                type="text"
                placeholder="Enter Alternate Position No."
                value={item.item.alternative_position_no}
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
                value={item.item.description}
                name="description"
                disabled
                
                
              />
              
            </div>
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="Width"
            value={item.item.width}
            name="width"
            disabled
            
           
          />
         
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="B"
            value={item.item.beadth}
            name="beadth"
            disabled
            
           
          />
         
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="H"
            value={item.item.height}
            name="height"
            disabled
           
          />
         
        </TableCell>
        <TableCell>
        <Input
            type="number"
            placeholder="req_quantity"
            value={item.item.req_qty}
            name="req_qty"
            disabled

          />
         
         
        </TableCell>
        <TableCell>
         
          <Input
            type="text"
            placeholder="uom"
            value={item.item.uom}
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
            value={item.uom}
            name="uom_vednor"
            disabled
           
           
          />
          
        </TableCell>
        <TableCell className="text-right relative">
        <Input
            type="number"
            placeholder="offered_price"
            value={item.offered_price}
            name="offered_price"
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
  console.log("RFQ Data:", rfqData);
  console.log("RFQ Items:", rfqItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  // Add to your state
const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
const [isCreator, setIsCreator] = useState(false);
const [approvalStatus, setApprovalStatus] = useState(rfqData?.status || 'draft');
const [vendors, setVendors] = useState<any[]>([]);
const [vendorApprovalStatus, setVendorApprovalStatus] = useState<Record<string, string>>({});
const [selectedVendorNumber, setSelectedVendorNumber] = useState<number | null>(null)

  console.log("filtered items" , filteredItems)


  
  

  const [isMem, setIsMem] = useState(true);

  const [user, setUser] = useState<any>(null);

useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };
  getUser();
}, []);
  
  
  useEffect(() => {
    const fetchVendor = async()=>{
      const { data: rfqSuppliers, error: rfqSupplierError } = await supabase
    .from("rfq_supplier")
    .select("vendor_id")
    .eq("rfq_id", id);
  
  if (rfqSupplierError) throw rfqSupplierError;
  
  setVendors(rfqSuppliers.map((r) => r.vendor_id));

    }
    fetchVendor()
    
  }, [])
  



  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const { data: rfq, error: rfqError } = await supabase
          .from("rfq")
          .select("*")
          .eq("id", id)
          .single();
  
        if (rfqError) throw rfqError;
  
        const { data: rfqResponses, error: rfqItemsError } = await supabase
          .from("rfq_response")
          .select("*")
          .eq("rfq_id", id);
  
        if (rfqItemsError) throw rfqItemsError;
        const itemIds = rfqResponses.map((res) => res.item_id).filter(Boolean);

        const { data: itemsData, error: itemsError } = await supabase
        .from("rfq_items")
        .select("*")
        .in("id", itemIds);
      if (itemsError) throw itemsError;

      const mergedResponses = rfqResponses.map((response) => {
        const itemDetails = itemsData.find((item) => item.id === response.item_id);
        return {
          ...response,
          item: itemDetails || null, // attach full item details
        };
      });

  
        setRfqData(rfq);
        setRfqItems(mergedResponses);
  
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load RFQ data");
      } finally {
        setLoading(false);
      }
    };
  
    if (id) fetchData();
  }, [id]);
  


  
  const handleVendorClick = (vendorId, vendorNumber) => {
    setSelectedVendor(vendorId);
    setSelectedVendorNumber(vendorNumber);
    
    const vendorResponses = rfqItems.filter(
      (item) => item.vendor_id === vendorId
    );
    setFilteredItems(vendorResponses);
  };


  console.log("geetting rfqitems",rfqItems)
  


 useEffect(() => {
  const fetchUserData = async () => {
    if (!id) return;
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Fetch member role
      const { data: member, error: memberError } = await supabase
        .from('member')
        .select('member_role')
        .eq('member_profile', user.id)
        .single();
      if (memberError) throw memberError;
      
      setCurrentUserRole(member?.member_role);
      
      // Check if current user is the creator
      const { data: rfq, error: rfqError } = await supabase
        .from('rfq')
        .select('requested_by, status')
        .eq('id', id)
        .single();
      if (rfqError) throw rfqError;
      
      setIsCreator(rfq?.requested_by === user.id);
      setApprovalStatus(rfq?.status || 'draft');
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };
  
  fetchUserData();
}, [id]);

useEffect(() => {
  const fetchApprovalStatus = async () => {
    const { data: approvals, error } = await supabase
      .from('rfq_approvals')
      .select('vendor_key, status')
      .eq('rfq_id', id);

    if (!error && approvals) {
      const statusMap: Record<string, string> = {};
      approvals.forEach(approval => {
        statusMap[approval.vendor_key] = approval.status;
      });
      setVendorApprovalStatus(statusMap);
    }
  };

  if (id) fetchApprovalStatus();
}, [id]);



const handleSendVendorForApproval = async () => {
  if (!selectedVendor || !selectedVendorNumber) return;
  
  try {
    const vendorKey = `vendor${selectedVendorNumber}`;
    
    // Update approval status in database
    const { error } = await supabase
      .from('rfq_approvals')
      .upsert({
        rfq_id: id,
        vendor_key: vendorKey,
        status: 'pending_approval',
        decided_by: user?.id,
        decided_at: new Date().toISOString()
      });

    if (error) throw error;

    // Update local state
    setVendorApprovalStatus(prev => ({
      ...prev,
      [vendorKey]: 'pending_approval'
    }));

    alert(`Vendor  sent for approval successfully!`);
  } catch (err) {
    console.error("Error sending for approval:", err);
    alert("Failed to send for approval");
  }
};


const handleVendorApproveReject = async (action: 'approve' | 'reject') => {
  if (!selectedVendor || !selectedVendorNumber || !user) {
    alert("Please select a vendor and ensure you're logged in");
    return;
  }
  
  try {
    const vendorKey = `vendor${selectedVendorNumber}`;
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    // Start a transaction to update both tables
    const { error: approvalError } = await supabase
      .from('rfq_approvals')
      .upsert({
        rfq_id: id,
        vendor_key: vendorKey,
        status: newStatus,
        decided_by: user.id
      });

    if (approvalError) throw approvalError;

    // Update the main RFQ status if all vendors are approved
    if (action === 'approve') {
      // Check if all vendors are approved
      const { data: approvals, error: fetchError } = await supabase
        .from('rfq_approvals')
        .select('status')
        .eq('rfq_id', id);

      if (fetchError) throw fetchError;

      const allApproved = vendors.every((_, index) => {
        const vendorNum = index + 1;
        return approvals.some(a => 
          a.vendor_key === `vendor${vendorNum}` && 
          a.status === 'approved'
        );
      });

      if (allApproved) {
        const { error: rfqError } = await supabase
          .from('rfq')
          .update({ status: 'approved' })
          .eq('id', id);

        if (rfqError) throw rfqError;
        setApprovalStatus('approved');
      }
    }

    // Update local state
    setVendorApprovalStatus(prev => ({
      ...prev,
      [vendorKey]: newStatus
    }));

    alert(`Vendor ${selectedVendorNumber} ${newStatus} successfully!`);
  } catch (err) {
    console.error(`Error ${action}ing vendor:`, err);
    alert(`Failed to ${action} vendor`);
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
        {vendors.map((vendorId, index) => {
  const vendorNumber = index + 1;
  const vendorKey = `vendor${vendorNumber}`;
  const status = vendorApprovalStatus[vendorKey] || 'draft';

  return (
    <button
      key={vendorId}
      onClick={() => rfqItems.length > 0 && handleVendorClick(vendorId, vendorNumber)}
      disabled={rfqItems.length === 0}
      className={`relative z-10 px-4 py-2 text-sm font-medium transition ${
        selectedVendor === vendorId ? "text-black font-bold bg-gray-200" : "text-gray-700"
      } ${rfqItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      Vendor {vendorNumber}
      
      {selectedVendor === vendorId && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 shadow-2xl rounded-full z-[-1]"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
    </button>
  );
})}

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
        No items found
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

          {selectedVendor ? (
  filteredItems.length > 0 ? (
    filteredItems.map((item, i) => (
      <div key={item.id} className="flex gap-4 items-center mx-auto mt-10">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Freight Charges</label>
          <input 
            type="text" 
            disabled 
            value={item.freight_charges} 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          />
        </div>
        {/* Repeat for other charge fields */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customs Charges</label>
          <input 
            type="text" 
            disabled 
            value={item.custom_charges} 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          />
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
       
        {/* Add remaining charge fields here */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Remark</label>
          <input 
            type="text" 
            disabled 
            value={item.remarks} 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          />
        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-4">
      No items found
    </div>
  )
) : (
  rfqItems.map((item, i) => (
    <div key={item.id} className="flex gap-4 items-center mx-auto mt-10">
      {/* Same charge fields as above */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Freight Charges</label>
        <input 
          type="text" 
          disabled 
          value={item.freight_charges} 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        />
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
       <input type="text" id="first_name" value={item.remarks} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
       </div>
      {/* Repeat for other charge fields */}
    </div>
  ))
)}

        

        <div className="text-right mt-3">
  <Button className="bg-blue-500 mt-3">Save as Draft</Button>
  
  {/* Employee sees Send for Approval for selected vendor */}
  {currentUserRole === 'employee' && selectedVendorNumber && (
    vendorApprovalStatus[`vendor${selectedVendorNumber}`] !== 'pending_approval' &&
    vendorApprovalStatus[`vendor${selectedVendorNumber}`] !== 'approved' &&
    vendorApprovalStatus[`vendor${selectedVendorNumber}`] !== 'rejected' && (
      <Button 
        className="bg-green-600 mt-3 mx-2"
        onClick={handleSendVendorForApproval}
      >
        Send  for Delivery
      </Button>
    )
  )}
  
  {/* Creator sees Approve/Reject for selected vendor */}
  {isCreator && selectedVendorNumber && 
    vendorApprovalStatus[`vendor${selectedVendorNumber}`] === 'pending_approval' && (
    <>
      <Button 
        className="bg-green-600 mt-3 mx-2"
        onClick={() => handleVendorApproveReject('approve')}
      >
        Approve Vendor
      </Button>
      <Button 
        className="bg-red-600 mt-3 mx-2"
        onClick={() => handleVendorApproveReject('reject')}
      >
        Reject Vendor
      </Button>
    </>
  )}
  
  {/* Status indicators */}
  {selectedVendorNumber && vendorApprovalStatus[`vendor${selectedVendorNumber}`] === 'approved' && (
    <span className="text-green-600 font-bold mt-3 mx-2">
      Vendor Approved ✓
    </span>
  )}
  
  {selectedVendorNumber && vendorApprovalStatus[`vendor${selectedVendorNumber}`] === 'rejected' && (
    <span className="text-red-600 font-bold mt-3 mx-2">
      Vendor Rejected ✗
    </span>
  )}
  
  <Button className="bg-pink-500 mt-3 mx-2">Print RFQ</Button>
  <Button className="bg-red-600 mt-3 mx-2">Cancel</Button>
</div>

       
        </div>

       


      
      </main>
    </>
  );


}



