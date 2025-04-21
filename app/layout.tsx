import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import ToasterProvider from "@/components/toaster-provider";
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'EUROASIANN - Your Gateway to Ship & Port Parts',
  description: 'EUROASIANN connects you with top vendors for all your maritime equipment needs. Fast, efficient, and reliable.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} w-screen overflow-x-hidden`}
      >
        <ToasterProvider/>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
