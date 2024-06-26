import type { Metadata } from "next";

import { Toaster } from "sonner";
import ThemeRegistry from "ThemeRegistry";

export const metadata: Metadata = {
  title: "HADA",
  description: "Hada ComportArte",
};

import { ApolloWrapper } from "@shared/libs/apollo-wrapper";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body suppressHydrationWarning>
        <main>
          <ThemeRegistry options={{ key: "mui" }}>
            <ApolloWrapper>{children}</ApolloWrapper>
          </ThemeRegistry>
          <Toaster position="top-right" expand={true} richColors closeButton />
        </main>
      </body>
    </html>
  );
}
