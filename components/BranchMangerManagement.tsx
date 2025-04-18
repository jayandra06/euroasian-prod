"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Trash2, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/front/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

interface BranchManager {
  id: string;
  branch_id: string;
  email: string;
}

interface BranchMangerManagementProps {
  branchId: string;
}

function BranchMangerManagementTableRow({
  manager,
  onManagerRemoved,
}: {
  manager: BranchManager;
  onManagerRemoved: (managerToRemove: BranchManager) => void; // Update the prop type
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleConfirmRemove = () => {
    onManagerRemoved(manager);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <tr key={manager.id} className="hover:bg-gray-50">
        <td className="px-4 py-3 text-md">{manager.email}</td>
        <td className="px-4 py-3 text-md">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <DotsVerticalIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-md">
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Manager
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {manager.email} as a manager?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function BranchMangerManagement({
  branchId,
}: BranchMangerManagementProps) {
  const { toast } = useToast();
  const [isAssignManagerDialogOpen, setIsAssignManagerDialogOpen] =
    useState(false);
  const [managerEmail, setManagerEmail] = useState("");
  const [managers, setManagers] = useState<BranchManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Branch ID:", branchId); // Debugging line

  useEffect(() => {
    const fetchBranchManagers = async () => {
      const supabase = createClient();
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("manager")
          .select("*") // customize as needed
          .eq("branch_id", branchId);

        if (error) {
          throw new Error(error.message);
        }

        setManagers(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching branch managers:", err);
        toast({
          title: "Error",
          description: "Failed to load branch managers.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (branchId) {
      fetchBranchManagers();
    }
  }, [branchId]);

  const handleAssignManager = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const res = await fetch("/api/add-manager-to-branch/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        branch: branchId,
      }),
    });

    const data = await res.json();
    console.log("Manager Added:", data);

    if (data.success) {
      toast({ title: "Success", description: "Successfully Added Manager" });
      // Optionally, you can reload the manager list here
    } else {
      toast({ title: "Error", description: "Error: " + data.error });
    }
    setIsAssignManagerDialogOpen(false);
    setManagerEmail("");
  };

  const handleManagerRemoved = async (manager: BranchManager) => {
    console.log("Removing manager:", manager);
    try {
      const response = await fetch("/api/remove-manager", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: manager.email,
          manager_id: manager.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Manager removed successfully");
        // Refresh manager list after removal
        const updatedManagers = managers.filter((m) => m.id !== manager.id);
        setManagers(updatedManagers);
      } else {
        console.error("Failed to remove manager:", result.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  if (loading) {
    return <div>Loading managers...</div>;
  }

  if (error) {
    return <div>Error loading managers: {error}</div>;
  }

  return (
    <div className="mt-6">
      <div className="py-2 sm:flex justify-between items-center">
        <h3 className="text-lg font-semibold">Branch Managers </h3>
        <Button onClick={() => setIsAssignManagerDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Manager
        </Button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {managers.map((manager) => (
              <BranchMangerManagementTableRow
                key={manager.id}
                manager={manager}
                onManagerRemoved={() => handleManagerRemoved(manager)}
              />
            ))}

            {managers.length === 0 && !loading && !error && (
              <tr>
                <td colSpan={2} className="px-4 py-3 text-center text-gray-500">
                  No managers assigned to this branch.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Manager Dialog */}
      <Dialog
        open={isAssignManagerDialogOpen}
        onOpenChange={setIsAssignManagerDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign New Manager</DialogTitle>
            <DialogDescription>
              Enter the email address of the user to assign as a manager for
              this branch.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignManager} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="managerEmail" className="text-right">
                Manager Email
              </Label>
              <Input
                id="managerEmail"
                type="email"
                name="email"
                placeholder="manager@example.com"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAssignManagerDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!managerEmail}>
                Assign Manager
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
