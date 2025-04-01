
"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInVendorExternal, signUpAction } from "@/app/actions"

export function InviteVednorForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await signInVendorExternal(formData);
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>
            Sign Up Vendor to EuroAsiann
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
              <div className="grid gap-2">
                  <Label htmlFor="username">User Name</Label>
                  <Input
                    id="name"
                    type="name"
                    name="name"
                    placeholder="name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phonenumber">Phone Number</Label>
                  <Input
                    id="phonenumber"
                    type="phonenumber"
                    name="phonenumber"
                    placeholder="+903809580"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="business_email">Email</Label>
                  <Input
                    id="business_email"
                    type="business_email"
                    name="business_email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {/* <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a> */}
                  </div>
                  <Input id="password" type="password" name="password" required />
                </div>
                <Button type="submit"  className="w-full">
                  Sign Up
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/sign-in" className="underline underline-offset-4">
                  Sign In
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
