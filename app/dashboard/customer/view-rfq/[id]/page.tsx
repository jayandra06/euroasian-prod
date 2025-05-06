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
import Image from "next/image";
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
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { set } from "react-hook-form";

interface RfqData {
  supply_port: string;
  lead_date: string;
  valid_date: string;
  imo_no: string;
  vessel_name: string;
  hull_no: string;
  equipement_tag: string;
  brand: string;
  model: string;
  category: string;
  drawing_number: string;
  serial_no: string;
  currentTag: string;
  offer_quality: string;
  remarks: string;
  [key: string]: any;
  forwad_to_director: boolean;
}

// @ts-ignore
function RFQInfoCard({ rfqData }: { rfqData: RfqData }) {
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
              {/* Row 1 */}
              <div className="flex flex-col col-span-1">
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
              <div className="flex flex-col col-span-1">
              <Label htmlFor="vesselExName">Vessel Ex Name</Label>
              <Input
                type="text"
                id="vessel_ex_name"
                placeholder="Enter Vessel Ex Name"
                value={rfqData.vessel_ex_name || ""}
                disabled
              />
              </div>
              <div className="flex flex-col col-span-1">
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
              <div className="flex flex-col col-span-1">
              <Label htmlFor="supplyPort">
                Supply Port <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="supplyport"
                value={rfqData?.supply_port || ""}
                disabled
              />
              </div>

              {/* Row 2 */}
              <div className="flex flex-col col-span-1">
              <Label htmlFor="equipementTag">Equipment Tags</Label>
              <Input
                type="text"
                id="equipement_tag"
                placeholder="Enter Equipment Tags"
                value={rfqData.equipement_tag}
                className="mt-2"
                disabled
              />
              </div>
              <div className="flex flex-col col-span-1">
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
              <div className="flex flex-col col-span-1">
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
              <div className="flex flex-col col-span-1">
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

              {/* Row 3 */}
              <div className="flex flex-col col-span-1">
              <Label htmlFor="hullNo">
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
              <div className="flex flex-col col-span-1">
              <Label htmlFor="drawingNumber">Drawing Number</Label>
              <Input
                type="text"
                id="drawing_number"
                placeholder="Enter Drawing Number"
                value={rfqData.drawing_number}
                className="mt-2"
                disabled
              />
              </div>
              <div className="flex flex-col col-span-1">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                type="text"
                id="serial_number"
                placeholder="Enter Serial No"
                value={rfqData.serial_no}
                className="mt-2"
                disabled
              />
              </div>
              <div className="flex flex-col col-span-1">
              <Label htmlFor="offerQuality">
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

              {/* Row 4 */}
              <div className="flex flex-col col-span-1">
              <Label htmlFor="createDate">Create Date</Label>
              <Input
                type="date"
                id="create_date"
                value={rfqData?.create_date?.split("T")[0] || ""}
                disabled
              />
              </div>
              <div className="flex flex-col col-span-1"></div>
              <Label htmlFor="leadDate">Lead Date</Label>
              <Input
                type="date"
                className="mt-2"
                id="leadDate"
                value={rfqData?.lead_date?.split("T")[0] || ""}
                disabled
              />
              </div>
              <div className="flex flex-col col-span-1">
              <Label htmlFor="remarks">General Remarks</Label>
              <Input
                type="text"
                id="remarks"
                placeholder="Enter Remarks"
                value={rfqData.remarks}
                className="mt-2"
                disabled
              />
              </div>
              <div className="flex flex-col col-span-1 items-center">
              <Label htmlFor="upload">Uploaded Image</Label>
              {rfqData?.upload ? (
                <div className="relative w-32 h-32 mt-2 overflow-hidden rounded-md shadow-md">
                <Image
                  src={rfqData.upload}
                  alt="Uploaded File"
                  layout="fill"
                  objectFit="cover"
                />
                </div>
              ) : (
                <p className="mt-2">No file uploaded</p>
              )}
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </>
  );
}

// @ts-ignore
function Item({ item, index }: { item: any; index: number }) {
  return (
    <>
      <TableRow key={item.id}>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>
          <div className="col-span-4 ">
            <Input
              type="text"
              placeholder="impa_no"
              value={item.item.impa_no}
              name="impa_no"
              disabled
            />
          </div>
          <div className="col-span-1 mt-2">
            <Textarea
              placeholder="Enter Item Description.."
              value={item.item.description}
              name="description"
              disabled
            />
          </div>
        </TableCell>
        <TableCell colSpan={6}>
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
                placeholder="dimension"
                value={item.item.dimensions}
                name="dimensions"
                disabled
              />
            </div>
          </div>
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

interface Approval {
  vendor_key: string;
  status: "approved" | "pending" | "rejected" | "requested"; // More specific if possible
}
export default function ViewRfq() {
  const params = useParams();
  const id = params.id;
  const supabase = createClient();
  const [rfqData, setRfqData] = useState<any>(null);
  const [rfqItems, setRfqItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const [vendors, setVendors] = useState<any[]>([]);

  const [vendorApprovalStatus, setVendorApprovalStatus] = useState<
    Record<string, Approval>
  >({});
  const [selectedVendorNumber, setSelectedVendorNumber] = useState<
    number | null
  >(null);
  const [currentVendorCharges, setCurrentVendorCharges] =
    useState<ChargeData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMem, setIsMem] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [charges, setCharges] = useState<ChargeData[] | []>([]);
  const [approvedVendorId, setApprovedVendorId] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<{
    [vendorId: string]: string;
  }>({});
  const [rfqDecision, setRfqDecision] = useState<RfqDecision[]>([]);
  const [enableConfirmDelivery, setEnableConfirmDelivery] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [showRequestButton, setShowRequestButton] = useState(false);
  const [initiator_role, setInitiatorRole] = useState<string | null>(null);
  const [isforwardToDirector, setIsForwardToDirector] = useState(false);
  const [directorEmails, setDirectorEmails] = useState<string[]>([]);

  interface ChargeData {
    vendor_id: string;
    freight_charges: string;
    custom_charges: string;
    shipment_charges: string;
    port_connectivity_charges: string;
    other_charges: string;
    remark_charges: string;
    [key: string]: string;
  }

  interface RfqDecision {
    rfq_id: string | string[] | undefined;
    vendor_id: string;
    status: "selected" | "rejected";
    reason: string;
  }

  interface RfqItem {
    vendor_id: string;
    // Add other fields as necessary
  }
  type ApprovalEntry = {
    role: string;
    status: string;
    email?: string;
    created_at: string;
  };

  useEffect(() => {
    if (vendors.length > 0 && !selectedVendor) {
      setSelectedVendor(vendors[0].vendor_id);
    }
  }, [vendors]);

  const checkApprovalStatus = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("Failed to fetch user", userError);
        return;
      }

      setUser(user);

      const userId = user?.id;
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const [profileResponse, rfqResponse, approvalResponse] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("user_role")
            .eq("id", userId)
            .single(),
          supabase
            .from("rfq")
            .select("initiator_role, forward_to_director, vessel_id")
            .eq("id", id)
            .single(),
          supabase
            .from("rfq_approval_flow")
            .select("role, status,email, created_at")
            .eq("rfq_id", id)
            .order("created_at", { ascending: true }),
        ]);

      const vesselId = rfqResponse.data?.vessel_id;

      let directorEmails = [];

      if (vesselId) {
        const directorAssignmentRes = await supabase
          .from("director_assignment")
          .select("director_id")
          .eq("vessel_id", vesselId);

        const directorIds = directorAssignmentRes.data?.map(
          (d) => d.director_id
        );
        console.log("Director IDs:", directorIds);
        if (directorIds && directorIds.length > 0) {
          const directorRes = await supabase
            .from("director")
            .select("email, id")
            .in("id", directorIds);

          directorEmails = directorRes.data?.map((d) => d.email) || [];
          setDirectorEmails(directorEmails);
        }
      }

      const { data: profileData } = profileResponse;
      const { data: rfqData } = rfqResponse as { data: RfqData | null };
      const { data: approvalData } = approvalResponse as {
        data: ApprovalEntry[];
      };

      console.log("Profile Data:", profileData);
      console.log("RFQ Data:", rfqData);
      console.log("Approval Data:", approvalData);

      const currentUserRole = profileData?.user_role || null;
      const initiatorRole = rfqData?.initiator_role || null;

      setInitiatorRole(initiatorRole);

      if (!initiatorRole) {
        console.error("Initiator role not found");
        return;
      }

      setUserRole(currentUserRole);

      setIsForwardToDirector(rfqData?.forward_to_director || false);

      const approvalFlow = [];
      if (initiatorRole === "manager") {
        approvalFlow.push("manager", "branch_admin", "customer");
      } else if (initiatorRole === "branch_admin") {
        approvalFlow.push("branch_admin", "customer");
      } else if (initiatorRole === "customer") {
      }

      if (rfqData?.forward_to_director) {
        approvalFlow.push("director", "customer");
      }

      let nextRole = null;

      for (const role of approvalFlow) {
        if (role === "director") {
          const totalDirectors = directorEmails.length;
          const approvedOrRequested =
            approvalData?.filter(
              (d) =>
                d.role === "director" &&
                directorEmails.includes(d.email) &&
                (d.status === "requested" || d.status === "approved")
            ).length || 0;

          if (approvedOrRequested < totalDirectors) {
            nextRole = "director";
            break;
          }
        } else {
          const roleApproved = approvalData?.some(
            (d) =>
              d.role === role &&
              (d.status === "requested" || d.status === "approved")
          );
          if (!roleApproved) {
            nextRole = role;
            break;
          }
        }
      }

      console.log("Next Role to Approve:", nextRole);

      if (
        currentUserRole === nextRole ||
        (nextRole === "director" && directorEmails.includes(user.email))
      ) {
        setShowRequestButton(true);
      } else {
        setShowRequestButton(false);
      }

      // console.log("=== DEBUG START ===");
      // console.log("Approval Flow:", approvalFlow);
      // console.log("Director Emails:", directorEmails);
      // console.log("Approval Data:", approvalData);
      // console.log("Current User Role:", currentUserRole);
      // console.log("Initiator Role:", initiatorRole);

      const allApproved = approvalFlow.every((role) => {
        if (role === "director") {
          const totalDirectors = directorEmails.length;

          const approvedDirectors =
            approvalData?.filter((d) => {
              const match =
                d.role === "director" &&
                d.status === "approved" &&
                directorEmails
                  .map((email) => email.toLowerCase().trim())
                  .includes(d.email?.toLowerCase().trim());

              if (match) {
                console.log(
                  `✅ Approved by Director: ${d.email} (status: ${d.status})`
                );
              } else if (d.role === "director") {
                console.log(
                  `❌ Not counted - Director: ${d.email}, Status: ${d.status}`
                );
              }

              return match;
            }).length || 0;

          console.log(
            `Approved Directors: ${approvedDirectors} / ${totalDirectors}`
          );

          return approvedDirectors === totalDirectors;
        } else {
          const roleApproved = approvalData?.some(
            (d) => d.role === role && d.status === "requested"
          );

          console.log(`${roleApproved ? "✅" : "❌"} Role Approved: ${role}`);

          return roleApproved;
        }
      });

      console.log("Final All Approved:", allApproved);

      if (allApproved && currentUserRole === initiatorRole) {
        console.log("🎉 All approvals done. Enabling delivery.");
        setEnableConfirmDelivery(true);
      } else {
        console.log("🚫 Not all approvals done or role mismatch.");
        setEnableConfirmDelivery(false);
      }
      console.log("=== DEBUG END ===");
    } catch (error) {
      console.error("An unexpected error occurred", error);
    }
  };

  useEffect(() => {
    if (id) {
      checkApprovalStatus();
    }
  }, [id]);

  useEffect(() => {
    const fetchRfqDecision = async () => {
      const { data, error } = await supabase
        .from("rfq_decision")
        .select("*")
        .eq("rfq_id", id); // rfqId from params

      if (error) {
        console.error("Error fetching RFQ decision:", error);
        return;
      }

      const approved = data.find((d) => d.status === "selected");
      if (approved) setApprovedVendorId(approved.vendor_id);

      const rejections = data.filter((d) => d.status === "rejected");
      const reasonsMap: Record<string, string> = {};
      rejections.forEach((d) => {
        reasonsMap[d.vendor_id] = d.reason || "";
      });
      setRejectionReasons(reasonsMap);
    };

    fetchRfqDecision();
  }, [id]);
  const handleForwardToDirector = async () => {
    try {
      // 1. Update the RFQ to mark it as forwarded to director
      const { error: updateError } = await supabase
        .from("rfq")
        .update({ forward_to_director: true })
        .eq("id", id);

      if (updateError) throw updateError;

      // 2. If user is customer, record their approval and vendor decision
      if (userRole === "customer") {
        const { error: approvalError } = await supabase
          .from("rfq_approval_flow")
          .insert({
            rfq_id: id,
            action_by: user?.id,
            status: "requested",
            role: "customer",
          });

        if (approvalError) throw approvalError;

        console.log("Customer request saved successfully.");

        if (approvedVendorId) {
          const { error: vendorError } = await supabase
            .from("rfq_decision")
            .insert({
              rfq_id: id,
              vendor_id: approvedVendorId,
              status: "selected",
              action_by: user?.id,
            });

          if (vendorError) throw vendorError;

          console.log("Customer's vendor selection saved successfully.");
        }
      }

      // 3. Fetch director emails assigned to this RFQ’s vessel
      const rfqRes = await supabase
        .from("rfq")
        .select("vessel_id")
        .eq("id", id)
        .single();

      const vesselId = rfqRes.data?.vessel_id;

      if (!vesselId) throw new Error("Vessel ID not found for RFQ");

      const directorAssignments = await supabase
        .from("director_assignment")
        .select("director_id")
        .eq("vessel_id", vesselId);

      const directorIds =
        directorAssignments.data?.map((d) => d.director_id) || [];

      const directorRes = await supabase
        .from("director")
        .select("id, email")
        .in("id", directorIds);

      const directorEmails = directorRes.data?.map((d) => d.email) || [];

      if (directorEmails.length === 0) {
        throw new Error("No directors assigned to this vessel.");
      }

      // 4. Insert approval flow entry for each director (with email)
      const approvalInserts = directorEmails.map((email) => ({
        rfq_id: id,
        action_by: null, // director has not acted yet
        status: "pending",
        role: "director",
        email: email,
      }));

      const { error: directorInsertError } = await supabase
        .from("rfq_approval_flow")
        .insert(approvalInserts);

      if (directorInsertError) throw directorInsertError;

      // 5. Send confirmation emails to all directors
      const emailResponse = await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfqId: id,
          directorEmails, // send all director emails
        }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error(
          "Failed to send confirmation email:",
          emailData.error || emailData.message
        );
      } else {
        toast.success("Confirmation email sent to all directors.");
      }

      // 6. Recalculate status
      checkApprovalStatus();
    } catch (err) {
      console.error("Failed to forward to director:", err);
      toast.error("Something went wrong while forwarding to director.");
    }
  };

  useEffect(() => {
    const fetchVendorsWithStatus = async () => {
      // Step 1: Get vendor_ids from rfq_supplier
      const { data: rfqSuppliers, error: rfqSupplierError } = await supabase
        .from("rfq_supplier")
        .select("vendor_id")
        .eq("rfq_id", id);

      if (rfqSupplierError) {
        console.error("Error fetching RFQ suppliers:", rfqSupplierError);
        return;
      }

      const vendorIds = rfqSuppliers.map((r) => r.vendor_id);

      // Step 2: Fetch merchants
      const { data: merchants, error: merchantError } = await supabase
        .from("merchant")
        .select("id, name")
        .in("id", vendorIds);

      if (merchantError) {
        console.error("Error fetching merchants:", merchantError);
        return;
      }

      // Step 3: Fetch responses
      const { data: responses, error: responseError } = await supabase
        .from("rfq_response")
        .select("vendor_id")
        .eq("rfq_id", id);

      if (responseError) {
        console.error("Error fetching RFQ responses:", responseError);
        return;
      }

      const respondedVendorIds = responses.map((r) => r.vendor_id);

      // Step 4: Set vendor info
      const vendorDetails = merchants.map((m) => ({
        vendor_id: m.id,
        name: m.name,
        hasResponded: respondedVendorIds.includes(m.id),
      }));

      setVendors(vendorDetails);

      // Step 5: Fetch charges and set separately
      const { data: chargeData, error: chargeError } = await supabase
        .from("rfq_response_item_charges")
        .select("*")
        .eq("rfq_response_id", id);

      if (chargeError) {
        console.error("Error fetching charges:", chargeError);
        return;
      }

      setCharges(chargeData ?? []);

      console.log("chargeData", chargeData);
    };

    fetchVendorsWithStatus();
  }, [id]);

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
          const itemDetails = itemsData.find(
            (item) => item.id === response.item_id
          );
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

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      const { data: approvals, error } = await supabase
        .from("rfq_approvals")
        .select("vendor_key, status")
        .eq("rfq_id", id);

      if (!error && approvals) {
        const approvalMap: Record<string, Approval> = approvals.reduce(
          (acc, approval) => {
            acc[approval.vendor_key] = {
              vendor_key: approval.vendor_key,
              status: approval.status as "approved" | "pending" | "rejected",
            };
            return acc;
          },
          {} as Record<string, Approval>
        );
        setVendorApprovalStatus(approvalMap);
      }
    };

    if (id) fetchApprovalStatus();
  }, [id]);

  const handleConfirmDelivery = async (approvalStatus = "approved") => {
    if (userRole === "customer" && !approvedVendorId) {
      toast.error("Please select one vendor for approval.");
      return;
    }

    let decisions: {
      rfq_id: string;
      vendor_id: string;
      status: string;
      reason: string;
      action_by: string;
    }[] = [];

    if (userRole === "customer") {
      decisions = vendors
        .map(({ vendor_id }) => {
          const isSelected = vendor_id === approvedVendorId;

          if (
            !isSelected &&
            (!rejectionReasons[vendor_id] ||
              rejectionReasons[vendor_id].trim() === "")
          ) {
            toast(`Please provide a rejection reason for vendor ${vendor_id}`);
            return undefined;
          }

          return {
            rfq_id: id as string,
            vendor_id: vendor_id as string,
            status: isSelected ? "selected" : "rejected",
            reason: isSelected ? "" : rejectionReasons[vendor_id],
            action_by: user?.id as string,
          };
        })
        .filter(
          (
            d
          ): d is {
            rfq_id: string;
            vendor_id: string;
            status: string;
            reason: string;
            action_by: string;
          } => Boolean(d)
        );
    }

    try {
      if (userRole === "customer") {
        // 1. Insert vendor decisions
        const { error: decisionError } = await supabase
          .from("rfq_decision")
          .insert(decisions);
        if (decisionError) throw decisionError;

        // 2. Insert approval flow
        const { error: approvalError } = await supabase
          .from("rfq_approval_flow")
          .insert({
            rfq_id: id,
            action_by: user?.id,
            status: approvalStatus,
            role: "customer",
          });
        if (approvalError) throw approvalError;
      }

      // 3. Update RFQ status
      const { error: rfqStatusError } = await supabase
        .from("rfq")
        .update({ status: "ordered" })
        .eq("id", id);
      if (rfqStatusError) throw rfqStatusError;

      // 4. Update remaining suppliers as canceled
      const { error: remainingSuppliersError } = await supabase
        .from("rfq_supplier")
        .update({ status: "canceled" })
        .match({ rfq_id: id })
        .neq("vendor_id", approvedVendorId);
      if (remainingSuppliersError) throw remainingSuppliersError;

      // 4. Update rfq_supplier for the accepted vendor
      if (approvedVendorId) {
        const { error: supplierError } = await supabase
          .from("rfq_supplier")
          .update({ status: "ordered_confirm" })
          .match({ rfq_id: id, vendor_id: approvedVendorId });
        if (supplierError) throw supplierError;
      }

      toast.success("Delivery confirmed successfully.");
    } catch (err) {
      console.error("Error during RFQ processing:", err);
      toast.success("Something went wrong. Please try again.");
    }
  };

  const handleRequestForApproval = async () => {
    try {
      if (userRole === initiator_role) {
        // Initiator: collect and insert vendor decisions
        if (!approvedVendorId) {
          toast.error("Please select one vendor for approval.");
          return;
        }

        const decisions = vendors
          .map(({ vendor_id }) => {
            const isSelected = vendor_id === approvedVendorId;

            if (
              !isSelected &&
              (!rejectionReasons[vendor_id] ||
                rejectionReasons[vendor_id].trim() === "")
            ) {
              return null;
            }

            return {
              rfq_id: id,
              vendor_id,
              status: isSelected ? "selected" : "rejected",
              reason: isSelected ? "" : rejectionReasons[vendor_id],
              action_by: user?.id,
            };
          })
          .filter(
            (
              d
            ): d is {
              rfq_id: string;
              vendor_id: string;
              status: string;
              reason: string;
              action_by: string;
            } => Boolean(d)
          );

        const { error: decisionError } = await supabase
          .from("rfq_decision")
          .insert(decisions);
        if (decisionError) throw decisionError;
      } else {
        // Non-initiator: fetch existing approval flows
        const { data: flows, error: fetchError } = await supabase
          .from("rfq_approval_flow")
          .select("id, role, status, created_at")
          .eq("rfq_id", id)
          .order("created_at", { ascending: true });

        if (fetchError) throw fetchError;
        if (!flows || flows.length === 0) {
          toast.error("No approval flow found to update.");
          return;
        }

        // Update the most recent flow’s status to “approved”
        const lastFlow = flows[flows.length - 1];
        const { error: updateError } = await supabase
          .from("rfq_approval_flow")
          .update({ status: "approved" })
          .eq("id", lastFlow.id);

        if (updateError) throw updateError;
      }

      // In both cases, insert a new “requested” flow for the current user
      const { error: approvalError } = await supabase
        .from("rfq_approval_flow")
        .insert({
          rfq_id: id,
          action_by: user?.id,
          status: "requested",
          role: userRole,
        });
      if (approvalError) throw approvalError;

      toast.success("Request for approval sent successfully.");
    } catch (err) {
      console.error("Error during RFQ processing:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleVendorClick = (vendorId: string, vendorNumber: number) => {
    setSelectedVendor(vendorId);
    setSelectedVendorNumber(vendorNumber);
    console.log("charges array", charges);
    console.log(
      "match found:",
      charges.some((charge) => charge.vendor_id === selectedVendor)
    );

    console.log("selected vendor", vendorId, vendorNumber);
    // Filter RFQ items by selected vendor
    const vendorResponses = rfqItems.filter(
      (item: RfqItem) => item.vendor_id === vendorId
    );
    setFilteredItems(vendorResponses);

    const vendorCharge = charges.find(
      (charge) => charge.vendor_id === vendorId
    );

    if (vendorCharge) {
      setCurrentVendorCharges(vendorCharge);
      // Set the current vendor's charges
    } else {
      setCurrentVendorCharges(null); // If no charges found for the vendor
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
      <main className="grid pb-20">
        {" "}
        {/* Added padding-bottom to prevent overlap */}
        <div className="pt-4 max-w-6xl w-full grid justify-self-center">
          <h1 className="text-3xl font-bold">View RFQ</h1>
          <h3 className="mt-2"></h3>
        </div>
        <main className="grid justify-self-center max-w-6xl w-full md:grid-cols-3 gap-4 mt-4">
          <RFQInfoCard rfqData={rfqData} />
        </main>
        <div className="flex w-full max-w-6xl justify-self-center items-center mt-8">
          <h1 className="text-xl font-bold">Choose vendors</h1>
        </div>
        <div className="relative flex justify-center w-full mx-auto mt-6 bg-white rounded-xl px-4 py-6 shadow-md border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-6 items-start justify-center">
            {vendors
              .filter((vendor) => {
                const adminId =
                  process.env.ADMIN_MERCHANT_ID ||
                  "cc331901-9a8f-4d07-a4c5-7605cfbbdb6f";
                return !(vendor.vendor_id === adminId && !vendor.hasResponded);
              })
              .map(({ vendor_id, name, hasResponded }, index) => {
                const isSelected = selectedVendor === vendor_id;
                const isApproved = approvedVendorId === vendor_id;
                const isRejected =
                  approvedVendorId && approvedVendorId !== vendor_id;

                return (
                  <div
                    key={vendor_id}
                    className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl shadow-sm w-64"
                  >
                    {/* Vendor Button */}
                    <button
                      onClick={() =>
                        rfqItems.length > 0 &&
                        handleVendorClick(vendor_id, index + 1)
                      }
                      disabled={rfqItems.length === 0 && isViewMode}
                      className={`w-full relative z-10 px-5 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-full flex items-center justify-center gap-2
            ${
              isSelected
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            }
            ${hasResponded ? "ring-2 ring-green-500" : ""}
            ${rfqItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
            border border-gray-300`}
                    >
                      <span>{name}</span>
                      {hasResponded && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                          Responded
                        </span>
                      )}
                      {isSelected && (
                        <motion.div
                          layoutId="tab-indicator"
                          className="absolute inset-0 rounded-full border-2 border-blue-700 shadow-inner z-[-1]"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>

                    {/* Select for Approval */}
                    <button
                      disabled={isViewMode}
                      onClick={() => setApprovedVendorId(vendor_id)}
                      className={`text-sm mt-2 px-4 py-1.5 rounded-full  ${
                        isViewMode ? "opacity-50 cursor-not-allowed" : ""
                      } ${
                        isApproved
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 hover:bg-green-100"
                      }`}
                    >
                      {isApproved ? "Approved" : "Select for Approval"}
                    </button>

                    {/* Rejection Reason */}
                    {isRejected && (
                      <textarea
                        disabled={isViewMode}
                        className="mt-2 w-full text-sm p-2 border border-red-300 rounded-md bg-red-50 text-red-800"
                        placeholder="Reason for rejection"
                        value={rejectionReasons[vendor_id] || ""}
                        onChange={(e) =>
                          setRejectionReasons((prev) => ({
                            ...prev,
                            [vendor_id]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
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
                    filteredItems.map((item, index) => (
                      <Item key={item.id} item={item} index={index} />
                    ))
                  ) : selectedVendor ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-4">
                        No items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    rfqItems.map((item, index) => (
                      <Item key={item.id} item={item} index={index} />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <Separator />

          <div className="flex gap-4 items-center mx-auto mt-10 mb-10">
            {/* Check if selectedVendor exists in the charges array */}
            {selectedVendor &&
              charges.some((charge) => charge.vendor_id === selectedVendor) && (
                <>
                  {[
                    { label: "Freight Charges", key: "freight_charges" },
                    { label: "Customs Charges", key: "custom_charges" },
                    { label: "Shipment Charges", key: "shipment_charges" },
                    {
                      label: "Port Connectivity Charges",
                      key: "port_connectivity_charges",
                    },
                    { label: "Other Charges", key: "other_charges" },
                    { label: "Remark", key: "remark_charges" },
                  ].map(({ label, key }) => {
                    // Find the charge data for the selected vendor
                    const vendorCharge = charges.find(
                      (c) => c.vendor_id === selectedVendor
                    );

                    return (
                      <div key={key}>
                        <label
                          htmlFor={key}
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {label}
                        </label>
                        <input
                          disabled
                          type="text"
                          id={key}
                          value={
                            vendorCharge
                              ? vendorCharge[key as keyof ChargeData] || ""
                              : ""
                          }
                          onChange={(e) => {
                            const updatedCharges = charges.map((c) =>
                              c.vendor_id === selectedVendor
                                ? { ...c, [key]: e.target.value }
                                : c
                            );
                            setCharges(updatedCharges);
                          }}
                          name={key}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder={label}
                          required
                        />
                      </div>
                    );
                  })}
                </>
              )}
          </div>

          <div className="border-t border-gray-300 pt-4 fixed bottom-0 left-[calc(250px)] right-0 bg-white shadow-lg shadow-blue-500/50 px-6 z-50">
            {userRole === "customer" && isforwardToDirector && (
              <div>
                <p className="text-gray-700 font-medium">
                  {enableConfirmDelivery
                    ? "Director approved."
                    : "Waiting for Director's approval."}
                </p>
              </div>
            )}
            <div className="text-right mt-3 space-x-4">
              {userRole === "customer" && !isforwardToDirector && (
                <button
                  className="px-4 py-2 my-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => {
                    handleForwardToDirector();
                  }}
                >
                  Forward to Director
                </button>
              )}

              {enableConfirmDelivery ? (
                <button
                  className={`px-4 py-2 my-4 rounded-md ${
                    enableConfirmDelivery
                      ? "bg-green-600 text-white"
                      : "bg-gray-400 text-gray-200"
                  }`}
                  onClick={() => {
                    handleConfirmDelivery("approved");
                  }}
                >
                  Confirm Order
                </button>
              ) : null}

              {showRequestButton ? (
                <button
                  className={`mt-4 px-4 py-2 my-4  rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700`}
                  onClick={() => {
                    handleRequestForApproval();
                  }}
                >
                  Request for Approval
                </button>
              ) : null}

              <Button className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md shadow">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
