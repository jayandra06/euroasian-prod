"use client";

import { resetPasswordAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage, Message } from "@/components/form-message";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          EUROASIANN
        </a>
        <FormMessage message={searchParams} />
        <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
          <h1 className="text-2xl font-medium">Reset password</h1>
          <p className="text-sm text-foreground/60">
            Please enter your new password below.
          </p>
          <Label htmlFor="password">New password</Label>
          <Input
            type="password"
            name="password"
            placeholder="New password"
            required
          />
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
          />
          <Button type="submit" formAction={resetPasswordAction}>
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
}