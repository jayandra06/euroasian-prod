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
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Pencil, Trash, MoreVertical, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface Brand {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
}

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [newBrand, setNewBrand] = useState({ name: "", description: "" });
    const [addBrandDialogOpen, setAddBrandDialogOpen] = useState(false);
    const [editBrandDialogOpen, setEditBrandDialogOpen] = useState(false);
    const [editBrand, setEditBrand] = useState<Brand | null>(null);
    const [deleteBrandDialogOpen, setDeleteBrandDialogOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("active"); // Default to active for admin view

    const filteredBrands = brands.filter((brand) =>
        activeTab === "active" ? brand.is_active : !brand.is_active
    );

    async function fetchBrands(isActive: boolean | null = null) {
        setLoading(true);
        const supabase = createClient();
        let query = supabase.from("brand").select("*").order("created_at", { ascending: false });
        if (isActive !== null) {
            query = query.eq("is_active", isActive);
        }
        const { data, error } = await query;

        if (error) {
            console.error("Error fetching brands:", error);
            toast.error("Error fetching brands. Please check the console.");
        } else if (data) {
            setBrands(data);
        }
        setLoading(false);
    }

    async function requestAddBrand() {
        const supabase = createClient();
        const { error } = await supabase
            .from("brand")
            .insert({ ...newBrand, is_active: false, created_at: new Date().toISOString() }); // Submitted as pending

        if (error) {
            console.error("Error requesting brand:", error);
            toast.error("Failed to request the new brand. Please check the console.");
        } else {
            toast.success(`${newBrand.name} has been submitted for approval.`);
            setNewBrand({ name: "", description: "" });
            setAddBrandDialogOpen(false);
            fetchBrands(false); // Refresh pending brands
        }
    }

    async function requestUpdateBrand() {
        if (!editBrand) return;

        const supabase = createClient();
        const { error } = await supabase
            .from("brand")
            .update({ name: editBrand.name, description: editBrand.description, is_active: false }) // Resubmitted as pending
            .eq("id", editBrand.id);

        if (error) {
            console.error("Error updating brand:", error);
            toast.error("Failed to request update for the brand details. Please check the console.");
        } else {
            toast.success(`${editBrand.name} update has been submitted for approval.`);
            setEditBrandDialogOpen(false);
            setEditBrand(null);
            fetchBrands(false); // Refresh pending brands
        }
    }

    async function approveBrand(id: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from("brand")
            .update({ is_active: true })
            .eq("id", id);

        if (error) {
            console.error("Error approving brand:", error);
            toast.error("Failed to approve the brand. Please check the console.");
        } else {
            toast.success("Brand has been approved.");
            fetchBrands(activeTab === "active"); // Refresh current tab
        }
    }

    async function confirmDeleteBrand() {
        if (!brandToDelete) return;

        const supabase = createClient();
        const { error } = await supabase.from("brand").delete().eq("id", brandToDelete);

        if (error) {
            console.error("Error deleting brand:", error);
            toast.error("Failed to delete the brand. Please check the console.");
        } else {
            toast.success("The brand has been successfully deleted.");
            setDeleteBrandDialogOpen(false);
            setBrandToDelete(null);
            fetchBrands(activeTab === "active"); // Refresh current tab
        }
    }

    const handleAddDialogOpen = () => {
        setAddBrandDialogOpen(true);
    };

    const handleEditDialogOpen = (brand: Brand) => {
        setEditBrand(brand);
        setEditBrandDialogOpen(true);
    };

    const handleEditInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setEditBrand((prevBrand) => {
            if (!prevBrand) return prevBrand;

            return {
                ...prevBrand,
                [name]: value,
            };
        });
    };

    const handleDeleteDialogOpen = (id: string) => {
        setBrandToDelete(id);
        setDeleteBrandDialogOpen(true);
    };

    const handleTabChange = (tab: "active" | "pending") => {
        setActiveTab(tab);
        fetchBrands(tab === "active");
    };

    useEffect(() => {
        fetchBrands(true); // Initially load active brands for admin view
    }, []);

    if (loading) {
        return <div>Loading brands...</div>;
    }

    return (
        <>
            <div className="mt-8 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Brands</h1>
                <div className="flex gap-2 justify-end">
                    <Dialog open={addBrandDialogOpen} onOpenChange={setAddBrandDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddDialogOpen}>Add Brand</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request New Brand</DialogTitle>
                                <DialogDescription>
                                    Enter the details for the new brand. This will be submitted for approval.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={newBrand.name}
                                        onChange={(e) =>
                                            setNewBrand({ ...newBrand, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={newBrand.description}
                                        onChange={(e) =>
                                            setNewBrand({
                                                ...newBrand,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={() => setAddBrandDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="button" onClick={requestAddBrand}>
                                    Request Add Brand
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="p-4">
                <div className="flex gap-4 mb-4">
                    <Button
                        variant={activeTab === "active" ? "default" : "outline"}
                        onClick={() => handleTabChange("active")}
                    >
                        Active
                    </Button>
                    <Button
                        variant={activeTab === "pending" ? "default" : "outline"}
                        onClick={() => handleTabChange("pending")}
                    >
                        Pending Approval
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBrands.map((brand) => (
                            <TableRow key={brand.id}>
                                <TableCell>{brand.name}</TableCell>
                                <TableCell>{brand.description || "-"}</TableCell>
                                <TableCell>{brand.is_active ? "Active" : "Pending"}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditDialogOpen(brand)}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            {!brand.is_active && (
                                                <DropdownMenuItem onClick={() => approveBrand(brand.id)}>
                                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                                    Approve
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem onClick={() => handleDeleteDialogOpen(brand.id)}>
                                                <Trash className="h-4 w-4 mr-2 text-red-500" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredBrands.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    No brands found in the "{activeTab}" tab.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Brand Dialog */}
            <Dialog open={editBrandDialogOpen} onOpenChange={setEditBrandDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Edit Brand</DialogTitle>
                        <DialogDescription>
                            Update the details for the selected brand. This will be submitted for approval.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                name="name"
                                value={editBrand?.name || ""}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input
                                id="edit-description"
                                name="description"
                                value={editBrand?.description || ""}
                                onChange={handleEditInputChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => setEditBrandDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={requestUpdateBrand}>
                            Request Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Brand Dialog */}
            <Dialog open={deleteBrandDialogOpen} onOpenChange={setDeleteBrandDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this brand? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" onClick={() => setDeleteBrandDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteBrand}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}