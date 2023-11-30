import type { Metadata } from "next";

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Cosmeticos Trujillo",
  description: "Generated by create next app",
};

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        <Toaster position="top-right" expand={true} richColors closeButton />
      </body>
    </html>
  );
}
