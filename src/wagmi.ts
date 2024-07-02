import {
  http,
  cookieStorage,
  createConfig,
  createStorage,
  custom,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export function getParentConfig() {
  return createConfig({
    chains: [mainnet, sepolia],
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

export function getChildConfig(props?: {
  requestHandler: (...args: any[]) => Promise<any>;
}) {
  const fallbackConfig = createConfig({
    chains: [mainnet, sepolia],
    connectors: [injected()],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  });

  return props?.requestHandler
    ? createConfig({
        chains: [mainnet, sepolia],
        connectors: [
          injected({
            target() {
              return {
                id: "parent-injected",
                name: "Parent Injected",
                provider(window) {
                  return {
                    request: props.requestHandler,
                    on: (...args) => {
                      // TODO: Parent needs to send events to child
                      console.log(`child called on`, args);
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
        storage: createStorage({
          storage: cookieStorage,
        }),
        transports: {
          [mainnet.id]: custom({
            request: props.requestHandler,
          }),
          [sepolia.id]: custom({
            request: props.requestHandler,
          }),
        },
      })
    : fallbackConfig;
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getChildConfig>;
  }
}
