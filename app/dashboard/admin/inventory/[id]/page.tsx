// "use client";
// import { createClient } from "@/utils/supabase/client";
// import { useState, useEffect } from "react";
// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"

// export default function InventoryForMerchant({
//     params,
// }: {
//     params: Promise<{ id: string }>
// }) {
//     const [id, setId] = useState("0");

//     const [products, setProducts] = useState<any[]>([]);

//     async function fetchProducts() {
//         const id = (await params).id
//         setId(id);

//         const supabase = createClient();

//         const products = await supabase.from("product").select("*").eq("merchant", id);

//         setProducts([...products.data!]);
//     }

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     return (
//         <main className="mt-8 p-4">
//         <div>
//             <h1 className="text-xl font-bold">
//                 Inventory Of Merchant
//             </h1>
//             <h3>
//                 {id}
//             </h3>
//         </div>

//         <div className="mt-8">
//         <Table>
//         <TableCaption>A list of your Products.</TableCaption>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead className="w-[100px]">SKU</TableHead>
//                             <TableHead>Name</TableHead>
//                             <TableHead>Description</TableHead>
//                             <TableHead className="text-right">Quantity</TableHead>
//                             <TableHead className="text-right">Price</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {products.map((product, i) =>
//                             <TableRow key={i}>
//                                 <TableCell className="font-medium">{product.sku}</TableCell>
//                                 <TableCell>{product.name}</TableCell>
//                                 <TableCell>{product.description}</TableCell>
//                                 <TableCell className="text-right">{product.quantity}</TableCell>
//                                 <TableCell className="text-right">{product.price}</TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//             </Table>
//         </div>
//     </main>
//     )
// };


"use client";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx";
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";


function Drive({ drive }: { drive: any }) {
    async function download() {
        const supabase = createClient();

        const {data} = await supabase.storage.from("drive_image").createSignedUrl(drive?.path, 60, {download: true});    
        window.location.href = data!.signedUrl;    
    }

    async function requestAdmin() {
        const supabase = createClient();

        await supabase.from("drive").update({ drive_status: "requested" }).eq("id", drive.id);
        alert("Successfully Sent Request!");
        window.location.reload();
    }

    async function approve() {
        const supabase = createClient();
        await supabase.from("drive").update({ drive_status: "approved" }).eq("id", drive.id);
        alert("Successfully Approved!");
        window.location.reload();
    }

    return (
        <Card className={`${drive?.drive_status == "requested" ?  "bg-rose-100 dark:bg-rose-950 dark:border dark:border-rose-500" : "bg-zinc-50 dark:bg-zinc-950 dark:border dark:border-zinc-500"} ${drive.drive_status == "approved" && "bg-emerald-100"}`}>
            <CardHeader>
                <CardTitle>File Id</CardTitle>
                <CardDescription>{drive?.drive_file}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end gap-2">
                    <Button onClick={download}>
                        Download File
                    </Button>
                    <Button className={`${drive?.drive_status == "approved" && "bg-emerald-100"}`} disabled={!(drive?.drive_status == "uploaded")} onClick={requestAdmin}>
                        {drive?.drive_status == "uploaded" && "Request Admin"}
                        {drive?.drive_status == "requested" && "Requested"}
                        {drive?.drive_status == "approved" && "Approved"}
                    </Button>
                    {drive?.drive_status == "requested" && (
                        <Button onClick={approve}>
                            Approve
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}


// function Drive({ drive }: { drive: any }) {
//     async function requestAdmin() {
//         const supabase = createClient();

//         await supabase.from("drive").update({ drive_status: "requested" }).eq("id", drive.id);
//         alert("Successfully Sent Request!");
//     }

//     async function createDownloadLink() {
//         const supabase = createClient()
//         console.log(drive)
//         const file = await supabase.storage.from("drive_image").createSignedUrl(drive.path, 60, {download: true});

//         console.log(file);
//     }

//     return (
//         <Card className={`${drive.drive_status == "uploaded" ? "bg-zinc-50 dark:bg-zinc-950 dark:border dark:border-zinc-500" : "bg-rose-100 dark:bg-rose-950 dark:border dark:border-rose-500"} ${drive.drive_status == "approved" && "bg-emerald-100"}`}>
//             <CardHeader>
//                 <CardTitle>File Id</CardTitle>
//                 <CardDescription>{drive.drive_file}</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <div className="flex justify-end gap-2">
//                     <Button onClick={createDownloadLink}>
//                         Download File
//                     </Button>
//                     <Button className={`${drive.drive_status == "approved" && "bg-emerald-100"}`} disabled={!(drive.drive_status == "uploaded")} onClick={requestAdmin}>
//                         {drive.drive_status == "uploaded" && "Request Admin"}
//                         {drive.drive_status == "requested" && "Requested"}
//                         {drive.drive_status == "approved" && "Approved"}
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }


export default function InventoryForMerchant({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const [driveUpload, setDriveUpload] = useState("");
    const [products, setProducts] = useState<any[]>([]);
    const [newProduct, setNewProduct] = useState({ sku: "", name: "", description: "", product_image: "", quantity: 0, price: 0 });
    const [drives, setDrives] = useState<any[]>([]);

    async function handleDriveUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const supabase = createClient();

            const file = e.target.files[0];
            const id = (await params).id;
    
            const {data: {user}} = await supabase.auth.getUser();
            const merchantData = await supabase.from("merchant").select("*").eq("id", id).single();
    
            const { data } = await supabase
                .storage
                .from('drive_image')
                .upload(`${user!.id}/${crypto.randomUUID()}/${file.name}`, file);
            setDriveUpload(data!.id);
        }
    }

    async function handleProductImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const supabase = createClient();
            const file = e.target.files[0];
            const id = (await params).id;
    
            const merchantData = await supabase.from("merchant").select("*").eq("id", id).single();
            const {data:{user}} = await supabase.auth.getUser();

            const { data } = await supabase
                .storage
                .from('product_image')
                .upload(`${user!.id}/${crypto.randomUUID()}/${file.name}`, file);

            if (data) {
                setNewProduct({ ...newProduct, product_image: data.id });
            }
        }
    }

    async function uploadToDrive() {
        const supabase = createClient();

        const id = (await params).id;
        const merchantData = await supabase.from("merchant").select("*").eq("id", id).single();

        const file = await supabase.from("drive").insert({ drive_file: driveUpload, drive_status: "uploaded", merchant: merchantData.data.id }).select();

        setDrives([...drives, ...file.data!]);
        alert("Successfully Uploaded to Drive!!!");
    }


    async function handleProductUpload() {
        const supabase = createClient();

        const id = (await params).id;
        const merchant = await supabase.from("merchant").select("*").eq("id", id).single();

        const product = await supabase.from("product").insert({ ...newProduct, created_at: new Date().toISOString(), merchant: id }).select();

        setProducts([...products, product.data]);
        console.log("Product Added, ", product.data);
        alert("Product Added Successfully!")
    }


    async function fetchItems() {
        const supabase = createClient();

        const id = (await params).id;
        const merchantData = await supabase.from("merchant").select("*").eq("id", id).single();

        const products = await supabase.from("product").select("*").eq("merchant", merchantData.data.id);
        setProducts([...products.data!]);

        const drives = await supabase.from("drive").select("*").eq("merchant", merchantData.data.id);
        setDrives([...drives.data!]);
    }

    const [data, setData] = useState<any[]>([]);

    function handleBulkUpload(e: any) {
        const file = e.target.files[0];
        console.log(file);

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                // @ts-ignore
                const binaryStr = e.target!.result;
                const workbook = XLSX.read(binaryStr, { type: "binary" });
                const sheetName = workbook.SheetNames[0]; // Get the first sheet name
                const sheet = workbook.Sheets[sheetName]; // Get the first sheet
                const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON
                console.log(jsonData);

                setData(jsonData);
            };

            reader.readAsBinaryString(file);
        }
    }

    async function addProducts() {
        const supabase = createClient();
        const id = (await params).id;
        const merchant = await supabase.from("merchant").select("*").eq("id", id).single();

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const products = await supabase.from("product").insert({ ...row, created_at: new Date().toISOString(), merchant: merchant.data.id, product_image: "" }).select();
            setProducts([...products.data!]);
        }

        alert("Successfully Added Products!");
    }


    useEffect(() => {
        fetchItems();
    }, []);


    return (
        <main className="max-w-6xl w-full grid justify-self-center mt-8">
            <div>
                <h1>
                    Your Inventory
                </h1>
            </div>

            <div className="mt-4">
                <div className="flex justify-between">
                    <div className="font-bold">
                        Drive
                    </div>

                    <div>
                        <Dialog>
                            <DialogTrigger>Add File</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add File</DialogTitle>
                                    <DialogDescription>
                                        Add Files to Drive
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-4">
                                    <Label htmlFor="file">File</Label>
                                    <Input id="file" type="file" onChange={handleDriveUpload} />
                                </div>
                                <div className="flex justify-end w-full">
                                    <Button onClick={uploadToDrive}>
                                        Add
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="mt-8 grid gap-4">
                    {drives.map((drive, i) =>
                        <Drive drive={drive} key={i} />
                    )}
                </div>
            </div>

            <div className="my-4 flex gap-2 mt-8">
                <Link href={"/EuroAsiann Sample.xlsx"}>
                    <Button>
                        Download Template
                    </Button>
                </Link>
                <div>
                    <Label htmlFor="bulkFile" className="relative">
                        <Input type="file" name="bulkFile" id="bulkFile" className="absolute top-0 left-0 opacity-0" onChange={handleBulkUpload} />
                        <Button>
                            Upload
                        </Button>
                    </Label>

                </div>
                <Dialog>
                    <DialogTrigger>
                        <Button>
                            View
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>View</DialogTitle>
                            <DialogDescription>
                                Check Bulk Upload Data
                            </DialogDescription>
                        </DialogHeader>

                        <Table>
                            <TableCaption>A list of your Products.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">SKU</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((product, i) =>
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{product.sku}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell className="text-right">{product.quantity}</TableCell>
                                        <TableCell className="text-right">{product.price}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <DialogFooter>
                            <Button type="submit" onClick={addProducts}>Add Products</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mt-8">
                <Dialog>
                    <DialogTrigger>
                        <Button>
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Product</DialogTitle>
                            <DialogDescription>
                                Enter Details of Product
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vesselName" className="text-right">
                                    SKU
                                </Label>
                                <Input id="vesselName" placeholder="Enter SKU..." value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vesselName" className="text-right">
                                    Name
                                </Label>
                                <Input id="vesselName" placeholder="Enter Name..." value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vesselName" className="text-right">
                                    Description
                                </Label>
                                <Input id="vesselName" placeholder="Enter Description..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vesselName" className="text-right">
                                    Product Image
                                </Label>
                                <Input id="vesselName" placeholder="Enter Description..." type="file" className="col-span-3" onChange={handleProductImageUpload} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vesselName" className="text-right">
                                    Quantity
                                </Label>
                                <Input id="vesselName" placeholder="Enter Quantity..." type="number" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vesselName" className="text-right">
                                    Price
                                </Label>
                                <Input id="vesselName" placeholder="Enter Price..." type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="col-span-3" />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" onClick={handleProductUpload}>Add Product</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mt-4 mb-24">
                <Table>
                    <TableCaption>A list of your Products.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">SKU</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product, i) =>
                            <TableRow key={i}>
                                <TableCell className="font-medium">{product.sku}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell className="text-right">{product.quantity}</TableCell>
                                <TableCell className="text-right">{product.price}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </main>
    )
}