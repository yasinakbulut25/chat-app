import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const httpClient = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
  }),
  cache: new InMemoryCache(),
});
