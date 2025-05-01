"use client";
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
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { stat } from "fs";
import { Loader2, Eye, Check } from "lucide-react"; // Assuming you have lucide-react installed for icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  user_role: string;
  vessels: string[];
  number_of_vessels?: string;
  primary_contact_person?: string;
  shipping_company_name?: string;
  official_email_address?: string;
  mobile_phone_number?: string;
  status: "accepted" | "pending";
}

interface UserData {
  email?: string;
  phone_number?: string;
}

function ProfileRow({ profile, i }: { profile: Profile; i: number }) {
  const [userData, setUserData] = useState<UserData>();
  const router = useRouter();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [profileIdToApprove, setProfileIdToApprove] = useState<string | null>(
    null
  );

  async function getUserDetail() {
    const res = await fetch("/api/all-all-customer", {
      method: "POST",
      body: JSON.stringify({ status: "accepted" }),
    });

    const data = await res.json();
    console.log(data);

    setUserData(data.userData);
  }

  useEffect(() => {
    getUserDetail();
  }, []);

  const handleApprove = async (customerId: string) => {
    setIsApproveDialogOpen(false); // Close the dialog after confirmation
    if (!customerId) return;
    const res = await fetch("/api/update-customer-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerId: customerId }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Customer approved successfully!");
      router.refresh(); // Refresh the page to update the status
    } else {
      toast.error(data?.error || "Failed to approve customer.");
    }
  };

  const openApproveDialog = (id: string) => {
    setProfileIdToApprove(id);
    setIsApproveDialogOpen(true);
  };

  return (
    <>
      <TableRow>
        <TableCell>{i + 1}</TableCell>
        <TableCell>{profile.shipping_company_name}</TableCell>
        <TableCell>{profile?.official_email_address}</TableCell>
        <TableCell>{profile?.mobile_phone_number}</TableCell>
        <TableCell>{profile.primary_contact_person}</TableCell>
        <TableCell>{profile.number_of_vessels}</TableCell>

        <TableCell className="text-center px-4 py-3 text-md">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <DotsVerticalIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-md">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/admin/customers/view-customer/${profile.id}`} // Replace with your actual view page URL
                  className="flex items-center"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>

              {profile.status === "pending" && (
                <>
                  <DropdownMenuItem
                    onClick={() => openApproveDialog(profile.id)}
                    className="flex items-center text-green-600"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Confirmation Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this customer?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleApprove(profileIdToApprove!)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const ITEMS_PER_PAGE = 12;

export default function CustomersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [company_name, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [primary_contact_person, setPrimaryContactPerson] = useState("");
  const [filterStatus, setFilterStatus] = useState<"accepted" | "pending">(
    "accepted"
  );
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchProfiles() {
    try {
      setLoading(true);

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE - 1;

      const res = await fetch("/api/fetch-all-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: filterStatus,
          from: startIndex,
          to: endIndex,
          search: searchTerm.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        console.error("Error fetching profiles:", result.error);
        toast.error("Error fetching customers: " + result.error);
      } else {
        setProfiles((result.customers as Profile[]) || []);
        setTotalCustomers(result.total || 0);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, filterStatus, searchTerm]);

  const totalPages = Math.ceil(totalCustomers / ITEMS_PER_PAGE);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleInviteCustomer = async () => {
    if (!company_name || !email || !phone_number || !primary_contact_person) {
      toast.error("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return;
    }

    try {
      const res = await fetch("/api/invite-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name,
          email,
          phone_number,
          primary_contact_person,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Customer invited successfully!");
        setOpen(false);
        setCompanyName("");
        setEmail("");
        setPhoneNumber("");
        setPrimaryContactPerson("");
        setCurrentPage(1);
        fetchProfiles();
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Error inviting customer:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <main className="p-4 mt-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">All Customers</h1>
        </div>
        <div className="mb-4"></div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black shadow-md hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
              Add Customer
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Customer</DialogTitle>
              <DialogDescription>
                Enter the details of the customer you want to invite.
              </DialogDescription>
            </DialogHeader>

            <form className="grid gap-4 py-4">
              {/* Company Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="company_name" className="text-right">
                  Company Name
                </label>
                <Input
                  id="company_name"
                  className="col-span-3"
                  value={company_name}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Phone Number */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone_number" className="text-right">
                  Phone Number
                </label>
                <Input
                  id="phone_number"
                  className="col-span-3"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {/* Primary Contact Person */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="primary_contact_person" className="text-right">
                  Primary Contact
                </label>
                <Input
                  id="primary_contact_person"
                  className="col-span-3"
                  value={primary_contact_person}
                  onChange={(e) => setPrimaryContactPerson(e.target.value)}
                />
              </div>
            </form>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleInviteCustomer}>
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex mb-4">
          <Button
            variant={filterStatus === "accepted" ? "default" : "outline"}
            onClick={() => {
              setCurrentPage(1);
              setFilterStatus("accepted");
            }}
            className="mr-2"
          >
            Accepted
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            onClick={() => {
              setCurrentPage(1);
              setFilterStatus("pending");
            }}
          >
            Pending
          </Button>
        </div>

        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-md"
        />
      </div>

      <div className="mt-8">
        <Table>
          <TableCaption>A list of all {filterStatus} Customers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>S. No.</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>no. of Vessels</TableHead>

              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                </TableCell>
              </TableRow>
            ) : profiles.length > 0 ? (
              profiles.map((profile, i) => (
                <ProfileRow
                  key={profile.id}
                  profile={profile}
                  i={(currentPage - 1) * ITEMS_PER_PAGE + i}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No {filterStatus} customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            className="mr-2"
          >
            Previous
          </Button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            className="ml-2"
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
