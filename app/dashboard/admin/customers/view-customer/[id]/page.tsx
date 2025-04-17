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
import axios from "axios";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";

interface CustomerOnboardingFormProps {
  customer_id: string;
  // userId?: string; // Removed userId prop as per requirement
}

export default function CustomerOnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(true); // State to control view/edit mode
  const [companyName, setCompanyName] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  // const [userId, setUserId] = useState<string | null>(initialUserId || null); // Removed userId state
  const [primaryContactPerson, setPrimaryContactPerson] = useState("");
  const [deskPhoneNumber, setDeskPhoneNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [provinceState, setProvinceState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India"); // Default value
  const [numberOfVessels, setNumberOfVessels] = useState<number | undefined>(0);
  const [taxId, setTaxId] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [invoicingEmail, setInvoicingEmail] = useState("");
  const [billingAddressLine1, setBillingAddressLine1] = useState("");
  const [billingAddressLine2, setBillingAddressLine2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingProvinceState, setBillingProvinceState] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("India"); // Default value
  const [email, setEmail] = useState(""); // Missing email state
  const params = useParams();
  const customer_id = params.id as string | undefined;

  async function fetchData(customer_id: string) {
    const supabase = createClient();

    const { data: customerData, error: customerError } = await supabase
      .from("customer_details") // Use the table name as requested
      .select("*")
      .eq("id", customer_id)
      .single();

    if (customerError) {
      console.error("Error fetching customer data:", customerError);
      toast.error("Error fetching customer details.");
      setIsViewMode(false); // If error, maybe start in edit mode or show error
    } else if (customerData) {
      console.log("Fetched customer data:", customerData);
      setIsViewMode(true); // Set to view mode if data exists
      setCompanyName(customerData.shipping_company_name || "");
      setPrimaryContactPerson(customerData.primary_contact_person || "");
      setEmail(customerData.official_email_address || "");
      setPhoneNumber(customerData.mobile_phone_number || "");
      setDeskPhoneNumber(customerData.desk_phone_number || "");
      setAddressLine1(customerData.address_line1 || "");
      setAddressLine2(customerData.address_line2 || "");
      setCity(customerData.city || "");
      setProvinceState(customerData.province_state || "");
      setPostalCode(customerData.postal_code || "");
      setCountry(customerData.country || "India");
      setNumberOfVessels(customerData.number_of_vessels);
      setTaxId(customerData.tax_id || "");
      setAccountHolderName(customerData.account_holder_name || "");
      setBankName(customerData.bank_name || "");
      setIban(customerData.iban || "");
      setSwiftCode(customerData.swift_code || "");
      setInvoicingEmail(customerData.invoicing_email || "");
      setBillingAddressLine1(customerData.billing_address_line1 || "");
      setBillingAddressLine2(customerData.billing_address_line2 || "");
      setBillingCity(customerData.billing_city || "");
      setBillingProvinceState(customerData.billing_province_state || "");
      setBillingPostalCode(customerData.billing_postal_Code || "");
      setBillingCountry(customerData.billing_country || "India");
      console.log("Customer data fetched and fields populated."); // Console log after successful fetch and population
    } else {
      setIsViewMode(false); // If no data found, start in edit mode
    }
  }

  useEffect(() => {
    if (customer_id) {
      fetchData(customer_id);
    }
  }, [customer_id]);

  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      login_id: null, // Removed userId, adjust backend logic accordingly
      shipping_company_name: companyName,
      primary_contact_person: primaryContactPerson,
      official_email_address: email,
      mobile_country_code: "+1 (US)", // Get selected if needed
      mobile_phone_number: phoneNumber,
      desk_country_code: "+1 (US)", // Get selected if needed
      desk_phone_number: deskPhoneNumber,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city: city,
      province_state: provinceState,
      postal_code: postalCode,
      country: country,
      number_of_vessels: numberOfVessels,
      tax_id: taxId,
      account_holder_name: accountHolderName,
      bank_name: bankName,
      iban: iban,
      swift_code: swiftCode,
      invoicing_email: invoicingEmail,
      billing_address_line1: billingAddressLine1,
      billing_address_line2: billingAddressLine2,
      billing_city: billingCity,
      billing_province_state: billingProvinceState,
      billing_postal_code: billingPostalCode,
      billing_country: billingCountry,
      id: customer_id, // Include customerId for updating if needed
    };

    try {
      const res = await axios.post("/api/save-customer-info", formData);
      toast.success("Form saved successfully!");
      setIsViewMode(true); // Switch back to view mode after saving
    } catch (err: any) {
      console.error("Error saving form:", err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsViewMode(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
        <div className="w-full md:w-[60%] mx-auto">
          <div className="w-full md:w-7/10 mx-auto">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-semibold">
                  Customer Details
                  </CardTitle>
                  {isViewMode && (
                  <Button className="ml-5" onClick={handleEditClick} variant="outline">
                    Edit
                  </Button>
                  )}
                </div>
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
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <Label htmlFor="primaryContactPerson" className="py-2">
                    Primary Contact Person
                  </Label>
                  <Input
                    id="primaryContactPerson"
                    value={primaryContactPerson}
                    onChange={(e) => setPrimaryContactPerson(e.target.value)}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <Label htmlFor="officialEmailAddress" className="py-2">
                    Official Email Address
                  </Label>
                  <Input
                    id="officialEmailAddress"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isViewMode}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobilePhoneNumber" className="py-2">
                      Mobile Phone Number
                    </Label>
                    <div className="flex">
                      <Select disabled={isViewMode}>
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
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deskPhoneNumber" className="py-2">
                      Desk Phone Number
                    </Label>
                    <div className="flex">
                      <Select disabled={isViewMode}>
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
                        id="deskPhoneNumber"
                        className="ml-2"
                        value={deskPhoneNumber}
                        onChange={(e) => setDeskPhoneNumber(e.target.value)}
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div>
                  <Label htmlFor="addressLine1" className="py-2">
                    Address Line 1
                  </Label>
                  <Input
                    id="addressLine1"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    disabled={isViewMode}
                  />
                </div>
                <div>
                  <Label htmlFor="addressLine2" className="py-2">
                    Address Line 2
                  </Label>
                  <Input
                    id="addressLine2"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    disabled={isViewMode}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="py-2">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="provinceState" className="py-2">
                      Province / State
                    </Label>
                    <Input
                      id="provinceState"
                      value={provinceState}
                      onChange={(e) => setProvinceState(e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode" className="py-2">
                      Postal Code
                    </Label>
                    <Input
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="py-2">
                      Country
                    </Label>
                    <Select
                      value={country}
                      onValueChange={setCountry}
                      disabled={isViewMode}
                    >
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
                  <Input
                    id="numberOfVessels"
                    type="number"
                    value={
                      numberOfVessels !== undefined
                        ? numberOfVessels.toString()
                        : ""
                    }
                    onChange={(e) =>
                      setNumberOfVessels(parseInt(e.target.value) || 0)
                    }
                    disabled={isViewMode}
                  />
                </div>

                {/* Tax Information */}
                <div>
                  <Label htmlFor="taxId" className="py-2">
                    Tax ID / VAT / GST / EIN
                  </Label>
                  <Input
                    id="taxId"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    disabled={isViewMode}
                  />
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
                    <Input
                      id="accountHolderName"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName" className="py-2">
                      Bank Name
                    </Label>
                    <Input
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="iban" className="py-2">
                        IBAN / Account Number
                      </Label>
                      <Input
                        id="iban"
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="swiftCode" className="py-2">
                        SWIFT / BIC Code
                      </Label>
                      <Input
                        id="swiftCode"
                        value={swiftCode}
                        onChange={(e) => setSwiftCode(e.target.value)}
                        disabled={isViewMode}
                      />
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
                    <Input
                      id="invoicingEmail"
                      type="email"
                      value={invoicingEmail}
                      onChange={(e) => setInvoicingEmail(e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingAddressLine1" className="py-2">
                      Billing Address Line 1
                    </Label>
                    <Input
                      id="billingAddressLine1"
                      value={billingAddressLine1}
                      onChange={(e) => setBillingAddressLine1(e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingAddressLine2" className="py-2">
                      Billing Address Line 2
                    </Label>
                    <Input
                      id="billingAddressLine2"
                      value={billingAddressLine2}
                      onChange={(e) => setBillingAddressLine2(e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingCity" className="py-2">
                        Billing City
                      </Label>
                      <Input
                        id="billingCity"
                        value={billingCity}
                        onChange={(e) => setBillingCity(e.target.value)}
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingProvinceState" className="py-2">
                        Billing Province / State
                      </Label>
                      <Input
                        id="billingProvinceState"
                        value={billingProvinceState}
                        onChange={(e) =>
                          setBillingProvinceState(e.target.value)
                        }
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingPostalCode" className="py-2">
                        Billing Postal Code
                      </Label>
                      <Input
                        id="billingPostalCode"
                        value={billingPostalCode}
                        onChange={(e) => setBillingPostalCode(e.target.value)}
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingCountry" className="py-2">
                        Billing Country
                      </Label>
                      <Select
                        value={billingCountry}
                        onValueChange={setBillingCountry}
                        disabled={isViewMode}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select Country --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Netherlands">
                            Netherlands
                          </SelectItem>
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
                {!isViewMode && (
                  <Button
                    className="mt-8 w-full"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Update"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
