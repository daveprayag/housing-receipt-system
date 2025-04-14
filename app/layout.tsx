import type React from "react";
import HeaderAuth from "@/components/header-auth";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "sonner";
import { HomeIcon } from "lucide-react";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Pranam Housing Receipt Generator",
    description:
        "Generate housing receipts easily and quickly with our user-friendly app. Just enter the details and get a professional receipt in seconds.",
};

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={geistSans.className}
            suppressHydrationWarning
        >
            <body className="bg-background text-foreground">
                <Toaster position="top-right" theme="light" richColors />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex min-h-screen flex-col">
                        {/* Modern Navbar with gradient border */}
                        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="container flex h-16 items-center">
                                <div className="mr-4 flex">
                                    <Link
                                        href="/"
                                        className="flex items-center space-x-2"
                                    >
                                        <HomeIcon className="h-5 w-5" />
                                        <span className="hidden text-xl font-medium sm:inline-block">
                                            Pranam Housing
                                        </span>
                                    </Link>
                                </div>
                                <div className="flex flex-1 items-center justify-end space-x-4">
                                    <nav className="flex items-center space-x-2">
                                        <HeaderAuth />
                                    </nav>
                                </div>
                            </div>
                        </header>

                        {/* Page content */}
                        <main className="flex-1 flex pt-5 sm:pt-8 sm:px-4 justify-center">
                            <div className="w-full max-w-7xl px-4">
                                {children}
                            </div>
                        </main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
