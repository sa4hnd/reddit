import { Inter } from "next/font/google";
import "./globals.css";
import { RedditProvider } from "@/libs/RedditContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RedditProvider>
          {children}
        </RedditProvider>
      </body>
    </html>
  );
}
