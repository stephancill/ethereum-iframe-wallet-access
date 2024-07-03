"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";
import { CustomTransport, HttpTransport } from "viem";
import {
  cookieStorage,
  createConfig,
  createStorage,
  http,
  type State,
  WagmiProvider,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { usePenpalContext } from "./penpal-child";
import { chains } from "./wagmi-shared";

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

export function getChildConfig(props?: {
  requestHandler: (...args: any[]) => Promise<any>;
}) {
  const transports = chains.reduce(
    (acc, chain) => ({
      ...acc,
      [chain.id]: http(),
    }),
    {} as Record<number, CustomTransport | HttpTransport>
  );

  const fallbackConfig = createConfig({
    chains,
    connectors: [],
    transports,
  });

  return props?.requestHandler
    ? createConfig({
        chains,
        storage: createStorage({
          storage: cookieStorage,
        }),
        transports,
        connectors: [
          injected({
            target() {
              return {
                id: "parent-injected",
                name: "Parent Injected",
                provider() {
                  return {
                    request: props.requestHandler,
                    on: (onEvent, listener) => {
                      // TODO: Parent needs to send events to child
                      console.log(`child called on`, onEvent);
                      // window.addEventListener("message", (messageEvent) => {
                      //   if (messageEvent.data?.type === onEvent) {
                      //     listener(messageEvent.data?.data);
                      //   }
                      // });
                    },
                    removeListener: () => {
                      console.log("removeListener");
                    },
                  };
                },
              };
            },
          }),
        ],
      })
    : fallbackConfig;
}
