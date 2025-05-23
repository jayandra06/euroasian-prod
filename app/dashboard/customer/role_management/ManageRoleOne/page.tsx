"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  originalRole: string;
  lastActive?: string;
  status?: "DISABLED" | "ACTIVE";
}

const ManageRoleOne = () => {
  const [newRole, setNewRole] = useState("");
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [customRoleInputs, setCustomRoleInputs] = useState<Record<string, string>>({});
  const [editingRoles, setEditingRoles] = useState<Record<string, boolean>>({});
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const standardRoles = ["Admin", "Manager", "User", "Branch Admin"];

  const fetchUsersAndRoles = async () => {
    try {
      const res = await fetch("/api/fetch-all-user-role");
      if (!res.ok) throw new Error("Failed to fetch users and roles");

      const { users: fetchedUsers, allRoles } = await res.json();

      setUsers(
        fetchedUsers.map((user: any) => ({
          id: user.id,
          name: user.user_metadata?.full_name || user.email,
          email: user.email,
          role: user.role || "Basic user",
          originalRole: user.role || "Basic user",
          status: user.confirmed_at ? "ACTIVE" : "DISABLED",
          lastActive: user.last_sign_in_at
            ? new Date(user.last_sign_in_at).toLocaleDateString()
            : "Never",
        }))
      );
      setAllRoles(allRoles);
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to fetch users or roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const createRole = async () => {
    const res = await fetch("/api/create-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    });
    const json = await res.json();

    if (json.success) {
      toast.success("Role created successfully");
      setNewRole("");
    } else {
      toast.error("Failed to create role");
    }
  };

  const updateRoles = async () => {
    try {
      const changedUsers = users.filter((user) => user.role !== user.originalRole);
      if (changedUsers.length === 0) {
        toast.success("No changes to save");
        return;
      }

      await Promise.all(
        changedUsers.map(async (user) => {
          const res = await fetch("/api/update-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, role: user.role }),
          });

         if (!res.ok) {
  const errorText = await res.text();
  console.error(`Error updating user ${user.id}:`, errorText);
  throw new Error("Failed to update role");
}

        })
      );

      toast.success("Roles updated successfully");
      setUsers((prev) =>
        prev.map((user) => ({ ...user, originalRole: user.role }))
      );
      setHasChanges(false);
    } catch (err) {
      toast.error("Failed to update roles");
      fetchUsersAndRoles();
    }
  };

  const handleRoleChange = (userId: string, email: string, newRole: string) => {
  if (newRole === "Create custom role...") {
    setEditingRoles((prev) => ({ ...prev, [email]: true }));
    setCustomRoleInputs((prev) => ({ ...prev, [email]: "" }));
  } else {
    setUsers((prev) =>
      prev.map((user) =>
        user.email === email ? { ...user, role: newRole } : user
      )
    );
    setEditingRoles((prev) => ({ ...prev, [email]: false }));
    setHasChanges(true);
  }

  setDropdownOpen((prev) => ({ ...prev, [email]: false }));
};


  const handleCustomRoleSubmit = (email: string) => {
    const role = customRoleInputs[email]?.trim();
    if (role) {
      setUsers((prev) =>
        prev.map((user) =>
          user.email === email ? { ...user, role } : user
        )
      );
      setEditingRoles((prev) => ({ ...prev, [email]: false }));
      setHasChanges(true);
    }
  };

  const handleCustomRoleChange = (email: string, value: string) => {
    setCustomRoleInputs((prev) => ({ ...prev, [email]: value }));
  };

  if (loading) return <div className="flex justify-center items-center h-64"><p>Loading users...</p></div>;
  if (users.length === 0 && !loading) return <div className="flex justify-center items-center h-64"><p>No users found</p></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mb-4">
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Enter the name of the role you want to create.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-4">
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. Senior Manager"
              />
            </div>
            <DialogFooter>
              <Button onClick={createRole}>
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          onClick={updateRoles}
          disabled={!hasChanges}
          className={hasChanges ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Save All Changes
        </Button>
      </div>

      <div className="border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {editingRoles[user.email] ? (
                    <div className="flex gap-2">
                      <Input
                        value={customRoleInputs[user.email] || ""}
                        onChange={(e) => handleCustomRoleChange(user.email, e.target.value)}
                        placeholder="Enter custom role"
                        className="h-8 w-[180px]"
                      />
                      <button
                        onClick={() => handleCustomRoleSubmit(user.email)}
                        className="text-sm px-2 py-1 bg-primary text-primary-foreground rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <DropdownMenu onOpenChange={(open) => setDropdownOpen(prev => ({ ...prev, [user.email]: open }))}>
                      <DropdownMenuTrigger className="flex items-center gap-1 focus-visible:outline-none">
                        {user.role}
                        {user.role !== user.originalRole && <span className="ml-1 text-xs text-yellow-600">*</span>}
                        {dropdownOpen[user.email] ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {[...new Set([...standardRoles , ...allRoles])].map((role) => (
                          <DropdownMenuItem key={role} onSelect={() => handleRoleChange(user.id, user.email, role)}>
                            {role}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onSelect={() => handleRoleChange(user.id, user.email, "Create custom role...")}>
                          Create custom role...
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={user.status === "DISABLED" ? "destructive" : "outline"}>
                    {user.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageRoleOne;
