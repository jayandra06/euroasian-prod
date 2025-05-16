"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useParams } from "next/navigation";
import { SelectItemText } from "@radix-ui/react-select";
import toast from "react-hot-toast";
import { select } from "@heroui/theme";
import Loader from "@/components/ui/loader";

interface OrderItem {
  id: string;
  impa_no: string;
  description: string;
  item_part_no: string;
  item_position_no: string;
  alternate_part_no: string;
  dimensions: string;
  req_qty: string;
  uom: string;
  issue_description?: string;
  rfq_response: [
    {
      uom: string;
      offered_price: string;
      offer_quality: string;
    }
  ];
}

interface orderDetails {
  vendor_name: string;
  brand: string;
  model: string;
  category: string;
  vessel_name: string;
  vendor_id: string;
  status:string;
}

interface RFQ {
  id: string;
  vessel_name: string;
  category: string;
  brand: string;
  model: string;
}

interface Merchant {
  id: string;
  name: string;
}

interface RFQSupplier {
  status: string;
  rfq: {
    id: string;
    vessel_name: string;
    category: string;
    brand: string;
    model: string;
  };
  merchant: {
    id: string;
    name: string;
  };
}

const OrderItemTable: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showReasonTextBox, setReasonTextBox] = useState(false);
  const [reason, setReason] = useState("");
  const [vendor, seVendorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [claimExist,setClaimExist]=useState(false);
  const [status,setShowStatus]=useState("");


  const [orderDetails, setOrderDetails] = useState<orderDetails>({
    vendor_name: "",
    brand: "",
    model: "",
    category: "",
    vessel_name: "",
    vendor_id: "",
    status:""
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const supabase = createClient();

  const { id: rfqId } = useParams<{ id: string }>();

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

const fetchRFQDetails = async () => {
      try {
        const [supplierResult, itemsResult, claimexist] = await Promise.all([
          supabase
            .from("rfq_supplier")
            .select(`
              status,
              rfq:rfq_id (
                id,
                vessel_name,
                category,
                brand,
                model
              ),
              merchant:vendor_id (
                id,
                name
              )
            `)
            .eq("rfq_id", rfqId)
            .eq("status", "completed")
            .single(),

          supabase
            .from("rfq_items")
            .select(`
              *,
              rfq_response (
                offered_price,
                offer_quality,
                uom
              ),
              claim_items!inner (
                issue_description
              )
            `)
            .eq("rfq_id", rfqId),

          supabase
            .from("claim")
            .select('*')
            .eq("rfq_id", rfqId)
        ]);

        // Handle supplier error
        if (supplierResult.error) {
          console.error("Error fetching RFQ supplier data:", supplierResult.error);
          return;
        }

        if (claimexist.data && claimexist.data.length > 0) {
          setClaimExist(true);
          setReason(claimexist.data[0].claim_reason || '');
          setShowStatus(claimexist.data[0].status || '')
        }

    
        // Handle item error
        if (itemsResult.error) {
          console.error("Error fetching RFQ items data:", itemsResult.error);
        }

        console.log("Supplier Result:", supplierResult.data);

        // Process supplier data
        const supplierData = supplierResult.data as unknown as RFQSupplier | null;
        if (supplierData?.rfq && supplierData?.merchant) {
          setOrderDetails({
            vendor_name: supplierData.merchant.name || "",
            vessel_name: supplierData.rfq.vessel_name || "",
            category: supplierData.rfq.category || "",
            brand: supplierData.rfq.brand || "",
            model: supplierData.rfq.model || "",
            vendor_id: supplierData.merchant.id || "",
            status: supplierData.status || ""
          });
        }

        // Process item data
        if (itemsResult.data) {
          setItems(itemsResult.data.map(item => ({
            ...item,
            issue_description: item.claim_items?.[0]?.issue_description || ''
          })) as OrderItem[]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    setLoading(true);
    

    fetchRFQDetails();
  }, [rfqId]);

  const rfqRaiseValidationHandler = () => {
    let isValid = true;

    if (selectedItems.length === 0) {
      toast.error("Please select at least one item");
      isValid = false;
    } 

    if (!reason || reason.trim() === '') {
      toast.error("Please add claim reason");
      isValid = false;
    }

    if (isValid) {
      SaveTheClaimData();
    }
  };
  const SaveTheClaimData = async () => {
    setReasonTextBox(false);
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user or no user logged in:", userError);
        return;
      }
  
      // Get customer ID
      const { data: customer, error: customerError } = await supabase
        .from("customer_details")
        .select("id")
        .eq("login", userData.user.id);
  
      if (customerError || !customer || customer.length === 0) {
        console.error("Error fetching customer details:", customerError);
        return;
      }
  
      // Insert claim
      const { data: claimData, error: claimError } = await supabase
        .from("claim")
        .insert({
          vendor_id: orderDetails.vendor_id,
          created_by: userData.user.id,
          status: "pending",
          rfq_id: rfqId,
          claim_reason: reason,
          customer_id: customer[0].id
        })
        .select("*")
        .limit(1);
  
      if (claimError || !claimData || claimData.length === 0) {
        console.error("Error inserting into claim:", claimError);
        return;
      }
  
      const claim = claimData[0];
  
      // Insert related claim_items
      if (Array.isArray(selectedItems) && selectedItems.length > 0) {
        const insertErrors = [];
  
        for (const item of selectedItems) {
          const rfq_item_id = item;
          const selectedItem = items.find(i => i.id === item);
  
          const { error: itemError } = await supabase
            .from("claim_items")
            .insert({
              claim_id: claim.id,
              rfq_item_id,
              issue_description: selectedItem?.issue_description || ''
            });
  
          if (itemError) {
            console.error(
              `Error inserting claim_item for rfq_item_id ${rfq_item_id}:`,
              itemError
            );
            insertErrors.push(itemError);
          }
        }
  
        if (insertErrors.length > 0) {
          toast.error("Some claim items failed to save.");
        } else {
          toast.success("Claim raised successfully.");
          fetchRFQDetails();
        }
      }
  
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };
  

  const handleItemSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleRaiseClaim = async () => {
    try {
      const { data: claimData, error: claimError } = await supabase
        .from('claim')
        .update({ status: 'cancelled' })
        .eq('rfq_id', rfqId)
        .select()
        .single();

      if (claimError) {
        console.error('Error cancelling claim:', claimError);
        toast.error('Failed to cancel claim');
        return;
      }

      toast.success('Claim cancelled successfully');
      setClaimExist(false);
      fetchRFQDetails(); // Refresh the data
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while cancelling the claim');
    }
  };

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="flex flex-col items-center">
            <Loader />
            
          </div>
        </div>
      ) : (
        <>
          <div className="w-full mb-8">
            <h1 className="text-2xl font-bold mb-6">Claim Details</h1>
            <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
              <div className="text-gray-700 font-medium col-span-2">
                <span className="block text-sm text-gray-500">
                  Vendor Name:
                </span>
                <span className="text-lg font-semibold">
                  {orderDetails.vendor_name}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
              <div>
                <span className="block text-sm text-gray-500">
                  Vessel Name:
                </span>
                <span className="text-lg font-semibold">
                  {orderDetails.vessel_name}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Category:</span>
                <span className="text-lg font-semibold">
                  {orderDetails.category}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Brand:</span>
                <span className="text-lg font-semibold">
                  {orderDetails.brand}
                </span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Model:</span>
                <span className="text-lg font-semibold">
                  {orderDetails.model}
                </span>
              </div>
             {claimExist && (<>
              <div>
                <span className="block text-sm text-gray-500">Status:</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  status === 'approved' ? 'bg-green-100 text-green-800' :
                  status === 'rejected' ? 'bg-red-100 text-red-800' :
                  status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {status === 'pending' ? 'Pending' :
                   status === 'approved' ? 'Approved' :
                   status === 'rejected' ? 'Rejected' :
                   status === 'in_progress' ? 'In Progress' :
                   status === 'Completed' ? 'Completed' :
                   status}
                </span>
              </div>
             </>)} 
              {/* <div>
                <span className="block text-sm text-gray-500">
                  Number of Items:
                </span>
                <span className="text-lg font-semibold">15</span>
              </div> */}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Claim Reason</h2>
              <div className="grid grid-cols-1 gap-6 mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
                <div>
                  <Textarea
                    placeholder="Enter reason for claim..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[120px]"
                    disabled={claimExist}
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead hidden={claimExist}>Select</TableHead>
                    <TableHead>#</TableHead>
                    <TableHead colSpan={2}>Description</TableHead>
                    <TableHead colSpan={5}></TableHead>
                    <TableHead>Req Qty</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead>Offered. Qty.</TableHead>
                    <TableHead>Vendor UOM</TableHead>
                    <TableHead>Offered Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleItemSelect(item.id)}
                          hidden={claimExist}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell colSpan={2}>
                        <div className="col-span-2">
                          <Input
                            type="text"
                            placeholder="impa_no"
                            value={item.impa_no}
                            name="impa_no"
                            disabled
                          />
                        </div>
                        <div className="col-span-1 mt-2">
                          <Textarea
                            placeholder="Item Description.."
                            value={item.description}
                            name="description"
                            disabled
                          />
                        </div>
                      </TableCell>
                      <TableCell colSpan={5}>
                        <div className="grid gap-2 grid-cols-4 items-center">
                          <div className="col-span-2">
                            <Input
                              type="text"
                              placeholder="Part No."
                              value={item.item_part_no}
                              name="item_part_no"
                              disabled
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="text"
                              placeholder="Position No."
                              value={item.item_position_no}
                              name="item_position_no"
                              disabled
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="text"
                              placeholder="Alternate Part No."
                              value={item.alternate_part_no}
                              name="alternate_part_no"
                              disabled
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              placeholder="Dimension"
                              value={item.dimensions}
                              name="dimension"
                              disabled
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          placeholder="offered quantity"
                          value={item.req_qty}
                          name="req_qty"
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          placeholder=""
                          value={item.uom}
                          name="uom"
                          disabled
                        />
                      </TableCell>
                      <TableCell className="text-right relative">
                        <Input
                          type="number"
                          placeholder=""
                          value={item.rfq_response[0].offer_quality}
                          name="offer_quality"
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          name="uom_vendor"
                          value={item.rfq_response[0].uom || ""}
                          disabled
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
                      </TableCell>
                      <TableCell className="text-right relative">
                        <Input
                          placeholder="Offered Price"
                          value={item.rfq_response[0].offered_price}
                          name="offer_price"
                          disabled
                          className="w-[80px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea 
                          placeholder="No reason provided"
                          className="min-h-[80px]"
                          value={item.issue_description || ''}
                          name={`reason-${item.id}`}
                          disabled={claimExist}
                          onChange={(e) => {
                            const updatedItems = items.map(i => 
                              i.id === item.id 
                                ? {...i, issue_description: e.target.value}
                                : i
                            );
                            setItems(updatedItems);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md p-4 flex justify-end items-center">
            <button
              onClick={() => rfqRaiseValidationHandler()}
              className={`border border-blue-600 text-blue-600 bg-white mr-4 px-4 py-2 rounded hover:bg-blue-100 ${
              claimExist ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              hidden={claimExist}
            >
              Raise Claim
            </button>

            {claimExist &&  <button
          onClick={handleRaiseClaim}
          className="border border-blue-600 text-blue-600 bg-white px-4 py-2 rounded hover:bg-blue-100"
        >
          Cancel Claim
        </button> }
          </div>
        </>
      )}
    </>
  );
};

export default OrderItemTable;
