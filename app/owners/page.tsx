// app/owners/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOwners } from "./action";
import { DeleteOwnerButton } from "./DeleteOwnerButton";
import { Loader2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function OwnersContent() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page") || "1");

    const [owners, setOwners] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOwners = async () => {
        setIsLoading(true);
        const { data, pages } = await getOwners(page);
        setOwners(data);
        setTotalPages(pages);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOwners();
    }, [page]);

    const disablePrev = page === 1 || totalPages <= 1;
    const disableNext = page === totalPages || totalPages <= 1;

    return (
        <div className="bg-gradient-to-b from-background to-background/95 p-6 sm:p-0">
            <main className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                            Owners
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            View and manage all registered flat owners
                        </p>
                    </div>
                    <Link href="/owners/new">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                            Add Owner
                        </Button>
                    </Link>
                </div>

                {/* Table */}
                <div className="rounded-2xl shadow-lg border border-border/50 overflow-hidden bg-card mb-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="font-semibold">
                                    Owner Name
                                </TableHead>
                                <TableHead className="font-semibold">
                                    House Number
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="bg-background/70 dark:bg-neutral-900/20">
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center py-10"
                                    >
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                            <Loader2 className="animate-spin w-5 h-5" />
                                            Loading owners...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : owners.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center py-10"
                                    >
                                        <p className="text-muted-foreground">
                                            No owners found
                                        </p>
                                        <p className="text-sm text-muted-foreground/70 mt-1">
                                            Try adding a new owner
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                owners.map((owner) => (
                                    <TableRow
                                        key={owner.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <TableCell>
                                            {owner.owner_name}
                                        </TableCell>
                                        <TableCell>
                                            {owner.house_number}
                                        </TableCell>
                                        <TableCell>
                                            <DeleteOwnerButton
                                                ownerId={owner.id}
                                                refreshOwners={fetchOwners}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 mt-8">
                    <Link href={`?page=${page - 1}`}>
                        <Button
                            variant="outline"
                            className="rounded-xl"
                            disabled={disablePrev}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>
                    </Link>

                    <span className="text-muted-foreground px-4 py-2 rounded-lg bg-muted/30">
                        Page {page} of {totalPages}
                    </span>

                    <Link href={`?page=${page + 1}`}>
                        <Button
                            variant="outline"
                            className="rounded-xl"
                            disabled={disableNext}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default function OwnersPage() {
    return (
        <Suspense
            fallback={
                <div className="p-6 text-muted-foreground">
                    Loading owners...
                </div>
            }
        >
            <OwnersContent />
        </Suspense>
    );
}
