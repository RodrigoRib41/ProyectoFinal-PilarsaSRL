import type { Metadata } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import ClienteLayoutWrapper from "@/components/ClienteLayoutWrapper";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Pilarsa SRL",
  description: "Concesionario y centro postventa BAIC en Entre Rios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${sora.variable} ${plexMono.variable}`}>
        <NextTopLoader color="#06b6d4" showSpinner={false} />
        <ClienteLayoutWrapper>{children}</ClienteLayoutWrapper>
      </body>
    </html>
  );
}
