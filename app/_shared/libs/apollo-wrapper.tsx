"use client";

import { setContext } from "@apollo/client/link/context";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { ApolloLink, HttpLink } from "@apollo/client";

function makeClient() {
  const httpLink = new HttpLink({
    uri: "https://rickandmortyapi.com/graphql", //process.env.NEXT_PUBLIC_API_URL_GRAPHQL,
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

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache({
      addTypename: false,
    }),
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
