import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className}`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <Toaster position="top-right" richColors closeButton />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
