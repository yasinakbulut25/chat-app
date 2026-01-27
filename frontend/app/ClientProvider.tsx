"use client";

import { apolloClient } from "@/graphql/client";
import { AuthProvider } from "@/providers/AuthContext";
import { ChatProvider } from "@/providers/ChatProvider";
import { ApolloProvider } from "@apollo/client/react";
import { HeroUIProvider } from "@heroui/react";

function ClientProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ChatProvider>
          <HeroUIProvider> {children}</HeroUIProvider>
        </ChatProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
export default ClientProvider;
