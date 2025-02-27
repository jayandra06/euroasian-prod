import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

export default function Header() {
    return (
        <>
            <header className="w-screen px-8 py-4 flex justify-between">
                <div>
                    <h1 className="text-xl font-bold">
                        EUROASIANN
                    </h1>
                </div>

                <div className="flex gap-4 items-center text-base">
                    <div className="flex gap-4 items-center">
                        <Link href={"/"}>
                            Sell
                        </Link>
                        <Link href={"/"}>
                            About
                        </Link>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/sign-in">
                            <Button>
                                Login
                            </Button>
                        </Link>
                        <Link href={"/sign-up"}>
                        <Button variant={"ghost"}>
                            Signup
                        </Button>
                        </Link>
                        <ModeToggle />
                    </div>
                </div>
            </header>
        </>
    )
}