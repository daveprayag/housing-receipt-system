"use client";

import { CalendarIcon, DownloadIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { generateReceiptPDF } from "./pdfUtils";
import { toWords } from "number-to-words";
import { saveAs } from "file-saver";
import { createReceiptOnServer, getNextReceiptNumber } from "../actions";

export default function CreateReceiptPage() {
    const supabase = createClient();
    const [owners, setOwners] = useState<any[]>([]);
    const [ownerId, setOwnerId] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [transactionDate, setTransactionDate] = useState<Date | undefined>(
        new Date()
    );
    const [amountNumber, setAmountNumber] = useState("");
    const [amountWords, setAmountWords] = useState("");
    const [transactionMode, setTransactionMode] = useState("Cash");
    const [reason, setReason] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [nextReceiptNo, setNextReceiptNo] = useState(0);

    // Fetch owners
    useEffect(() => {
        async function fetchOwners() {
            const { data } = await supabase.from("owners").select("*");
            setOwners(data || []);
        }
        fetchOwners();
    }, []);

    // Auto-fill house number and ownerId
    const handleOwnerSelect = (id: string) => {
        const selected = owners.find((o) => o.id === id);
        if (selected) {
            setOwnerId(selected.id);
            setOwnerName(selected.owner_name);
            setHouseNumber(selected.house_number);
        }
    };

    // Convert amount to words
    useEffect(() => {
        if (amountNumber) {
            try {
                const number = parseInt(amountNumber);
                const inWords = `${toWords(number)} rupees only`.replace(
                    /\b\w/g,
                    (char) => char.toUpperCase()
                );
                setAmountWords(inWords);
            } catch (err) {
                setAmountWords("");
            }
        }
    }, [amountNumber]);

    // Handle Generate Receipt
    const handleGenerate = async () => {
        if (!ownerId || !transactionDate || !amountNumber || !reason) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsGenerating(true);

        const data = await getNextReceiptNumber();
        if (!data) {
            toast.error("Failed to get the next receipt number.");
            setIsGenerating(false);
            return;
        }
        setNextReceiptNo(data);

        const receiptData = {
            receipt_no: data.toString(),
            owner_name: ownerName,
            house_number: houseNumber,
            date: format(transactionDate, "yyyy-MM-dd"),
            amount_number: amountNumber,
            amount_words: amountWords,
            transaction_mode: transactionMode,
            reason,
        };

        try {
            const blob = await generateReceiptPDF(receiptData);

            const result = await createReceiptOnServer({
                ...receiptData,
                pdf_blob: blob,
                owner_id: ownerId,
            });

            setPdfUrl(result.pdf_url);
            toast.success(`Receipt created successfully!`);
        } catch (error: any) {
            toast.error("Failed to generate receipt.");
        } finally {
            setIsGenerating(false);
        }
    };
    return (
        <div className="bg-gradient-to-b from-background to-background/95 sm:p-8">
            <main className="max-w-3xl mx-auto">
                <div className="sm:mb-8 mb-4">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        New Receipt
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Generate a new transaction receipt
                    </p>
                </div>

                <div className="bg-card rounded-2xl p-6 mb-8 shadow-lg border border-border/50 space-y-6">
                    {/* Owner Selection */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium mb-2 block text-muted-foreground">
                                Owner Name
                            </label>
                            <select
                                className="w-full p-2.5 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                onChange={(e) =>
                                    handleOwnerSelect(e.target.value)
                                }
                                value={ownerId}
                            >
                                <option value="">Select Owner</option>
                                {owners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>
                                        {owner.owner_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block text-muted-foreground">
                                House Number
                            </label>
                            <Input
                                value={houseNumber}
                                disabled
                                className="rounded-xl bg-muted"
                            />
                        </div>
                    </div>

                    {/* Date and Amount */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium mb-2 block text-muted-foreground">
                                Transaction Date
                            </label>
                            <Popover
                                open={calendarOpen}
                                onOpenChange={setCalendarOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal rounded-xl"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {transactionDate
                                            ? format(transactionDate, "PPP")
                                            : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={transactionDate}
                                        onSelect={(date) => {
                                            setTransactionDate(date);
                                            setCalendarOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block text-muted-foreground">
                                Amount (in ₹)
                            </label>
                            <Input
                                type="number"
                                value={amountNumber}
                                onChange={(e) =>
                                    setAmountNumber(e.target.value)
                                }
                                className="rounded-xl"
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>

                    {/* Amount in Words */}
                    <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                            Amount in Words
                        </label>
                        <Textarea
                            value={amountWords}
                            readOnly
                            disabled
                            className="rounded-xl bg-muted resize-none"
                        />
                    </div>

                    {/* Transaction Mode and Reason */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium mb-2 block text-muted-foreground">
                                Transaction Mode
                            </label>
                            <select
                                className="w-full p-2.5 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                value={transactionMode}
                                onChange={(e) =>
                                    setTransactionMode(e.target.value)
                                }
                            >
                                <option value="Cash">Cash</option>
                                <option value="Cheque">Cheque</option>
                                <option value="NEFT">NEFT</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block text-muted-foreground">
                                Payment for
                            </label>
                            <Input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="rounded-xl"
                                placeholder="Enter payment reason"
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Receipt...
                            </>
                        ) : (
                            "Generate Receipt"
                        )}
                    </Button>
                </div>

                {/* Preview Section */}
                {pdfUrl && (
                    <div className="mt-8 bg-card rounded-2xl p-6 shadow-lg border border-border/50 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                Receipt Preview
                            </h2>
                            <Button
                                onClick={() =>
                                    saveAs(
                                        pdfUrl,
                                        `${ownerName}-${reason}-Receipt-${nextReceiptNo}.pdf`
                                    )
                                }
                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <DownloadIcon className="mr-2 h-4 w-4" />
                                Download Receipt
                            </Button>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-border/50">
                            <iframe src={pdfUrl} className="w-full h-[680px]" />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
