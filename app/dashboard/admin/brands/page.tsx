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
import { Pencil, Trash, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
    const [editBrandDialogOpen, setEditBrandDialogOpen] = useState(false);
    const [editBrand, setEditBrand] = useState<Brand | null>(null);
    const [deleteBrandDialogOpen, setDeleteBrandDialogOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("active");

    const filteredBrands = brands.filter((brand) =>
        activeTab === "active" ? brand.is_active : !brand.is_active
    );

    async function fetchBrands() {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
            .from("brand")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching brands:", error);
            alert("Error fetching brands. Please check the console.");
        } else if (data) {
            setBrands(data);
        }
        setLoading(false);
    }

    async function addBrand() {
        const supabase = createClient();
        const { error } = await supabase
            .from("brand")
            .insert({ ...newBrand, is_active: false, created_at: new Date().toISOString() }); // Default to pending

        if (error) {
            console.error("Error adding brand:", error);
            alert("Failed to add the new brand. Please check the console.");
        } else {
            alert(`${newBrand.name} has been successfully added and is pending approval.`);
            setNewBrand({ name: "", description: "" });
            fetchBrands();
        }
    }

    async function updateBrand() {
        if (!editBrand) return;

        const supabase = createClient();
        const { error } = await supabase
            .from("brand")
            .update({ name: editBrand.name, description: editBrand.description })
            .eq("id", editBrand.id);

        if (error) {
            console.error("Error updating brand:", error);
            alert("Failed to update the brand details. Please check the console.");
        } else {
            alert(`${editBrand.name} has been successfully updated.`);
            setEditBrandDialogOpen(false);
            setEditBrand(null);
            fetchBrands();
        }
    }

    async function confirmDeleteBrand() {
        if (!brandToDelete) return;

        const supabase = createClient();
        const { error } = await supabase.from("brand").delete().eq("id", brandToDelete);

        if (error) {
            console.error("Error deleting brand:", error);
            alert("Failed to delete the brand. Please check the console.");
        } else {
            alert("The brand has been successfully deleted.");
            setDeleteBrandDialogOpen(false);
            setBrandToDelete(null);
            fetchBrands();
        }
    }

    const handleEditDialogOpen = (brand: Brand) => {
        setEditBrand(brand);
        setEditBrandDialogOpen(true);
    };

    const handleEditInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target;
      
        setEditBrand((prevBrand) => {
          if (!prevBrand) return prevBrand; // safeguard for null
      
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
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    if (loading) {
        return <div>Loading brands...</div>;
    }

    return (
        <>
            <div className="mt-8 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">All Brands</h1>
                <div className="flex gap-2 justify-end">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Add Brand</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Brand</DialogTitle>
                                <DialogDescription>
                                    Enter the details for the new brand.
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
                                <Button type="button" onClick={addBrand}>
                                    Add Brand
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
                        Pending
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
                                <TableCell>
                                    {brand.is_active ? "Active" : "Pending"}
                                </TableCell>
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
                                            <DropdownMenuItem onClick={() => handleDeleteDialogOpen(brand.id)}>
                                                <Trash className="h-4 w-4 mr-2" />
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
                        <DialogTitle>Edit Brand</DialogTitle>
                        <DialogDescription>
                            Update the details for the selected brand.
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
                        <Button type="button" onClick={updateBrand}>
                            Save Changes
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