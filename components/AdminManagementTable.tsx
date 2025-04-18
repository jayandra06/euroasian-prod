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

interface AdminManager {
  id: string;
  branch_id: string;
  email: string;
}

interface AdminManagementTableProps {
  branchId: string;
}

function AdminManagementTable({
  manager,
  onManagerRemoved,
}: {
  manager: AdminManager;
  onManagerRemoved: (managerToRemove: AdminManager) => void;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleConfirmRemove = () => {
    onManagerRemoved(manager);
    setIsDeleteDialogOpen(false);
  };

  return (
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
              Remove Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Removal</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove the admin with email "
                {manager.email}" from this branch?
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
              <Button variant="destructive" onClick={handleConfirmRemove}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </td>
    </tr>
  );
}

export default function BranchMangerManagement({
  branchId,
}: AdminManagementTableProps) {
  const { toast } = useToast();
  const [isAssignManagerDialogOpen, setIsAssignManagerDialogOpen] =
    useState(false);
  const [managerEmail, setManagerEmail] = useState("");
  const [managers, setManagers] = useState<AdminManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminManagers = async () => {
    const supabase = createClient();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("branch_admin")
        .select("*")
        .eq("branch", branchId);

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

  useEffect(() => {
    if (branchId) {
      fetchAdminManagers();
    }
  }, [branchId]);

  const handleAssignManager = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const res = await fetch("/api/add-admin-to-branch/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        branch: branchId,
      }),
    });

    const data = await res.json();
    console.log("Manager Added:", data);
    setIsAssignManagerDialogOpen(false);
    fetchAdminManagers();
  };

  const handleAdminRemove = async (adminToRemove: AdminManager) => {
    console.log("Removing admin:", adminToRemove);
    try {
      const response = await fetch("/api/remove-admin", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: adminToRemove.email,
          admin_id: adminToRemove.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Admin removed successfully");
        toast({ title: "Success", description: "Admin removed successfully." }); // Add success toast
        // Refresh manager list after removal
        const updatedManagers = managers.filter(
          (m) => m.id !== adminToRemove.id
        );
        setManagers(updatedManagers);
      } else {
        console.error("Failed to remove admin:", result.error);
        toast({
          title: "Error",
          description: `Failed to remove admin: ${result.error}`,
        }); // Add error toast
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast({ title: "Error", description: "An unexpected error occurred." }); // Add error toast
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
        <h3 className="text-lg font-semibold">Admins </h3>
        <Button onClick={() => setIsAssignManagerDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Admin
        </Button>
      </div>
      <div className="mt-4 overflow-x-auto">
        ``
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
              <AdminManagementTable
                key={manager.id}
                manager={manager}
                onManagerRemoved={handleAdminRemove} // Make sure this prop name matches the one in AdminManagementTable
              />
            ))}
            {managers.length === 0 && !loading && !error && (
              <tr>
                <td colSpan={2} className="px-4 py-3 text-center text-gray-500">
                  No Admins assign to this branch yet.
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
            <DialogTitle>Assign New Admin</DialogTitle>
            <DialogDescription>
              Enter the email address of the user to assign as a Admin for this
              branch.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignManager} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="managerEmail" className="text-right">
                Admin Email
              </Label>
              <Input
                id="managerEmail"
                type="email"
                name="email"
                placeholder="admin@example.com"
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
                Assign Admin
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
