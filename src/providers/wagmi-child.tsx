"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";
import { type State, WagmiProvider } from "wagmi";

import { getChildConfig } from "@/wagmi";
import { usePenpalContext } from "./penpal-child";

export function WagmiProviders(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const penpal = usePenpalContext();

  const [config, setConfig] = useState(() => getChildConfig());
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setConfig(getChildConfig({ requestHandler: penpal.handleRequest }));
  }, [penpal]);

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
