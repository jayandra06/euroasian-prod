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
import { useEffect, useState, useCallback } from "react"; // Import useCallback
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { UserPlus, Pencil, Trash2, Users } from "lucide-react"; // Import icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/front/ui/use-toast";

interface Branch {
  id: string;
  name: string;
  vessels: string[];
}

interface Member {
  id: string;
  branch: string;
  member_profile: string;
  member_role: string;
}

interface Profile {
  id: string;
  email: string;
  vessels: string[];
}

function BranchCard({
  branch,
  vessels,
  fetchDetails,
}: {
  branch: Branch;
  vessels: string[];
  fetchDetails: () => void;
}) {
  const [admin, setAdmin] = useState<Member | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [rfqCount, setRfqCount] = useState(0);
  const [adminProfile, setAdminProfile] = useState<Profile | null>(null);
  const [newBranch, setNewBranch] = useState<{
    name: string;
    vessels: string[];
  }>({
    name: "",
    vessels: [],
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editBranchName, setEditBranchName] = useState(branch.name);
  const [isAssignAdminDialogOpen, setIsAssignAdminDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false); // State for update loading
  const [deleting, setDeleting] = useState(false); // State for delete loading
  const { toast } = useToast();

  // Fetching Branch Details
  async function fetchBranchDetails() {
    const supabase = createClient();

    const member = await supabase
      .from("manager")
      .select("*")
      .eq("branch_id", branch.id);
    setMemberCount(member.data?.length || 0);



    const { count, error } = await supabase
    .from("branch_admin")
    .select("*", { count: "exact", head: true })
    .eq("branch", branch.id);

    if (error) {
      console.error("Error fetching admin count:", error);
    } else {
      setAdminCount(count || 0);
    }




    const rfq = await supabase.from("rfq").select("*").eq("branch", branch.id);
    setRfqCount(rfq.data?.length || 0);

    const admin = await supabase
      .from("member")
      .select("*")
      .eq("branch", branch.id)
      .eq("member_role", "admin")
      .single();
    setAdmin(admin.data || null);

    if (admin.data?.member_profile) {
      const res = await fetch("/api/all-user", {
        method: "POST",
        body: JSON.stringify({ userID: admin.data.member_profile }),
      });
      const data = await res.json();
      setAdminProfile(data.userData);
    } else {
      setAdminProfile(null); // Ensure adminProfile is null if no admin
    }
  }

  //to delete the branch
  async function handleDeleteBranch() {
    const supabase = createClient();
    setDeleting(true);

    // Step 1: Confirm the record exists
    const { data: checkData, error: checkError } = await supabase
      .from("branch")
      .select("*")
      .eq("id", branch.id);

    if (checkError) {
      console.error("Error checking record:", checkError.message);
      toast({
        title: "Error checking branch",
        description: checkError.message,
        variant: "destructive",
      });
      setDeleting(false);
      return;
    }

    if (!checkData || checkData.length === 0) {
      toast({
        title: "Branch not found",
        description: "No branch found with that ID.",
        variant: "destructive",
      });
      setDeleting(false);
      return;
    }

    // Step 2: Attempt to delete
    const { error } = await supabase
      .from("branch")
      .delete()
      .eq("id", branch.id);

    if (error) {
      console.error("Delete error:", error.message);
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Branch deleted",
        description: `"${branch.name}" was successfully deleted.`,
      });
      fetchDetails();
    }

    setIsDeleteDialogOpen(false);
    setDeleting(false);
  }

  async function handleUpdateBranch() {
    const supabase = createClient();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from("branch")
        .update({ name: editBranchName.trim() })
        .eq("id", branch.id);

      if (error) {
        console.error("Error updating branch:", error);
        toast({
          title: "Failed to update",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Branch updated",
          description: `Branch name changed to "${editBranchName}" successfully.`,
        });
        fetchDetails();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Unexpected error",
        description: "Something went wrong while updating the branch.",
        variant: "destructive",
      });
    } finally {
      setIsEditDialogOpen(false);
      setUpdating(false);
    }
  }

  useEffect(() => {
    fetchBranchDetails();
    setEditBranchName(branch.name); // Update edit name when branch changes
  }, [branch.id, fetchDetails]); // Fetch details when the branch changes

  return (
    <>
      {/* <td className="text-center px-4 py-3 text-md">
        {`${branch.id}`.slice(0, 8)}
      </td> */}
      <td className="text-center px-4 py-3 text-md">{branch.name}</td>

      <td className="text-center px-4 py-3 text-md">{adminCount}</td>
      <td className="text-center px-4 py-3 text-md">{memberCount}</td>
      <td className="text-center px-4 py-3 text-md">{rfqCount}</td>
      <td className="text-center px-4 py-3 text-md">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <DotsVerticalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-md">
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/customer/branch/branchmanagment/${branch.id}`}
                className="flex items-center"
              >
                <Users className="mr-2 h-4 w-4" />
                Mangae Branch
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setIsEditDialogOpen(true)}
              className="flex items-center"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Branch
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Branch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete branch "{branch.name}"? This
                action cannot be undone.
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
                onClick={handleDeleteBranch}
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
              <DialogTitle>Edit Branch</DialogTitle>
              <DialogDescription>
                Update the name of the branch.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editBranchName" className="text-right">
                  Branch Name
                </Label>
                <Input
                  id="editBranchName"
                  value={editBranchName}
                  onChange={(e) => setEditBranchName(e.target.value)}
                  className="col-span-3"
                />
              </div>
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
                onClick={handleUpdateBranch}
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

export default function BranchPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isClient, setIsClient] = useState(true);
  const [loading, setloading] = useState(true); // Initialize loading as true
  const [newBranch, setNewBranch] = useState<{
    name: string;
    vessels: string[];
  }>({
    name: "",
    vessels: [],
  });
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false); // State for controlling the add branch dialog

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7); // You can adjust this value

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBranches = branches.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(branches.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  console.log("vessels", []); // Keeping the console log for now, but 'vessels' is now an empty array

  async function addBranch() {
    const supabase = createClient();
    setloading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User not logged in.");
        setloading(false);
        return;
      }

      const creatorId = user.id;
      console.log("Creator ID:", creatorId);

      const currentTime = new Date().toISOString();

      const { data: branchData, error: branchError } = await supabase
        .from("branch")
        .insert({
          name: newBranch.name,
          creator: creatorId,
          created_at: currentTime,
        })
        .select()
        .single();

      if (branchError) {
        console.error("Branch Insert Error:", branchError.message);
        setloading(false);
        return;
      }

      console.log("Branch Data:", branchData);

      // Insert into member table
      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .insert({
          branch: branchData?.id,
          member_profile: creatorId,
          member_role: "creator",
        });

      if (memberError) {
        console.error("Member Insert Error:", memberError.message);
        setloading(false);
        return;
      }

      console.log("Member Data:", memberData);
      setloading(false);
      setIsAddBranchDialogOpen(false); // Close the dialog after successful addition
      setNewBranch({ name: "", vessels: [] }); // Reset the form
      fetchDetails(); // Call fetchDetails to reload the table
    } catch (e) {
      console.error("Unable to Create Branch:", e);
      setloading(false);
    }
  }

  // Use useCallback to prevent infinite loop in useEffect
  const fetchDetails = useCallback(async () => {
    const supabase = createClient();
    setloading(true); // Set loading to true before fetching

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const profileData = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      // REMOVED: setVessels(profileData.data?.vessels || []); // No longer setting vessels here

      const member = await supabase
        .from("member")
        .select("*")
        .eq("member_profile", user?.id);
      const allBranches: Branch[] = [];

      for (let i = 0; i < member.data!.length; i++) {
        const m = member.data![i];
        const branchesData = await supabase
          .from("branch")
          .select("*")
          .eq("id", m.branch)
          .single();
        if (branchesData.data) {
          allBranches.push(branchesData.data);
        }
      }

      if (
        member.data!.length === 1 &&
        member.data![0].member_role !== "creator"
      ) {
        setIsClient(false);
      }

      setBranches(allBranches);
      setCurrentPage(1); // Reset to first page after fetching new data
    } catch (e) {
      console.log("Unable to Fetch Details, ", e);
    } finally {
      setloading(false); // Set loading to false after fetching (success or error)
    }
  }, []); // The dependency array is now empty as useCallback memoizes the function

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]); // Now the dependency is the memoized fetchDetails function

  return (
    <main className="grid max-w-6xl w-full justify-self-center">
      <div className="py-4 sm:flex justify-between">
        <div>Your Branches</div>
        <div className="flex gap-2">
          <Dialog open={isAddBranchDialogOpen} onOpenChange={setIsAddBranchDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={loading} onClick={() => setIsAddBranchDialogOpen(true)}>Add BU</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Branch</DialogTitle>
                <DialogDescription>Create New Branch</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="branchName" className="text-right">
                    Branch Name
                  </Label>
                  <Input
                    id="branchName"
                    placeholder="Enter Branch Name..."
                    value={newBranch.name}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsAddBranchDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} onClick={addBranch}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Add Branch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                  {/* Add BU Button remains here */}
                </div>
              </th>
            </tr>
            <tr>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                ID
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                Name
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                No. of Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                No. of Managers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                RFQs
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
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </td>
              </tr>
            ) : branches.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  No branches have been added yet.
                </td>
              </tr>
            ) : (
              currentBranches.map((branch, i) => (
                <tr key={branch.id} className="hover:bg-gray-50">
                  <BranchCard
                    branch={branch}
                    vessels={[]} // Removed dependency on the 'vessels' state here
                    fetchDetails={fetchDetails}
                  />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {branches.length > itemsPerPage && !loading && (
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