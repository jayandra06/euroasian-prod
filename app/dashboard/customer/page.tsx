"use client";
import { Chart2Component } from "@/components/Chart2Component";
import { ChartsComponent } from "@/components/ChartsComponents";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { PlusIcon } from "lucide-react";
import { useState, useEffect } from "react";

function InviteAdmin() {
  return (
    <div className="item-right flex justify-end mt-4 mr-4">
      <Button className="text-white font-semibold rounded-md shadow-sm transition duration-200">
        <PlusIcon className="mr-2 h-4 w-4" />
        Invite Vendor
      </Button>
    </div>
  );
}

function RFQCard({ rfq }: { rfq: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RFQs</CardTitle>
        <CardDescription>Total RFQs Created</CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="text-3xl font-bold">{rfq}</h1>
      </CardContent>
      <CardFooter>
        <p className="text-xs">Updated Now</p>
      </CardFooter>
    </Card>
  );
}

function RevenueCard({ branch }: { branch: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch</CardTitle>
        <CardDescription>Total Branches</CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="text-3xl font-bold">{branch}</h1>
      </CardContent>
      <CardFooter>
        <p className="text-xs">Updated Now</p>
      </CardFooter>
    </Card>
  );
}

function CustomerCard({ employee }: { employee: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <CardDescription>Total Happy Employees</CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="text-3xl font-bold">{employee}</h1>
      </CardContent>
      <CardFooter>
        <p className="text-xs">Updated Now</p>
      </CardFooter>
    </Card>
  );
}

export default function CustomerPage() {
  const [rfqs, setRfqs] = useState(0);
  const [branches, setBranches] = useState(0);
  const [employee, setEmployee] = useState(0);

  async function fetchDetails() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const rfqs = await supabase
      .from("rfq")
      .select("*")
      .eq("client_profile", user?.id);
    setRfqs(rfqs.data!.length);

    const branches = await supabase
      .from("branch")
      .select("*")
      .eq("creator", user?.id);
    setBranches(branches.data!.length);

    for (let i = 0; i < branches.data!.length; i++) {
      const branch = branches.data![i];

      const member = await supabase
        .from("member")
        .select("*")
        .eq("branch", branch.id);
      setEmployee((e) => e + member.data!.length);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <main className="">
      <div>
        <InviteAdmin />
      </div>
      <div className="max-w-7xl w-full justify-self-center grid md:grid-cols-3 gap-4 mt-4">
        <RFQCard rfq={rfqs} />
        <RevenueCard branch={branches} />
        <CustomerCard employee={employee} />
      </div>

      <div className="mt-8">
        <h1 className="text-md font-bold">Dashboard</h1>
      </div>

      <div className="max-w-7xl w-full justify-self-center grid md:grid-cols-2 gap-4 mt-4">
        <ChartsComponent />
        <Chart2Component />
      </div>
    </main>
  );
}
