import type {Metadata} from "next";
import {Inter} from "next/font/google";
import 'tailwindcss/tailwind.css'
import './globals.css'

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "United Way of The Black Hills - Pledge Donation",
    description: "",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-slate-600 p-0`}>
        {children}
        </body>
        </html>
    );
}
