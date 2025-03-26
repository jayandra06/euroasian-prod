"use client"
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function CrewManagement() {
  const [members, setMembers] = useState<{ [key: string]: string; saved: boolean }[]>([
    { id: "", email: "", username: "", phonenumber: "", saved: false , editable: true },
  ]);

  const supabase = createClient();

  // Fetch Crew Members from Supabase
  const getMembers = async () => {
    const { data, error } = await supabase.from("crewmember").select("*");

    if (error) {
      console.error("Failed getting user details", error.message);
    } else {
      setMembers(data.map((m: any) => ({
        id: String(m.id),
        email: m.email || "",
        username: m.username || "",
        phonenumber: m.phonenumber || "",
        saved: true,
        editable: false
      })));
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  // Add New Member Row
  const addMember = () => {
    setMembers([...members, { id: "", email: "", username: "", phonenumber: "", saved: false , editable: true }]);
  };

  // Save Member Data
  const handleMember = async (index: number) => {
    const member = members[index];

    if (!member.email || !member.username || !member.phonenumber) {
      alert("Please fill all fields before saving.");
      return;
    }

    let response;
    if (member.id) {
      response = await supabase.from("crewmember").update({
        email: member.email,
        username: member.username,
        phonenumber: member.phonenumber,
      }).eq("id", parseInt(member.id));
    } else {
      response = await supabase.from("crewmember").insert([{
        email: member.email,
        username: member.username,
        phonenumber: member.phonenumber,
      }]).select("*").single();
    }

    const { data, error } = response;
    if (error) {
      console.error("Error inserting/updating data:", error.message);
    } else {
      console.log("Data saved successfully:", data);
      const updatedMembers = [...members];
      updatedMembers[index] = {
        id: String(data.id),
        email: data.email || "",
        username: data.username || "",
        phonenumber: data.phonenumber || "",
        saved: true,
        editable: false
      };
      setMembers(updatedMembers);
        await handleInviteEmail(member.email);
    }
  };

  


  const handleDelete = async(index:number)=>{
    const memberId = members[index].id;
    if (!memberId) return;
    const {data:deleteUser,error:deleteError} = await supabase.from('crewmember').delete().eq("id",memberId)

    if(deleteError){
        console.error("Error in deleting user" , deleteError.message)
    }else{
        console.error("Deleted user succesfully",deleteUser)
        setMembers((prevMembers) => prevMembers.filter((_, i) => i !== index));
    }

  }


  const handleUpdate = async (index: number) => {
    const member = members[index];
  
    if (!member.id) {
      console.error("Error: Cannot update, user ID is missing.");
      return;
    }
  
    if (!member.email || !member.username || !member.phonenumber) {
      alert("Please fill all fields before updating.");
      return;
    }
  
    const { data, error } = await supabase
      .from("crewmember")
      .update({
        email: member.email,
        username: member.username,
        phonenumber: member.phonenumber,
      })
      .eq("id", member.id)
      .select("*")
      .single();
  
    if (error) {
      console.error("Error updating user:", error.message);
    } else {
      console.log("User updated successfully:", data);
  
      const updatedMembers = [...members];
      updatedMembers[index] = {
        id: String(data.id),
        email: data.email || "",
        username: data.username || "",
        phonenumber: data.phonenumber || "",
        saved: true,
        editable: false, // Disable edit mode after saving
      };
      setMembers(updatedMembers);
    }
  };
  
  const handleAction = (index: number, action: string) => {
    const updatedMembers = [...members];
  
    if (action === "edit") {
      updatedMembers[index].editable = true; // Enable editing
    } else if (action === "update") {
      handleUpdate(index); // Save to Supabase & disable editing
    } else if (action === "delete") {
      handleDelete(index);
    }
  
    setMembers(updatedMembers);
  };

  const handleInviteEmail = async (email: string) => {
    if (!email) {
      console.error("Email is required to send an invite.");
      return;
    }
  
    // Send an email via Supabase
    const { error } = await supabase.auth.signInWithOtp({ email });

  
    if (error) {
      console.error("Failed to send invite:", error.message);
    } else {
      console.log(`Invite email sent to ${email}`);
      alert(`Invite email sent to ${email}`);
    }
  };


  

  return (
    <>
      <div className="pt-4 flex justify-between">
        <h1 className="text-3xl font-bold">Add Employee</h1>
      </div>
      <table className="mt-4 w-full max-w-6xl border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Employee ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Employee Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Mail ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Contact No.</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index} className="border cursor-pointer border-gray-300">
              <td className="border border-gray-300 px-4 py-2">
                {member.id ? member.id.slice(0, 8) : "New"}
              </td>
              <td className="px-2 border border-gray-300 py-1">
                <Input
                  type="text"
                  className={`${member.editable ? "text-black outline-2":"text-gray-950 outline-none border-none"}`}
                  placeholder="Enter a username"
                  value={member.username}
                  disabled={!member.editable}
                  
                  onChange={(e) => {
                    const updatedMembers = [...members];
                    updatedMembers[index].username = e.target.value;
                    setMembers(updatedMembers);
                  }}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Input
                  type="text"
                  placeholder="Enter an Email"
                  value={member.email}
                  className={`${member.editable ? "text-black outline-2":"text-gray-950 outline-none border-none"}`}
                  disabled={!member.editable}
                  onChange={async(e) => {
                    const updatedMembers = [...members];
                    updatedMembers[index].email = e.target.value;
                    setMembers(updatedMembers);

                    if (e.target.value.includes("@") && e.target.value.includes(".")) {
                        await handleInviteEmail(e.target.value);
                      }
                  }}
                />
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <Input
                  type="text"
                  placeholder="Enter a phone number"
                  value={member.phonenumber}
                  className={`${member.editable ? "text-black outline-2":"text-gray-950 outline-none border-none"}`}
                  disabled={!member.editable}
                  onChange={(e) => {
                    const updatedMembers = [...members];
                    updatedMembers[index].phonenumber = e.target.value;
                    setMembers(updatedMembers);
                  }}
                />
              </td>
              <td className="px-4 py-2">
                {member.saved ? (
                 <Select onValueChange={(value) => handleAction(index, value)}>
                 <SelectTrigger>
                   <SelectValue className="text-black" placeholder={member.editable ? "Editing" : "Saved"} />
                 </SelectTrigger>
                 <SelectContent>
                 {member.editable ? 
                   <SelectItem value="update">Update</SelectItem> : <SelectItem value="edit">Edit</SelectItem>}
                   <SelectItem value="delete">Delete</SelectItem>
                 </SelectContent>
               </Select>
               
                ) : (
                  <Button onClick={() => handleMember(index)}>Save</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end mt-2">
        <Button onClick={addMember}>Add Employee</Button>
      </div>
    </>
  );
}
