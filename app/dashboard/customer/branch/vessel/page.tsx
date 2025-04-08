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
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

interface Vessel {
    id: string;
    name: string;
}

function VesselRow({ vessel, onDelete, onEdit }: { vessel: Vessel; onDelete: (id: string) => void; onEdit: (vessel: Vessel) => void }) {
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                {vessel.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <DotsVerticalIcon className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(vessel)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(vessel.id)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
}

export default function VesselManagementPage() {
    const [vessels, setVessels] = useState<Vessel[]>([
        { id: "vessel-1", name: "Demo Vessel A" },
        { id: "vessel-2", name: "Demo Vessel B" },
        { id: "vessel-3", name: "Demo Vessel C" },
        { id: "vessel-4", name: "Demo Vessel D" },
    ]);
    const [newVesselName, setNewVesselName] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
    const [editedVesselName, setEditedVesselName] = useState("");

    const openAddDialog = () => setIsAddDialogOpen(true);
    const closeAddDialog = () => setIsAddDialogOpen(false);
    const openEditDialog = (vessel: Vessel) => {
        setEditingVessel(vessel);
        setEditedVesselName(vessel.name);
        setIsEditDialogOpen(true);
    };
    const closeEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditingVessel(null);
        setEditedVesselName("");
    };

    const addVessel = () => {
        if (newVesselName) {
            const newVessel: Vessel = {
                id: Math.random().toString(36).substring(7),
                name: newVesselName,
            };
            setVessels((prevVessels) => [...prevVessels, newVessel]);
            setNewVesselName("");
            closeAddDialog();
        }
    };

    const updateVessel = () => {
        if (editingVessel && editedVesselName) {
            setVessels((prevVessels) =>
                prevVessels.map((vessel) =>
                    vessel.id === editingVessel.id ? { ...vessel, name: editedVesselName } : vessel
                )
            );
            closeEditDialog();
        }
    };

    const deleteVessel = (idToDelete: string) => {
        setVessels((prevVessels) => prevVessels.filter((vessel) => vessel.id !== idToDelete));
    };

    return (
        <div className="grid max-w-6xl w-full justify-self-center gap-8 p-8">
            <div className="py-4">
                <h2 className="text-2xl font-bold">Vessel Management</h2>
            </div>
            <div className="py-4 sm:flex justify-end">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddDialog}>Add Vessel</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Vessel</DialogTitle>
                            <DialogDescription>Create a new vessel.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vesselName" className="text-right">
                                    Vessel Name
                                </Label>
                                <Input
                                    id="vesselName"
                                    placeholder="Enter Vessel Name..."
                                    value={newVesselName}
                                    onChange={(e) => setNewVesselName(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={addVessel} disabled={!newVesselName}>
                                Add Vessel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                Vessel Name
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-50 divide-y divide-gray-100">
                        {vessels.map((vessel) => (
                            <VesselRow
                                key={vessel.id}
                                vessel={vessel}
                                onDelete={deleteVessel}
                                onEdit={openEditDialog}
                            />
                        ))}
                    </tbody>
                </table>
                {vessels.length === 0 && (
                    <div className="py-4 text-center">No vessels available yet.</div>
                )}
            </div>

            {/* Edit Vessel Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Vessel</DialogTitle>
                        <DialogDescription>Update the name of the vessel.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editVesselName" className="text-right">
                                Vessel Name
                            </Label>
                            <Input
                                id="editVesselName"
                                placeholder="Enter Vessel Name..."
                                value={editedVesselName}
                                onChange={(e) => setEditedVesselName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={closeEditDialog}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={updateVessel} disabled={!editedVesselName}>
                            Update Vessel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}