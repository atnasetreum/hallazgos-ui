"use client";

import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import { ApolloLink, HttpLink } from "@apollo/client";

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL_GRAPHQL,
    fetchOptions: { cache: "no-store" },
    credentials: "include",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ["x-app-key"]: process.env.NEXT_PUBLIC_APP_KEY,
      },
    };
  });

  const httpLinkMain =
    typeof window === "undefined"
      ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          httpLink,
        ])
      : httpLink;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLinkMain),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
