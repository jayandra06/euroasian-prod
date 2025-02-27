// @ts-nocheck
"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";


// function InfoCard() {
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Requisition Info</CardTitle>
//                 <CardDescription></CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <div className="grid w-full max-w-sm items-center gap-1.5">
//                     <Label htmlFor="clientName">Client Name</Label>
//                     <Input type="text" id="clientName" placeholder="Client Name" />
//                 </div>
//                 <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
//                     <Label htmlFor="clientName">Client Email</Label>
//                     <Input type="email" id="clientName" placeholder="Client Email" />
//                 </div>
//                 <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
//                     <Label htmlFor="clientName">Created At</Label>
//                     <Input type="text" id="clientName" placeholder="10/02/2025" />
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

function RFQInfoCard({ rfq }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>RFQ Info</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Lead Date</Label>
                    <Input type="text" id="clientName" placeholder="10/02/2025" value={rfq?.lead_date} disabled />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Supply Port</Label>
                    <Input type="text" id="clientName" placeholder="BUSSAN" value={rfq?.supply_port} disabled />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Expire Date</Label>
                    <Input type="text" id="clientName" placeholder="10/02/2025" value={rfq?.expire_date} disabled />
                </div>
            </CardContent>
        </Card>
    )
}


function VesselCard({ rfq }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Vessel Info</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="clientName">Vessel Name</Label>
                    <Input type="text" id="clientName" placeholder="RFQ No." value={rfq?.vessel_name} disabled />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">IMO No</Label>
                    <Input type="text" id="clientName" placeholder="10/02/2025" value={rfq?.imo_no} disabled />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Port</Label>
                    <Input type="text" id="clientName" placeholder="BUSSAN" value={rfq?.port} disabled />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Hull No</Label>
                    <Input type="text" id="clientName" placeholder="10/02/2025" value={rfq?.hull_no} disabled />
                </div>
            </CardContent>
        </Card>
    )
}


function EquipmentCard({ rfq }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Equipments Details</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="clientName">Equipments Tags</Label>
                        <div className="my-1 flex gap-1">
                            {rfq?.equipment_tags.map((tag, i) =>
                                <div className="px-2 rounded-full bg-zinc-500 text-white text-xs" key={i}>
                                    {tag}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="clientName">Brand</Label>
                        <Input type="text" id="clientName" placeholder="10/02/2025" value={rfq?.brand} />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="clientName">Model</Label>
                        <Input type="text" id="clientName" placeholder="BUSSAN" value={rfq?.model} />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="clientName">Category</Label>
                        <Input type="text" id="clientName" placeholder="10/02/2025" value={rfq?.category} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}



export default function RFQDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const [rfq, setRfq] = useState<any>();
    const [items, setItems] = useState<any[]>();
    const finalItem = items?.filter((i) => i.status == "finalized");

    let price = 0;

    finalItem?.forEach((i) => price += i.quoted_price + i.quoted_price * i.margin / 100);


    async function fetchRFQs() {
        const id = (await params).id
        const supabase = createClient();
        const rfq = await supabase.from("rfq").select("*").eq("id", id).single();

        setRfq(rfq.data);

        const items = await supabase.from("item").select("*").eq("rfq", rfq.data!.id);
        setItems([...items.data!]);
    }

    useEffect(() => {
        fetchRFQs();
    }, []);


    return (
        <main className="grid">
            <div className="pt-4 max-w-6xl w-full grid justify-self-center">
                <h1 className="text-3xl font-bold">
                    RFQ Detail
                </h1>
                <h3 className="mt-2">
                    Id: {rfq?.id}
                </h3>
            </div>

            <main className="grid justify-self-center max-w-6xl w-full md:grid-cols-3 gap-4 mt-4">
                <RFQInfoCard rfq={rfq} />
                <VesselCard rfq={rfq} />
                <EquipmentCard rfq={rfq} />
            </main>

            {/* <main className="grid justify-self-center my-8 max-w-6xl w-full">
                <EquipmentCard />
            </main> */}

            <div className="grid justify-self-center max-w-6xl w-full mb-24">
                <div>
                    <h1 className="text-xl font-bold">
                        Items
                    </h1>
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
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items?.map((item, i) =>
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{i + 1}</TableCell>
                                        <TableCell colSpan={3}>
                                            <div className="grid gap-2 grid-cols-3">
                                                <div className="col-span-3">
                                                    {item.description}
                                                </div>
                                                <div className="col-span-3 sm:col-span-1">
                                                    <span className="font-bold">Parts No.: </span>{item.part_no},
                                                </div>
                                                <div className="col-span-3 sm:col-span-1">
                                                    <span className="font-bold">Position No.: </span>{item.position_no},
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.req_qty}</TableCell>
                                        <TableCell>{item.offered_qty}</TableCell>
                                        <TableCell>{item.uom}</TableCell>
                                        <TableCell className="text-right">{item.status}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>



            {(items?.length == finalItem?.length) && (
                <Card className="max-w-lg mb-16">
                    <CardHeader>
                        <CardTitle>Total Amount</CardTitle>
                        <CardDescription>Total Price</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {finalItem?.map((item, i) =>
                            <h1 className="font-bold text-lg" key={i}>
                                Item {i+1}: <span className="font-medium">{item.quoted_price + item.quoted_price*item.margin/100}</span>
                            </h1>
                        )}
                        <h1 className="font-bold text-lg mt-4 py-1 border-t border-zinc-300 dark:border-zinc-700">
                            Total Price: <span className="font-medium">{price}</span>
                        </h1>
                    </CardContent>
                    <CardFooter>
                        <p>Amount Details</p>
                    </CardFooter>
                </Card>

            )}
        </main>
    )
}