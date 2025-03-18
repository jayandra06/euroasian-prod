"use client"
import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { House } from "lucide-react"


function toTitleCase(str: string) {
  return str
    .toLowerCase() // Convert the whole string to lowercase
    .split(' ')    // Split the string into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter
    .join(' ');    // Join the words back into a single string
}

export function TeamSwitcher({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    role: string
  }
}) {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <House className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              EUROASIANN
            </span>
            <span className="truncate text-xs">{toTitleCase(user.role)}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
