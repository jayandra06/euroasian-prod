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

interface Category {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });
    const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pending"); // Default to pending for approval

    const filteredCategories = categories.filter((category) =>
        activeTab === "active" ? category.is_active : !category.is_active
    );

    async function fetchCategories(isActive: boolean | null = null) {
        setLoading(true);
        const supabase = createClient();
        let query = supabase.from("category").select("*").order("created_at", { ascending: false });
        if (isActive !== null) {
            query = query.eq("is_active", isActive);
        }
        const { data, error } = await query;

        if (error) {
            console.error("Error fetching categories:", error);
            alert("Error fetching categories. Please check the console.");
        } else if (data) {
            setCategories(data);
        }
        setLoading(false);
    }

    async function addCategory() {
        const supabase = createClient();
        const { error } = await supabase
            .from("category")
            .insert({ ...newCategory, is_active: false, created_at: new Date().toISOString() }); // Default to pending

        if (error) {
            console.error("Error adding category:", error);
            alert("Failed to add the new category. Please check the console.");
        } else {
            alert(`${newCategory.name} has been successfully added and is pending approval.`);
            setNewCategory({ name: "", description: "" });
            fetchCategories(false); // Refresh pending categories
        }
    }

    async function updateCategory() {
        if (!editCategory) return;

        const supabase = createClient();
        const { error } = await supabase
            .from("category")
            .update({ name: editCategory.name, description: editCategory.description })
            .eq("id", editCategory.id);

        if (error) {
            console.error("Error updating category:", error);
            alert("Failed to update the category details. Please check the console.");
        } else {
            alert(`${editCategory.name} has been successfully updated.`);
            setEditCategoryDialogOpen(false);
            setEditCategory(null);
            fetchCategories(activeTab === "active"); // Refresh current tab
        }
    }

    async function approveCategory(id: string) {
        const supabase = createClient();
        const { error } = await supabase.from("category").update({ is_active: true }).eq("id", id);

        if (error) {
            console.error("Error approving category:", error);
            alert("Failed to approve the category. Please check the console.");
        } else {
            alert("Category successfully approved!");
            fetchCategories(false); // Refresh pending categories
            if (activeTab === "pending") {
                fetchCategories(false);
            } else if (activeTab === "active") {
                fetchCategories(true);
            }
        }
    }

    async function confirmDeleteCategory() {
        if (!categoryToDelete) return;

        const supabase = createClient();
        const { error } = await supabase.from("category").delete().eq("id", categoryToDelete);

        if (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete the category. Please check the console.");
        } else {
            alert("The category has been successfully deleted.");
            setDeleteCategoryDialogOpen(false);
            setCategoryToDelete(null);
            fetchCategories(activeTab === "active"); // Refresh current tab
        }
    }

    const handleEditDialogOpen = (category: Category) => {
        setEditCategory(category);
        setEditCategoryDialogOpen(true);
    };

    const handleEditInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target;
      
        setEditCategory((prevCategory) => {
          if (!prevCategory) return prevCategory; // safeguard against null
      
          return {
            ...prevCategory,
            [name]: value,
          };
        });
      };
      

    const handleDeleteDialogOpen = (id: string) => {
        setCategoryToDelete(id);
        setDeleteCategoryDialogOpen(true);
    };

    const handleTabChange = (tab: "active" | "pending") => {
        setActiveTab(tab);
        fetchCategories(tab === "active");
    };

    useEffect(() => {
        fetchCategories(false); // Initially load pending categories
    }, []);

    if (loading) {
        return <div>Loading categories...</div>;
    }

    return (
        <>
            <div className="mt-8 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Categories</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Category</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                            <DialogDescription>
                                Enter the details for the new category.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={newCategory.name}
                                    onChange={(e) =>
                                        setNewCategory({ ...newCategory, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={newCategory.description}
                                    onChange={(e) =>
                                        setNewCategory({
                                            ...newCategory,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={addCategory}>
                                Add Category
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                        {filteredCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description || "-"}</TableCell>
                                <TableCell>
                                    {category.is_active ? "Active" : "Pending"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditDialogOpen(category)}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            {!category.is_active && (
                                                <DropdownMenuItem onClick={() => approveCategory(category.id)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-check-circle h-4 w-4 mr-2"
                                                    >
                                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                        <path d="m9 11 3 3L22 4" />
                                                    </svg>
                                                    Approve
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem onClick={() => handleDeleteDialogOpen(category.id)}>
                                                <Trash className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredCategories.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    No categories found in the "{activeTab}" tab.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Category Dialog */}
            <Dialog open={editCategoryDialogOpen} onOpenChange={setEditCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update the details for the selected category.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                name="name"
                                value={editCategory?.name || ""}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input
                                id="edit-description"
                                name="description"
                                value={editCategory?.description || ""}
                                onChange={handleEditInputChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => setEditCategoryDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={updateCategory}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Category Dialog */}
            <Dialog open={deleteCategoryDialogOpen} onOpenChange={setDeleteCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this category? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" onClick={() => setDeleteCategoryDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteCategory}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}