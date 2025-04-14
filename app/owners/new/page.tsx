"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addOwner } from "../action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "sonner";

export default function AddOwnerPage() {
    const [ownerName, setOwnerName] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addOwner(new FormData(e.target as HTMLFormElement));
            toast.success("Owner added successfully!");
            setOwnerName("");
            setHouseNumber("");
            router.push("/owners");
        } catch (error) {
            toast.error("Error adding owner. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-background to-background/95 sm:p-8">
            <main className="max-w-3xl mx-auto">
                <div className="sm:mb-8 mb-4">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Add Owner
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Add a new owner to the housing society
                    </p>
                </div>

                <div className="bg-card rounded-2xl p-6 mb-8 shadow-lg border border-border/50 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label
                                htmlFor="owner_name"
                                className="text-sm font-medium mb-2 block text-muted-foreground"
                            >
                                Owner Name
                            </Label>
                            <Input
                                id="owner_name"
                                name="owner_name"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                required
                                placeholder="John Doe"
                                className="rounded-xl"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="house_number"
                                className="text-sm font-medium mb-2 block text-muted-foreground"
                            >
                                House Number
                            </Label>
                            <Input
                                id="house_number"
                                name="house_number"
                                value={houseNumber}
                                onChange={(e) => setHouseNumber(e.target.value)}
                                required
                                placeholder="303"
                                className="rounded-xl"
                            />
                        </div>

                        <SubmitButton
                            pendingText="Adding..."
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Add Owner
                        </SubmitButton>
                    </form>
                </div>
            </main>
        </div>
    );
}
