import type { Metadata } from "next";
import { Inter, Michroma } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
});

export const metadata: Metadata = {
  title: "Gervasio e Hijos | Automotores - Villa Ramallo",
  description: "Venta de vehículos 0km y usados en Villa Ramallo. 3 sucursales, financiación propia, transferencias y el mejor servicio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${michroma.variable} font-sans antialiased bg-white text-gray-900`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
