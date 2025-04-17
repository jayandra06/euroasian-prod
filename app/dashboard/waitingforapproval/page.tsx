// pages/waiting-for-approval.js
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const WaitingForApprovalPage = () => {
  const router = useRouter();

 

  // Example of a simple redirect after a delay (replace with actual logic)
  useEffect(() => {
    // Simulate checking approval status (replace with your actual mechanism)
    const checkApproval = async () => {
      // In a real application, you would make an API call here
      // to check if the user's status has been updated to 'approved'.
      // For this example, we'll just use a timeout.
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds

      // After checking, if approved, redirect
      // Replace this with your actual approval status check
      const isApproved = false; // Replace with your actual check
      if (isApproved) {
        router.push("/dashboard"); // Redirect to the dashboard or appropriate page
      }
    };

    // checkApproval(); // Uncomment this to enable the simulated check
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 py-20 flex justify-center items-center">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold text-center">
            Waiting for Approval
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <CardDescription className="text-center text-gray-600">
            Your account is currently pending approval.
          </CardDescription>
          <CardDescription className="text-center text-sm text-gray-500">
            We are reviewing your information and will notify you via email once
            your account has been approved. This process usually takes a short
            while.
          </CardDescription>
          <CardDescription className="text-center text-sm text-gray-500 italic">
            Thank you for your patience.
          </CardDescription>
          {/* Optional: Add a link to contact support if it takes too long */}
          {/* <Link href="/contact-support" className="text-blue-500 hover:underline text-sm">
            Contact Support
          </Link> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingForApprovalPage;