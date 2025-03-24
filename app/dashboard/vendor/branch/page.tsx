
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { create } from "domain";

interface Branch {
  id: string;
  name: string;
  vessels: string[];
}

interface Member {
  id: string;
  branch: string;
  member_profile: string;
  member_role: string;
}

interface Profile {
  id: string;
  email: string;
  vessels: string[];
}

function BranchCard({ branch, vessels }: { branch: Branch; vessels: string[] }) {
  const [email, setemail] = useState("")
  const [admin, setAdmin] = useState<Member | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [rfqCount, setRfqCount] = useState(0);
  const [adminProfile, setAdminProfile] = useState<Profile | null>(null);
  const [newBranch, setNewBranch] = useState<{ name: string; vessels: string[] }>({
    name: "",
    vessels: [],
  });

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const res = await fetch("/api/add-admin-to-branch/", {
      method: "POST",
      body: JSON.stringify({ email: formData.get("email"), branch: branch.id }),
    });
    const data = await res.json();
    alert("Successfully Added Admin");
    window.location.reload();
  }

  async function addEmployee(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const res = await fetch("/api/add-manager-to-branch/", {
      method: "POST",
      body: JSON.stringify({ email: formData.get("email"), branch: branch.id }),
    });
    const data = await res.json();

    alert("Successfully Added Employee");
    window.location.reload();
  }

  async function fetchBranch() {
    const supabase = createClient();

    const member = await supabase.from("member").select("*").eq("branch", branch.id);
    setMemberCount(member.data?.length || 0);

    const rfq = await supabase.from("rfq").select("*").eq("branch", branch.id);
    setRfqCount(rfq.data?.length || 0);

    const admin = await supabase
      .from("member")
      .select("*")
      .eq("branch", branch.id)
      .eq("member_role", "admin")
      .single();
    setAdmin(admin.data || null);

    if (admin.data?.member_profile) {
      const res = await fetch("/api/all-user", {
        method: "POST",
        body: JSON.stringify({ userID: admin.data.member_profile }),
      });
      const data = await res.json();
      setAdminProfile(data.userData);
    }
  }

  useEffect(() => {
    fetchBranch();
  }, []);

  const handleInvite = async()=>{
    if(!email){
      console.log("enter the email")
    }
    const supabase = createClient()

    const {data , error} = await supabase.auth.admin.inviteUserByEmail(email)

    if (error) {
      console.log("Error: " + error.message);
      return;
    }

    // Update profile with vendor role
    await supabase
      .from("profiles")
      .update({ user_role: "vendor" })
      .eq("id", data.user?.id);

    // Send sign-in OTP link to email
    await supabase.auth.signInWithOtp({ email: email });

    setMessage("Vendor invited successfully! Check your email.");
    setEmail(""); // Reset input

  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{branch.name}</CardTitle>
        <CardDescription>Id: {`${branch.id}`.slice(1, 8)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2 grid grid-cols-2 gap-2 text-sm">
          {!admin && (
            <Dialog>
              <DialogTrigger>
                <Button variant={"outline"}>Add Admin</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Admin</DialogTitle>
                  <DialogDescription>Enter Admin Details</DialogDescription>
                </DialogHeader>
                <form onSubmit={addAdmin}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Admin Email
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Enter Admin Email..."
                        id="email"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="branch" className="text-right">
                        Branch Id
                      </Label>
                      <Input
                        type="text"
                        name="branch"
                        id="branch"
                        value={branch.id}
                        disabled
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vessels" className="text-right">
                        Select Vessels
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setNewBranch({ ...newBranch, vessels: [...newBranch.vessels, value] })
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Vessels..." />
                        </SelectTrigger>
                        <SelectContent>
                          {vessels.map((vessel, i) => (
                            <SelectItem value={vessel} key={i}>
                              {vessel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit">Assign</Button>
                </form>
                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Dialog>
            <DialogTrigger>
              <Button variant={"outline"}>Add Manager</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Manager</DialogTitle>
                <DialogDescription>Enter Manager Details</DialogDescription>
              </DialogHeader>
              <form onSubmit={addEmployee}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Manager Email
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter Manager Email..."
                      id="email"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="branch" className="text-right">
                      Branch Id
                    </Label>
                    <Input
                      type="text"
                      name="branch"
                      id="branch"
                      value={branch.id}
                      disabled
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="vessels" className="text-right">
                        Select Vessels
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setNewBranch({ ...newBranch, vessels: [...newBranch.vessels, value] })
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Vessels..." />
                        </SelectTrigger>
                        <SelectContent>
                          {vessels.map((vessel, i) => (
                            <SelectItem value={vessel} key={i}>
                              {vessel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                <Button type="submit">Add Manager</Button>
              </form>
              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {admin && adminProfile && (
          <div className="text-xs">
            <h1 className="text-sm font-bold mb-1">Branch Admin</h1>
            <p>
              <span className="font-bold">Id: </span> {(admin.id).slice(1,8)}
            </p>
            <p>
              <span className="font-bold">Email: </span> {adminProfile.email}
            </p>
          </div>
        )}
        <div className="mt-2 grid text-base">
          <div>
            <span className="font-bold">Managers: </span> {memberCount}
          </div>
          <div>
            <span className="font-bold">RFQs: </span> {rfqCount}
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid">
        <Link href={`/dashboard/customer/branch/${branch.id}`} className="grid">
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function BranchPage() {
  const [vesselName, setVesselName] = useState("");
  const [vessels, setVessels] = useState<string[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isClient, setIsClient] = useState(true);
  const [newBranch, setNewBranch] = useState<{ name: string; vessels: string[] }>({
    name: "",
    vessels: [],
  });

  async function addVessel() {
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const profileData = await supabase.from("profiles").select("*").eq("id", user?.id).single();

      if (profileData.data?.vessels) {
        await supabase
          .from("profiles")
          .update({
            vessels: [...profileData.data.vessels, vesselName],
          })
          .eq("id", profileData.data.id);
      } else {
        await supabase
          .from("profiles")
          .update({
            vessels: [vesselName],
          })
          .eq("id", profileData.data?.id);
      }

      alert("Vessel Successfully Added!");
      window.location.reload();
    } catch (e) {
      console.log("Error Occurred", e);
    }

    setVesselName("");
  }

  async function addBranch() {
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const profileData = await supabase.from("profiles").select("*").eq("id", user?.id).single();

      const currentTime = new Date().toISOString();
      const branchData = await supabase
        .from("branch")
        .insert({ name: newBranch.name, vessels: newBranch.vessels, creator: user!.id, created_at: currentTime })
        .select()
        .single();
      await supabase
        .from("member")
        .insert({ branch: branchData.data?.id, member_profile: user?.id, member_role: "creator" });

      alert("Branch Created Successfully!");
      window.location.reload();
    } catch (e) {
      console.log("Unable to Create Branch, ", e);
      alert("Unable to Create Branch!!");
    }
  }

  async function fetchDetails() {
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const profileData = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      setVessels(profileData.data?.vessels || []);

      const member = await supabase.from("member").select("*").eq("member_profile", user?.id);
      const allBranches: Branch[] = [];

      for (let i = 0; i < member.data!.length; i++) {
        const m = member.data![i];
        const branchesData = await supabase.from("branch").select("*").eq("id", m.branch).single();
        if (branchesData.data) {
          allBranches.push(branchesData.data);
        }
      }

      if (member.data!.length === 1 && member.data![0].member_role !== "creator") {
        setIsClient(false);
      }

      setBranches(allBranches);
    } catch (e) {
      console.log("Unable to Fetch Details, ", e);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <main className="grid max-w-6xl w-full justify-self-center">
      <div className="py-4 sm:flex justify-between">
        <div>Your Branches</div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger>
              <Button>Add Branch</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Branch</DialogTitle>
                <DialogDescription>Create New Branch</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="branchName" className="text-right">
                    Branch Name
                  </Label>
                  <Input
                    id="branchName"
                    placeholder="Enter Branch Name..."
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="my-1 flex gap-1">
                {newBranch.vessels.map((vessel, i) => (
                  <div className="px-1 bg-zinc-500 rounded-full text-white text-xs" key={i}>
                    {vessel}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={addBranch}>
                  Add Branch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <Button>Add Vessel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vessel</DialogTitle>
                <DialogDescription>Create New Vessel</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vesselName" className="text-right">
                    Vessel Name
                  </Label>
                  <Input
                    id="vesselName"
                    placeholder="Enter Vessel Name..."
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={addVessel}>
                  Add Vessel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {branches.map((branch, i) => (
          <BranchCard key={i} branch={branch} vessels={vessels} />
        ))}
      </div>
    </main>
  );
}




function BranchCard({ branch }: { branch: any }) {
    const [admin, setAdmin] = useState<any>(null);
    const [memberCount, setMemberCount] = useState(0);
    const [rfqCount, setRfqCount] = useState(0);
    const [adminProfile, setAdminProfile] = useState<any>();

    async function addAdmin(e: any) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const res = await fetch("/api/add-admin-to-branch/", {method: "POST", body: JSON.stringify({email: formData.get("email"), branch: branch.id})})
        const data = await res.json();
        alert("Successfully Added Employee");
    }

    async function addEmployee(e: any) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const res = await fetch("/api/add-manager-to-branch/", {method: "POST", body: JSON.stringify({email: formData.get("email"), branch: branch.id})});
        const data = await res.json();

        alert("Successfully Added Employee");
    }

    async function fetchBranch() {
        const supabase = createClient();

        const member = await supabase.from("member").select("*").eq("branch", branch.id);
        setMemberCount(member.data!.length);

        const rfq = await supabase.from("rfq").select("*").eq("branch", branch.id);
        setRfqCount(rfq.data!.length);

        const admin = await supabase.from("member").select("*").eq("branch", branch.id).eq("member_role", "admin").single();
        // console.log(admin);
        setAdmin(admin.data);

        const res = await fetch("/api/all-user", {method: "POST", body: JSON.stringify({userID: admin.data.member_profile})});
        const data = await res.json();

        setAdminProfile(data.userData);
        console.log(data)
    }

    useEffect(() => {
        fetchBranch();
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>{branch.name}</CardTitle>
                <CardDescription>Id: {branch.id}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-2 grid grid-cols-1 gap-2 text-sm">
                    {!admin && (
                        <Dialog>
                            <DialogTrigger className="grid">
                                <Button>
                                    Assign
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Employee</DialogTitle>
                                    <DialogDescription>
                                        Enter Employee Details
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={addAdmin}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="vesselName" className="text-right">
                                                Employee Email
                                            </Label>
                                            <Input type="email" name="email" placeholder="Enter Employee Email..." id="email" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="vesselName" className="text-right">
                                                Sub Merchant Id
                                            </Label>
                                            <Input type="text" name="branch" id="branch" value={branch.id} disabled className="col-span-3" />
                                        </div>
                                    </div>
                                    <Button type="submit">Assign</Button>
                                </form>

                                <DialogFooter>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
                {admin && (
                    <div className="text-xs">
                        <h1 className="text-sm font-bold mb-1">
                            Employee
                        </h1>
                        <p>
                            <span className="font-bold">Id: </span> {admin.id}
                        </p>
                        <p>
                            <span className="font-bold">Email: </span> {adminProfile?.email}
                        </p>
                    </div>
                )}

                {/* <div className="mt-2 grid grid text-base">
                    <div>
                        <span className="font-bold">Managers: </span> {memberCount}
                    </div>
                    <div>
                        <span className="font-bold">RFQs: </span> {rfqCount}
                    </div>
                </div> */}

            </CardContent>
            <CardFooter className="grid">
                <p>
                Sub Merchant Details
                </p>
                {/* <Link href={`/dashboard/customer/branch/${branch.id}`} className="grid">
                    <Button>
                        View Details
                    </Button>
                </Link> */}
            </CardFooter>
        </Card>
    )
}


export default function BranchPage() {
    const [vesselName, setVesselName] = useState("");
    const [vessels, setVessels] = useState<string[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [newBranch, setNewBranch] = useState<{ name: string, vessels: string[] }>({ name: "", vessels: [] });
    const [isClient, setIsClient] = useState(true);

    async function addVessel() {
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const profileData = await supabase.from("profiles").select("*").eq("id", user?.id).single();


            if (profileData.data.vessels) {
                const { data } = await supabase.from("profiles").update({
                    vessels: [...profileData.data.vessels, vesselName],
                }).eq("id", profileData.data.id);
                console.log("Vessel Successfully Added!", data);
            } else {
                const { data } = await supabase.from("profiles").update({
                    vessels: [vesselName],
                }).eq("id", profileData.data.id);
                console.log("Vessel Successfully Added!", data);
            }

            alert("Vessel Successfully Added!");
        } catch (e) {
            console.log("Error Occurse", e);
        }

        setVesselName("");
    }

    async function addBranch() {
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const profileData = await supabase.from("profiles").select("*").eq("id", user?.id).single();

            // Format time as HH:MM:SS
            const currentTime = new Date().toISOString();
            const branchData = await supabase.from("branch").insert({ name: newBranch.name, vessels: newBranch.vessels, creator: user!.id, created_at: currentTime }).select().single();
            const member = await supabase.from("member").insert({ branch: branchData.data?.id, member_profile: user?.id, member_role: "creator" })

            console.log("Branch Created: ", branchData);

            alert("Branch Created Successfully!");
            window.location.reload();

        } catch (e) {
            console.log("Unable to Create Branch, ", e);
            alert("Unable to Create Branch!!");
        }
    }

    async function fetchDetails() {
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();

            // const vessels = (await supabase.from("profiles").select("*").eq("id", user!.id).single()).data.vessels;
            // setVessels([...vessels]);

            const member = await supabase.from("member").select("*").eq("member_profile", user?.id);
            const allBranches = [...branches]
            for (let i = 0; i < member.data!.length; i++) {
                const m = member.data![i];
                const branchesData = await supabase.from("branch").select("*").eq("id", m.branch).single();
                if (branchesData.data) {
                    // setBranches([...branches, branchesData.data];
                    allBranches.push(branchesData.data)
                    console.log(branchesData.data);
                }
            }

            if (member.data!.length == 1) {
                if (member.data![0].member_role !== "creator") {
                    setIsClient(false);
                }
            }

            setBranches([...allBranches])
        } catch (e) {
            console.log("Unable to Fetch Details, ", e);
            // alert("Error Occured White fetching details");
        }
    }

    useEffect(() => {
        fetchDetails();
    }, []);


    return (
        <main className="grid max-w-6xl w-full justify-self-center">
            <div className="py-4 sm:flex justify-between">
                <div>
                    Your Sub Merchant
                </div>
                
                {isClient && (
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger>
                            <Button>
                                Add Sub Merchant
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Sub Merchant</DialogTitle>
                                <DialogDescription>
                                    Create New Sub Merchant
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vesselName" className="text-right">
                                        Sub Merchant Name
                                    </Label>
                                    <Input id="vesselName" placeholder="Enter Sub Merchant Name..." value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} className="col-span-3" />
                                </div>
                                {/* <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vesselName" className="text-right">
                                        Select Vessels
                                    </Label>
                                    <Select onValueChange={(value) => setNewBranch({ ...newBranch, vessels: [...newBranch.vessels, value] })}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Vessels..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vessels.map((vessel, i) =>
                                                <SelectItem value={vessel} key={i}>{vessel}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div> */}
                            </div>

                            <DialogFooter>
                                <Button type="submit" onClick={addBranch}>Add Sub Merchant</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                )}
            </div>

            <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {branches.map((branch, i) =>
                    <BranchCard key={i} branch={branch} />
                )}
            </div>
        </main>
    )
}
>>>>>>> 8389b9365a68938c0370c4b810916e19e5572937
