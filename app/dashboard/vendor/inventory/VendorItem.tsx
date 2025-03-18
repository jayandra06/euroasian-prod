import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const VendorItem = () => {
    

    const [items, setItems] = useState([
        { 
            id: 1, 
            impa: "", 
            description: "", 
            part_no: "", 
            position_no: "", 
            alternative_part_no: "", 
            brand: "", 
            model: "", 
            category: "", 
            dimension: "", 
            remarks: "", 
            isSaved: false, // Tracks whether the row is saved or editable
            isEditing: false
        }
    ]);

    // Handle input change
    const handleUpdateItem = (id, name, value) => {
        setItems(prevItems =>
            prevItems.map(item => (item.id === id ? { ...item, [name]: value } : item))
        );
    };

    // Remove a row
    const handleRemove = (id) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleEdit = (id) =>{
        setItems(prevItems => 
            prevItems.map(item =>
                item.id === id ? {...item , isEditing: !item.isEditing}:item
            )
        )
    }

    // Save current row and add a new blank row
    const handleAddItem = () => {
        setItems(prevItems => {
            const updatedItems = prevItems.map((item, index) => 
                index === prevItems.length - 1 ? { ...item, isSaved: true } : item
            );
            return [
                ...updatedItems,
                { 
                    id: prevItems.length + 1, 
                    impa: "", 
                    description: "", 
                    part_no: "", 
                    position_no: "", 
                    alternative_part_no: "", 
                    brand: "", 
                    model: "", 
                    category: "", 
                    dimension: "", 
                    remarks: "", 
                    isSaved: false ,
                    isEditing: false
                }
            ];
        });
    };

    return (
        <div className="overflow-x-auto mt-6 mb-16 px-4">
            <p className="text-3xl font-bold mt-4 mb-5">List of your Products</p>
            <Table className="w-full">
                <TableCaption>A list of your Products.</TableCaption>
                <TableHeader>
                    <TableRow className="text-sm">
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead>IMPA</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Part No</TableHead>
                        <TableHead>Position No</TableHead>
                        <TableHead>Alternative No</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Model</TableHead> 
                        <TableHead>Category</TableHead> 
                        <TableHead>Dimensions(W x B x H)</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={item.id} className="border-b">
                            <TableCell className="text-center">{index + 1}</TableCell>
                            
                            {/* IMPA */}
                            <TableCell className="p-2">
                                {item.isSaved && !item.isEditing ? (
                                    <span>{item.impa}</span>
                                ) : (
                                    <input 
                                        type="text" 
                                        value={item.impa} 
                                        className="border p-1 w-full text-sm rounded shadow-md border-gray-400"
                                        placeholder="IMPA"
                                        onChange={(e) => handleUpdateItem(item.id, "impa", e.target.value)} 
                                    />
                                )}
                            </TableCell>

                            {/* Description */}
                            <TableCell className="p-2">
                                {item.isSaved && !item.isEditing ? (
                                    <span>{item.description}</span>
                                ) : (
                                    <textarea 
                                        value={item.description} 
                                        placeholder="description"
                                        className="border p-1 w-full text-sm rounded shadow-md border-gray-400"
                                        onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)} 
                                    />
                                )}
                            </TableCell>

                            {/* Part No */}
                            <TableCell className="p-2">
                                {item.isSaved && !item.isEditing ? (
                                    <span>{item.part_no}</span>
                                ) : (
                                    <input 
                                        type="text" 
                                        value={item.part_no}
                                        placeholder="portno" 
                                        className="border p-1 w-full text-sm rounded shadow-md border-gray-400"
                                        onChange={(e) => handleUpdateItem(item.id, "part_no", e.target.value)} 
                                    />
                                )}
                            </TableCell>

                            {/* Position No */}
                            <TableCell className="p-2">
                                {item.isSaved && !item.isEditing ? (
                                    <span>{item.position_no}</span>
                                ) : (
                                    <input 
                                        type="text" 
                                        value={item.position_no} 
                                        placeholder="position no"
                                        className="border p-1 w-full text-sm rounded shadow-md border-gray-400"
                                        onChange={(e) => handleUpdateItem(item.id, "position_no", e.target.value)} 
                                    />
                                )}
                            </TableCell>

                            {/* Alternative No */}
                            <TableCell className="p-2">
                                {item.isSaved && !item.isEditing ? (
                                    <span>{item.alternative_part_no}</span>
                                ) : (
                                    <input 
                                        type="text" 
                                        value={item.alternative_part_no} 
                                        placeholder="alternative no"
                                        className="border p-1 w-full text-sm rounded shadow-md border-gray-400"
                                        onChange={(e) => handleUpdateItem(item.id, "alternative_part_no", e.target.value)} 
                                    />
                                )}
                            </TableCell>

                            {/* Brand */}
                            <TableCell className="p-2">
                                {item.isSaved && !item.isEditing ? (
                                    <span>{item.brand}</span>
                                ) : (
                                    <input 
                                        type="text" 
                                        value={item.brand} 
                                        placeholder="brand"
                                        className="border p-1 w-full text-sm rounded shadow-md border-gray-400"
                                        onChange={(e) => handleUpdateItem(item.id, "brand", e.target.value)} 
                                    />
                                )}
                            </TableCell>

                            {/* Model */}
                            <TableCell className="p-2">
                                {item.isSaved && !item.isEditing ? (
                                    <span>{item.model}</span>
                                ) : (
                                    <input 
                                        type="text" 
                                        value={item.model} 
                                        placeholder="model"
                                        className="border p-1 w-full text-sm rounded shadow-md border-gray-400"
                                        onChange={(e) => handleUpdateItem(item.id, "model", e.target.value)} 
                                    />
                                )}
                            </TableCell>

                            {/* Category */}
                            <TableCell className="p-2">
                                {item.isSaved && !item.isEditing ? (
                                    <span>{item.category}</span>
                                ) : (
                                    <input 
                                        type="text" 
                                        value={item.category} 
                                        placeholder="category"
                                        className="border p-1 w-full text-sm rounded shadow-md border-gray-400"
                                        onChange={(e) => handleUpdateItem(item.id, "category", e.target.value)} 
                                    />
                                )}
                            </TableCell>

                            {/* Dimensions */}
                            <TableCell className="p-2">
                                {item.isSaved && !item.isEditing ? (
                                    <span>{item.dimension}</span>
                                ) : (
                                    <input 
                                        type="text" 
                                        value={item.dimension}
                                        placeholder="dimension" 
                                        className="border p-1 w-full text-sm rounded shadow-md border-gray-400"
                                        onChange={(e) => handleUpdateItem(item.id, "dimension", e.target.value)} 
                                    />
                                )}
                            </TableCell>

                            {/* Remarks */}
                            <TableCell className="p-2">
                                {item.isSaved && !item.isEditing ? (
                                    <span>{item.remarks}</span>
                                ) : (
                                    <textarea 
                                        value={item.remarks}
                                        placeholder="remark" 
                                        className="border p-1 w-full text-sm rounded shadow-md border-gray-400"
                                        onChange={(e) => handleUpdateItem(item.id, "remarks", e.target.value)} 
                                    />
                                )}
                            </TableCell>

                            {/* Delete Button */}
                            <TableCell className="text-center">
                                <Button 
                                    onClick={() => handleRemove(item.id)} 
                                     
                                    className="text-black bg-white hover:text-red-700 hover:bg-white shadow-none  p-1"
                                >
                                    <Trash2 size={16} />
                                </Button>
                                
                            </TableCell>
                            <TableCell className="text-center">
                            <Button 
                                    onClick={() => handleEdit(item.id)} 
                                    
                                   className="text-black bg-white hover:text-blue-700 hover:bg-white shadow-none   p-1"
                                >
                                    <Pencil size={16} /> 
                                </Button>
                                
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4 flex justify-end">
                <Button onClick={handleAddItem} className="bg-black text-white px-4 py-2 rounded">
                    Add Product
                </Button>
            </div>
            
        </div>
    );
};

export default VendorItem;
