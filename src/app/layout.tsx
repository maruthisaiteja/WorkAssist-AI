import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import NotificationListener from '@/components/NotificationListener';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vardhaman IT | Task Management & Alerts",
  description: "Task Assignment & Alert Management Application for Vardhaman College of Engineering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-slate-50`}>
        <Toaster position="bottom-right" />
        <NotificationListener />
        {children}
      </body>
    </html>
  );
}
