import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layouts/Navbar";
import ProviderComponent from "./ProviderComponent";
import { cn } from "@/lib/utils";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniBet App",
  description: "UniBet App",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={cn('body', `${inter.className}`, 'bg-background', 'text-text', 'h-screen')}>
        <ProviderComponent>
          <Navbar />
          <main className={cn('main', 'h-full', 'w-full')}>
            {children}
          </main>
        </ProviderComponent>
      </body>
    </html>
  );
}
