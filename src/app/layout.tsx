import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/providers/providers";

export const metadata: Metadata = {
  title: "StudyBit",
  description: "A platform for collaborative student success.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
