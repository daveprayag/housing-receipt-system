"use client";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useTransition } from "react";
import { deleteOwner } from "./action";
import { toast } from "sonner";

export function DeleteOwnerButton({
    ownerId,
    refreshOwners,
}: {
    ownerId: string;
    refreshOwners: () => void;
}) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteOwner(ownerId);
                toast.success("Owner deleted successfully!");
                refreshOwners();
            } catch (err) {
                toast.error("Failed to delete owner");
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="text-red-500 hover:text-red-600 font-medium transition">
                    Delete
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-background text-foreground border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this owner?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Are you sure you want to
                        delete this owner’s record?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        type="button"
                        disabled={isPending}
                        onClick={handleDelete}
                        className="bg-red-500 text-white hover:bg-red-600"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
