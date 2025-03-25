"use client"
import { createClient } from "@/utils/supabase/client"

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"


export default function DashboardProfile() {
    const supabase = createClient();

    async function getUser() {
        const { data: userData, error: authError } = await supabase.auth.getUser();
        
        if (authError || !userData.user) {
            console.error("Authentication error or user not found:", authError);
            return;
        }
    
        console.log("Authenticated user:", userData.user);
        
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userData.user.id)
            .single();
    
        if (profileError) {
            console.error("Profile fetch error:", profileError);
            return;
        }
    
        console.log("Profile data:", profileData);
    
        if (profileData) {
            redirect(`/dashboard/${profileData.user_role}`);
        }
    }
    

    useEffect(() => {
        getUser();
    }, []);


    return (
        <>
            <div className="flex flex-col space-y-3 p-8">
                <Skeleton className="h-[125px] w-[100%] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-24 w-[90%]" />
                    <Skeleton className="h-24 w-[80%]" />
                </div>
            </div>
        </>
    )
}