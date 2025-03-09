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
function RFQInfoCard({rfqInfo, setRfqInfo,errors, setErrors}) {
    useEffect(() => {
        if (!rfqInfo.lead_date) {
            const currentDate = new Date().toISOString().split("T")[0];
            setRfqInfo((prev: any) => ({...prev, lead_date: currentDate}));
        }
    }, [rfqInfo.lead_date, setRfqInfo]);
    return (
        <Card>
            <CardHeader>
                <CardTitle>RFQ Info</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="leadDate">Lead Date</Label>
                    <Input
                        type="date"
                        id="leadDate"
                        value={rfqInfo.lead_date || ""}
                        onChange={(e) =>
                            setRfqInfo({...rfqInfo, lead_date: e.target.value})
                        }
                        className="grid"
                        disabled
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="supplyPort">Supply Port <span className="text-red-500 ml-1">*</span></Label>
                    <Select
                        onValueChange={(value) =>{
                            setRfqInfo({...rfqInfo, supply_port: value});
                            setErrors({...errors, supply_port:""})
                        }
                        }
                        value={rfqInfo.supply_port || ""}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Supply Port"/>
                        </SelectTrigger>
                        <SelectContent>
                            {["Bussan", "Goa", "Tamil Nadu", "Kerala", "Mumbai"].map(
                                (port) => (
                                    <SelectItem key={port} value={port}>
                                        {port}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                    {errors.supply_port && <p className="text-red-500 text-sm">{errors.supply_port}</p>}

                    {/* {errors.supply_port && <p className="text-red-500 text-sm">{errors.supply_port}</p>} */}
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="expireDate">Expire Date <span className="text-red-500 ml-1">*</span></Label>
                    <Input
                        type="date"
                        id="expireDate"
                        value={rfqInfo.expire_date || ""}
                        onChange={(e) =>
                        {
                            setRfqInfo({...rfqInfo, expire_date: e.target.value})
                            setErrors({...errors, expire_date:""})
                        }
                        }
                        className="grid"
                    />
                    {errors.expire_date && <p className="text-red-500 text-sm">{errors.expire_date}</p>}
                </div>
            </CardContent>
        </Card>
    );
}

// @ts-ignore
function VesselCard({vesselInfo, setVesselInfo,errors, setErrors}) {
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
                    <Label htmlFor="clientName">Vessel Name <span className="text-red-500 ml-1">*</span></Label>
                    {/* <Input type="text" id="clientName" placeholder="Enter Vessel Name..." value={vesselInfo.name} onChange={(e) => setVesselInfo({ ...vesselInfo, name: e.target.value })} /> */}
                    <Select onValueChange={(e) =>
                    {
                        setVesselInfo({...vesselInfo, name: e})
                        setErrors({...errors, name:""})
                    }}
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Vessel"/>
                        </SelectTrigger>
                        <SelectContent>
                            {vessels.map((vessel, i) =>
                                <SelectItem value={vessel} key={i}>{vessel}</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">IMO No <span className="text-red-500 ml-1">*</span></Label>
                    <Input type="text" id="clientName" placeholder="Enter IMO No." value={vesselInfo.imo_no}
                           onChange={(e) =>
                           {
                           setVesselInfo({...vesselInfo, imo_no: e.target.value})
                           setErrors({...errors, imo_no:""})
                           }}
                           />
                             {errors.imo_no && <p className="text-red-500 text-sm">{errors.imo_no}</p>}
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Port <span className="text-red-500 ml-1">*</span></Label>
                    {/* <Input type="text" id="clientName" placeholder="Enter Port..." value={vesselInfo.port} onChange={(e) => setVesselInfo({ ...vesselInfo, port: e.target.value })} /> */}
                    <Select onValueChange={(e) =>
                    {
                         setVesselInfo({...vesselInfo, port: e})
                         setErrors({...errors, port:""})
                    }
                        }
                         >
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
                    {errors.port && <p className="text-red-500 text-sm">{errors.port}</p>}
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="clientName">Hull No <span className="text-red-500 ml-1">*</span></Label>
                    <Input type="text" id="clientName" placeholder="Enter HULL No." value={vesselInfo.hull_no}
                           onChange={(e) =>
                            {
                           setVesselInfo({...vesselInfo, hull_no: e.target.value})
                           setErrors({...errors, hull_no:""})
                            }
                        }
                           />
                             {errors.hull_no && <p className="text-red-500 text-sm">{errors.hull_no}</p>}
                </div>
            </CardContent>
        </Card>
    )
}

// @ts-ignore
function EquipmentCard({equipmentTags, setEquipmentTags, models, brands, category,errors, setErrors}) {
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
                        <Label htmlFor="clientName">Brand <span className="text-red-500 ml-1">*</span></Label>
                        <Select onValueChange={(v) =>
                        {
                            setEquipmentTags({...equipmentTags, brand: v})
                            setErrors({...errors, brand:""})
                        }
                            }>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Brand"/>
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}

                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="clientName">Model <span className="text-red-500 ml-1">*</span></Label>
                        <Select onValueChange={(v) =>
                        {
                            setEquipmentTags({...equipmentTags, model: v})
                            setErrors({...errors, model:""})
                        }
                            }>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Model"/>
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="clientName">Category <span className="text-red-500 ml-1">*</span></Label>
                        <Select onValueChange={(v) =>
                        {
                            setEquipmentTags({...equipmentTags, category: v})
                            setErrors({...errors, category:""})
                        }}
                            >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category"/>
                            </SelectTrigger>
                            <SelectContent>
                                {category.map((brand: any, i: number) =>
                                    <SelectItem value={brand.name} key={i}>{brand.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


// @ts-ignore
function Item({item, handleUpdateItem, handleRemove, setErrors, errors}) {
    const handleChange = (e: any) => {
        const {name, value} = e.target;
        handleUpdateItem(item.id, name, value);
    };
    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell colSpan={3}>
                    <div className="grid gap-2 grid-cols-4">
                        <div className="col-span-4">
                            <Textarea placeholder="Enter Item Description..." value={item.description}
                                      name="description"
                                    //   onChange={(e) => {
                                    //     const {name, value} = e.target;
                                    //     handleUpdateItem(item.id, name, value);
                                    //     // setErrors({ ...errors, description: "" });
                                    //   }}
                                    onChange={handleChange}
                                      />
                                       {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                            <Input type="text" placeholder="Enter Part No." value={item.part_no} name="part_no"
                                //    onChange={(e) => {
                                //     handleChange(e);
                                //     setErrors({ ...errors, part_no: "" });
                                //   }}
                                onChange={handleChange}
                                  />
                                   {errors.part_no && <p className="text-red-500 text-sm">{errors.part_no}</p>}
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                            <Input type="text" placeholder="Enter Position No." value={item.position_no}
                                   name="position_no"
                                //    onChange={(e) => {
                                //     handleChange(e);
                                //     setErrors({ ...errors, position_no: "" });
                                //   }}

                                onChange={handleChange}
                                   />
                                    {errors.position_no && <p className="text-red-500 text-sm">{errors.position_no}</p>}
                        </div>
                        <div className="col-span-4 sm:col-span-4">
                            <Input type="text" placeholder="Enter Alternate Part No." value={item.alternative_part_no}
                                   name="alternative_part_no"
                                //    onChange={(e) => {
                                //     handleChange(e);
                                //     setErrors({ ...errors, alternative_part_no: "" });
                                //   }}
                                onChange={handleChange}
                                   />
                                   {errors.alternative_part_no && <p className="text-red-500 text-sm">{errors.alternative_part_no}</p>}
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Input type="number" placeholder="Enter Required Quanity" value={item.req_qty} name="req_qty"
                            // onChange={(e) => {
                            //     handleChange(e);
                            //     setErrors({ ...errors, req_qty: "" });
                            //   }}
                            onChange={handleChange}
                           />
                           {errors.req_qty && <p className="text-red-500 text-sm">{errors.req_qty}</p>}
                </TableCell>
                <TableCell>
                    {/* <Input type="text" placeholder="Enter UOM..." value={item.uom} name="uom" onChange={} /> */}
                    <Select name="uom" onValueChange={(v) =>
                    // {
                         handleUpdateItem(item.id, "uom", v)
                        //  setErrors({ ...errors, uom: "" });
                    // }
                         }>
                        <SelectTrigger>
                            <SelectValue placeholder="Select UOM"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pieces">Pieces</SelectItem>
                            <SelectItem value="KiloGrams">KiloGrams</SelectItem>
                            <SelectItem value="Litres">Litres</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.uom && <p className="text-red-500 text-sm">{errors.uom}</p>}
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

    const [reqdVendors, updateReqdVendors] = useState({
        vendor1: {
            name: '',
            vendorId: ''
        },
        vendor2: {
            name: '',
            vendorId: ''
        },
        vendor3: {
            name: '',
            vendorId: ''
        }
    });

    const [brands, setBrands] = useState<any[]>([]);
    const [category, setCategory] = useState<any[]>([]);
    const [model, setModels] = useState<any[]>([]);
    const [vendors, updateVendors] = useState<any[]>([]);
    const [vendorsError, setVendorsError] = useState(false);
    const [rfqInfo, setRfqInfo] = useState({lead_date: "", supply_port: "", expire_date: "", rfq_no: ""});
    const [vesselInfo, setVesselInfo] = useState({name: "", imo_no: "", hull_no: "", port: ""});
    const [equipmentTags, setEquipmentTags] = useState({tags: [], brand: "", model: "", category: ""});
    const [items, setItems] = useState<any>([{
        id: 1,
        description: "",
        part_no: "",
        position_no: "",
        alternative_part_no: "",
        uom: "",
        req_qty: "",
        offered_qty: "0"
    }]);
    const [fiedData, setFieldData]= useState({
        description: "",
        part_no: "",
        position_no: "",
        alternative_part_no: "",
        uom: "",
        req_qty: "",
        offered_qty: "0"
    })
    const [isMem, setIsMem] = useState(false);
    const [errors, setErrors] = useState({ supply_port: "", expire_date: "", items:[] });
    const handleUpdateItem = (id: number, key: any, value: any) => {
        setItems((prevItems:any) =>
            prevItems.map((item:any) =>
                item.id === id ? {...item, [key]: value} : item
            )
        );
    };
 console.log(errors)
    async function getQuote() {
        console.log(items?.description, "desc")
        let newErrors = { supply_port: "", expire_date: "" ,name:"", imo_no:"",hull_no:"",port:"",brand:"",model:"",category:"", items:[]};
        if (!rfqInfo.supply_port) newErrors.supply_port = "Supply Port is required.";
        if (!rfqInfo.expire_date) newErrors.expire_date = "Expire Date is required.";
        if(!vesselInfo.name) newErrors.name="Vessel Name is required.";
        if(!vesselInfo.imo_no) newErrors.imo_no="IMO No is required.";
        if(!vesselInfo.hull_no) newErrors.hull_no="Hull No is required.";
        if(!vesselInfo.port) newErrors.port="Port is required.";
        if(!equipmentTags.brand) newErrors.brand="Brand is required"
        if(!equipmentTags.model) newErrors.model="Model is required.";
        if(!equipmentTags.category) newErrors.category="Catrgory is required.";

        const itemErrors = items.map((item: any) => ({
            description: item.description ? "" : "Description is required.",
            part_no: item.part_no ? "" : "Part No is required.",
            position_no: item.position_no ? "" : "Position No is required.",
            alternative_part_no: item.alternative_part_no ? "" : "Alternative Part No is required.",
            uom: item.uom ? "" : "UOM is required.",
            offered_qty: item.offered_qty ? "" : "Offered Quantity is required.",
            req_qty: item.req_qty ? "" : "Required Quantity is required.",
        }));
        setErrors(newErrors);
        newErrors.items = itemErrors;
        if (!reqdVendors.vendor1.vendorId || !reqdVendors.vendor2.vendorId || !reqdVendors.vendor3.vendorId) {
            setVendorsError(true);
            return;
        } else {
            setVendorsError(false);
        }
        if (itemErrors.some((item: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(item).some(err => err))) return;

        const supabase = createClient();
    try {

            const {data: {user}} = await supabase.auth.getUser();
            const member = await supabase.from("member").select("*").eq("member_profile", user!.id).single();
            console.log("selected vendors", Object.values(reqdVendors).map(vendor => vendor.vendorId))
            const rfq = await supabase.from("rfq").insert({
          vessel_name: vesselInfo.name,
          imo_no: vesselInfo.imo_no,
          hull_no: vesselInfo.hull_no,
          requested_by: user!.id,
          port: vesselInfo.port,
          supply_port: rfqInfo.supply_port,
          suppliers: Object.values(reqdVendors)
            .filter((vendor) => vendor.vendorId)
            .map((vendor) => vendor.vendorId),
          created_at: new Date().toISOString(),
          due_date: rfqInfo.expire_date,
          equipment_tags: equipmentTags.tags,
                branch: member.data.branch,
          status: Object.values(reqdVendors).filter((vendor) => vendor.vendorId)
            .length
            ? "sent"
            : "draft",
        })
        .select()
        .single();

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
        await supabase.from("rfq_items").insert({
          rfq_id: rfq.data!.id,
          item_part_no: item.part_no,
          item_position_no: item.position_no,
          alternate_part_no: item.alternative_part_no,
          description: item.description,
          req_qty: item.req_qty,
          uom: item.uom,
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
        const filteredItem = items.filter((i:any) => i.id !== itemId);

        setItems([...filteredItem]);
    }

    async function fetchDetails() {
        const supabase = createClient();

        const merchants = await supabase.from("merchant").select("*").select("*");
        updateVendors([...merchants.data!]);

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
                <RFQInfoCard rfqInfo={rfqInfo} setRfqInfo={setRfqInfo} errors={errors} setErrors={setErrors} />
                <VesselCard vesselInfo={vesselInfo} setVesselInfo={setVesselInfo} errors={errors} setErrors={setErrors}/>
                <EquipmentCard equipmentTags={equipmentTags} setEquipmentTags={setEquipmentTags} models={model}
                               brands={brands} category={category} errors={errors} setErrors={setErrors}/>
            </main>

            <div className="flex w-full max-w-6xl justify-self-center items-center mt-8">
                <h1 className="text-xl font-bold">
                    Choose vendors
                </h1>
            </div>
            {vendorsError && (
    <div className="text-red-500 text-sm ml-32 mt-2">
        Please select all vendors.
    </div>
)}

            <div
                className="grid justify-self-center grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl w-full mt-4">

                <div className="grid gap-1">
                    <div className="flex gap-1">
                        <div className="text-xs text-white bg-zinc-600 rounded-full px-2">
                            {reqdVendors.vendor1.name}
                        </div>

                    </div>
                    <div className="grid ">
                        <Label className={"mb-3"}>
                            Option 1 <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select onValueChange={(e) => updateReqdVendors({
                            ...reqdVendors,
                            vendor1: {name: e, vendorId: vendors.find(v => v.name === e).id}
                        })}>
                            <SelectTrigger>
                <SelectValue placeholder="Select Vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                {vendors.map((vendor: any, i: number) =>
                                    <SelectItem value={vendor.name} key={vendor.id}>{vendor.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                    </div>
                </div>

                <div className="grid gap-1">
                    <div className="flex gap-1">
                        <div className="text-xs text-white bg-zinc-600 rounded-full px-2">
                            {reqdVendors.vendor2.name}
                        </div>
                    </div>
                    <div className="grid ">
                        <Label className={"mb-3"}>
                            Option 2 <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select onValueChange={(e) => updateReqdVendors({
                            ...reqdVendors,
                            vendor2: {name: e, vendorId: vendors.find(v => v.name === e).id}
                        })}>
                            <SelectTrigger>
                <SelectValue placeholder="Select Vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                {vendors.map((vendor: any, i: number) =>
                                    <SelectItem value={vendor.name} key={vendor.id}>{vendor.name}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-1">
                    <div className="flex gap-1">
                        <div className="text-xs text-white bg-zinc-600 rounded-full px-2">
                            {reqdVendors.vendor3.name}
                        </div>
                    </div>
                    <div className="grid ">
                        <Label className={"mb-3"}>
                            Option 3 <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select onValueChange={(e) =>
                        {
                            updateReqdVendors({
                            ...reqdVendors,
                            vendor3: {name: e, vendorId: vendors.find(v => v.name === e).id}
                        });
                        setVendorsError(false);
                    }

                        }>
                            <SelectTrigger>
                <SelectValue placeholder="Select Vendor" />
                            </SelectTrigger>
                            <SelectContent>
                {vendors.map((vendor: any, i: number) => (
                  <SelectItem value={vendor.name} key={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>


            </div>




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
                    }}

                    >
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
                                    <TableHead colSpan={3}>Description<span className="text-red-500 ml-1">*</span></TableHead>
                                    <TableHead>Req. Qty.<span className="text-red-500 ml-1">*</span></TableHead>
                                    <TableHead>UOM<span className="text-red-500 ml-1">*</span></TableHead>
                                    <TableHead className="text-right">Quoted Price<span className="text-red-500 ml-1">*</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item:any, i:any) =>
                                    <Item key={i} item={item} handleRemove={handleRemove}
                                          handleUpdateItem={handleUpdateItem} setErrors={setErrors}
                                          errors={errors.items?.[i] || {}}
                                          />
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
