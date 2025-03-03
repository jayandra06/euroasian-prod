"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";


function ItemTable({ itemData, i }: { itemData: any, i: number }) {
    const [item, setItem] = useState<any>({ ...itemData });
    const [originalItem, setOriginalItem] = useState<any>();
    const [offer, setOffer] = useState(0);
    const [price, setPrice] = useState(item.quoted_price);
    const [alternative, setAlternative] = useState({ part_no: itemData.part_no, position_no: itemData.position_no, alternative_part_no: itemData.alternative_part_no, comment: itemData.comment });

    async function addAlternateItem() {
        const supabase = createClient();

        await supabase.from("itemcopy").update({ ...alternative }).eq("id", item.id);

        setItem({ ...item, ...alternative });
    }

    async function handleQuote() {
        const supabase = createClient();

        const itemDat = await supabase.from("itemcopy").update({ quoted: true, quoted_price: price, part_no: alternative.part_no, position_no: alternative.position_no, alternative_part_no: alternative.alternative_part_no, comment: `${alternative.comment}[OFFER]${offer}` }).eq("id", itemData.id);

        console.log("Quoted, ", itemDat);

        alert("Item Quoted Successfully!");
        window.location.reload();
    }

    async function fetchOriginal() {
        const supabase = createClient();
        const item = await supabase.from("item").select("*").eq("id", itemData.item).single();
        console.log(item.data);
        setOriginalItem(item.data);
        setOffer(item.data.offered_qty);
    }


    useEffect(() => {
        fetchOriginal();
    }, []);


    return (
        <TableRow key={item.id}>
            <TableCell className="font-medium">{i + 1}</TableCell>
            <TableCell colSpan={3}>
                <div className="grid gap-2 grid-cols-4">
                    <div className="col-span-4">
                        {item.description}
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                        <span className="font-bold">Parts No.: </span>{item.part_no},
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                        <span className="font-bold">Position No.: </span>{item.position_no},
                    </div>
                    {!item.quoted && (
                        <div className="col-span-4 flex gap-2">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Input id="vesselName" placeholder="Enter Comment..." value={alternative.comment} onChange={(e) => setAlternative({ ...alternative, comment: e.target.value })} className="col-span-3" />
                            </div>
                            <Dialog>
                                <DialogTrigger>
                                    <Button>
                                        Add Alternate Item
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Alternate Item</DialogTitle>
                                        <DialogDescription>
                                            Create Alternate Item
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="vesselName" className="text-right">
                                                Part No.
                                            </Label>
                                            <Input id="vesselName" placeholder="Enter Part No..." value={alternative.part_no} onChange={(e) => setAlternative({ ...alternative, part_no: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="vesselName" className="text-right">
                                                Position No.
                                            </Label>
                                            <Input id="vesselName" placeholder="Enter Part No..." value={alternative.position_no} onChange={(e) => setAlternative({ ...alternative, position_no: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="vesselName" className="text-right">
                                                Alternative Part No.
                                            </Label>
                                            <Input id="vesselName" placeholder="Enter Part No..." value={alternative.alternative_part_no} onChange={(e) => setAlternative({ ...alternative, alternative_part_no: e.target.value })} className="col-span-3" />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" onClick={addAlternateItem}>Add Item</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell>{originalItem?.req_qty}</TableCell>
            <TableCell>
                <Input type="text" placeholder="Enter Offered Quantity..." value={offer} onChange={(e) => setOffer(Number(e.target.value))} disabled={item.quoted} />
            </TableCell>
            <TableCell>{originalItem?.uom}</TableCell>
            <TableCell className="text-right">
                <Label htmlFor="vesselName" className="text-right">
                    Enter Price
                </Label>
                <Input id="vesselName" placeholder="Enter Quote Price..." type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="col-span-3" disabled={item.quoted} />

            </TableCell>
            <TableCell className="text-right">
                <Button onClick={handleQuote} disabled={item.quoted}>
                    {item.quoted ? "Quoted" : "Send Quote"}
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default function VendorRfqs() {
    const [items, setItems] = useState<any[]>();
    const [merchantData, setMerchantData] = useState<any>();

    const quotedItems = items?.filter((i) => i.quoted);

    async function fetchItems() {
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();
        const profileData = await supabase.from("profiles").select("*").eq("id", user!.id).single();
        const merchantData = await supabase.from("merchant").select("*").eq("merchant_profile", profileData.data.id).single();
        setMerchantData({ ...merchantData.data });

        const rfqs = await supabase.from("rfq").select("*").contains("assigned_to_merchants", merchantData.data!.id);
        const items = await supabase.from("itemcopy").select("*").eq("merchant", merchantData.data!.id);
        setItems([...items.data!]);
    }

    useEffect(() => {
        fetchItems();
    }, [])

    return (
        <>
            <main className="grid max-w-6xl w-full justify-self-center gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{merchantData?.name}</CardTitle>
                        <CardDescription>Status: {merchantData?.status}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2">
                            <div className="grid">
                                <h1 className="text-3xl font-bold">Merchant Id</h1>
                                <h1 className="text-xl font-light">{merchantData?.id}</h1>
                            </div>
                            <div className="grid">
                                <h1 className="text-3xl font-bold">Email</h1>
                                <h1 className="text-xl font-light">{merchantData?.business_email}</h1>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs">Since {merchantData?.created_at}.</p>
                    </CardFooter>
                </Card>

                <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>RFQ Recieved</CardTitle>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-4xl font-bold">
                                {items?.length}
                            </h1>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs">Total Recieved</p>
                        </CardFooter>
                    </Card>




                    <Card>
                        <CardHeader>
                            <CardTitle>Quoted Back</CardTitle>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-4xl font-bold">
                                {quotedItems?.length}
                            </h1>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs">Total Quoted</p>
                        </CardFooter>
                    </Card>


                    <Card>
                        <CardHeader>
                            <CardTitle>RFQ Pending</CardTitle>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-4xl font-bold">
                                {(items?.length && quotedItems?.length) && (items?.length - quotedItems?.length)}
                            </h1>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs">Pending</p>
                        </CardFooter>
                    </Card>
                </div>



                <div className="mt-4 max-w-6xl overflow-x-scroll">
                    <div className="min-w-5xl max-w-9xl grid">
                        <Table className="min-w-5xl max-w-9xl w-full">
                            <TableCaption>List Of Items.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">No.</TableHead>
                                    <TableHead colSpan={3}>Description</TableHead>
                                    <TableHead>Req. Qty.</TableHead>
                                    <TableHead>Offered. Qty.</TableHead>
                                    <TableHead>UOM</TableHead>
                                    <TableHead className="text-right">Quoted Price</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items?.map((item, i) =>
                                    <ItemTable itemData={item} key={i} i={i} />
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>
        </>
    )
}