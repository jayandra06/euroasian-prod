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
import { Loader2Icon } from "lucide-react";
import ErrorToast from "@/components/ui/errorToast";
import SuccessToast from "@/components/ui/successToast";
import Image from "next/image";

import { useParams, useSearchParams } from "next/navigation";
import { create } from "domain";
import { set } from "react-hook-form";

// @ts-ignore
function RFQInfoCard({
  rfqInfo,

  setRfqInfo,
}: {
  rfqInfo: any;

  setRfqInfo: any;
}) {
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
      <div className="w-[950px] max-w-7xl mx-auto  p-6 bg-white shadow-lg rounded-lg">
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
                <Label htmlFor="Vessel Ex Name">
                  Vessel Ex Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="vessel_ex_name"
                  placeholder="vessel ex name"
                  value={rfqInfo?.vessel_name}
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
                <Label htmlFor="model">
                  Hull Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="hull_number"
                  placeholder="hull_number"
                  value={rfqInfo?.model}
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
                <Label htmlFor="leadDate">Lead Date</Label>
                <Input
                  type="date"
                  className="mt-2"
                  id="leadDate"
                  value={rfqInfo?.lead_date?.split("T")[0] || ""}
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
                <Label htmlFor=" Genereal Remarks">General Remarks</Label>
                <Input
                  type="text"
                  id="remarks"
                  placeholder="remarks"
                  value={rfqInfo?.remarks || ""}
                  className="mt-2"
                  disabled
                />
              </div>
              <div className="flex flex-col items-center">
                {" "}
                {/* Center the image and label */}
                <Label htmlFor="upload">Uploaded Image</Label>{" "}
                {/* More descriptive label */}
                {rfqInfo?.upload ? (
                  <div className="relative w-32 h-32 mt-2 overflow-hidden rounded-md shadow-md">
                    {/* Fixed square container with overflow hidden and styling */}
                    <Image
                      src={rfqInfo.upload}
                      alt="Uploaded File"
                      layout="fill" // Make the image fill the container
                      objectFit="cover" // Maintain aspect ratio and cover the container
                    />
                  </div>
                ) : (
                  <p className="mt-2">No file uploaded</p>
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
function Item({ index, item, handleUpdateItem, errors }) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    handleUpdateItem(item.id, name, value);
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{index + 1}</TableCell>{" "}
        {/* Auto-incrementing Item Number */}
        <TableCell colSpan={2}>
          <div className="col-span-2 ">
            <Input
              type="text"
              placeholder="impa_no"
              value={item.impa_no}
              name="impa_no"
              disabled // Disabled
            />
            {errors.part_no && (
              <p className="text-red-500 text-sm">{errors.part_no}</p>
            )}
          </div>{" "}
          {/* Description spans two columns */}
          <div className="col-span-1 mt-2">
            <Textarea
              placeholder="Item Description.."
              value={item.description}
              name="description"
              disabled // Disabled
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
        </TableCell>
        <TableCell colSpan={5}>
          {" "}
          {/* Removed rowSpan */}
          <div className="grid gap-2 grid-cols-4 items-center">
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Part No."
                value={item.item_part_no}
                name="item_part_no"
                disabled // Disabled
              />
              {errors.part_no && (
                <p className="text-red-500 text-sm">{errors.part_no}</p>
              )}
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Position No."
                value={item.item_position_no}
                name="item_position_no"
                disabled // Disabled
              />
              {errors.position_no && (
                <p className="text-red-500 text-sm">{errors.position_no}</p>
              )}
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Alternate Part No."
                value={item.alternate_part_no}
                name="alternate_part_no"
                disabled // Disabled
              />
              {errors.alternative_part_no && (
                <p className="text-red-500 text-sm">
                  {errors.alternative_part_no}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                placeholder="Dimension"
                value={item.dimensions}
                name="dimension"
                disabled // Disabled
              />
              {errors.req_qty && (
                <p className="text-red-500 text-sm">{errors.req_qty}</p>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Input
            type="number"
            placeholder="offered quanity"
            value={item.req_qty}
            name="req_qty"
            disabled
            onChange={handleChange}
          />
          {errors.req_qty && (
            <p className="text-red-500 text-sm">{errors.req_qty}</p>
          )}
        </TableCell>
        <TableCell>
          <Input
            type="text"
            placeholder=""
            value={item.uom}
            name="uom"
            disabled
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
            placeholder="Offered Price"
            value={item.offered_price}
            name="offer_price"
            onChange={handleChange} // Enabled for editing
            className="w-[80px]"
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
  const [charges, setCharges] = useState({
    freight_charges: "",
    custom_charges: "",
    shipment_charges: "",
    port_connectivity_charges: "",
    other_charges: "",
    remark_charges: "",
  });

  const [viewMode, setViewMode] = useState(false);

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
  useEffect(() => {
    const supabase = createClient();

    const checkResponseExist = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user?.id) {
          throw new Error("Failed to retrieve user.");
        }

        const userId = userData.user.id;

        const { data: merchant, error: merchantError } = await supabase
          .from("merchant")
          .select("id")
          .eq("merchant_profile", userId)
          .single();

        if (merchantError || !merchant?.id) {
          throw new Error("Merchant ID not found.");
        }

        const vendorId = merchant.id;

        const { data: response, error: responseError } = await supabase
          .from("rfq_response")
          .select("*")
          .eq("rfq_id", id)
          .eq("vendor_id", vendorId)
          .single();

        if (responseError) {
          console.error("Error fetching RFQ response:", responseError.message);
        }
        if (response) {

          setViewMode(true);
          // Fetch the items associated with the RFQ
          const { data: items, error: itemsError } = await supabase
            .from("rfq_items")
            .select("*")
            .eq("rfq_id", id);

          if (itemsError) throw itemsError;

          console.log("items ", items);
          // Combine response data with items data
            const combinedData = items.map((item) => ({
            ...item, // Spread item data
            ...response, // Spread response data
            uom_vendor: response.uom ,
            uom:item.uom
            }));

          console.log("combinedData ", combinedData);
          // Set the combined data in state
            setItems(combinedData);
            const { data: rfqCharges, error: rfqChargesError } = await supabase
            .from("rfq_response_item_charges")
            .select("*")
            .eq("rfq_response_id", id)
            .eq("vendor_id", vendorId)
            .single();
            if (rfqChargesError) throw rfqChargesError;

            setCharges({
            shipment_charges: rfqCharges?.shipment_charges || "",
            custom_charges: rfqCharges?.custom_charges || "",
            port_connectivity_charges: rfqCharges?.port_connectivity_charges || "",
            other_charges: rfqCharges?.other_charges || "",
            freight_charges: rfqCharges?.freight_charges || "",
            remark_charges: rfqCharges?.remark_charges || "",
            });
            console.log("charges ", rfqCharges);

        } else {
          // If no response exists, just set the items
          const { data: items, error: itemsError } = await supabase
            .from("rfq_items")
            .select("*")
            .eq("rfq_id", id);

          if (itemsError) throw itemsError;
          console.log("items ", items);

          setItems(items || []);
        }
      } catch (err) {
        console.error("Error checking RFQ response:", (err as Error).message);
      }
    };

    checkResponseExist();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    async function fetchVendorRFQs() {
      const supabase = createClient();

      try {
        // Get the current logged-in user
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const userId = user?.user?.id;

        // Fetch RFQs
        const { data: rfqs, error: rfqsError } = await supabase
          .from("rfq")
          .select("*")
          .eq("id", id);

        if (rfqsError) throw rfqsError;

        setSelectedRfq(rfqs?.[0] ?? []);
      } catch (err) {
        console.error("Error fetching RFQs:", (err as Error).message);
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
            dimensions: item.dimensions,
            impa_no: item.impa_no,
            alternative_positon_number: item.alternative_positon_number,
          })
          .eq("id", item.id)
      );

      const updateResults = await Promise.all(updatePromises);
      const failedUpdates = updateResults.filter((res) => res.error);

      if (failedUpdates.length > 0) {
        console.error("❌ Some RFQ items failed to update:", failedUpdates);
        throw new Error("Failed to update some RFQ items.");
      }

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

  const handleUpdateSupplierStatus = async () => {
    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user?.id) {
      throw new Error("Failed to retrieve user.");
    }

    const userId = userData.user.id;

    // Get vendor/merchant ID
    const { data: merchant, error: merchantError } = await supabase
      .from("merchant")
      .select("id")
      .eq("merchant_profile", userId)
      .single();

    if (merchantError || !merchant?.id) {
      throw new Error("Merchant ID not found.");
    }

    const vendorId = merchant.id;

    // Update status of rfq_supplier
    const { error: rfqSupplierStatusError } = await supabase
      .from("rfq_supplier")
      .update({ status: "completed" })
      .eq("rfq_id", id)
      .eq("vendor_id", vendorId);

    if (rfqSupplierStatusError) {
      console.error(
        "❌ Error updating RFQ supplier status:",
        rfqSupplierStatusError
      );
    } else {
      setSuccessMessage("Successfully delivered!");
    }
  };
  
  const submitVendorResponse = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();

      //update rfq status
      const { error: rfqStatusError } = await supabase
        .from("rfq")
        .update({ status: "quoted" })
        .eq("id", id);

      if (rfqStatusError) {
        console.error("❌ Error updating RFQ status:", rfqStatusError);
      }

      // ✅ Get logged-in user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user?.id) {
        throw new Error("Failed to retrieve user.");
      }

      const userId = userData.user.id;

      // ✅ Get vendor/merchant ID
      const { data: merchant, error: merchantError } = await supabase
        .from("merchant")
        .select("id")
        .eq("merchant_profile", userId)
        .single();

      if (merchantError || !merchant?.id) {
        throw new Error("Merchant ID not found.");
      }

      const vendorId = merchant.id;

      // ✅ Prepare RFQ response payload
      const rfqResponses = items.map((item) => ({
        rfq_id: item.rfq_id,
        item_id: item.id,
        vendor_id: vendorId,
        offered_price: item.offer_price,
        offer_quality: item.offer_quality,
        uom: item.uom_vendor,
      }));

      const { error: responseInsertError } = await supabase
        .from("rfq_response")
        .insert(rfqResponses);

      if (responseInsertError) throw responseInsertError;

      //update status of suppliet
      const { error: rfqSupplierStatusError } = await supabase
        .from("rfq_supplier")
        .update({ status: "quoted" })
        .eq("rfq_id", id)
        .eq("vendor_id", vendorId);

      if (rfqSupplierStatusError) {
        console.error(
          "❌ Error updating RFQ supplier status:",
          rfqSupplierStatusError
        );
      }

      // ✅ Prepare charges payload
      const chargePayload = {
        rfq_response_id: id, // TODO: Dynamically link this if needed
        vendor_id: vendorId,
        shipment_charges: charges.shipment_charges ?? 0,
        custom_charges: charges.custom_charges ?? 0,
        port_connectivity_charges: charges.port_connectivity_charges ?? 0,
        other_charges: charges.other_charges ?? 0,
        freight_charges: charges.freight_charges ?? 0,
        remark_charges: charges.remark_charges ?? "",
      };

      const { error: chargesInsertError } = await supabase
        .from("rfq_response_item_charges")
        .insert([chargePayload]);

      if (chargesInsertError) throw chargesInsertError;

      setSuccessMessage("Vendor responses submitted successfully!");
    } catch (error) {
      console.error("❌ Error submitting vendor responses:", error);
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

  const handleChange = (e: any, itemId: any) => {
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
          <RFQInfoCard rfqInfo={selectedRfq} setRfqInfo={setSelectedRfq} />
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
                  {items.map(
                    (
                      item: any,
                      i: number // Explicitly type 'i' as number for clarity
                    ) => (
                      <Item
                        key={i}
                        index={i} // Pass the index as the 'index' prop
                        item={item}
                        handleUpdateItem={handleUpdateItem}
                        errors={errors.items?.[i] || {}}
                      />
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <Separator />

          <div className="flex gap-4 items-center mx-auto mt-10">
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
                value={charges.freight_charges || ""}
                onChange={(e) =>
                  setCharges({ ...charges, freight_charges: e.target.value })
                }
                name="freight_charges"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Freight Charges"
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
                value={charges.custom_charges || ""}
                onChange={(e) =>
                  setCharges({ ...charges, custom_charges: e.target.value })
                }
                name="custom_charges"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Customs Charges"
                required
              />
            </div>
            <div>
              <label
                htmlFor="shipment_charges"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Shipment Charges
              </label>
              <input
                type="text"
                id="shipment_charges"
                value={charges.shipment_charges || ""}
                onChange={(e) =>
                  setCharges({ ...charges, shipment_charges: e.target.value })
                }
                name="shipment_charges"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Shipment Charges"
                required
              />
            </div>
            <div>
              <label
                htmlFor="port_connectivity_charges"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Port Connectivity Charges
              </label>
              <input
                type="text"
                id="port_connectivity_charges"
                value={charges.port_connectivity_charges || ""}
                onChange={(e) =>
                  setCharges({
                    ...charges,
                    port_connectivity_charges: e.target.value,
                  })
                }
                name="port_connectivity_charges"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Port Connectivity Charges"
                required
              />
            </div>

            <div>
              <label
                htmlFor="other_charges"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Other Charges
              </label>
              <input
                type="text"
                id="other_charges"
                value={charges.other_charges || ""}
                onChange={(e) =>
                  setCharges({ ...charges, other_charges: e.target.value })
                }
                name="other_charges"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Other Charges"
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
                value={charges.remark_charges || ""}
                onChange={(e) =>
                  setCharges({ ...charges, remark_charges: e.target.value })
                }
                name="remark_charges"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Remark"
                required
              />
            </div>
          </div>

          <div className="text-right mt-3">
            {!viewMode ? null:(
              <Button
                className="bg-red-600 mt-3 mx-2"
                onClick={handleUpdateSupplierStatus}
              >
                Complete Delivery
              </Button>
            )}

            {viewMode ? null : (
              <Button
                className="bg-green-600 mt-3 mx-2"
                onClick={() => handleSubmit()}
                disabled={viewMode}
              >
                {" "}
                {isloading ? (
                  <Loader2Icon className="animate-spin mr-2" />
                ) : null}
                {isloading ? "Sending Send Qutotaion" : "Send Qutotaion"}
              </Button>
            )}
             {viewMode ? null : (
            <Button className="bg-blue-600 mt-3 mx-2">Print Invoice</Button>)}
          </div>
        </div>
      </main>
    </>
  );
}
