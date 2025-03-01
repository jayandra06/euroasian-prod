"use client";
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Textarea} from "@/components/ui/textarea"
import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Trash2} from "lucide-react";


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

// @ts-ignore
function RFQInfoCard({rfqInfo, setRfqInfo}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>RFQ Info</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Lead Date</Label>
                    <Input type="date" id="clientName" placeholder="Enter Lead Date..." className="grid"
                           value={rfqInfo.lead_date}
                           onChange={(e) => setRfqInfo({...rfqInfo, lead_date: e.target.value})}/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Supply Port</Label>
                    {/* <Input type="text" id="clientName" placeholder="Enter Supply Port..." value={rfqInfo.supply_port} onChange={(e) => setRfqInfo({ ...rfqInfo, supply_port: e.target.value })} /> */}
                    <Select onValueChange={(e) => setRfqInfo({...rfqInfo, supply_port: e})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Supply Port"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Bussan">Bussan</SelectItem>
                            <SelectItem value="Goa">Goa</SelectItem>
                            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="Kerala">Kerala</SelectItem>
                            <SelectItem value="Mumbai">Mumbai</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Expire Date</Label>
                    <Input type="date" id="clientName" className="grid" placeholder="Enter Expire Date..."
                           value={rfqInfo.expire_date}
                           onChange={(e) => setRfqInfo({...rfqInfo, expire_date: e.target.value})}/>
                </div>
            </CardContent>
        </Card>
    )
}

// @ts-ignore
function VesselCard({vesselInfo, setVesselInfo}) {
    const [vessels, setVessels] = useState<any[]>([]);

    async function fetchVessels() {
        const supabase = createClient();

        const {data: {user}} = await supabase.auth.getUser();

        const memberProfiles = await supabase.from("member").select("*").eq("member_profile", user!.id);

        let allVessels: any[] = [];

        for (let i = 0; i < memberProfiles.data!.length; i++) {
            const member = memberProfiles.data![i];
            const branch = await supabase.from("branch").select("*").eq("id", member!.branch).single();
            allVessels.push(branch.data.vessels)
        }

        setVessels(allVessels)
    }

    useEffect(() => {
        fetchVessels();
    }, []);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Vessel Info</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="clientName">Vessel Name</Label>
                    {/* <Input type="text" id="clientName" placeholder="Enter Vessel Name..." value={vesselInfo.name} onChange={(e) => setVesselInfo({ ...vesselInfo, name: e.target.value })} /> */}
                    <Select onValueChange={(e) => setVesselInfo({...vesselInfo, name: e})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Vessel"/>
                        </SelectTrigger>
                        <SelectContent>
                            {vessels.map((vessel, i) =>
                                <SelectItem value={vessel} key={i}>{vessel}</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">IMO No</Label>
                    <Input type="text" id="clientName" placeholder="Enter IMO No." value={vesselInfo.imo_no}
                           onChange={(e) => setVesselInfo({...vesselInfo, imo_no: e.target.value})}/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Port</Label>
                    {/* <Input type="text" id="clientName" placeholder="Enter Port..." value={vesselInfo.port} onChange={(e) => setVesselInfo({ ...vesselInfo, port: e.target.value })} /> */}
                    <Select onValueChange={(e) => setVesselInfo({...vesselInfo, port: e})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Port"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Bussan">Bussan</SelectItem>
                            <SelectItem value="Goa">Goa</SelectItem>
                            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="Kerala">Kerala</SelectItem>
                            <SelectItem value="Mumbai">Mumbai</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Hull No</Label>
                    <Input type="text" id="clientName" placeholder="Enter HULL No." value={vesselInfo.hull_no}
                           onChange={(e) => setVesselInfo({...vesselInfo, hull_no: e.target.value})}/>
                </div>
            </CardContent>
        </Card>
    )
}

// @ts-ignore
function EquipmentCard({equipmentTags, setEquipmentTags, models, brands, category}) {
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState("");

    return (
        <Card>
            <CardHeader>
                <CardTitle>Equipments Details</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 my-1">
                    {equipmentTags.tags.map((tag: string, i: any) =>
                        <div key={i} className="px-2 rounded-full bg-zinc-500 text-white text-xs">
                            {tag}
                        </div>
                    )}
                </div>
                <div className="grid gap-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="clientName">Equipments Tags</Label>
                        <Input type="text" id="clientName" placeholder="Enter Equipment Tags" value={currentTag}
                               onChange={(e) => setCurrentTag(e.target.value)}/>
                        <Button onClick={() => {
                            setEquipmentTags({...equipmentTags, tags: [...equipmentTags.tags, currentTag]});
                            setCurrentTag("")
                        }}>
                            Add
                        </Button>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="clientName">Brand</Label>
                        <Select onValueChange={(v) => setEquipmentTags({...equipmentTags, brand: v})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Brand"/>
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="clientName">Model</Label>
                        <Select onValueChange={(v) => setEquipmentTags({...equipmentTags, model: v})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Model"/>
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="clientName">Category</Label>
                        <Select onValueChange={(v) => setEquipmentTags({...equipmentTags, category: v})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category"/>
                            </SelectTrigger>
                            <SelectContent>
                                {category.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


// @ts-ignore
function Item({item, handleUpdateItem, handleRemove}) {
    const handleChange = (e: any) => {
        const {name, value} = e.target;
        handleUpdateItem(item.id, name, value); // Update the parent state
    };

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell colSpan={3}>
                    <div className="grid gap-2 grid-cols-4">
                        <div className="col-span-4">
                            <Textarea placeholder="Enter Item Description..." value={item.description}
                                      name="description" onChange={handleChange}/>
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                            <Input type="text" placeholder="Enter Part No." value={item.part_no} name="part_no"
                                   onChange={handleChange}/>
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                            <Input type="text" placeholder="Enter Position No." value={item.position_no}
                                   name="position_no" onChange={handleChange}/>
                        </div>
                        <div className="col-span-4 sm:col-span-4">
                            <Input type="text" placeholder="Enter Alternate Part No." value={item.alternative_part_no}
                                   name="alternative_part_no" onChange={handleChange}/>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Input type="number" placeholder="Enter Required Quanity" value={item.req_qty} name="req_qty"
                           onChange={handleChange}/>
                </TableCell>
                <TableCell>
                    {/* <Input type="text" placeholder="Enter UOM..." value={item.uom} name="uom" onChange={} /> */}
                    <Select name="uom" onValueChange={(v) => handleUpdateItem(item.id, "uom", v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select UOM"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pieces">Pieces</SelectItem>
                            <SelectItem value="KiloGrams">KiloGrams</SelectItem>
                            <SelectItem value="Litres">Litres</SelectItem>
                        </SelectContent>
                    </Select>
                </TableCell>
                <TableCell className="text-right relative">
                    <Button onClick={() => handleRemove(item.id)} className="absolute top-4 right-4"
                            variant={"outline"}>
                        <Trash2/>
                    </Button>
                    PENDING
                </TableCell>
            </TableRow>
        </>
    )
}


export default function CreateEnquiryPage() {
    // const id = (await params).id;
    const [brands, setBrands] = useState<any[]>([]);
    const [category, setCategory] = useState<any[]>([]);
    const [model, setModels] = useState<any[]>([]);

    const [rfqInfo, setRfqInfo] = useState({lead_date: "", supply_port: "", expire_date: "", rfq_no: ""});
    const [vesselInfo, setVesselInfo] = useState({name: "", imo_no: "", hull_no: "", port: ""});
    const [equipmentTags, setEquipmentTags] = useState({tags: [], brand: "", model: "", category: ""});
    const [items, setItems] = useState([{
        id: 1,
        description: "",
        part_no: "",
        position_no: "",
        alternative_part_no: "",
        uom: "",
        req_qty: "",
        offered_qty: "0"
    }]);
    const [isMem, setIsMem] = useState(false);

    const handleUpdateItem = (id: number, key: any, value: any) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? {...item, [key]: value} : item
            )
        );
    };

    async function getQuote() {
        const supabase = createClient();

        try {
            const {data: {user}} = await supabase.auth.getUser();

            const member = await supabase.from("member").select("*").eq("member_profile", user!.id).single();

            const rfq = await supabase.from("rfq").insert({
                client_profile: user!.id,
                lead_date: rfqInfo.lead_date,
                supply_port: rfqInfo.supply_port,
                expire_date: rfqInfo.expire_date,
                vessel_name: vesselInfo.name,
                imo_no: vesselInfo.imo_no,
                port: vesselInfo.port,
                hull_no: vesselInfo.hull_no,
                equipment_tags: equipmentTags.tags,
                brand: equipmentTags.brand,
                model: equipmentTags.model,
                category: equipmentTags.category,
                created_at: new Date().toISOString(),
                branch: member.data.branch
            }).select().single();

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                await supabase.from("item").insert({
                    rfq: rfq.data!.id,
                    part_no: item.part_no,
                    position_no: item.position_no,
                    alternative_part_no: item.alternative_part_no,
                    description: item.description,
                    req_qty: item.req_qty,
                    offered_qty: item.offered_qty,
                    uom: item.uom,
                    quoted_price: 0,
                    margin: 0,
                    quoted: false,
                    status: "processing"
                });
            }

            console.log("RFQ Created! ", rfq.data);

            alert("RFQ Successfully Created!");
            window.location.reload();
        } catch (e) {
            console.log("Unable to create RFQ ", e);
            alert("Unable to Create RFQ!!");
        }
    }

    function handleRemove(itemId: number) {
        const filteredItem = items.filter((i) => i.id !== itemId);

        setItems([...filteredItem]);
    }

    async function fetchDetails() {
        const supabase = createClient();

        const brands = await supabase.from("brand").select("*").eq("is_active", true);
        setBrands([...brands.data!]);

        const models = await supabase.from("model").select("*").eq("is_active", true);
        console.log(models);
        setModels([...models.data!]);

        const categories = await supabase.from("category").select("*").eq("is_active", true);
        setCategory([...categories.data!]);

        const {data: {user}} = await supabase.auth.getUser();

        const member = await supabase.from("member").select("*").eq("member_profile", user!.id);
        console.log(member);
        if (member.data) {
            setIsMem(true);
        }
    }

    useEffect(() => {
        void fetchDetails();
    }, []);

    if (!isMem) return "Create a Branch or be the Part of any Branch to Create Enquiry..."

    return (
        <main className="grid">
            <div className="pt-4 max-w-6xl w-full grid justify-self-center">
                <h1 className="text-3xl font-bold">
                    Create RFQ
                </h1>
                <h3 className="mt-2">
                </h3>
            </div>

            <main className="grid justify-self-center max-w-6xl w-full md:grid-cols-3 gap-4 mt-4">
                <RFQInfoCard rfqInfo={rfqInfo} setRfqInfo={setRfqInfo}/>
                <VesselCard vesselInfo={vesselInfo} setVesselInfo={setVesselInfo}/>
                <EquipmentCard equipmentTags={equipmentTags} setEquipmentTags={setEquipmentTags} models={model}
                               brands={brands} category={category}/>
            </main>

            <div className="grid justify-self-center max-w-6xl w-full mt-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">
                        Items
                    </h1>

                    <Button onClick={() => {
                        setItems([...items, {
                            id: items.length + 1,
                            description: "",
                            part_no: "",
                            position_no: "",
                            alternative_part_no: "",
                            uom: "",
                            req_qty: "",
                            offered_qty: "0"
                        }]);
                    }}>
                        Add Item
                    </Button>
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
                                    <TableHead>UOM</TableHead>
                                    <TableHead className="text-right">Quoted Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, i) =>
                                    <Item key={i} item={item} handleRemove={handleRemove}
                                          handleUpdateItem={handleUpdateItem}/>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl w-full grid justify-self-center justify-center mt-8 mb-24">
                <div>
                    <Button className="px-12" onClick={getQuote}>
                        Get Quote
                    </Button>
                </div>
            </div>
        </main>
    )
}