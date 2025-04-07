"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
// import { useRouter } from "next/router";
import { Separator } from "@/components/ui/separator";

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
import { Loader, Loader2Icon, Trash2 } from "lucide-react";
import ErrorToast from "@/components/ui/errorToast";
import SuccessToast from "@/components/ui/successToast";
import Image from "next/image";
import { useRouter } from "next/router";
import { useParams, useSearchParams } from "next/navigation";
import { create } from "domain";

// @ts-ignore
function RFQInfoCard({
  rfqInfo,
 
  setRfqInfo,
}: {
  rfqInfo: any;
  
  setRfqInfo: any;
}) {
  console.log("efq", rfqInfo);

  console.log("rrrr", rfqInfo);
  const supabase = createClient();

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("rfq-image").getPublicUrl(path);
    return data.publicUrl;
  };
  if (!rfqInfo) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div  className="w-[950px] max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
                      ? new Date(rfqInfo.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )
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
function Item({ item, handleUpdateItem, errors }) {
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    handleUpdateItem(item.id, name, value);
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{item.id}</TableCell>
        <TableCell colSpan={3} rowSpan={4}>
          <div className="grid gap-2 grid-cols-4 items-center">
            <div className="col-span-2 ">
              <Input
                type="text"
                placeholder="Enter Part No."
                value={item.item_part_no}
                name="item_part_no"
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
            <div className="col-span-2 ">
              <Input
                type="text"
                placeholder="Enter Position No."
                value={item.item_position_no}
                name="item_position_no"
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
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Enter Alternate Part No."
                value={item.alternate_part_no}
                name="alternate_part_no"
                onChange={handleChange}
              />
              {errors.alternative_part_no && (
                <p className="text-red-500 text-sm">
                  {errors.alternative_part_no}
                </p>
              )}
            </div>
            <div className="col-span-2 ">
              <Input
                type="text"
                placeholder="Enter Alternate Position No."
                value={item.impa_no}
                id="impa_no"
                name="impa_no"
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
            value={item.width}
            name="width"
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
            value={item.height}
            name="height"
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
            value={item.beadth}
            name="beadth"
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
          <Input
            type="text"
            placeholder=""
            value={item.uom}
            name="uom"
            // onChange={(e) => {
            //     handleChange(e);
            //     setErrors({ ...errors, req_qty: "" });
            //   }}
            onChange={handleChange}
          />
          {errors.uom && <p className="text-red-500 text-sm">{errors.uom}</p>}
        </TableCell>
        <TableCell className="text-right relative">
          <Input
            type="number"
            placeholder=""
            value={item.offer_quality}
            name="offer_quality"
            onChange={handleChange}
          />
        </TableCell>
        <TableCell>
          {/* <Input type="text" placeholder="Enter UOM..." value={item.uom} name="uom" onChange={} /> */}
          <Select
            name="uom_vendor"
            value={item.uom_vendor || ""}
            onValueChange={(value) => {
              handleUpdateItem(item.id, "uom_vendor", value);
            }}
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
          {errors.uom_vendor && (
            <p className="text-red-500 text-sm">{errors.uom}</p>
          )}
        </TableCell>
        <TableCell className="text-right relative">
          <Input
            placeholder=""
            value={item.offered_price}
            name="offer_price"
            // onChange={(e) => {
            //     handleChange(e);
            //     setErrors({ ...errors, req_qty: "" });
            //   }}
            onChange={handleChange}
            className="w-[60px]"
          />
        </TableCell>
      </TableRow>
    </>
  );
}

export default function ViewRfq() {
  const params = useParams();
  const id = params.id; // Extract the dynamic ID

  const [selectedRfq, setSelectedRfq] = useState<any>(null);

  const [items, setItems] = useState<any[]>([]);

  const [isMem, setIsMem] = useState(true);
  const [errors, setErrors] = useState({ supply_port: "", items: [] });
  const handleUpdateItem = (id: number, key: string, value: any) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState(false);

  console.log(errors);

  useEffect(() => {
    if (!id) return;

    async function fetchVendorRFQs() {
      const supabase = createClient();

      try {
        // ✅ Get the current logged-in user
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const userId = user?.user?.id; // Get the authenticated user's ID
        console.log("✅ Authenticated User ID:", userId);

        const { data: merchantData, error: merchantError } = await supabase
          .from("merchant")
          .select("id")
          .eq("merchant_profile", userId) // Match with authenticated user
          .single(); // Since each user has one merchant profile

        if (merchantError) throw merchantError;

        const merchantId = merchantData?.id;
        console.log("✅ Retrieved Merchant ID:", merchantId);

        const { data: rfqSupplierData, error: supplierError } = await supabase
          .from("rfq_supplier")
          .select("rfq_id")
          .eq("vendor_id", merchantId);

        if (supplierError) throw supplierError;

        console.log("✅ RFQs for Merchant:", rfqSupplierData);

        if (supplierError) throw supplierError;
        if (!rfqSupplierData || rfqSupplierData.length === 0) {
          console.warn("⚠️ No RFQs found for this vendor.");
          return;
        }

        const rfqIdsArray = rfqSupplierData.map((row) => row.rfq_id);

        console.log("✅ RFQ IDs Found:", rfqIdsArray);

        // Step 2: Fetch RFQs
        const { data: rfqs, error: rfqsError } = await supabase
          .from("rfq")
          .select("*")
          .in("id", rfqIdsArray);

        if (rfqsError) throw rfqsError;

        console.log("✅ RFQs for Vendor:", rfqs);
        setSelectedRfq(rfqs.length > 0 ? rfqs[0] : null);

        // Step 3: Fetch RFQ Items
        const { data: items, error: itemsError } = await supabase
          .from("rfq_items")
          .select("*")
          .in("rfq_id", rfqIdsArray);

        if (itemsError) throw itemsError;

        console.log("✅ RFQ Items for Vendor:", items);
        setItems(items);
      } catch (err) {
        console.error("❌ Error fetching RFQs:", (err as Error).message);
      }
    }

    fetchVendorRFQs();
  }, [id]);

  const supabase = createClient();
  const updateAllItems = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
        // ✅ Step 1: Update rfq_items with base details
        const updatePromises = items.map((item) =>
            supabase
                .from("rfq_items")
                .update({
                    item_part_no: item.item_part_no,
                    item_position_no: item.item_position_no,
                    alternate_part_no: item.alternate_part_no,
                    description: item.description,
                    req_qty: item.req_qty,
                    uom: item.uom,
                    width: item.width,
                    height: item.height,
                    beadth: item.beadth,
                    impa_no: item.impa_no,
                })
                .eq("id", item.id)
        );

        const updateResults = await Promise.all(updatePromises);
        const failedUpdates = updateResults.filter((res) => res.error);

        if (failedUpdates.length > 0) {
            console.error("❌ Some RFQ items failed to update:", failedUpdates);
            throw new Error("Failed to update some RFQ items.");
        }

        console.log("✅ RFQ items updated successfully!");
        setSuccessMessage("RFQ items updated successfully!");
        return true; // ✅ Proceed to next step
    } catch (error) {
        console.error("❌ Error updating rfq_items:", error);
        setErrorMessage("Failed to update RFQ items. Please try again.");
        return false; // ❌ Stop process
    } finally {
        setIsLoading(false);
    }
};

const submitVendorResponse = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
        // ✅ Get the current logged-in vendor ID
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user?.user?.id) {
            throw new Error("Failed to retrieve user.");
        }

        // ✅ Get Merchant ID using authenticated user
        const { data: merchantData, error: merchantError } = await supabase
            .from("merchant")
            .select("id")
            .eq("merchant_profile", user.user.id)
            .single();

        if (merchantError || !merchantData?.id) {
            throw new Error("Merchant ID not found.");
        }

        const vendorId = merchantData.id;
        console.log("✅ Vendor ID Retrieved:", vendorId);

        const responseData = items.map((item) => ({
            rfq_id: item.rfq_id,
            item_id: item.id,
            vendor_id: vendorId, // ✅ Corrected vendor_id
            offered_price: item.offer_price,
            offer_quality: item.offer_quality,
            uom: item.uom_vendor,
            shipment_charges: item.shipment_charges || 0,
            custom_charges: item.custom_charges || 0,
            port_connectivity_charges: item.port_connectivity_charges || 0,
            agent_charges: item.agent_charges || 0,
            other_charges: item.other_charges || 0,
            freight_charges :item.freight_charges || 0,
            
            remarks: item.remark_charges || "",
        }));

        const { error } = await supabase.from("rfq_response").insert(responseData);
        if (error) throw error;

        console.log("✅ Vendor responses inserted successfully!");
        setSuccessMessage("Vendor responses submitted successfully!");
    } catch (error) {
        console.error("❌ Error inserting vendor responses:", error);
        setErrorMessage("Failed to submit vendor responses. Please try again.");
    } finally {
        setIsLoading(false);
    }
};

const handleSubmit = async () => {
    setIsLoading(true);
    const isUpdated = await updateAllItems(); // ✅ Step 1: Update rfq_items
    if (!isUpdated) return; // ❌ Stop if update fails
    await submitVendorResponse(); // ✅ Step 2: Insert into rfq_response
};


  console.log("RFQ ID:", id);

  const handleChange = (e:any, itemId:any) => {
    const { name, value } = e.target;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, [name]: value } : item
      )
    );
  };

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
          <RFQInfoCard rfqInfo={selectedRfq}  setRfqInfo={setSelectedRfq} />
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
                  {items.map((item: any, i: any) => (
                    <Item
                      key={i}
                      item={item}
                      handleUpdateItem={handleUpdateItem}
                      errors={errors.items?.[i] || {}}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <Separator />
          {items.map((item: any, i: any) => (
            <>
              <div
                key={item.id}
                className="flex gap-4 items-center mx-auto mt-10"
              >
                <div>
                  <label
                    htmlFor="freight_charges"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Freight Charges
                  </label>
                  <input
                    type="text"
                    id="freight_charges"
                    value={item.freight_charges || ""}
                    onChange={(e) => handleChange(e, item.id)}
                    name="freight_charges"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="custom_charges"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Customs Charges
                  </label>

                  <input
                    type="text"
                    id="custom_charges"
                    value={item.custom_charges || ""}
                    onChange={(e) => handleChange(e, item.id)}
                    name="custom_charges"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="shipment_charges"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Shipment CHarges
                  </label>
                  <input
                    type="text"
                    id="shipment_charges"
                    value={item.shipment_charges || ""}
                    onChange={(e) => handleChange(e, item.id)}
                    name="shipment_charges"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="port_connectivity_charges"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Port Connectivity CHarges
                  </label>
                  <input
                    type="text"
                    id="port_connectivity_charges"
                    value={item.port_connectivity_charges || ""}
                    onChange={(e) => handleChange(e, item.id)}
                    name="port_connectivity_charges"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="agent_charges"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Agent Charges
                  </label>
                  <input
                    type="text"
                    id="agent_charges"
                    value={item.agent_charges || ""}
                    onChange={(e) => handleChange(e, item.id)}
                    name="agent_charges"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="other_charges"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Other CHarges
                  </label>
                  <input
                    type="text"
                    id="other_charges"
                    value={item.other_charges || ""}
                    onChange={(e) => handleChange(e, item.id)}
                    name="other_charges"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="remark_charges"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Remark
                  </label>
                  <input
                    type="text"
                    id="remark_charges"
                    value={item.remark_charges || ""}
                    onChange={(e) => handleChange(e, item.id)}
                    name="remark_charges"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John"
                    required
                  />
                </div>
              </div>
            </>
          ))}

          <div className="text-right mt-3">
            <Button
              className="bg-green-600 mt-3 mx-2"
              onClick={() => handleSubmit()}
            >
              {" "}
              {isloading ? <Loader2Icon className="animate-spin mr-2" /> : null}
              {isloading ? "Sending for delivery" : "Send For delivery"}
            </Button>
            <Button className="bg-blue-600 mt-3 mx-2">Print Invoice</Button>
          </div>
        </div>
      </main>
    </>
  );
}
