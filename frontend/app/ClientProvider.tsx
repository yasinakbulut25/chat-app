"use client";

import { apolloClient } from "@/graphql/client";
import { ApolloProvider } from "@apollo/client/react";
import { HeroUIProvider } from "@heroui/react";

function ClientProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ApolloProvider client={apolloClient}>
      <HeroUIProvider> {children}</HeroUIProvider>
    </ApolloProvider>
  );
}

export default ClientProvider;
