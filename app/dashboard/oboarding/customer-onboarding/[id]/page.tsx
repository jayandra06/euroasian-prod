"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import axios from "axios";
import toast from 'react-hot-toast';
import { createClient } from "@/utils/supabase/client";


interface CustomerOnboardingFormProps {
  email: string;
}

export default function CustomerOnboardingForm({ email: initialEmail }: CustomerOnboardingFormProps) {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userData) {
        setUserId(userData.user?.id || null); // Set the user ID if available
      } else {
        console.error("No user found.");
      }

      if (userError) {
        console.error("Error fetching user:", userError);
      } else if (userData) {
        console.log("Fetched user:", userData);
      }
    }

    fetchUser();
  }, []);


  useEffect(() => {
    toast.success("Toast test!");
  }, []);
  

  useEffect(() => {
    async function fetchInvitations() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("email", "arun@vijethasoftwares.in")
        .single(); // Assuming only one invitation per email

      if (error) {
        console.error("Error fetching invitations:", error);
        // Handle the error appropriately, e.g., display a message to the user
      } else if (data) {
        console.log("Fetched invitation:", data);
        setCompanyName(data.company_name || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phone_number || "");
        // Process the fetched data, e.g., update component state
      }
    }

    fetchInvitations();
  }, [initialEmail]);


  const handleSubmit = async () => {
  
    setLoading(true);
    const formData = {
      login_id: userId,
      shipping_company_name: companyName || (document.getElementById("shippingCompanyName") as HTMLInputElement).value,
      primary_contact_person: (
        document.getElementById("primaryContactPerson") as HTMLInputElement
      ).value,
      official_email_address: email || (document.getElementById("officialEmailAddress") as HTMLInputElement).value,
      mobile_country_code: "+1 (US)", // Get selected if needed
      mobile_phone_number: phoneNumber || (document.getElementById("mobilePhoneNumber") as HTMLInputElement).value,
      desk_country_code: "+1 (US)", // Get selected if needed
      desk_phone_number: (
        document.getElementById("deskPhoneNumber") as HTMLInputElement
      ).value,
      address_line1: (
        document.getElementById("addressLine1") as HTMLInputElement
      ).value,
      address_line2: (
        document.getElementById("addressLine2") as HTMLInputElement
      ).value,
      city: (document.getElementById("city") as HTMLInputElement).value,
      province_state: (
        document.getElementById("provinceState") as HTMLInputElement
      ).value,
      postal_code: (document.getElementById("postalCode") as HTMLInputElement)
        .value,
      country: "India", // Replace with selected country if needed
      number_of_vessels: parseInt(
        (document.getElementById("numberOfVessels") as HTMLInputElement).value
      ),
      tax_id: (document.getElementById("taxId") as HTMLInputElement).value,
      account_holder_name: (
        document.getElementById("accountHolderName") as HTMLInputElement
      ).value,
      bank_name: (document.getElementById("bankName") as HTMLInputElement)
        .value,
      iban: (document.getElementById("iban") as HTMLInputElement).value,
      swift_code: (document.getElementById("swiftCode") as HTMLInputElement)
        .value,
      invoicing_email: (
        document.getElementById("invoicingEmail") as HTMLInputElement
      ).value,
      billing_address_line1: (
        document.getElementById("billingAddressLine1") as HTMLInputElement
      ).value,
      billing_address_line2: (
        document.getElementById("billingAddressLine2") as HTMLInputElement
      ).value,
      billing_city: (document.getElementById("billingCity") as HTMLInputElement)
        .value,
      billing_province_state: (
        document.getElementById("billingProvinceState") as HTMLInputElement
      ).value,
      billing_postal_code: (
        document.getElementById("billingPostalCode") as HTMLInputElement
      ).value,
      billing_country: "India", // Replace with selected country if needed
    };

    try {
      const res = await axios.post("/api/save-customer-info", formData);
     alert("Form saved successfully!");
     

    } catch (err) {
      console.error("Error saving form:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-white shadow-md rounded-md p-8">
        <NavigationMenu>
          <NavigationMenuList className="justify-start">
            <NavigationMenuItem>
              <div className="font-bold text-xl">Euroasian</div>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="min-h-screen bg-gray-100 py-10 flex justify-center">

        <div className="w-full md:w-[60%] mx-auto">


          <div className="w-full md:w-7/10 mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center font-semibold">
                  Customer Onboarding Form
                </CardTitle>
                <CardDescription>
                  Euroasiann ERP Shipping Company Details
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {/* Shipping Company Details */}
                <div>
                  <Label htmlFor="shippingCompanyName" className="py-2">
                    Shipping Company Name
                  </Label>
                  <Input
                    id="shippingCompanyName"
                    value={companyName}
                    disabled={!!companyName}
                  />
                </div>
                <div>
                  <Label htmlFor="primaryContactPerson" className="py-2">
                    Primary Contact Person
                  </Label>
                  <Input id="primaryContactPerson" />
                </div>
                <div>
                  <Label htmlFor="officialEmailAddress" className="py-2">
                    Official Email Address
                  </Label>
                  <Input
                    id="officialEmailAddress"
                    type="email"
                    value={email}
                    disabled={!!email}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobilePhoneNumber" className="py-2">
                      Mobile Phone Number
                    </Label>
                    <div className="flex">
                      <Select disabled={!!phoneNumber}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="+1 (US)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+31 (NL)">🇳🇱 +31 (NL)</SelectItem>
                          <SelectItem value="+91 (IN)">🇮🇳 +91 (IN)</SelectItem>
                          <SelectItem value="+1 (US)">🇺🇸 +1 (US)</SelectItem>
                          <SelectItem value="+44 (UK)">🇬🇧 +44 (UK)</SelectItem>
                          <SelectItem value="+65 (SG)">🇸🇬 +65 (SG)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="mobilePhoneNumber"
                        className="ml-2"
                        value={phoneNumber}
                        disabled={!!phoneNumber}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deskPhoneNumber" className="py-2">
                      Desk Phone Number
                    </Label>
                    <div className="flex">
                      <Select>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="+1 (US)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+31 (NL)">🇳🇱 +31 (NL)</SelectItem>
                          <SelectItem value="+91 (IN)">🇮🇳 +91 (IN)</SelectItem>
                          <SelectItem value="+1 (US)">🇺🇸 +1 (US)</SelectItem>
                          <SelectItem value="+44 (UK)">🇬🇧 +44 (UK)</SelectItem>
                          <SelectItem value="+65 (SG)">🇸🇬 +65 (SG)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input id="deskPhoneNumber" className="ml-2" />
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div>
                  <Label htmlFor="addressLine1" className="py-2">
                    Address Line 1
                  </Label>
                  <Input id="addressLine1" />
                </div>
                <div>
                  <Label htmlFor="addressLine2" className="py-2">
                    Address Line 2
                  </Label>
                  <Input id="addressLine2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="py-2">
                      City
                    </Label>
                    <Input id="city" />
                  </div>
                  <div>
                    <Label htmlFor="provinceState" className="py-2">
                      Province / State
                    </Label>
                    <Input id="provinceState" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode" className="py-2">
                      Postal Code
                    </Label>
                    <Input id="postalCode" />
                  </div>
                  <div>
                    <Label htmlFor="country" className="py-2">
                      Country
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select Country --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Netherlands">Netherlands</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Singapore">Singapore</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Vessel Information */}
                <div>
                  <Label htmlFor="numberOfVessels" className="py-2">
                    Number of Vessels to Onboard
                  </Label>
                  <Input id="numberOfVessels" type="number" />
                </div>

                {/* Tax Information */}
                <div>
                  <Label htmlFor="taxId" className="py-2">
                    Tax ID / VAT / GST / EIN
                  </Label>
                  <Input id="taxId" />
                </div>

                {/* Banking Details */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Banking Details (For Auto-Debit)
                  </h3>
                  <div>
                    <Label htmlFor="accountHolderName" className="py-2">
                      Account Holder Name
                    </Label>
                    <Input id="accountHolderName" />
                  </div>
                  <div>
                    <Label htmlFor="bankName" className="py-2">
                      Bank Name
                    </Label>
                    <Input id="bankName" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="iban" className="py-2">
                        IBAN / Account Number
                      </Label>
                      <Input id="iban" />
                    </div>
                    <div>
                      <Label htmlFor="swiftCode" className="py-2">
                        SWIFT / BIC Code
                      </Label>
                      <Input id="swiftCode" />
                    </div>
                  </div>
                </div>

                {/* Invoicing Details */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Invoicing Details
                  </h3>
                  <div>
                    <Label htmlFor="invoicingEmail" className="py-2">
                      Email for Invoicing
                    </Label>
                    <Input id="invoicingEmail" type="email" />
                  </div>
                  <div>
                    <Label htmlFor="billingAddressLine1" className="py-2">
                      Billing Address Line 1
                    </Label>
                    <Input id="billingAddressLine1" />
                  </div>
                  <div>
                    <Label htmlFor="billingAddressLine2" className="py-2">
                      Billing Address Line 2
                    </Label>
                    <Input id="billingAddressLine2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingCity" className="py-2">
                        Billing City
                      </Label>
                      <Input id="billingCity" />
                    </div>
                    <div>
                      <Label htmlFor="billingProvinceState" className="py-2">
                        Billing Province / State
                      </Label>
                      <Input id="billingProvinceState" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingPostalCode" className="py-2">
                        Billing Postal Code
                      </Label>
                      <Input id="billingPostalCode" />
                    </div>
                    <div>
                      <Label htmlFor="billingCountry" className="py-2">
                        Billing Country
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select Country --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Netherlands">Netherlands</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                          <SelectItem value="United Kingdom">
                            United Kingdom
                          </SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="Singapore">Singapore</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Proceed Button */}
                <Button
                  className="mt-8 w-full"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Proceed to Pricing"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}