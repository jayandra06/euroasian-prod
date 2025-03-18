// @ts-nocheck
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
// import { comment } from "postcss";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";

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
          <Input
            type="text"
            id="clientName"
            placeholder="10/02/2025"
            value={rfq?.lead_date}
            disabled
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <Label htmlFor="clientName">Supply Port</Label>
          <Input
            type="text"
            id="clientName"
            placeholder="BUSSAN"
            value={rfq?.supply_port}
            disabled
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <Label htmlFor="clientName">Expire Date</Label>
          <Input
            type="text"
            id="clientName"
            placeholder="10/02/2025"
            value={rfq?.expire_date}
            disabled
          />
        </div>
      </CardContent>
    </Card>
  );
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
          <Input
            type="text"
            id="clientName"
            placeholder="RFQ No."
            value={rfq?.vessel_name}
            disabled
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <Label htmlFor="clientName">IMO No</Label>
          <Input
            type="text"
            id="clientName"
            placeholder="10/02/2025"
            value={rfq?.imo_no}
            disabled
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <Label htmlFor="clientName">Port</Label>
          <Input
            type="text"
            id="clientName"
            placeholder="BUSSAN"
            value={rfq?.port}
            disabled
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <Label htmlFor="clientName">Hull No</Label>
          <Input
            type="text"
            id="clientName"
            placeholder="10/02/2025"
            value={rfq?.hull_no}
            disabled
          />
        </div>
      </CardContent>
    </Card>
  );
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
              {rfq?.equipment_tags.map((tag, i) => (
                <div
                  className="px-2 rounded-full bg-zinc-500 text-white text-xs"
                  key={i}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="clientName">Brand</Label>
            <Input
              type="text"
              id="clientName"
              placeholder="10/02/2025"
              value={rfq?.brand}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="clientName">Model</Label>
            <Input
              type="text"
              id="clientName"
              placeholder="BUSSAN"
              value={rfq?.model}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="clientName">Category</Label>
            <Input
              type="text"
              id="clientName"
              placeholder="10/02/2025"
              value={rfq?.category}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MerchantRow({
  merchant,
  copies,
  itemId,
  isMerchant,
  item,
  addMargin,
  setMargin,
  margin,
}) {
  const [sended, setSended] = useState(false);
  console.log(isMerchant);
  const sizeCopy = copies.filter((c) => c.merchant == merchant.id);

  let total =
    sizeCopy[0]?.quoted_price + (sizeCopy[0]?.quoted_price * margin) / 100;

  async function handleSend() {
    const supabase = createClient();

    // const item = await supabase.from("item").update({ merchant: merchant.id, status: "send" }).eq("id", itemId);
    const itemcopy = await supabase.from("itemcopy").insert({
      item: itemId,
      merchant: merchant.id,
      comment: "",
      part_no: item.part_no,
      position_no: item.position_no,
      alternative_part_no: item.alternative_part_no,
      quoted_price: 0,
      quoted: false,
    });

    console.log(itemcopy.data);
    setSended(true);
  }

  return (
    <TableRow>
      <TableCell colSpan={8}>
        <div>
          <h1 className="text-xl font-bold my-2">Merchants</h1>

          <div className="mt-4">
            <Card
              className={
                (sizeCopy.length || isMerchant) &&
                `bg-emerald-100 dark:bg-emerald-950/80 dark:border dark:border-emerald-500`
              }
            >
              <CardHeader>
                <CardTitle>{merchant.name}</CardTitle>
                <CardDescription>{merchant.business_email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:flex sm:gap-4">
                  <div className="text-base font-light">
                    <span className="font-bold">Merchant Id:</span>
                    {merchant.id}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="grid justify-end w-full">
                  {!sizeCopy[0]?.quoted ? (
                    <Button onClick={handleSend} disabled={sizeCopy.length}>
                      {sizeCopy.length || sended ? "RFQ Sended!" : "Send RFQ"}
                    </Button>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <div className="grid items-end">
                          <Dialog>
                            <DialogTrigger>
                              <Button className="">Alternative</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Alternative</DialogTitle>
                                <DialogDescription>
                                  Alternative
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-2">
                                <div>
                                  <Label>Part No</Label>
                                  <Input
                                    type="text"
                                    value={sizeCopy[0].part_no}
                                    disabled
                                  />
                                </div>
                                <div>
                                  <Label>Position No</Label>
                                  <Input
                                    type="text"
                                    value={sizeCopy[0].position_no}
                                    disabled
                                  />
                                </div>
                                <div>
                                  <Label>Alternative Part No</Label>
                                  <Input
                                    type="text"
                                    value={sizeCopy[0].alternative_part_no}
                                    disabled
                                  />
                                </div>
                                <div>
                                  <Label>Comment</Label>
                                  <Input
                                    type="text"
                                    value={
                                      sizeCopy[0].comment.split("[OFFER]")[0]
                                    }
                                    disabled
                                  />
                                </div>
                              </div>

                              <DialogFooter>
                                <Button type="submit">Add Model</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div>
                          <Label className="text-xs">Quoted Price</Label>
                          <Input
                            value={sizeCopy[0].quoted_price}
                            disabled
                            className="bg-white text-black"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Add Margin(%)</Label>
                          <Input
                            value={margin}
                            type="number"
                            className="bg-white text-black"
                            onChange={(e) => setMargin(e.target.value)}
                            disabled={item.status == "finalized"}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Total Price</Label>
                          <Input
                            value={total}
                            type="number"
                            className="bg-white text-black"
                            disabled
                          />
                        </div>
                        {item.status !== "finalized" && (
                          <div className="self-end">
                            <Button
                              onClick={() =>
                                addMargin(
                                  margin,
                                  sizeCopy[0].quoted_price,
                                  merchant.id,
                                  sizeCopy[0].comment.split("[OFFER]")[1]
                                )
                              }
                            >
                              Finalize
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

function ItemRow({ item, merchants, i }) {
  const [margin, setMargin] = useState<number>(item.margin);
  const [copies, setCopies] = useState<any[]>([]);
  const [openMerchant, setOpenMerchant] = useState(false);

  async function addMargin(margin, quoted_price, marchantId, offered_qty) {
    const supabase = createClient();

    await supabase
      .from("item")
      .update({
        margin: margin,
        quoted_price: quoted_price,
        quoted: true,
        merchant: marchantId,
        offered_qty: Number(offered_qty),
      })
      .eq("id", item.id);
    alert("Margin Successfully Added!");
    window.location.reload();
  }

  async function fetchCopies() {
    const supabase = createClient();

    const itemsCopies = await supabase
      .from("itemcopy")
      .select("*")
      .eq("item", item.id);
    setCopies([...itemsCopies.data!]);
  }

  useEffect(() => {
    fetchCopies();
  }, []);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{i + 1}</TableCell>
        <TableCell colSpan={3}>
          <div className="grid gap-2 grid-cols-3">
            <div className="col-span-3">{item.description}</div>
            <div className="col-span-3 sm:col-span-1">
              <span className="font-bold">Parts No.: </span>
              {item.part_no},
            </div>
            <div className="col-span-3 sm:col-span-1">
              <span className="font-bold">Position No.: </span>
              {item.position_no},
            </div>
          </div>
        </TableCell>
        <TableCell>{item.req_qty}</TableCell>
        <TableCell>
          {" "}
          <Input
            type="number"
            name="margin"
            value={margin}
          />
        </TableCell>
        <TableCell>{item.uom}</TableCell>
        <TableCell className="text-right">
          <Input
            type="number"
            name="margin"
            value={margin}
          />
        </TableCell>
      </TableRow>
    </>
  );
}

export default function RFQDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [rfq, setRfq] = useState<any>();
  const [items, setItems] = useState<any[]>();
  const [merchants, setMerchants] = useState<any[]>();

  const filterItem = items?.filter((i) => i.quoted);
  const finalItem = items?.filter((i) => i.status == "finalized");
  const allmerchant = merchants?.filter(
    (m) =>
      m.brands.includes(rfq.brand) ||
      m.category.includes(rfq.category) ||
      m.model.includes(rfq.model)
  );

  let price = 0;

  finalItem?.forEach(
    (i) => (price += i.quoted_price + (i.quoted_price * i.margin) / 100)
  );

  async function fetchRFQs() {
    const id = (await params).id;
    const supabase = createClient();
    const rfq = await supabase.from("rfq").select("*").eq("id", id).single();

    setRfq(rfq.data);

    const items = await supabase
      .from("rfq_items")
      .select("*")
      .eq("rfq_id", rfq.data!.id);
    setItems([...items.data!]);

    const merchants = await supabase.from("merchant").select("*");
    setMerchants([...merchants.data]);
  }

  async function sendQuote() {
    const supabase = createClient();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await supabase
        .from("item")
        .update({ status: "finalized" })
        .eq("id", item.id);
    }

    console.log("Quote Sended");
    alert("Quote Successfully Sended!!!");
    window.location.reload();
  }

  useEffect(() => {
    let loaded = false;
    if (!loaded) {
      fetchRFQs();
      loaded = true;
    }
  }, []);

  return (
    <main className="grid">
      <div className="pt-4 max-w-6xl w-full grid justify-self-center">
        <h1 className="text-3xl font-bold">RFQ Detail</h1>
        <h3 className="mt-2">{rfq?.id}</h3>
      </div>

      <main className="grid justify-self-center max-w-6xl w-full md:grid-cols-3 gap-4 mt-4">
        <RFQInfoCard rfq={rfq} />
        <VesselCard rfq={rfq} />
        <EquipmentCard rfq={rfq} />
      </main>

      <div className="grid justify-self-center max-w-6xl w-full mb-24">
        <div>
          <h1 className="text-xl font-bold">Items</h1>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item, i) => (
                  <ItemRow item={item} key={i} i={i} merchants={allmerchant} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {items?.length && (
        <div className="my-4 flex justify-center">
          <Button
            onClick={sendQuote}
            disabled={finalItem?.length == items?.length}
          >
            {!items?.length ? "Quote Sended" : "Send Quote"}
          </Button>
        </div>
      )}
    </main>
  );
}
