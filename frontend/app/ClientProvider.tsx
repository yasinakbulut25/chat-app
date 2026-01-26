"use client";

import { httpClient } from "@/graphql/client";
import { wsClient } from "@/graphql/wsClient";
import { ApolloProvider } from "@apollo/client/react";
import { HeroUIProvider } from "@heroui/react";

function ClientProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ApolloProvider client={httpClient}>
      <ApolloProvider client={wsClient}>
        <HeroUIProvider> {children}</HeroUIProvider>
      </ApolloProvider>
    </ApolloProvider>
  );
}
export default ClientProvider;
