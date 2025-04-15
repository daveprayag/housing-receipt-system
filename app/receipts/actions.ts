"use server";

import { createClient } from "@/utils/supabase/server";
import { ReceiptData } from "@/utils/types";
import { format, parse } from "date-fns";

// This function fetches all owners from the database
export async function getAllOwners() {
    const supabase = createClient();
    const { data } = await (await supabase).from("owners").select("*");
    return data || [];
}

// This function fetches all receipts from the database with pagination and filtering
export async function getReceipts(
    page = 1,
    ownerName = "",
    reason = "",
    receiptNo = ""
) {
    const supabase = createClient();
    const pageSize = 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = (await supabase)
        .from("receipts")
        .select("*", { count: "exact" })
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (ownerName) {
        query = query.ilike("owner_name", `%${ownerName}%`);
    }

    if (reason) {
        query = query.ilike("reason", `%${reason}%`);
    }

    if (receiptNo.trim() !== "") {
        query = query.ilike("receipt_no", `%${receiptNo.trim()}%`);
    }

    const { data, count, error } = await query;

    if (error) {
        return { data: [], pages: 1 };
    }

    const totalPages = Math.ceil((count || 0) / pageSize);
    return { data, pages: totalPages };
}

// This function uploads a PDF blob to Supabase storage
export async function uploadPDFToStorage(blob: Blob, filename: string) {
    const supabase = createClient();
    const { data, error } = await (await supabase).storage
        .from("receipts")
        .upload(filename, blob, {
            contentType: "application/pdf",
            upsert: false,
        });

    if (error) throw new Error(error.message);

    const { data: urlData } = (await supabase).storage
        .from("receipts")
        .getPublicUrl(filename);

    return urlData;
}

// This function creates a new receipt on the server
export async function createReceiptOnServer(data: ReceiptData) {
    const supabase = createClient();

    // Step 1: Get the next receipt number
    const nextReceiptNo = await getNextReceiptNumber();

    if (!nextReceiptNo) {
        throw new Error("Failed to get the next receipt number.");
    }

    // Step 2: Upload the PDF
    const filename = `${data.owner_name}-${data.reason}-Receipt-${nextReceiptNo}.pdf`;

    const uploadedFile = await uploadPDFToStorage(data.pdf_blob, filename);

    if (!uploadedFile) {
        throw new Error("Failed to upload the PDF.");
    }

    const pdf_url = uploadedFile.publicUrl;

    const parsedDate = parse(data.date, "dd-MM-yyyy", new Date());

    // Reformat it back if needed
    const formattedDate = format(parsedDate, "yyyy-MM-dd");

    // Step 3: Insert into receipts table
    const { error: insertError } = await (await supabase)
        .from("receipts")
        .insert({
            receipt_no: nextReceiptNo,
            owner_id: data.owner_id,
            owner_name: data.owner_name,
            house_number: data.house_number,
            date: formattedDate,
            amount_number: parseInt(data.amount_number),
            amount_words: data.amount_words,
            transaction_mode: data.transaction_mode,
            reason: data.reason,
            pdf_url,
        });

    if (insertError) {
        throw insertError;
    }

    return { receipt_no: nextReceiptNo, pdf_url };
}

// This function generates the next receipt number by fetching the latest one from the database
export async function getNextReceiptNumber() {
    const supabase = createClient();

    const { data: latest, error: latestError } = await (await supabase)
        .from("receipts")
        .select("receipt_no")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (latestError && latestError.code !== "PGRST116") throw latestError;

    if (latest === null) {
        return 1;
    }

    return latest?.receipt_no ? Number(latest.receipt_no) + 1 : 1;
}

// This function deletes a receipt from the database
export async function deleteReceipt(id: number) {
    const supabase = createClient();

    const { data, error } = await (await supabase)
        .from("receipts")
        .update({ is_deleted: true })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
    return data;
}
