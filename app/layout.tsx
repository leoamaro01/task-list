import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../styles/globals.css";

import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task-List",
  description: "Task List App for cuban.engineer application",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
