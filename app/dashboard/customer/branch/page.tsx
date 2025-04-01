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
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

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
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ email: formData.get("email"), branch: branch.id }),
    });
    
    const data = await res.json();
    console.log('admin',data)
    console.log('admin' , data.email)
    alert("Successfully Added Admin");
    // window.location.reload();
  }

  async function addEmployee(e: React.FormEvent) {
    
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const res = await fetch("/api/add-manager-to-branch/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        branch: branch.id,
        vessels: newBranch.vessels,  // Send selected vessels
      }),
    });

    const data = await res.json();
    console.log("Manager Added:", data);

    if (data.success) {
      
        alert("Successfully Added Manager");
        // Reload to reflect changes
        
    } else {
        alert("Error: " + data.error);
    }
}

  async function fetchBranch() {
    const supabase = createClient();

    const member = await supabase.from("manager").select("*").eq("branch_id", branch.id);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{branch.name}</CardTitle>
        <CardDescription>Id: {`${branch.id}`.slice(0, 8)}</CardDescription>
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
                      <Select onValueChange={(value) =>
  setNewBranch((prev) => ({
    ...prev,
    vessels: prev.vessels.includes(value) ? prev.vessels : [...prev.vessels, value], // Prevent duplicates
  }))
}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select Vessels..." />
  </SelectTrigger>
  <SelectContent>
    {[...new Set(vessels)].map((vessel, index) => (
      <SelectItem value={vessel} key={`${vessel}-${index}`}>
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
  const [loading, setloading] = useState(false)
  const [newBranch, setNewBranch] = useState<{ name: string; vessels: string[] }>({
    name: "",
    vessels: [],
  });

  console.log('vessels',vessels)
  

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
    setloading(true);
  
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) {
        console.error("User not logged in.");
        alert("Please log in first!");
        setloading(false);
        return;
      }
  
      const creatorId = user.id;
      console.log("Creator ID:", creatorId);
  
      const currentTime = new Date().toISOString();
  
      const { data: branchData, error: branchError } = await supabase
        .from("branch")
        .insert({ name: newBranch.name, creator: creatorId, created_at: currentTime })
        .select()
        .single();
  
      if (branchError) {
        console.error("Branch Insert Error:", branchError.message);
        alert("Branch creation failed!");
        setloading(false);
        return;
      }
  
      console.log("Branch Data:", branchData);
      
      // Insert into member table
      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .insert({ branch: branchData?.id, member_profile: creatorId, member_role: "creator" });
  
      if (memberError) {
        console.error("Member Insert Error:", memberError.message);
        alert("Failed to add creator to members.");
        setloading(false);
        return;
      }
  
      console.log("Member Data:", memberData);
      setloading(false);
  
      alert("Branch Created Successfully!");
      window.location.reload();
    } catch (e) {
      console.error("Unable to Create Branch:", e);
      alert("Unable to Create Branch!!");
      setloading(false);
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
              
              <DialogFooter>
                <Button  type="submit" disabled={loading} onClick={addBranch}>
                  {loading ? "Adding branch" : "Add Branch" }
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
                <Button type="submit"  onClick={addVessel}>
                  Add vessel
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