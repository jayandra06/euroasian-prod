"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Vessel {
  id: string;
  vessel_name: string;
}

interface Manager {
  id: string;
  email: string;
  branch_id: string;
}

export default function VesselAssignUX({ branchId }: { branchId: string }) {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<string, string[]>>({});
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchVessels = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User not logged in.");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/fetch-all-vessel?login_id=${user.id}`);
      const { data, error } = await res.json();
      if (error) console.error("Error fetching vessels:", error);
      else setVessels(data || []);
    };

    const fetchManagers = async () => {
      const { data, error } = await supabase
        .from("manager")
        .select("id, email, branch_id")
        .eq("branch_id", branchId);

      if (error) console.error("Error fetching managers:", error);
      else setManagers(data || []);
    };

    const fetchAssignments = async () => {
      const { data, error } = await supabase
        .from("vessel_assignments")
        .select("*")
        .eq("branch_id", branchId);

      if (error) {
        console.error("Error fetching assignments:", error);
        return;
      }

      const assignmentMap: Record<string, string[]> = {};
      data?.forEach((row: { vessel_id: string; manager_id: string }) => {
        if (!assignmentMap[row.vessel_id]) assignmentMap[row.vessel_id] = [];
        assignmentMap[row.vessel_id].push(row.manager_id);
      });

      setAssigned(assignmentMap);
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchVessels(), fetchManagers(), fetchAssignments()]);
      setLoading(false);
    };

    fetchData();
  }, [branchId]);

  const handleCheckboxChange = (managerId: string) => {
    setSelectedManagers((prev) =>
      prev.includes(managerId)
        ? prev.filter((id) => id !== managerId)
        : [...prev, managerId]
    );
  };

  const assignManagers = async () => {
    if (!selectedVessel) return;

    const { error: deleteError } = await supabase
      .from("vessel_assignments")
      .delete()
      .eq("vessel_id", selectedVessel)
      .eq("branch_id", branchId);

    if (deleteError) {
      console.error("Failed to delete old assignments:", deleteError);
      return;
    }

    const newAssignments = selectedManagers.map((managerId) => ({
      vessel_id: selectedVessel,
      manager_id: managerId,
      branch_id: branchId,
    }));

    const { error: insertError } = await supabase
      .from("vessel_assignments")
      .insert(newAssignments);

    if (insertError) {
      console.error("Failed to insert new assignments:", insertError);
      return;
    }

    setAssigned((prev) => ({
      ...prev,
      [selectedVessel]: selectedManagers,
    }));
    setDialogOpen(false);
    setSelectedManagers([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto grid grid-cols-2 gap-6">
      {/* Vessels List */}
      <Card>
        <CardHeader>Vessels</CardHeader>
        <CardContent className="flex flex-col gap-2">
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading vessels...</p>
          ) : (
            vessels.map((vessel) => (
              <Button
                key={vessel.id}
                variant={selectedVessel === vessel.id ? "default" : "outline"}
                className={
                  selectedVessel === vessel.id ? "ring ring-primary" : ""
                }
                onClick={() => {
                  setSelectedVessel(vessel.id);
                  setSelectedManagers(assigned[vessel.id] || []);
                }}
              >
                {vessel.vessel_name}
              </Button>
            ))
          )}
        </CardContent>
      </Card>

      {/* Assigned Managers */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <span>Assigned Managers</span>
          {selectedVessel &&
            (managers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No managers available.
              </p>
            ) : (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setDialogOpen(true)}>
                    Assign Managers
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <h2 className="text-lg font-semibold mb-4">
                    Assign Managers
                  </h2>
                  <div className="flex flex-col gap-3">
                    {managers.map((manager) => (
                      <div key={manager.id} className="flex items-center gap-2">
                        <Checkbox
                          id={manager.id}
                          checked={selectedManagers.includes(manager.id)}
                          onCheckedChange={() =>
                            handleCheckboxChange(manager.id)
                          }
                        />
                        <Label htmlFor={manager.id}>{manager.email}</Label>
                      </div>
                    ))}
                    <Button onClick={assignManagers} className="mt-4">
                      Confirm Assignment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
        </CardHeader>
        <CardContent className="space-y-2">
          {selectedVessel && assigned[selectedVessel]?.length > 0 ? (
            assigned[selectedVessel]
              .map((id) => managers.find((m) => m.id === id))
              .filter((manager) => manager) // remove undefined
              .map((manager) => (
                <div
                  key={manager!.id}
                  className="px-3 py-2 bg-muted rounded text-sm"
                >
                  {manager!.email}
                </div>
              ))
          ) : (
            <p className="text-muted-foreground text-sm">
              No managers assigned.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
