"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useCallback, useRef } from "react"; // Import useRef
import { createClient } from "@/utils/supabase/client";
import { Pencil, Trash2 } from "lucide-react"; // Import icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import * as XLSX from "xlsx"; // Import the xlsx library

interface Vessel {
  id: string;
  imoNumber: string;
  vesselName: string;
  exVesselName?: string;
  vesselType?: string; // Added vesselType
}

function VesselCard({
  vessel,
  fetchDetails,
}: {
  vessel: Vessel;
  fetchDetails: () => void;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editImoNumber, setEditImoNumber] = useState(vessel.imoNumber);
  const [editVesselName, setEditVesselName] = useState(vessel.vesselName);
  const [editExVesselName, setEditExVesselName] = useState(
    vessel.exVesselName || ""
  );
  const [editVesselType, setEditVesselType] = useState(vessel.vesselType || ""); // Added state for vesselType
  const [updating, setUpdating] = useState(false); // State for update loading
  const [deleting, setDeleting] = useState(false); // State for delete loading
  const [userId, setUserId] = useState<string | null>(null);

 

  async function handleDeleteVessel() {
    const supabase = createClient();
    setDeleting(true);

    try {
      const { error } = await supabase
        .from("vessel_management")
        .delete()
        .eq("id", vessel.id);

      if (error) {
        console.error("Delete error:", error);
      } else {
        fetchDetails(); // Refresh the list after deletion
      }
    } catch (error) {
      console.error("Unexpected error during deletion:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleting(false);
    }
  }

  async function handleUpdateVessel() {
    const supabase = createClient();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from("vessel_management")
        .update({
          imo_number: editImoNumber.trim(),
          vessel_name: editVesselName.trim(),
          ex_vessel_name: editExVesselName.trim(),
          vessel_type: editVesselType.trim(),
        })
        .eq("id", vessel.id);

      if (error) {
        console.error("Error updating vessel:", error);
      } else {
        fetchDetails(); // Refresh vessel data after update
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsEditDialogOpen(false);
      setUpdating(false);
    }
  }

  useEffect(() => {
    setEditImoNumber(vessel.imoNumber);
    setEditVesselName(vessel.vesselName);
    setEditExVesselName(vessel.exVesselName || "");
    setEditVesselType(vessel.vesselType || ""); // Initialize editVesselType
  }, [vessel]);

  return (
    <>
     
      <td className="text-center px-4 py-3 text-md">{vessel.imoNumber}</td>
      <td className="text-center px-4 py-3 text-md">{vessel.vesselName}</td>
      <td className="text-center px-4 py-3 text-md">{vessel.exVesselName}</td>
      <td className="text-center px-4 py-3 text-md">
        {vessel.vesselType}
      </td>{" "}
      {/* Display vesselType */}
      <td className="text-center px-4 py-3 text-md">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <DotsVerticalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-md">
            <DropdownMenuItem
              onClick={() => setIsEditDialogOpen(true)}
              className="flex items-center"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Vessel
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Vessel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete vessel "{vessel.vesselName}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteVessel}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Vessel</DialogTitle>
              <DialogDescription>
                Update the details of the vessel.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editImoNumber" className="text-right">
                  IMO Number
                </Label>
                <Input
                  id="editImoNumber"
                  value={editImoNumber}
                  onChange={(e) => setEditImoNumber(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editVesselName" className="text-right">
                  Vessel Name
                </Label>
                <Input
                  id="editVesselName"
                  value={editVesselName}
                  onChange={(e) => setEditVesselName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editExVesselName" className="text-right">
                  Ex Vessel Name
                </Label>
                <Input
                  id="editExVesselName"
                  value={editExVesselName}
                  onChange={(e) => setEditExVesselName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              {/* Added vessel type edit field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editVesselType" className="text-right">
                  Vessel Type
                </Label>
                <Input
                  id="editVesselType"
                  value={editVesselType}
                  onChange={(e) => setEditVesselType(e.target.value)}
                  className="col-span-3"
                />
              </div>
              {/* Add other fields for editing vessel details if needed */}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdateVessel}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </td>
    </>
  );
}

export default function VesselPage() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true); // Initialize loading as true
  const [newVessels, setNewVessels] = useState<
    {
      imoNumber: string;
      vesselName: string;
      exVesselName?: string;
      vesselType?: string; // Added vesselType to newVessel state
      // Add other relevant vessel properties here for creation
    }[]
  >([
    {
      imoNumber: "",
      vesselName: "",
      exVesselName: "",
      vesselType: "",
    },
  ]);
  const [isAddVesselDialogOpen, setIsAddVesselDialogOpen] = useState(false); // State for controlling the add vessel dialog
  const [isBulkAddVesselDialogOpen, setIsBulkAddVesselDialogOpen] =
    useState(false); // State for controlling the bulk add vessel dialog
  const [bulkAdding, setBulkAdding] = useState(false); // State for bulk add loading
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input

  const supabase = createClient();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // You can adjust this value

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVessels = vessels.slice(indexOfFirstItem, indexOfLastItem);

  const [assignedVesselsCount, setAssignedVesselsCount] = useState<
  number | null
>(null);
const [filledVesselsCount, setFilledVesselsCount] = useState<number | null>(
  null
);
const [vesselCountLoading, setVesselCountLoading] = useState(true);
const [vesselCountError, setVesselCountError] = useState<string | null>(null);

useEffect(() => {
  async function fetchVesselCounts() {
    const supabase = createClient();
    setVesselCountLoading(true);
    setVesselCountError(null);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        setVesselCountError("Error fetching user.");
        return;
      }

      const { data: customerData, error: customerError } = await supabase
        .from("customer_details")
        .select("id, number_of_vessels")
        .eq("login_id", user.id)
        .single(); // assuming one customer per login

      if (customerError || !customerData) {
        console.error("Error fetching customer details:", customerError);
        setVesselCountError("Error fetching customer details.");
        return;
      }

      setAssignedVesselsCount(customerData.number_of_vessels);

      const { count, error: vesselCountError } = await supabase
        .from("vessel_management")
        .select("*", { count: "exact", head: true }) // head: true => no data returned
        .eq("customer_id", customerData.id);

      if (vesselCountError) {
        console.error("Error counting vessels:", vesselCountError);
        setVesselCountError("Error counting vessels.");
        return;
      }

      setFilledVesselsCount(count ?? 0);
    } catch (error) {
      console.error("Unexpected error fetching vessel counts:", error);
      setVesselCountError("Unexpected error fetching vessel counts.");
    } finally {
      setVesselCountLoading(false);
    }
  }

  fetchVesselCounts();
}, []);
 

  const totalPages = Math.ceil(vessels.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleAddNewVesselInput = () => {
    setNewVessels((prev) => [
      ...prev,
      { imoNumber: "", vesselName: "", exVesselName: "", vesselType: "" },
    ]);
  };

  const handleRemoveNewVesselInput = (index: number) => {
    setNewVessels((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewVesselInputChange = (
    index: number,
    field: keyof (typeof newVessels)[0],
    value: string
  ) => {
    setNewVessels((prev) =>
      prev.map((vessel, i) =>
        i === index ? { ...vessel, [field]: value } : vessel
      )
    );
  };

  async function addVessel() {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User not logged in.");
        setLoading(false);
        return;
      }

      const login_id = user.id; // Assuming user ID is the customer ID

      const res = await fetch("/api/bulk-vessel-save", {
        // Changed to bulk save API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vessels: newVessels, login_id: login_id }), // Sending array of new vessels
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error creating vessels:", errorData);
      } else {
        setIsAddVesselDialogOpen(false); // Close the dialog after successful addition
        setNewVessels([
          // Reset to one empty vessel input
          {
            imoNumber: "",
            vesselName: "",
            exVesselName: "",
            vesselType: "",
          },
        ]);
        fetchDetails(); // Call fetchDetails to reload the table
      }
    } catch (e) {
      console.error("Unable to Create Vessels:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleBulkUpload = async (file: File) => {
    setBulkAdding(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
        console.log("Parsed JSON Data from Excel:", jsonData); // Add this line

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("User not logged in.");
          setBulkAdding(false);
          return;
        }

        const login_id = user.id;
        const vesselsToCreate: Omit<Vessel, "id">[] = jsonData.map((item) => ({
          imoNumber: item["IMO Number"]?.toString() || "",
          vesselName: item["Vessel Name"]?.toString() || "",
          exVesselName: item["Ex Vessel Name"]?.toString() || "",
          vesselType: item["Vessel Type"]?.toString() || "",
        }));

        const res = await fetch("/api/bulk-vessel-save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vessels: vesselsToCreate,
            login_id: login_id,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error during bulk add:", errorData);
        } else {
          setIsBulkAddVesselDialogOpen(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input
          }
          fetchDetails();
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setBulkAdding(false);
      };
      reader.onabort = () => {
        console.error("File reading aborted.");
        setBulkAdding(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error processing Excel file:", error);
    } finally {
      setBulkAdding(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleBulkUpload(file);
    }
  };

  // Use useCallback to prevent infinite loop in useEffect
  const fetchDetails = useCallback(async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User not logged in.");
        setLoading(false);
        return;
      }

      const customerId = user.id;

      const res = await fetch(`/api/fetch-all-vessel?login_id=${customerId}`);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error fetching vessels:", errorData);
      } else {
        const response = await res.json(); // Changed variable name to 'response' for clarity
        console.log("API Response:", response); // Log the entire response

        if (response && response.data && Array.isArray(response.data)) {
          const formattedVessels: Vessel[] = response.data.map((v: any) => ({
            id: String(v.id),
            imoNumber: v.imo_number,
            vesselName: v.vessel_name,
            exVesselName: v.ex_vessel_name,
            vesselType: v.vessel_type,
          }));
          setVessels(formattedVessels);
          console.log("Fetched and formatted vessels:", formattedVessels);
        } else {
          console.error("Unexpected API response format:", response);
          setVessels([]);
        }
        setCurrentPage(1);
      }
    } catch (e) {
      console.error("Unable to Fetch Vessels, ", e);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]); // Now the dependency is the memoized fetchDetails function

  return (
    <main className="grid max-w-6xl w-full justify-self-center">
      <div className="py-4 sm:flex justify-between">
        <div>Vessel Management</div>
        <div className="flex gap-2">
          <Dialog
            open={isAddVesselDialogOpen}
            onOpenChange={setIsAddVesselDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                disabled={loading || bulkAdding}
                onClick={() => setIsAddVesselDialogOpen(true)}
              >
                Add Vessel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[70%] overflow-y-auto max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Add New Vessels</DialogTitle>
                <DialogDescription>
                  Add one or more new vessels.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {newVessels.map((vessel, index) => (
                  <div key={index} className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold">
                        Vessel {index + 1}
                      </h4>
                      {newVessels.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveNewVesselInput(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 items-center gap-2 sm:gap-4">
                      <Input
                        id={`imoNumber-${index}`}
                        placeholder="IMO Number"
                        value={vessel.imoNumber}
                        onChange={(e) =>
                          handleNewVesselInputChange(
                            index,
                            "imoNumber",
                            e.target.value
                          )
                        }
                        className="col-span-4 sm:col-span-2"
                      />

                      <Input
                        id={`vesselName-${index}`}
                        placeholder="Vessel Name"
                        value={vessel.vesselName}
                        onChange={(e) =>
                          handleNewVesselInputChange(
                            index,
                            "vesselName",
                            e.target.value
                          )
                        }
                        className="col-span-4 sm:col-span-2"
                      />

                      <Input
                        id={`exVesselName-${index}`}
                        placeholder="Ex Vessel Name (optional)"
                        value={vessel.exVesselName}
                        onChange={(e) =>
                          handleNewVesselInputChange(
                            index,
                            "exVesselName",
                            e.target.value
                          )
                        }
                        className="col-span-4 sm:col-span-2"
                      />
                      {/* Added vessel type input field */}

                      <Input
                        id={`vesselType-${index}`}
                        placeholder="Vessel Type"
                        value={vessel.vesselType}
                        onChange={(e) =>
                          handleNewVesselInputChange(
                            index,
                            "vesselType",
                            e.target.value
                          )
                        }
                        className="col-span-4 sm:col-span-2"
                      />
                    </div>
                    {/* Add other input fields for vessel properties if needed */}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddNewVesselInput}
                  className="w-fit"
                >
                  Add Item
                </Button>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddVesselDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} onClick={addVessel}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Add Vessels

                </Button>
                <div>
                     
                    </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isBulkAddVesselDialogOpen}
            onOpenChange={setIsBulkAddVesselDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                disabled={loading || bulkAdding}
                onClick={() => setIsBulkAddVesselDialogOpen(true)}
              >
                Bulk Add (Excel)
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Add Vessels (Excel)</DialogTitle>
                <DialogDescription>
                  Upload an Excel file (.xlsx or .csv) containing vessel
                  details. The file should have columns named: IMO Number,
                  Vessel Name, Ex Vessel Name (optional), Vessel Type
                  (optional). The column names are case-insensitive.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="bulkUpload">Select Excel File</Label>
                  <Input
                    id="bulkUpload"
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileChange}
                    className="col-span-1"
                    ref={fileInputRef}
                  />
                </div>
              
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsBulkAddVesselDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" disabled={bulkAdding}>
                  {bulkAdding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Upload & Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex justify-end">
        Allowed Vessels:{" "}
        <span
          className={
        filledVesselsCount && assignedVesselsCount && filledVesselsCount > assignedVesselsCount
          ? "text-red-500"
          : "text-green-500"
          }
        >
          {filledVesselsCount}
        </span>{" "}
        / {assignedVesselsCount}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                colSpan={6}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                <div className="flex justify-end">
                  {/* Add Vessel Button remains here */}
                </div>
              </th>
            </tr>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                IMO Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                Vessel Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                Ex Vessel Name
              </th>
              {/* Added Vessel Type header */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                Vessel Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  {" "}
                  {/* Updated colspan */}
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </td>
              </tr>
            ) : vessels.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  {" "}
                  {/* Updated colspan */}
                  No vessels have been added yet.
                </td>
              </tr>
            ) : (
              currentVessels.map((vessel, i) => (
                <tr key={vessel.id} className="hover:bg-gray-50">
                  <VesselCard vessel={vessel} fetchDetails={fetchDetails} />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {vessels.length > itemsPerPage && !loading && !bulkAdding && (
        <div className="flex justify-between items-center mt-4">
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
