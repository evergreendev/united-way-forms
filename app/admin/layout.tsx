import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "@/app/globals.css";
import Header from "@/app/admin/components/Header";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "United Way Contribution Forms",
    description: "",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Header/>
        <div className="max-w-screen-2xl mx-auto bg-slate-200 text-slate-950 p-8 min-h-screen">
            {children}
        </div>
        </body>
        </html>
    );
}
