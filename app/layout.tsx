import type { Metadata } from "next";
import Script from "next/script";

import { Toaster } from "sonner";
import ThemeRegistry from "ThemeRegistry";

export const metadata: Metadata = {
  title: "HADA",
  manifest: "/manifest.json",
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
        <main>
          <ThemeRegistry options={{ key: "mui" }}>{children}</ThemeRegistry>
          <Toaster position="top-right" expand={true} richColors closeButton />
        </main>
        <Script src="/service-worker.js" />
      </body>
    </html>
  );
}
