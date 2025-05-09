"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// Add this line for the shadcn-ui styles CDN
const shadcnStylesCDN =
  "https://unpkg.com/@radix-ui/react-slot@1.0.2/dist/index.css";

interface PortAgent {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  customer_id: string;
  is_accepted: boolean | null;
}

interface Vessel {
  id: string;
  vessel_name: string;
}

interface AllowedVessel {
  id: string;
  port_agent_id: string;
  vessel_id: string;
}

const itemsPerPage = 5; // You can adjust this as needed

export default function PortManagementUX() {
  const [ports, setPorts] = useState<PortAgent[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [selectedPort, setSelectedPort] = useState<PortAgent | null>(null);
  const [allowedVessels, setAllowedVessels] = useState<
    Record<string, string[]>
  >({});
  const [selectedAllowedVessels, setSelectedAllowedVessels] = useState<
    string[]
  >([]);
  const [addPortDialogOpen, setAddPortDialogOpen] = useState(false);
  const [assignVesselsDialogOpen, setAssignVesselsDialogOpen] = useState(false);
  const [editPortDialogOpen, setEditPortDialogOpen] = useState(false);
  const [deletePortDialogOpen, setDeletePortDialogOpen] = useState(false);
  const [viewPortDialogOpen, setViewPortDialogOpen] = useState(false);
  const [newPortName, setNewPortName] = useState(""); // Changed from newPortName
  const [newPortPhone, setNewPortPhone] = useState("");
  const [newPortEmail, setNewPortEmail] = useState("");
  const [editingPort, setEditingPort] = useState<PortAgent | null>(null);
  const [viewingPort, setViewingPort] = useState<PortAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();


  // Load CDN styles
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = shadcnStylesCDN;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const fetchPorts = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not logged in.");
      setLoading(false);
      return;
    }
    setUserId(user.id); //set userId
    const { data, error } = await supabase
      .from("port_agent")
      .select("*")
      .eq("customer_id", user.id);

    if (error) console.error("Error fetching ports:", error);
    else setPorts(data || []);
  }, [supabase]);

  const fetchVessels = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not logged in.");
      return;
    }

    const res = await fetch(`/api/fetch-all-vessel?login_id=${user.id}`);
    const { data, error } = await res.json();
    if (error) console.error("Error fetching vessels:", error);
    else setVessels(data || []);
  }, []);

  const fetchAllowedVessels = useCallback(async () => {
    const { data, error } = await supabase.from("allowed_vessels").select("*");

    if (error) console.error("Error fetching allowed vessels:", error);
    else {
      const allowedVesselMap: Record<string, string[]> = {};
      data?.forEach((row) => {
        if (!allowedVesselMap[row.port_agent_id])
          allowedVesselMap[row.port_agent_id] = [];
        allowedVesselMap[row.port_agent_id].push(row.vessel_id);
      });
      setAllowedVessels(allowedVesselMap);
    }
  }, [supabase]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPorts(), fetchVessels(), fetchAllowedVessels()]);
      setLoading(false);
    };

    fetchData();
  }, [fetchPorts, fetchVessels, fetchAllowedVessels]);

  const handleAddPort = async () => {
    if (!userId) {
      console.error("User ID is not available.");
      return; // Or show a user-friendly error message
    }

    const companyName = "xyz harcore"; // Hardcoded company name

    try {
      const response = await fetch("/api/invite-port-agent/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: userId,
          email: newPortEmail,
          companyName:companyName,
        
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to invite port agent:", errorData);
        // Handle the error appropriately (e.g., show a toast notification)
        return;
      }else{
        toast.success("Port Agent invite succsdully")
      }

      const newPort = await response.json();
      setPorts((prevPorts) => [...prevPorts, newPort]); // Assuming the response includes the new port data
      setAddPortDialogOpen(false);
      setNewPortName("");
      setNewPortPhone("");
      setNewPortEmail("");
    } catch (error) {
      console.error("Error sending invitation:", error);
      // Handle the error (e.g., show a toast notification)
    }
  };

  const handleEditPort = (port: PortAgent) => {
    setEditingPort(port);
    setNewPortName(port.name); // Changed from name
    setNewPortPhone(port.phone_number);
    setNewPortEmail(port.email);
    setEditPortDialogOpen(true);
  };

  const handleViewPort = (port: PortAgent) => {
    setViewingPort(port);
    setViewPortDialogOpen(true);
  };

  const handleSaveEditedPort = async () => {
    if (!editingPort) return;

    const { error } = await supabase
      .from("port_agent")
      .update({
        name: newPortName, // Changed from name
        phone_number: newPortPhone,
        email: newPortEmail,
      })
      .eq("id", editingPort.id);

    if (error) {
      console.error("Error updating port:", error);
      return;
    }

    setPorts((prevPorts) =>
      prevPorts.map((port) =>
        port.id === editingPort.id
          ? {
              ...port,
              name: newPortName, // Changed from name
              phone_number: newPortPhone,
              email: newPortEmail,
            }
          : port
      )
    );

    setEditPortDialogOpen(false);
    setEditingPort(null);
    setNewPortName("");
    setNewPortPhone("");
    setNewPortEmail("");
  };

  const handleDeletePort = (portId: string) => {
    setEditingPort(ports.find((port) => port.id === portId) || null);
    setDeletePortDialogOpen(true);
  };

  const confirmDeletePort = async () => {
    if (!editingPort) return;

    const { error } = await supabase
      .from("port_agent")
      .delete()
      .eq("id", editingPort.id);

    if (error) {
      console.error("Error deleting port:", error);
      return;
    }

    setPorts((prevPorts) =>
      prevPorts.filter((port) => port.id !== editingPort.id)
    );

    setDeletePortDialogOpen(false);
    setEditingPort(null);
  };

  // Pagination logic
  const indexOfLastPort = currentPage * itemsPerPage;
  const indexOfFirstPort = indexOfLastPort - itemsPerPage;
  const currentPorts = ports.slice(indexOfFirstPort, indexOfLastPort);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(ports.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4"> Port Agent Management</h1>
      <div className="mb-4 flex justify-end">
        <Dialog open={addPortDialogOpen} onOpenChange={setAddPortDialogOpen}>
          <DialogTrigger asChild>
            <Button>Invite Port Agent</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-semibold ">Invite Port Agent</h2>
            <div className="grid gap-4 py-4">
              <div className="">
                <Label  className="mb-2" htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={newPortEmail}
                  onChange={(e) => setNewPortEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddPort}>Invite Agent</Button>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading ports...</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone No.</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPorts.map((port) => (
                <TableRow key={port.id}>
                  <TableCell>{port.name}</TableCell>{" "}
                  {/* Changed from name */}
                  <TableCell>{port.phone_number}</TableCell>
                  <TableCell>{port.email}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewPort(port)}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditPort(port)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleDeletePort(port.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {pageNumbers.map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            className={
              currentPage === number ? "mx-1 bg-blue-500 text-white" : "mx-1"
            }
            onClick={() => paginate(number)}
          >
            {number}
          </Button>
        ))}
      </div>

      {/* Edit Port Dialog */}
      <Dialog open={editPortDialogOpen} onOpenChange={setEditPortDialogOpen}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">Edit Port Agent</h2>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_name">Port Agent Name</Label>
              <Input
                id="edit_name"
                value={newPortName}
                onChange={(e) => setNewPortName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_phone_number">Phone Number</Label>
              <Input
                id="edit_phone_number"
                value={newPortPhone}
                onChange={(e) => setNewPortPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                type="email"
                value={newPortEmail}
                onChange={(e) => setNewPortEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditPortDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEditedPort}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Port Dialog */}
      <Dialog
        open={deletePortDialogOpen}
        onOpenChange={setDeletePortDialogOpen}
      >
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">Delete Port Agent</h2>
          <p className="text-muted-foreground">
            Are you sure you want to delete this port agent?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeletePortDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeletePort}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Port Dialog */}
      <Dialog open={viewPortDialogOpen} onOpenChange={setViewPortDialogOpen}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">Port Agent Details</h2>
          {viewingPort && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <span className="font-semibold">Port Agent Name:</span>
                <span>{viewingPort.name}</span> {/* Changed from name */}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="font-semibold">Phone Number:</span>
                <span>{viewingPort.phone_number}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="font-semibold">Email:</span>
                <span>{viewingPort.email}</span>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setViewPortDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
