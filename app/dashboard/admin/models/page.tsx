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
import Link from "next/link";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Model {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [newModel, setNewModel] = useState({ name: "", description: "" });
  const [editModelDialogOpen, setEditModelDialogOpen] = useState(false);
  const [editModel, setEditModel] = useState<Model | null>(null);
  const [deleteModelDialogOpen, setDeleteModelDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  const filteredModels = models.filter((model) =>
    activeTab === "active" ? model.is_active : !model.is_active
  );

  async function fetchModels() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("model")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching models:", error);
      alert("Error fetching models. Please check the console.");
    } else if (data) {
      setModels(data);
    }
    setLoading(false);
  }

  async function addModel() {
    const supabase = createClient();
    const { error } = await supabase
      .from("model")
      .insert({
        ...newModel,
        is_active: false,
        created_at: new Date().toISOString(),
      }); // Default to pending

    if (error) {
      console.error("Error adding model:", error);
      alert("Failed to add the new model. Please check the console.");
    } else {
      alert(
        `${newModel.name} has been successfully added and is pending approval.`
      );
      setNewModel({ name: "", description: "" });
      fetchModels();
    }
  }

  async function updateModel() {
    if (!editModel) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("model")
      .update({ name: editModel.name, description: editModel.description })
      .eq("id", editModel.id);

    if (error) {
      console.error("Error updating model:", error);
      alert("Failed to update the model details. Please check the console.");
    } else {
      alert(`${editModel.name} has been successfully updated.`);
      setEditModelDialogOpen(false);
      setEditModel(null);
      fetchModels();
    }
  }

  async function deleteModel(id: string) {
    if (!window.confirm("Are you sure you want to delete this model?")) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("model").delete().eq("id", id);

    if (error) {
      console.error("Error deleting model:", error);
      alert("Failed to delete the model. Please check the console.");
    } else {
      alert("The model has been successfully deleted.");
      fetchModels();
    }
  }

  const handleEditDialogOpen = (model: Model) => {
    setEditModel(model);
    setEditModelDialogOpen(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setEditModel((prevModel) => {
      if (!prevModel) return prevModel; // safeguard against null

      return {
        ...prevModel,
        [name]: value,
      };
    });
  };

  const handleDeleteDialogOpen = (id: string) => {
    setModelToDelete(id);
    setDeleteModelDialogOpen(true);
  };

  const handleTabChange = (tab: "active" | "pending") => {
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  if (loading) {
    return <div>Loading models...</div>;
  }

  return (
    <>
      <div className="mt-8 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Models</h1>
        <div className="flex gap-2 justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Model</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Model</DialogTitle>
                <DialogDescription>
                  Enter the details for the new model.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newModel.name}
                    onChange={(e) =>
                      setNewModel({ ...newModel, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newModel.description}
                    onChange={(e) =>
                      setNewModel({
                        ...newModel,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={addModel}>
                  Add Model
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
            {filteredModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell>{model.name}</TableCell>
                <TableCell>{model.description || "-"}</TableCell>
                <TableCell>{model.is_active ? "Active" : "Pending"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditDialogOpen(model)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteDialogOpen(model.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredModels.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No models found in the "{activeTab}" tab.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Model Dialog */}
      <Dialog open={editModelDialogOpen} onOpenChange={setEditModelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Model</DialogTitle>
            <DialogDescription>
              Update the details for the selected model.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={editModel?.name || ""}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                name="description"
                value={editModel?.description || ""}
                onChange={handleEditInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setEditModelDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={updateModel}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Model Dialog */}
      <Dialog
        open={deleteModelDialogOpen}
        onOpenChange={setDeleteModelDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this model? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setDeleteModelDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteModel(modelToDelete!)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
