import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "./theme-switcher";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";

export default async function AuthButton() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user ? (
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <UserIcon className="w-4 h-4" />
                        {user.email}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="text-muted-foreground text-base">
                        My Dashboard
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild className="w-full cursor-pointer">
                        <Link href="/owners">🏠 Owners</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="w-full cursor-pointer">
                        <Link href="/receipts">🧾 Receipts</Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <form action={signOutAction}>
                        <DropdownMenuItem
                            asChild
                            className="w-full cursor-pointer"
                        >
                            <button type="submit" className="w-full text-left">
                                🚪 Sign out
                            </button>
                        </DropdownMenuItem>
                    </form>
                </DropdownMenuContent>
            </DropdownMenu>

            <ThemeSwitcher />
        </div>
    ) : (
        <div className="flex gap-2">
            <Button asChild size="sm" variant={"outline"}>
                <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant={"default"}>
                <Link href="/sign-up">Sign up</Link>
            </Button>
        </div>
    );
}
