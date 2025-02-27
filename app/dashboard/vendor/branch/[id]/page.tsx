import { createClient } from "@/utils/supabase/client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { AdminCard } from "@/components/BranchCard";

export default async function BranchParticulerPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const supabase = createClient();
    const id = (await params).id;
    const branch = await supabase.from("branch").select("*").eq("id", id).single();
    const allmembers = await supabase.from("member").select("*").eq("branch", branch.data.id);

    const admin = allmembers.data?.filter((d) => d.member_role == "admin");
    const members = allmembers.data?.filter((d) => d.member_role == "employee");

    return (
        <div className="mt-8 p-4">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Sub Merchant Details
                    </h1>
                    <h3>
                        Id: {branch.data.id}
                    </h3>
                </div>


                {/* <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger>
                            <Button variant={"outline"}>
                                Add Manager
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Manager</DialogTitle>
                                <DialogDescription>
                                    Enter Manager Details
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vesselName" className="text-right">
                                        Manager Name
                                    </Label>
                                    <Input id="vesselName" placeholder="Enter Manager Name..." className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vesselName" className="text-right">
                                        Manager Email
                                    </Label>
                                    <Input id="vesselName" placeholder="Enter Manager Email..." type="email" className="col-span-3" />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit">Add Manager</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger>
                            <Button variant={"outline"}>
                                Assign
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Admin</DialogTitle>
                                <DialogDescription>
                                    Enter Admin Details
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vesselName" className="text-right">
                                        Admin Name
                                    </Label>
                                    <Input id="vesselName" placeholder="Enter Admin Name..." className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vesselName" className="text-right">
                                        Admin Email
                                    </Label>
                                    <Input id="vesselName" placeholder="Enter Admin Email..." type="email" className="col-span-3" />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit">Add Admin</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div> */}
            </div>

            <div className="my-8 border-t border-b border-zinc-800 p-4">
                <h1 className="text-xl font-bold">
                    Creator Id: {branch.data?.creator}
                </h1>
            </div>

            {/* <div className="py-8">
                <div className="mb-4">
                    <h1 className="text-xl font-bold">Admin Details</h1>
                </div>
                {admin?.map((ad, i) =>
                    <AdminCard adminId={ad.id} key={i} adminProfile={ad.member_profile} />
                )}
            </div> */}

            <div className="py-8 mt-4">
                <div className="mb-4">
                    <h1 className="text-xl font-bold">Employees Details</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {members?.map((ad, i) =>
                        <AdminCard adminId={ad.id} key={i} adminProfile={ad.member_profile} />
                    )}
                </div>
            </div>
        </div>
    )
}