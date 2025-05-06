"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { BookOpen, Bot, SquareTerminal } from "lucide-react";
import { title } from "process";

// This is sample data.
const adminData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    role: "admin",
  },
  navMain: [
    {
      title: "Admin Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/admin",
        },
        {
          title: "RFQs",
          url: "/dashboard/admin/rfqs",
        },
        {
          title: "Inventory",
          url: "/dashboard/admin/inventory",
        },
      
      ],
    },
    {
      title: "Vendors",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "All Vendors",
          url: "/dashboard/admin/vendors",
        },
      
        {
          title: "Brands",
          url: "/dashboard/admin/brands",
        },
        {
          title: "Categories",
          url: "/dashboard/admin/categories",
        },
        {
          title: "Models",
          url: "/dashboard/admin/models",
        },
      ],
    },
    {
      title: "Customers",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All Customers",
          url: "/dashboard/admin/customers",
        },
        {
          title: "Support",
          url: "#",
        },
      ],
    },
  ],
};

// This is sample data.
const vendorData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    role: "Vendor",
  },
  navMain: [
    {
      title: "Vendor Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/vendor",
        },

        {
          title: "RFQs",
          url: "/dashboard/vendor/rfqs",
        },
        {
          title: "Categories",
          url: "/dashboard/vendor/categories",
        },
        { title: "Brands", url: "/dashboard/vendor/brands" },

        {
          title: "Orders",
          url: "/dashboard/vendor/orders",
        },
        {
          title: "Details",
          url: "/dashboard/vendor/details",
        },
      ],
    },
    {
      title: "Vessel Management",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Vessel Management",
          url: "/dashboard/vendor/vessel-management",
        },
        {
          title: "Vessel Details",
          url: "/dashboard/vendor/vessel-details",
        },
      ],
    },
    {
      title: "Catalog",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Catalog Management",
          url: "/dashboard/vendor/inventory",
        },
      ],
    },
    {
      title: "Support",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Support",
          url: "#",
        },
        {
          title: "Terms Of Use",
          url: "#",
        },
        {
          title: "Privacy Policy",
          url: "#",
        },
      ],
    },
  ],
};

// This is sample data.
const customerData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    role: "customer",
  },
  navMain: [
    {
      title: "Fleet Overview",
      url: "/dashboard/customer",
    },
    {
      title: "Financial & Procurement",
      url: "/dashboard/customer",
      isActive: false,
      items: [
        {
          title: "RFQs",
          url: "/dashboard/customer/rfqs",
        },
        {
          title: "Vendor Management",
          url: "/dashboard/customer/vendorManagement",
        },
      ],
    },
    {
      title: "Fleet performance & Maintainece",
      url: "/dashboard/customer",
    },
    {
      title: "Vessel Finder & Route Opimization ",
      url: "/dashboard/customer",
    },
    {
      title: "Complaince & Certifcation",
      url: "/dashboard/customer",
    },
    {
      title: "Crew Management",
      url: "/dashboard/customer/crew-management",
    },
    {
      title: "Risk & Incident Management",
      url: "/dashboard/customer",
    },
    {
      title: "Sustuabinability & ESG Reporting",
      url: "/dashboard/customer",
    },

{
title:"Vessel Management",
url:"/dashboard/customer/vessel_management",
},
{
  title:"Role Management",
  url:"/dashboard/customer/role_management",
  
  },
    

    {
      title: "Vessel Management",
      url: "/dashboard/customer/vessel_management",
    },

    {
      title: "Branch",
      url: "/dashboard/customer/branch",
    },
    {
      title: "Support",
      url: "#",

      items: [
        {
          title: "Become a Seller",
          url: "/dashboard/become-a-seller",
        },
        {
          title: "Support",
          url: "#",
        },
        {
          title: "Terms Of Use",
          url: "#",
        },
        {
          title: "Privacy Policy",
          url: "#",
        },
      ],
    },
  ],
};

type SidebarWithDataProps = React.ComponentProps<typeof Sidebar> & {
  data: string; // Replace `any` with a specific type if you know the structure of `data`
};

export function AppSidebar({ ...props }: SidebarWithDataProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          user={
            props.data === "admin"
              ? adminData.user
              : props.data === "customer"
              ? customerData.user
              : vendorData.user
          }
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={
            props.data === "admin"
              ? adminData.navMain
              : props.data === "customer"
              ? customerData.navMain
              : vendorData.navMain
          }
        />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
