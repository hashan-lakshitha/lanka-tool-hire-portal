import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lanka Tool Hire — Equipment Hire & Reviews",
  description: "Browse trade and DIY equipment, check real customer reviews, and calculate your exact hire cost before you book with Lanka Tool Hire.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
