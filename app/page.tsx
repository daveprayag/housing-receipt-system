import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import OwnersPage from "./owners/page";
import ReceiptsPage from "./receipts/page";

export default async function Home() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }
    return (
        <>
            <ReceiptsPage />
        </>
    );
}
