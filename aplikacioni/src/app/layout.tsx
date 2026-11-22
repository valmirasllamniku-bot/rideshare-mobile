import Pwa from "@/components/Pwa";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Ndërtimtari",
  description: "Aplikacion për projekte ndërtimore dhe kërkesa për oferta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq">
      <body>
       <Pwa />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

