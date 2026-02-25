import { cookies } from "next/headers";

import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export const { getClient } = registerApolloClient(() => {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL_GRAPHQL,
    fetchOptions: { cache: "no-store" },
  });

  const authLink = setContext(async (_, { headers }) => {
    const cookieStore = await cookies();
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
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
});
