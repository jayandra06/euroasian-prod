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
import { Button } from "@/components/ui/button";

import { useParams } from "next/navigation";
import { SelectItemText } from "@radix-ui/react-select";
import toast from "react-hot-toast";
import { calendar, select } from "@heroui/theme";
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
  claim_reason:string;
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

interface ClaimData {
  status: string;
  created_at: string;
  claim_reason: string;
  rfq: {
    vessel_name: string;
    category: string;
    brand: string;
    model: string;
  };
  customer: {
    shipping_company_name: string;
  };
}

const OrderItemTable: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showReasonTextBox, setReasonTextBox] = useState(false);
  const [reason, setReason] = useState("");
  const [vendor, seVendorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [claimExist,setClaimExist]=useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pending");

  const [orderDetails, setOrderDetails] = useState<orderDetails>({
    vendor_name: "",
    brand: "",
    model: "",
    category: "",
    vessel_name: "",
    vendor_id: "",
    status:"",
    claim_reason:""
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const supabase = createClient();

  const { id: claimId } = useParams<{ id: string }>();

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);
  
  const fetchClaimDetails = async () => {
    try {
      const { data: claimData, error: claimError } = await supabase
        .from('claim')
        .select(`
          claim_reason,
          status,
          created_at,
          rfq:rfq_id (
            vessel_name,
            category,
            brand,
            model
          ),
          customer:customer_id (
            shipping_company_name
          )
        `)
        .eq('id',claimId)
        .single();

      if (claimError) {
        console.error("Error fetching claim data:", claimError);
        return;
      }

      console.log("claimData", claimData);

      if (claimData) {
        const claim = claimData as unknown as ClaimData;
        setOrderDetails({
          vendor_name: claim.customer.shipping_company_name || "",
          vessel_name: claim.rfq.vessel_name || "",
          category: claim.rfq.category || "",
          brand: claim.rfq.brand || "",
          model: claim.rfq.model || "",
          vendor_id: "",
          status: claim.status || "",
          claim_reason: claim.claim_reason || ""
        });
      }

      // Fetch claim items
      const { data: itemsData, error: itemsError } = await supabase
        .from('claim_items')
        .select(`
          *,
          rfq_items (
            *,
            rfq_response (
              offered_price,
              offer_quality,
              uom
            )
          )
        `)
        .eq('claim_id', claimId);

      if (itemsError) {
        console.error("Error fetching claim items:", itemsError);
      } else if (itemsData) {
        setItems(itemsData.map(item => ({
          ...item.rfq_items,
          issue_description: item.issue_description
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
   

    fetchClaimDetails();
  }, [claimId]);

  const rfqRaiseValidationHandler = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item");
    } else {
      setReasonTextBox(true);
    }
  };
  const SaveTheClaimData = async () => {
    
  };

  const handleItemSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleRaiseClaim = () => {
    const selected = items.filter((item) => selectedItems.includes(item.id));
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
                  Company Name:
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
              <div>
                <span className="block text-sm text-gray-500">Status:</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  orderDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  orderDetails.status === 'approved' ? 'bg-green-100 text-green-800' :
                  orderDetails.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  orderDetails.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  orderDetails.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {orderDetails.status === 'pending' ? 'Under Review' :
                   orderDetails.status === 'approved' ? 'Approved' :
                   orderDetails.status === 'rejected' ? 'Rejected' :
                   orderDetails.status === 'in_progress' ? 'In Progress' :
                   orderDetails.status === 'completed' ? 'Completed' :
                   orderDetails.status}
                </span>
              </div>
             
            </div>
            <div>
            <h1 className="text-lg font-bold mb-6">Claim Reason</h1>
            <div className="grid grid-cols-1 gap-6 mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
              <div>
               
                <div className="p-4 bg-white rounded-md min-h-[120px] text-gray-700">
                  {orderDetails.claim_reason || 'No claim reason provided'}
                </div>
              </div>
            </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    
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
                          value={item.issue_description || 'No reason provided'}
                          name={`reason-${item.id}`}
                          disabled
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md p-4 flex justify-end items-center">
            <div className="flex items-center gap-4">
              <Select 
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="default"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => {
                  const handleStatusUpdate = async () => {
                    try {
                      const { data, error } = await supabase
                        .from('claim')
                        .update({ status: selectedStatus })
                        .eq('id', claimId);
                        
                      if (error) {
                        console.error('Error updating status:', error);
                        toast.error('Failed to update status');
                        return;
                      }
                      toast.success('Status updated successfully');
                      
                      console.log('Status updated successfully');
                    } catch (err) {
                      console.error('Error:', err);
                    } finally {
                      fetchClaimDetails();
                    }
                  };
                  handleStatusUpdate();

                }}
              >
                Update Status
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderItemTable;
