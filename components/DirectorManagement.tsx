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

interface BranchDirector {
  id: string;
  branch_id: string;
  email: string;
}

interface BranchDirectorManagementProps {
  branchId: string;
}

function BranchDirectorManagementTableRow({
  director,
  onDirectorRemoved,
}: {
  director: BranchDirector;
  onDirectorRemoved: (directorToRemove: BranchDirector) => void;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleConfirmRemove = () => {
    onDirectorRemoved(director);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <tr key={director.id} className="hover:bg-gray-50">
        <td className="px-4 py-3 text-md">{director.email}</td>
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
                Remove Owner
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
              Are you sure you want to remove {director.email} as a Owner?
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

export default function BranchDirectorManagement({
  branchId,
}: BranchDirectorManagementProps) {
  const { toast } = useToast();
  const [isAssignDirectorDialogOpen, setIsAssignDirectorDialogOpen] =
    useState(false);
  const [directorEmail, setDirectorEmail] = useState("");
  const [directors, setDirectors] = useState<BranchDirector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranchDirectors = async () => {
      const supabase = createClient();
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("director")
          .select("*")
          .eq("branch_id", branchId);

        if (error) {
          throw new Error(error.message);
        }

        setDirectors(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching branch directors:", err);
        toast({
          title: "Error",
          description: "Failed to load branch directors.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (branchId) {
      fetchBranchDirectors();
    }
  }, [branchId]);

  const handleAssignDirector = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const res = await fetch("/api/add-director-to-branch/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        branch: branchId,
      }),
    });

    const data = await res.json();
    console.log("Response from server:", data);

    if (data.success) {
      toast({ title: "Success", description: "Successfully Added Director" });
      setDirectors([...directors, data.director]); // Update with actual response shape if needed
    } else {
      toast({ title: "Error", description: "Error: " + data.error });
    }

    setIsAssignDirectorDialogOpen(false);
    setDirectorEmail("");
  };

  const handleDirectorRemoved = async (director: BranchDirector) => {
    try {
      const response = await fetch("/api/remove-director", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: director.email,
          director_id: director.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const updatedDirectors = directors.filter((d) => d.id !== director.id);
        setDirectors(updatedDirectors);
      } else {
        console.error("Failed to remove director:", result.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  if (loading) return <div>Loading directors...</div>;
  if (error) return <div>Error loading directors: {error}</div>;

  return (
    <div className="mt-6">
      <div className="py-2 sm:flex justify-between items-center">
        <h3 className="text-lg font-semibold">Branch Owners</h3>
        <Button onClick={() => setIsAssignDirectorDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Owner
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
            {directors.map((director) => (
              <BranchDirectorManagementTableRow
                key={director.id}
                director={director}
                onDirectorRemoved={() => handleDirectorRemoved(director)}
              />
            ))}

            {directors.length === 0 && !loading && !error && (
              <tr>
                <td colSpan={2} className="px-4 py-3 text-center text-gray-500">
                  No directors assigned to this branch.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Director Dialog */}
      <Dialog
        open={isAssignDirectorDialogOpen}
        onOpenChange={setIsAssignDirectorDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign New Owner</DialogTitle>
            <DialogDescription>
              Enter the email address of the user to assign as a Owner for
              this branch.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignDirector} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="directorEmail" className="text-right">
                Owner Email
              </Label>
              <Input
                id="directorEmail"
                type="email"
                name="email"
                placeholder="director@example.com"
                value={directorEmail}
                onChange={(e) => setDirectorEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAssignDirectorDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!directorEmail}>
                Assign Owner
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
