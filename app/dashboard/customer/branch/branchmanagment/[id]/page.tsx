"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import BranchMangerManagement  from "@/components/BranchMangerManagement" // Import the AdminManagementTable
import AdminManagementTable from "@/components/AdminManagementTable" // Import the AdminManagementTable
import VesselCAssignUX from "@/components/VesselAssignMangement"
import { useParams } from "next/navigation"

export default function SettingsPage() {

  const params = useParams()
  const branchId = params.id as string
  return (
    <div className="max-w-4xl mx-auto">
    

      <Tabs defaultValue="admin-management" className="w-full">
        <TabsList className="mx-auto mb-4 flex justify-center"> {/* Removed grid and w-[70%] */}
          <TabsTrigger value="admin-management">Admin Management</TabsTrigger>
          <TabsTrigger value="branch-manager">Branch Manager Management</TabsTrigger>
          <TabsTrigger value="vessel-assignment">Vessel Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="admin-management">
              <AdminManagementTable  branchId={branchId}/>
        </TabsContent>

        <TabsContent value="branch-manager">
          <BranchMangerManagement branchId={branchId} />
        </TabsContent>

     <TabsContent value="vessel-assignment">
          <VesselCAssignUX branchId={branchId}  />
        </TabsContent> 
      </Tabs>
    </div>
  )
}