import { cookies } from "next/headers";

import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export const { getClient } = registerApolloClient(() => {
  const httpLink = createHttpLink({
    uri: "https://rickandmortyapi.com/graphql", //process.env.NEXT_PUBLIC_API_URL_GRAPHQL,
    fetchOptions: { cache: "no-store" },
  });

  const authLink = setContext((_, { headers }) => {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value || "";
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        ["x-app-key"]: process.env.NEXT_PUBLIC_APP_KEY,
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache({
      addTypename: false,
    }),
    link: authLink.concat(httpLink),
  });
});
