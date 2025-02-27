import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { ChartsComponent } from "@/components/ChartsComponents";
import { Chart2Component } from "@/components/Chart2Component";
import { InviteAdmin } from "@/components/InviteAdmin";


async function RFQCard() {
    const supabase = createClient();

    const rfqs = await supabase.from("rfq").select();

    return (
        <Card>
            <CardHeader>
                <CardTitle>RFQs</CardTitle>
                <CardDescription>Total RFQs Recieved</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold">
                    {rfqs.data?.length}
                </h1>
            </CardContent>
            <CardFooter>
                <p className="text-xs">Updated Now</p>
            </CardFooter>
        </Card>

    )
}



async function RevenueCard() {
    const supabase = createClient();

    const merchants = await supabase.from("merchant").select();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Merchants</CardTitle>
                <CardDescription>Total Merchants</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold">
                    {merchants.data?.length}
                </h1>

            </CardContent>
            <CardFooter>
                <p className="text-xs">Updated Now</p>
            </CardFooter>
        </Card>

    )
}


async function CustomerCard() {
    const supabase = createClient();
    const profiles = await supabase.from("profiles").select("*").eq("user_role", "customer");

    return (
        <Card>
            <CardHeader>
                <CardTitle>Clients</CardTitle>
                <CardDescription>Total Happy Customers</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold">
                    {profiles.data?.length}
                </h1>

            </CardContent>
            <CardFooter>
                <p className="text-xs">Updated Now</p>
            </CardFooter>
        </Card>

    )
}

async function BrandCard() {
    const supabase = createClient();
    const brands = await supabase.from("brand").select();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Brands</CardTitle>
                <CardDescription>Total Brands</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold">
                    {brands.data?.length}
                </h1>
            </CardContent>
            <CardFooter>
                <p className="text-xs">Updated Now</p>
            </CardFooter>
        </Card>
    )
}

async function ItemCard() {
    const supabase = createClient();
    const brands = await supabase.from("item").select();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Items</CardTitle>
                <CardDescription>Total Items Send</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold">
                    {brands.data?.length}
                </h1>
            </CardContent>
            <CardFooter>
                <p className="text-xs">Updated Now</p>
            </CardFooter>
        </Card>
    )
}


async function CategoriesCard() {
    const supabase = createClient();
    const brands = await supabase.from("category").select();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Total Categories</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-bold">
                    {brands.data?.length}
                </h1>
            </CardContent>
            <CardFooter>
                <p className="text-xs">Updated Now</p>
            </CardFooter>
        </Card>
    )
}


export default function AdminPage() {


    return (
        <main className="">
            <div className="max-w-7xl w-full justify-self-center grid md:grid-cols-3 gap-4 mt-4">
                <RFQCard />
                <RevenueCard />
                <CustomerCard />
            </div>
            <div className="max-w-7xl w-full justify-self-center grid md:grid-cols-3 gap-4 mt-4">
                <BrandCard />
                <ItemCard />
                <CategoriesCard />
            </div>

            <div className="mt-8 flex justify-between">
                <h1 className="text-md font-bold">
                    Dashboard
                </h1>

                <InviteAdmin />
            </div>

            <div className="max-w-7xl w-full justify-self-center grid md:grid-cols-2 gap-4 mt-4">
                <ChartsComponent />
                <Chart2Component />
            </div>
        </main>
    )
}