"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { getReceipts, getAllOwners, deleteReceipt } from "./actions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ReceiptsPage() {
    const [receipts, setReceipts] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [receiptNo, setReceiptNo] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

    const [ownerOptions, setOwnerOptions] = useState<
        { id: string; owner_name: string }[]
    >([]);
    const [selectedOwner, setSelectedOwner] = useState("");
    const [reason, setReason] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        const { data, pages } = await getReceipts(
            page,
            selectedOwner,
            reason,
            receiptNo
        );
        setReceipts(data);
        setTotalPages(pages);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [page, selectedOwner, reason, receiptNo]);

    useEffect(() => {
        getAllOwners().then(setOwnerOptions);
    }, []);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [totalPages]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            toast.loading(`Deleting receipt #${deleteTarget.receipt_no}...`, {
                id: "delete-receipt",
            });
            await deleteReceipt(deleteTarget.id);
            toast.success(
                `Receipt #${deleteTarget.receipt_no} has been removed.`,
                {
                    id: "delete-receipt",
                }
            );
            setDeleteTarget(null);
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(
                `Failed to delete receipt #${deleteTarget.receipt_no}. Please try again.`,
                {
                    id: "delete-receipt",
                }
            );
        }
    };

    const disablePrev = page === 1 || totalPages <= 1;
    const disableNext = page === totalPages || totalPages <= 1;

    const hasActiveFilters = receiptNo || selectedOwner || reason;

    return (
        <div className="bg-gradient-to-b from-background to-background/95 p-6 mb-10 sm:p-0">
            <main className="max-w-[1400px] mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                            Receipts
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and track all your transaction receipts
                        </p>
                    </div>
                    <Link href="/receipts/new">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                            Generate Receipt
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-card rounded-2xl p-6 shadow-lg mb-6 border border-border/50">
                    <div className="flex flex-wrap gap-6">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-2 block text-muted-foreground">
                                Owner
                            </label>
                            <select
                                value={selectedOwner}
                                onChange={(e) =>
                                    setSelectedOwner(e.target.value)
                                }
                                className="w-full p-2.5 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            >
                                <option value="">All Owners</option>
                                {ownerOptions.map((owner) => (
                                    <option
                                        key={owner.id}
                                        value={owner.owner_name}
                                    >
                                        {owner.owner_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-2 block text-muted-foreground">
                                Reason
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Search by reason..."
                                    className="pl-9 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-2 block text-muted-foreground">
                                Receipt No
                            </label>
                            <Input
                                type="number"
                                value={receiptNo}
                                onChange={(e) => setReceiptNo(e.target.value)}
                                placeholder="Enter receipt number"
                                className="rounded-xl"
                            />
                        </div>

                        {hasActiveFilters && (
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setReceiptNo("");
                                        setSelectedOwner("");
                                        setReason("");
                                        setPage(1);
                                    }}
                                    className="rounded-xl border-destructive/30 hover:bg-destructive/10 text-destructive"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl shadow-lg border border-border/50 overflow-hidden bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="font-semibold">
                                    Receipt No
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Owner
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Amount
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Reason
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Date
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Receipt
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-10"
                                    >
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                            <Loader2 className="animate-spin w-5 h-5" />
                                            Loading receipts...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : receipts.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-10"
                                    >
                                        <p className="text-muted-foreground">
                                            No receipts found
                                        </p>
                                        <p className="text-sm text-muted-foreground/70 mt-1">
                                            Try adjusting your filters or create
                                            a new receipt
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                receipts.map((receipt) => (
                                    <TableRow
                                        key={receipt.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <TableCell>
                                            {receipt.receipt_no}
                                        </TableCell>
                                        <TableCell>
                                            {receipt.owner_name}
                                        </TableCell>
                                        <TableCell className="text-primary">
                                            ₹{receipt.amount_number}
                                        </TableCell>
                                        <TableCell>{receipt.reason}</TableCell>
                                        <TableCell>{receipt.date}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="hover:text-primary hover:bg-primary/10"
                                                onClick={() =>
                                                    window.open(
                                                        receipt.pdf_url,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                View PDF
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant={"ghost"}
                                                        size="sm"
                                                        className="text-red-500 hover:bg-red-500/10"
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                receipt
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Are you sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will
                                                            permanently delete
                                                            Receipt #
                                                            {
                                                                deleteTarget?.receipt_no
                                                            }
                                                            . This action cannot
                                                            be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    null
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={
                                                                handleDelete
                                                            }
                                                        >
                                                            Yes, Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={disablePrev}
                        className="rounded-xl"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <span className="text-muted-foreground px-4 py-2 rounded-lg bg-muted/30">
                        Page {page} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={disableNext}
                        className="rounded-xl"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </main>
        </div>
    );
}
