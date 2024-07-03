"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import {
  cookieStorage,
  createConfig,
  createStorage,
  http,
  type State,
  WagmiProvider,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { chains } from "./wagmi-shared";

export function WagmiProviders(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getParentConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function getParentConfig() {
  return createConfig({
    chains: chains,
    connectors: [
      injected(),
      coinbaseWallet(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  });
}
