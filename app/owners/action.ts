// app/owners/actions.ts
"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export async function getOwners(page = 1) {
    const supabase = createClient();
    const pageSize = 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await (await supabase)
        .from("owners")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("created_at", { ascending: false });

    if (error) {
        toast.error(error.message);
        return { data: [], pages: 1 };
    }

    const totalPages = Math.ceil((count || 0) / pageSize);
    return { data, pages: totalPages };
}

export async function addOwner(formData: FormData) {
    const supabase = createClient();

    const owner_name = formData.get("owner_name") as string;
    const house_number = formData.get("house_number") as string;

    const { error } = await (await supabase)
        .from("owners")
        .insert([{ owner_name, house_number }]);

    if (error) {
        throw new Error("Failed to add owner.");
    }

    // Optional: Refresh the owners page after insertion
    revalidatePath("/owners");
}

export async function deleteOwner(ownerId: string) {
    const supabase = createClient();

    const { error } = await (await supabase)
        .from("owners")
        .delete()
        .eq("id", ownerId);

    if (error) {
        throw new Error("Failed to delete owner.");
    }

    // Redirect back to the owners page
    revalidatePath("/owners");
}
