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
import toast from 'react-hot-toast';
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea";

export default function PortAgentOnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [conditions, setConditions] = useState("");
  const [remarks, setRemarks] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customer_id");
  const emailFromParams = searchParams.get("email");

  useEffect(() => {
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [emailFromParams]);

  const handleSubmit = async () => {
    setLoading(true);
    const supabase = createClient();

    if (!customerId) {
      toast.error("Customer ID is missing.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('port_agent')
      .insert({
        name: name,
        email: email,
        phone_number: phoneNumber,
        delivery_address: deliveryAddress,
        conditions: conditions,
        remarks: remarks,
        customer_id: customerId,
      });

    if (error) {
      console.error("Error saving port agent details:", error);
      toast.error("Failed to save details. Please try again.");
    } else {
      setSubmissionSuccess(true);
      // Optionally redirect the user after successful submission
      // router.push(`/customer/${customerId}/pricing`);
    }
    setLoading(false);
  };

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 flex justify-center items-center">
        <Card className="w-full md:w-[60%] mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-semibold">
              Onboarding Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-700">
              You have been onboarded successfully. Thank you!
            </p>
            {/* You can add a button here for further actions if needed */}
            {/* <Button className="mt-4" onClick={() => router.push(`/customer/${customerId}/dashboard`)}> */}
            {/* Go to Dashboard */}
            {/* </Button> */}
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  Port Agent Onboarding Form
                </CardTitle>
                <CardDescription>
                  Please fill in the details below.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="py-2">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {/* Email ID */}
                <div>
                  <Label htmlFor="email" className="py-2">
                    Email ID
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled={!!email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* Phone Number */}
                <div>
                  <Label htmlFor="phoneNumber" className="py-2">
                    Phone Number
                  </Label>
                  <div className="flex">
                    <Select value={phoneCode} onValueChange={setPhoneCode}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="+1 (US)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+31">🇳🇱 +31 (NL)</SelectItem>
                        <SelectItem value="+91">🇮🇳 +91 (IN)</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1 (US)</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                        <SelectItem value="+65">🇸🇬 +65 (SG)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phoneNumber"
                      className="ml-2"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
                {/* Delivery Address */}
                <div>
                  <Label htmlFor="deliveryAddress" className="py-2">
                    Delivery Address
                  </Label>
                  <Input
                    id="deliveryAddress"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                {/* Conditions */}
                <div>
                  <Label htmlFor="conditions" className="py-2">
                    Conditions
                  </Label>
                  <Textarea
                    id="conditions"
                    className="min-h-[100px]"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                  />
                </div>
                {/* Remarks */}
                <div>
                  <Label htmlFor="remarks" className="py-2">
                    Remarks
                  </Label>
                  <Textarea
                    id="remarks"
                    className="min-h-[100px]"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

                {/* Proceed Button */}
                <Button
                  className="mt-8 w-full"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Details"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}