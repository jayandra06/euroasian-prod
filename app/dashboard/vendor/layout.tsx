"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/ModeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import  createClient  from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  async function getVendorDetails() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const merchant = await supabase.from("merchant").select("*").eq("merchant_profile", user?.id).single();
    console.log(merchant.data);
    if (!merchant.data) {
      router.push("/dashboard/become-a-seller");
    }
  }

  useEffect(() => {
    getVendorDetails();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar data={"vendor"} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ModeToggle />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Vendor
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
