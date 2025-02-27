"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export function InviteAdmin() {
    async function addAdmin(e: any) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const res = await fetch("/api/invite-admin/", {method: "POST", body: JSON.stringify({email: formData.get("email")})});
        const data = await res.json();
        console.log(data);

        alert("Successfully Invited Admin!!!");
    }


    return (
        <Dialog>
            <DialogTrigger>
                <Button>
                    Invite Admin
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Admin</DialogTitle>
                    <DialogDescription>
                        Enter Details to Invite Admin
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={addAdmin}>
                    <div className="grid gap-2">
                        <div>
                            <Label>
                                Enter Admin Email
                            </Label>
                            <Input type="email" name="email" id="email" placeholder="Enter Admin Email" />
                        </div>
                    </div>
                    <Button type="submit" className="mt-4">Invite Admin</Button>
                </form>

            </DialogContent>
        </Dialog>
    )
}