"use client";

import { HeroUIProvider } from "@heroui/react";

function ClientProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <HeroUIProvider> {children}</HeroUIProvider>;
}

export default ClientProvider;
