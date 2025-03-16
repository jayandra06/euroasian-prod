import { LoginForm } from "@/components/login-form"
import { FormMessage, Message } from "@/components/form-message";

export default async function LoginPage(props: {
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
        <LoginForm className="" isadmin={true} />
      </div>
    </div>
  )
}
