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

interface Director {
  id: string;
  email: string;
  branch_id: string;
}

export default function DirectorAssignUX({ branchId }: { branchId: string }) {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<string, string[]>>({});
  const [selectedDirectors, setSelectedDirectors] = useState<string[]>([]);
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

    const fetchDirectors = async () => {
      const { data, error } = await supabase
        .from("director")
        .select("id, email, branch_id")
        .eq("branch_id", branchId);

      if (error) console.error("Error fetching directors:", error);
      else setDirectors(data || []);
    };

    const fetchAssignments = async () => {
      const { data, error } = await supabase
        .from("director_assignment")
        .select("*")
        .eq("branch_id", branchId);

      if (error) {
        console.error("Error fetching assignments:", error);
        return;
      }

      const assignmentMap: Record<string, string[]> = {};
      data?.forEach((row: { vessel_id: string; director_id: string }) => {
        if (!assignmentMap[row.vessel_id]) assignmentMap[row.vessel_id] = [];
        assignmentMap[row.vessel_id].push(row.director_id);
      });

      setAssigned(assignmentMap);
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchVessels(), fetchDirectors(), fetchAssignments()]);
      setLoading(false);
    };

    fetchData();
  }, [branchId]);

  const handleCheckboxChange = (directorId: string) => {
    setSelectedDirectors((prev) =>
      prev.includes(directorId)
        ? prev.filter((id) => id !== directorId)
        : [...prev, directorId]
    );
  };

  const assignDirectors = async () => {
    if (!selectedVessel) return;

    const { error: deleteError } = await supabase
      .from("director_assignment")
      .delete()
      .eq("vessel_id", selectedVessel)
      .eq("branch_id", branchId);

    if (deleteError) {
      console.error("Failed to delete old assignments:", deleteError);
      return;
    }

    const newAssignments = selectedDirectors.map((directorId) => ({
      vessel_id: selectedVessel,
      director_id: directorId,
      branch_id: branchId,
    }));

    const { error: insertError } = await supabase
      .from("director_assignment")
      .insert(newAssignments);

    if (insertError) {
      console.error("Failed to insert new assignments:", insertError);
      return;
    }

    setAssigned((prev) => ({
      ...prev,
      [selectedVessel]: selectedDirectors,
    }));
    setDialogOpen(false);
    setSelectedDirectors([]);
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
                  setSelectedDirectors(assigned[vessel.id] || []);
                }}
              >
                {vessel.vessel_name}
              </Button>
            ))
          )}
        </CardContent>
      </Card>

      {/* Assigned Directors */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <span>Assigned Directors</span>
          {selectedVessel &&
            (directors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No directors available.
              </p>
            ) : (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setDialogOpen(true)}>
                    Assign Directors
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <h2 className="text-lg font-semibold mb-4">
                    Assign Directors
                  </h2>
                  <div className="flex flex-col gap-3">
                    {directors.map((director) => (
                      <div
                        key={director.id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={director.id}
                          checked={selectedDirectors.includes(director.id)}
                          onCheckedChange={() =>
                            handleCheckboxChange(director.id)
                          }
                        />
                        <Label htmlFor={director.id}>{director.email}</Label>
                      </div>
                    ))}
                    <Button onClick={assignDirectors} className="mt-4">
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
              .map((id) => directors.find((d) => d.id === id))
              .filter((d) => d)
              .map((director) => (
                <div
                  key={director!.id}
                  className="px-3 py-2 bg-muted rounded text-sm"
                >
                  {director!.email}
                </div>
              ))
          ) : (
            <p className="text-muted-foreground text-sm">
              No directors assigned.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
