// "use client";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { getOwners } from "./action";
// import { DeleteOwnerButton } from "./DeleteOwnerButton";
// import { Loader2 } from "lucide-react";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function OwnersPage() {
//     const searchParams = useSearchParams();
//     const page = Number(searchParams.get("page") || "1");
//     const [owners, setOwners] = useState<any[]>([]);
//     const [totalPages, setTotalPages] = useState(1);
//     const [isLoading, setIsLoading] = useState(false);

//     const fetchOwners = async () => {
//         setIsLoading(true);
//         const { data, pages } = await getOwners(page);
//         setOwners(data);
//         setTotalPages(pages);
//         setIsLoading(false);
//     };

//     useEffect(() => {
//         fetchOwners();
//     }, [page]);
//     return (
//         <main className="min-w-7xl mx-auto">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold text-foreground">
//                     🏠 Owners
//                 </h1>
//                 <Link href="/owners/new">
//                     <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg transition duration-300">
//                         + Add Owner
//                     </button>
//                 </Link>
//             </div>

//             <div className="overflow-auto rounded-xl shadow-lg border border-border backdrop-blur-sm bg-background/70">
//                 <Table>
//                     {/* Table Headers always visible */}
//                     <TableHeader className="bg-zinc-100 dark:bg-neutral-900 text-zinc-200 dark:text-white">
//                         <TableRow>
//                             <TableHead>Owner Name</TableHead>
//                             <TableHead>House Number</TableHead>
//                             <TableHead>Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>

//                     <TableBody>
//                         {isLoading ? (
//                             <TableRow>
//                                 <TableCell colSpan={3}>
//                                     <div className="flex justify-center items-center h-10">
//                                         <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
//                                     </div>
//                                 </TableCell>
//                             </TableRow>
//                         ) : owners.length === 0 ? (
//                             <TableRow>
//                                 <TableCell
//                                     colSpan={3}
//                                     className="text-center py-6 text-muted-foreground"
//                                 >
//                                     No owners found.
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             owners.map((owner) => (
//                                 <TableRow key={owner.id}>
//                                     <TableCell>{owner.owner_name}</TableCell>
//                                     <TableCell>{owner.house_number}</TableCell>
//                                     <TableCell className="flex gap-3">
//                                         {/* <Link href={`/owners/edit/${owner.id}`}>
//                                             <button className="text-blue-500 hover:text-blue-600 font-medium transition">
//                                                 Edit
//                                             </button>
//                                         </Link> */}
//                                         <DeleteOwnerButton
//                                             ownerId={owner.id}
//                                             refreshOwners={fetchOwners}
//                                         />
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center gap-4 mt-6">
//                 {page > 1 ? (
//                     <Link href={`?page=${page - 1}`}>
//                         <Button variant="outline">
//                             <ChevronLeft className="h-4 w-4" /> Previous
//                         </Button>
//                     </Link>
//                 ) : (
//                     <Button variant="outline" disabled>
//                         <ChevronLeft className="h-4 w-4" /> Previous
//                     </Button>
//                 )}

//                 <span className="text-muted-foreground self-center">
//                     Page {page} of {totalPages}
//                 </span>

//                 {page < totalPages ? (
//                     <Link href={`?page=${page + 1}`}>
//                         <Button variant="outline">
//                             Next <ChevronRight className="h-4 w-4" />
//                         </Button>
//                     </Link>
//                 ) : (
//                     <Button variant="outline" disabled>
//                         Next <ChevronRight className="h-4 w-4" />
//                     </Button>
//                 )}
//             </div>
//         </main>
//     );
// }

"use client";

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

export default function OwnersPage() {
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
                    {page > 1 ? (
                        <Link href={`?page=${page - 1}`}>
                            <Button variant="outline" className="rounded-xl">
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant="outline"
                            disabled
                            className="rounded-xl"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>
                    )}

                    <span className="text-muted-foreground px-4 py-2 rounded-lg bg-muted/30">
                        Page {page} of {totalPages}
                    </span>

                    {page < totalPages ? (
                        <Link href={`?page=${page + 1}`}>
                            <Button variant="outline" className="rounded-xl">
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant="outline"
                            disabled
                            className="rounded-xl"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                </div>
            </main>
        </div>
    );
}
